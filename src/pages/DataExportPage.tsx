import { useState, useEffect } from 'react';
import { Download, FileJson, FileSpreadsheet, FileText, Check, Loader2, Shield, Eye, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

// Génère le contenu HTML pour l'export PDF
function generatePDFContent(data: any): string {
  const date = new Date().toLocaleDateString('fr-FR', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Export EmotionsCare - ${date}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
        h1 { color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; }
        h2 { color: #4c1d95; margin-top: 30px; }
        .meta { color: #666; font-size: 12px; margin-bottom: 30px; }
        .section { background: #f9fafb; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .item { padding: 10px; border-bottom: 1px solid #e5e7eb; }
        .item:last-child { border-bottom: none; }
        .label { font-weight: bold; color: #374151; }
        .value { color: #6b7280; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <h1>📊 Rapport EmotionsCare</h1>
      <p class="meta">Exporté le ${date} • ID: ${data.user?.id?.slice(0, 8) || 'N/A'}</p>
      
      ${data.profile ? `
        <h2>👤 Profil</h2>
        <div class="section">
          <div class="item"><span class="label">Email:</span> <span class="value">${data.user?.email || 'N/A'}</span></div>
          <div class="item"><span class="label">Nom:</span> <span class="value">${data.profile.display_name || 'Non renseigné'}</span></div>
        </div>
      ` : ''}
      
      ${data.moods?.length ? `
        <h2>😊 Historique des humeurs (${data.moods.length} entrées)</h2>
        <div class="section">
          ${data.moods.slice(0, 20).map((m: any) => `
            <div class="item">
              <span class="label">${new Date(m.created_at).toLocaleDateString('fr-FR')}:</span>
              <span class="value">Score ${m.score}/10 ${m.notes ? `- ${m.notes.slice(0, 50)}...` : ''}</span>
            </div>
          `).join('')}
          ${data.moods.length > 20 ? `<p class="value">... et ${data.moods.length - 20} autres entrées</p>` : ''}
        </div>
      ` : ''}
      
      ${data.journalEntries?.length ? `
        <h2>📔 Journal (${data.journalEntries.length} entrées)</h2>
        <div class="section">
          ${data.journalEntries.slice(0, 10).map((j: any) => `
            <div class="item">
              <span class="label">${new Date(j.created_at).toLocaleDateString('fr-FR')}:</span>
              <span class="value">${j.content?.slice(0, 100) || 'Contenu chiffré'}...</span>
            </div>
          `).join('')}
          ${data.journalEntries.length > 10 ? `<p class="value">... et ${data.journalEntries.length - 10} autres entrées</p>` : ''}
        </div>
      ` : ''}
      
      ${data.achievements?.length ? `
        <h2>🏆 Succès débloqués (${data.achievements.length})</h2>
        <div class="section">
          ${data.achievements.map((a: any) => `
            <div class="item">
              <span class="label">${a.achievements?.name || 'Badge'}:</span>
              <span class="value">${a.achievements?.description || ''}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <p class="meta" style="margin-top: 40px;">
        🔒 Document généré conformément à l'article 20 du RGPD (droit à la portabilité).
        <br>EmotionsCare - Vos données vous appartiennent.
      </p>
    </body>
    </html>
  `;
}

const EXPORT_SECTIONS = [
  { id: 'profile', label: 'Profil utilisateur', description: 'Informations de compte', icon: '👤', estimatedSize: '~1 KB' },
  { id: 'moods', label: 'Historique des humeurs', description: 'Tous vos enregistrements d\'humeur', icon: '😊', estimatedSize: '~50 KB' },
  { id: 'journal', label: 'Entrées de journal', description: 'Vos réflexions personnelles', icon: '📔', estimatedSize: '~100 KB' },
  { id: 'breath', label: 'Sessions de respiration', description: 'Historique des exercices', icon: '🌬️', estimatedSize: '~20 KB' },
  { id: 'assessments', label: 'Évaluations', description: 'Résultats des questionnaires', icon: '📊', estimatedSize: '~30 KB' },
  { id: 'achievements', label: 'Succès et badges', description: 'Vos accomplissements', icon: '🏆', estimatedSize: '~5 KB' },
  { id: 'coach', label: 'Sessions coach', description: 'Interactions avec le coach IA', icon: '🤖', estimatedSize: '~80 KB' },
  { id: 'preferences', label: 'Préférences', description: 'Paramètres personnalisés', icon: '⚙️', estimatedSize: '~2 KB' },
];

interface ExportHistory {
  id: string;
  date: string;
  format: string;
  sections: string[];
  size: string;
}

export default function DataExportPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedSections, setSelectedSections] = useState<string[]>(['all']);
  const [format, setFormat] = useState<'json' | 'csv' | 'pdf'>('json');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [previewData, setPreviewData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([]);

  useEffect(() => {
    // Load export history from localStorage
    const history = localStorage.getItem('export_history');
    if (history) {
      setExportHistory(JSON.parse(history));
    }
  }, []);

  if (!user) return <Navigate to="/login" replace />;

  const handleSectionToggle = (sectionId: string) => {
    if (sectionId === 'all') {
      setSelectedSections(['all']);
    } else {
      setSelectedSections(prev => {
        const newSections = prev.filter(s => s !== 'all');
        if (newSections.includes(sectionId)) {
          return newSections.filter(s => s !== sectionId);
        }
        return [...newSections, sectionId];
      });
    }
  };

  const handlePreview = async () => {
    setShowPreview(true);
    try {
      const { data, error } = await supabase.functions.invoke('data-export', {
        body: {
          format: 'json',
          sections: selectedSections.includes('all') ? ['all'] : selectedSections,
          preview: true
        }
      });

      if (!error) {
        setPreviewData(data);
      }
    } catch (err) {
      console.error('Preview error:', err);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const { data, error } = await supabase.functions.invoke('data-export', {
        body: {
          format,
          sections: selectedSections.includes('all') ? ['all'] : selectedSections
        }
      });

      clearInterval(progressInterval);
      setExportProgress(100);

      if (error) throw error;

      // Create and download file
      let blob: Blob;
      let filename: string;
      const dateStr = new Date().toISOString().split('T')[0];
      
      if (format === 'json') {
        blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        filename = `emotionscare-export-${dateStr}.json`;
      } else if (format === 'csv') {
        blob = new Blob([data], { type: 'text/csv' });
        filename = `emotionscare-export-${dateStr}.csv`;
      } else if (format === 'pdf') {
        // Générer un PDF simple via HTML
        const pdfContent = generatePDFContent(data);
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(pdfContent);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => {
            printWindow.print();
          }, 500);
        }
        toast({
          title: 'Export PDF prêt',
          description: 'Utilisez la boîte de dialogue pour sauvegarder en PDF.',
        });
        setIsExporting(false);
        setExportProgress(0);
        return;
      } else {
        blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        filename = `emotionscare-export-${dateStr}.json`;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Save to history
      const newHistory: ExportHistory = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        format,
        sections: selectedSections,
        size: `${(blob.size / 1024).toFixed(1)} KB`
      };
      const updatedHistory = [newHistory, ...exportHistory.slice(0, 9)];
      setExportHistory(updatedHistory);
      localStorage.setItem('export_history', JSON.stringify(updatedHistory));

      toast({
        title: 'Export réussi ✅',
        description: 'Vos données ont été téléchargées.',
      });
    } catch (err) {
      console.error('Export error:', err);
      toast({
        title: 'Erreur d\'export',
        description: 'Impossible d\'exporter vos données. Réessayez.',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportProgress(0), 1000);
    }
  };

  const estimatedSize = selectedSections.includes('all')
    ? '~300 KB'
    : EXPORT_SECTIONS
        .filter(s => selectedSections.includes(s.id))
        .reduce((sum, s) => {
          const kb = parseInt(s.estimatedSize.replace(/[^0-9]/g, ''));
          return sum + kb;
        }, 0) + ' KB';

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          Exporter mes données
        </h1>
        <p className="text-muted-foreground">
          Conformément au RGPD, vous pouvez télécharger toutes vos données personnelles.
        </p>
      </div>

      <Tabs defaultValue="export" className="space-y-6">
        <TabsList>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="export" className="space-y-6">
          {/* Section selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Données à exporter</span>
                <Badge variant="outline">{estimatedSize}</Badge>
              </CardTitle>
              <CardDescription>
                Sélectionnez les catégories de données à inclure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 pb-4 border-b">
                <Checkbox
                  id="all"
                  checked={selectedSections.includes('all')}
                  onCheckedChange={() => handleSectionToggle('all')}
                />
                <Label htmlFor="all" className="font-semibold cursor-pointer flex items-center gap-2">
                  📦 Toutes les données
                  <Badge variant="secondary">Recommandé</Badge>
                </Label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {EXPORT_SECTIONS.map(section => (
                  <div 
                    key={section.id} 
                    className={`flex items-start space-x-2 p-3 rounded-lg border transition-colors ${
                      selectedSections.includes(section.id) || selectedSections.includes('all')
                        ? 'bg-primary/5 border-primary/30'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <Checkbox
                      id={section.id}
                      checked={selectedSections.includes('all') || selectedSections.includes(section.id)}
                      onCheckedChange={() => handleSectionToggle(section.id)}
                      disabled={selectedSections.includes('all')}
                    />
                    <div className="grid gap-0.5 flex-1">
                      <Label htmlFor={section.id} className="cursor-pointer flex items-center gap-2">
                        <span>{section.icon}</span>
                        {section.label}
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {section.description}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {section.estimatedSize}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Format selection */}
          <Card>
            <CardHeader>
              <CardTitle>Format d'export</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={format === 'json' ? 'default' : 'outline'}
                  onClick={() => setFormat('json')}
                  className="h-auto py-4 flex-col gap-2"
                >
                  <FileJson className="h-6 w-6" />
                  <span>JSON</span>
                  {format === 'json' && <Check className="h-4 w-4" />}
                </Button>
                <Button
                  variant={format === 'csv' ? 'default' : 'outline'}
                  onClick={() => setFormat('csv')}
                  className="h-auto py-4 flex-col gap-2"
                >
                  <FileSpreadsheet className="h-6 w-6" />
                  <span>CSV</span>
                  {format === 'csv' && <Check className="h-4 w-4" />}
                </Button>
                <Button
                  variant={format === 'pdf' ? 'default' : 'outline'}
                  onClick={() => setFormat('pdf')}
                  className="h-auto py-4 flex-col gap-2"
                >
                  <FileText className="h-6 w-6" />
                  <span>PDF</span>
                  {format === 'pdf' && <Check className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {format === 'json' && 'Format complet avec toutes les métadonnées. Idéal pour portabilité.'}
                {format === 'csv' && 'Format tableur simplifié. Idéal pour analyse dans Excel.'}
                {format === 'pdf' && 'Rapport PDF formaté (bientôt disponible).'}
              </p>
            </CardContent>
          </Card>

          {/* Progress & Actions */}
          {isExporting && (
            <Card>
              <CardContent className="py-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Export en cours...</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <Progress value={exportProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handlePreview}
              disabled={isExporting || selectedSections.length === 0}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting || selectedSections.length === 0}
              className="flex-1"
              size="lg"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Export en cours...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger mes données
                </>
              )}
            </Button>
          </div>

          {/* Preview modal */}
          {showPreview && previewData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Aperçu des données</span>
                  <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                    ✕
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64 rounded-md border p-4">
                  <pre className="text-xs">
                    {JSON.stringify(previewData, null, 2).substring(0, 2000)}
                    {JSON.stringify(previewData, null, 2).length > 2000 && '\n...'}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Historique des exports
              </CardTitle>
            </CardHeader>
            <CardContent>
              {exportHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Download className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Aucun export effectué</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {exportHistory.map(exp => (
                    <div key={exp.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">
                          {new Date(exp.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{exp.format.toUpperCase()}</Badge>
                          <span className="text-xs text-muted-foreground">{exp.size}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground text-center mt-6">
        🔒 Vos données sont chiffrées et ne sont accessibles que par vous.
        <br />
        Les exports sont conformes à l'article 20 du RGPD (droit à la portabilité).
      </p>
    </div>
  );
}

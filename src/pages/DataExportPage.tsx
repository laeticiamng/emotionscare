import React, { useState } from 'react';
import { Download, FileJson, FileSpreadsheet, Check, Loader2, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const EXPORT_SECTIONS = [
  { id: 'profile', label: 'Profil utilisateur', description: 'Informations de compte' },
  { id: 'moods', label: 'Historique des humeurs', description: 'Tous vos enregistrements d\'humeur' },
  { id: 'journal', label: 'Entrées de journal', description: 'Vos réflexions personnelles' },
  { id: 'breath', label: 'Sessions de respiration', description: 'Historique des exercices' },
  { id: 'assessments', label: 'Évaluations', description: 'Résultats des questionnaires' },
  { id: 'achievements', label: 'Succès et badges', description: 'Vos accomplissements' },
  { id: 'coach', label: 'Sessions coach', description: 'Interactions avec le coach IA' },
  { id: 'preferences', label: 'Préférences', description: 'Paramètres personnalisés' },
];

export default function DataExportPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedSections, setSelectedSections] = useState<string[]>(['all']);
  const [format, setFormat] = useState<'json' | 'csv'>('json');
  const [isExporting, setIsExporting] = useState(false);

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

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { data, error } = await supabase.functions.invoke('data-export', {
        body: {
          format,
          sections: selectedSections.includes('all') ? ['all'] : selectedSections
        }
      });

      if (error) throw error;

      // Créer et télécharger le fichier
      const blob = new Blob(
        [format === 'json' ? JSON.stringify(data, null, 2) : data],
        { type: format === 'json' ? 'application/json' : 'text/csv' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emotionscare-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Export réussi',
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
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Exporter mes données</h1>
        <p className="text-muted-foreground">
          Conformément au RGPD, vous pouvez télécharger toutes vos données personnelles.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Données à exporter
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
            <Label htmlFor="all" className="font-semibold cursor-pointer">
              Toutes les données
            </Label>
          </div>

          <div className="grid gap-3">
            {EXPORT_SECTIONS.map(section => (
              <div key={section.id} className="flex items-start space-x-2">
                <Checkbox
                  id={section.id}
                  checked={selectedSections.includes('all') || selectedSections.includes(section.id)}
                  onCheckedChange={() => handleSectionToggle(section.id)}
                  disabled={selectedSections.includes('all')}
                />
                <div className="grid gap-0.5">
                  <Label htmlFor={section.id} className="cursor-pointer">
                    {section.label}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {section.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Format d'export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              variant={format === 'json' ? 'default' : 'outline'}
              onClick={() => setFormat('json')}
              className="flex-1"
            >
              <FileJson className="h-4 w-4 mr-2" />
              JSON
              {format === 'json' && <Check className="h-4 w-4 ml-2" />}
            </Button>
            <Button
              variant={format === 'csv' ? 'default' : 'outline'}
              onClick={() => setFormat('csv')}
              className="flex-1"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              CSV
              {format === 'csv' && <Check className="h-4 w-4 ml-2" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {format === 'json' 
              ? 'Format complet avec toutes les métadonnées' 
              : 'Format simplifié pour tableurs (humeurs uniquement)'}
          </p>
        </CardContent>
      </Card>

      <Button
        onClick={handleExport}
        disabled={isExporting || selectedSections.length === 0}
        className="w-full"
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

      <p className="text-xs text-muted-foreground text-center mt-4">
        Vos données sont chiffrées et ne sont accessibles que par vous.
      </p>
    </div>
  );
}

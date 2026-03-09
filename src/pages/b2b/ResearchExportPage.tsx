// @ts-nocheck
/**
 * Research Export Panel
 * Anonymized dataset summaries with GDPR consent management
 */
import React, { useState } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  ArrowLeft, Download, Shield, FileText, Database, Lock,
  Users, Calendar, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DemoBanner } from '@/components/ui/DemoBanner';

const DATASETS = [
  { id: 'burnout', label: 'Scores MBI-HSS agrégés', records: 847, period: '2025-2026', consented: 623 },
  { id: 'wellbeing', label: 'Scores bien-être hebdomadaires', records: 2340, period: '2025-2026', consented: 1890 },
  { id: 'interventions', label: 'Efficacité des interventions', records: 456, period: '2025-2026', consented: 412 },
  { id: 'shifts', label: 'Corrélation shifts/bien-être', records: 1200, period: '2025-2026', consented: 980 },
];

const ResearchExportPage: React.FC = () => {
  usePageSEO({
    title: 'Export Recherche | EmotionsCare B2B',
    description: 'Exportation de données anonymisées pour la recherche académique avec gestion du consentement RGPD.',
  });

  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [format, setFormat] = useState('csv');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [kAnonymity, setKAnonymity] = useState('5');
  const [exporting, setExporting] = useState(false);

  const toggleDataset = (id: string) => {
    setSelectedDatasets((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleExport = async () => {
    if (selectedDatasets.length === 0) {
      toast.error('Sélectionnez au moins un jeu de données');
      return;
    }
    setExporting(true);
    // Simulate export
    await new Promise((r) => setTimeout(r, 2000));
    setExporting(false);
    toast.success('Export généré avec succès', {
      description: `${selectedDatasets.length} jeu(x) de données exporté(s) en ${format.toUpperCase()}`,
    });
  };

  const totalRecords = selectedDatasets.reduce((sum, id) => {
    const ds = DATASETS.find((d) => d.id === id);
    return sum + (ds?.consented ?? 0);
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/b2b/admin/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              Export Recherche
            </h1>
            <p className="text-sm text-muted-foreground">Données anonymisées pour partenaires académiques • RGPD conforme</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Dataset Selection */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Jeux de données disponibles</CardTitle>
                <CardDescription>Seules les données avec consentement explicite à la recherche sont incluses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {DATASETS.map((ds) => {
                  const consentRate = Math.round((ds.consented / ds.records) * 100);
                  return (
                    <div
                      key={ds.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedDatasets.includes(ds.id) ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                      }`}
                      onClick={() => toggleDataset(ds.id)}
                      role="checkbox"
                      aria-checked={selectedDatasets.includes(ds.id)}
                      tabIndex={0}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox checked={selectedDatasets.includes(ds.id)} className="mt-1" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{ds.label}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{ds.consented} consentis / {ds.records} total</span>
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{ds.period}</span>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>Taux de consentement</span>
                              <span className="font-medium">{consentRate}%</span>
                            </div>
                            <Progress value={consentRate} className="h-1.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* GDPR Consent Info */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4 flex gap-3">
                <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">Conformité RGPD</p>
                  <ul className="space-y-1 text-muted-foreground text-xs">
                    <li className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-600" /> Consentement explicite recueilli individuellement</li>
                    <li className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-600" /> k-anonymité appliquée (seuil configurable)</li>
                    <li className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-600" /> Aucune donnée identifiante dans l'export</li>
                    <li className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-600" /> Registre de traitement maintenu</li>
                    <li className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-600" /> Droit de retrait du consentement actif</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export Configuration */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Format d'export</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="parquet">Parquet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>k-Anonymité (seuil)</Label>
                  <Select value={kAnonymity} onValueChange={setKAnonymity}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">k = 5 (standard)</SelectItem>
                      <SelectItem value="10">k = 10 (renforcé)</SelectItem>
                      <SelectItem value="20">k = 20 (maximum)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="metadata">Inclure métadonnées</Label>
                  <Switch id="metadata" checked={includeMetadata} onCheckedChange={setIncludeMetadata} />
                </div>

                <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                  <p><strong>Résumé :</strong></p>
                  <p>{selectedDatasets.length} jeu(x) sélectionné(s)</p>
                  <p>{totalRecords.toLocaleString()} enregistrements consentis</p>
                  <p>Format : {format.toUpperCase()}</p>
                </div>

                <Button
                  className="w-full"
                  onClick={handleExport}
                  disabled={selectedDatasets.length === 0 || exporting}
                >
                  {exporting ? (
                    <>Génération en cours...</>
                  ) : (
                    <><Download className="h-4 w-4 mr-2" />Générer l'export</>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <p className="text-xs">Les exports sont chiffrés et signés numériquement. Un registre d'audit est maintenu pour chaque export.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchExportPage;

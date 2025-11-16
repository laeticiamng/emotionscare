import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Download,
  Filter,
  FileJson,
  FileText,
  FileSpreadsheet,
  Share2,
  Copy,
  Calendar,
  TrendingUp,
} from 'lucide-react';

interface FilterOptions {
  dateRange: 'week' | 'month' | 'quarter' | 'year' | 'all';
  emotionFilter: string[];
  minEngagement: number;
  includeMetadata: boolean;
  anonymize: boolean;
}

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  mimeType: string;
  extension: string;
}

const EXPORT_FORMATS: ExportFormat[] = [
  {
    id: 'json',
    name: 'JSON',
    description: 'Format structuré pour intégration',
    icon: <FileJson className="w-5 h-5" />,
    mimeType: 'application/json',
    extension: '.json',
  },
  {
    id: 'csv',
    name: 'CSV',
    description: 'Compatible Excel/Sheets',
    icon: <FileSpreadsheet className="w-5 h-5" />,
    mimeType: 'text/csv',
    extension: '.csv',
  },
  {
    id: 'txt',
    name: 'Texte',
    description: 'Format lisible simple',
    icon: <FileText className="w-5 h-5" />,
    mimeType: 'text/plain',
    extension: '.txt',
  },
];

const EMOTIONS = ['Joie', 'Calme', 'Neutre', 'Anxiété', 'Tristesse', 'Colère'];

export const CoachAdvancedFiltering = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'month',
    emotionFilter: [],
    minEngagement: 0,
    includeMetadata: true,
    anonymize: false,
  });

  const [selectedFormats, setSelectedFormats] = useState<string[]>(['json']);
  const [exportedData, setExportedData] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleEmotionChange = (emotion: string) => {
    setFilters((prev) => ({
      ...prev,
      emotionFilter: prev.emotionFilter.includes(emotion)
        ? prev.emotionFilter.filter((e) => e !== emotion)
        : [...prev.emotionFilter, emotion],
    }));
  };

  const handleExport = async (format: string) => {
    // Simulation d'export
    const mockData = {
      exportDate: new Date().toISOString(),
      filters: filters,
      dataPoints: 156,
      conversations: 12,
      format: format,
      message: `Export en ${format.toUpperCase()} généré avec succès`,
    };

    setExportedData(JSON.stringify(mockData, null, 2));

    // Simuler le téléchargement
    const blob = new Blob([JSON.stringify(mockData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `coach-export-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyExport = () => {
    if (exportedData) {
      navigator.clipboard.writeText(exportedData);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const dateRangeLabels = {
    week: '7 derniers jours',
    month: '30 derniers jours',
    quarter: '3 derniers mois',
    year: '12 derniers mois',
    all: 'Tout l\'historique',
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          Filtrage et Export Avancé 🚀
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Filtrez vos données et exportez-les dans le format de votre choix
        </p>
      </div>

      <Tabs defaultValue="filter" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="filter" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtres
          </TabsTrigger>
          <TabsTrigger value="export" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </TabsTrigger>
        </TabsList>

        {/* Onglet Filtres */}
        <TabsContent value="filter" className="space-y-6">
          {/* Plage de dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Plage de dates
              </CardTitle>
              <CardDescription>Sélectionnez la période d'analyse</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.entries(dateRangeLabels).map(([key, label]) => (
                  <Button
                    key={key}
                    variant={filters.dateRange === key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: key as FilterOptions['dateRange'],
                      }))
                    }
                    className="text-xs"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filtres émotionnels */}
          <Card>
            <CardHeader>
              <CardTitle>Filtrer par émotion dominante</CardTitle>
              <CardDescription>Sélectionnez une ou plusieurs émotions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {EMOTIONS.map((emotion) => (
                  <div key={emotion} className="flex items-center gap-2">
                    <Checkbox
                      id={emotion}
                      checked={filters.emotionFilter.includes(emotion)}
                      onCheckedChange={() => handleEmotionChange(emotion)}
                    />
                    <Label htmlFor={emotion} className="cursor-pointer text-sm font-medium">
                      {emotion}
                    </Label>
                  </div>
                ))}
              </div>
              {filters.emotionFilter.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {filters.emotionFilter.map((emotion) => (
                    <Badge
                      key={emotion}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleEmotionChange(emotion)}
                    >
                      {emotion} ✕
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Niveau d'engagement minimum */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Engagement minimum
              </CardTitle>
              <CardDescription>Filtrer par niveau d'engagement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={filters.minEngagement}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minEngagement: parseInt(e.target.value),
                    }))
                  }
                  className="flex-1"
                />
                <span className="text-sm font-semibold min-w-12">{filters.minEngagement}%</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Inclure uniquement les conversations avec {filters.minEngagement}% d'engagement ou plus
              </p>
            </CardContent>
          </Card>

          {/* Options supplémentaires */}
          <Card>
            <CardHeader>
              <CardTitle>Options supplémentaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <Checkbox
                  id="metadata"
                  checked={filters.includeMetadata}
                  onCheckedChange={(checked) =>
                    setFilters((prev) => ({
                      ...prev,
                      includeMetadata: checked as boolean,
                    }))
                  }
                />
                <div>
                  <Label htmlFor="metadata" className="cursor-pointer font-medium text-sm">
                    Inclure les métadonnées
                  </Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Timestamps, ID, statistiques détaillées
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <Checkbox
                  id="anonymize"
                  checked={filters.anonymize}
                  onCheckedChange={(checked) =>
                    setFilters((prev) => ({
                      ...prev,
                      anonymize: checked as boolean,
                    }))
                  }
                />
                <div>
                  <Label htmlFor="anonymize" className="cursor-pointer font-medium text-sm">
                    Anonymiser les données
                  </Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Masquer noms, emails, numéros de téléphone
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Résumé des filtres */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100">Aperçu des filtres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <p>
                📅 <strong>Période:</strong> {dateRangeLabels[filters.dateRange]}
              </p>
              {filters.emotionFilter.length > 0 && (
                <p>
                  😊 <strong>Émotions:</strong> {filters.emotionFilter.join(', ')}
                </p>
              )}
              <p>
                🔥 <strong>Engagement min:</strong> {filters.minEngagement}%
              </p>
              <p>
                ⚙️ <strong>Options:</strong> {filters.includeMetadata ? 'Métadonnées' : ''}{' '}
                {filters.anonymize ? '+ Anonymisation' : ''}
              </p>
              <p className="pt-2">
                <strong>Résultat estimé:</strong> 156 points de données dans 12 conversations
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Export */}
        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Choisir le format d'export</CardTitle>
              <CardDescription>Sélectionnez le format qui convient le mieux à vos besoins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {EXPORT_FORMATS.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormats([format.id])}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedFormats.includes(format.id)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {format.icon}
                      <span className="font-semibold">{format.name}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {format.description}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                      Extension: {format.extension}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Options d'export */}
          <Card>
            <CardHeader>
              <CardTitle>Options d'export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <Checkbox id="export-metadata" defaultChecked />
                <Label htmlFor="export-metadata" className="cursor-pointer text-sm">
                  Inclure les métadonnées complètes
                </Label>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <Checkbox id="export-anon" />
                <Label htmlFor="export-anon" className="cursor-pointer text-sm">
                  Données anonymisées
                </Label>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <Checkbox id="export-compress" defaultChecked />
                <Label htmlFor="export-compress" className="cursor-pointer text-sm">
                  Compresser le fichier (ZIP)
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Actions d'export */}
          <Card>
            <CardHeader>
              <CardTitle>Télécharger les données</CardTitle>
              <CardDescription>Les filtres ci-dessus seront appliqués</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedFormats.map((formatId) => {
                const format = EXPORT_FORMATS.find((f) => f.id === formatId);
                return (
                  <Button
                    key={formatId}
                    className="w-full justify-start gap-2"
                    onClick={() => handleExport(formatId)}
                  >
                    {format?.icon}
                    Télécharger en {format?.name}
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Aperçu des données */}
          {exportedData && (
            <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-green-900 dark:text-green-100">
                  <span>Aperçu des données</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyExport}
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    {copySuccess ? 'Copié!' : 'Copier'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs max-h-64">
                  {exportedData}
                </pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Info box */}
      <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
        <CardContent className="pt-6">
          <p className="text-sm text-amber-900 dark:text-amber-100">
            💡 <strong>Conseil:</strong> Utilisez les filtres pour affiner vos données avant export.
            L'anonymisation peut être utile pour partager des données sans révéler votre identité.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

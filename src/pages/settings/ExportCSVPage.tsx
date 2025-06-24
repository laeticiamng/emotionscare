
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Calendar, Filter } from 'lucide-react';

const ExportCSVPage: React.FC = () => {
  const [selectedData, setSelectedData] = useState({
    emotions: true,
    journal: true,
    music: false,
    breathwork: true,
    vr: false,
    social: false,
    achievements: true
  });
  
  const [dateRange, setDateRange] = useState('last_30_days');
  const [format, setFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const dataTypes = [
    { key: 'emotions', label: 'Données émotionnelles', description: 'Scans et analyses d\'humeur', size: '2.3 MB' },
    { key: 'journal', label: 'Entrées de journal', description: 'Textes et audio journalier', size: '1.8 MB' },
    { key: 'music', label: 'Historique musical', description: 'Playlists et écoutes thérapeutiques', size: '0.5 MB' },
    { key: 'breathwork', label: 'Sessions de respiration', description: 'Exercices et métriques respiratoires', size: '0.8 MB' },
    { key: 'vr', label: 'Expériences VR', description: 'Sessions de réalité virtuelle', size: '1.2 MB' },
    { key: 'social', label: 'Interactions sociales', description: 'Activités dans le cocon social', size: '0.3 MB' },
    { key: 'achievements', label: 'Réalisations', description: 'Badges et progression gamification', size: '0.1 MB' }
  ];

  const handleToggleData = (key: string) => {
    setSelectedData(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    // Simulation de l'export
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          // Ici, déclencher le téléchargement
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const selectedCount = Object.values(selectedData).filter(Boolean).length;
  const totalSize = dataTypes
    .filter(type => selectedData[type.key as keyof typeof selectedData])
    .reduce((acc, type) => acc + parseFloat(type.size), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Export de Données</h1>
          <p className="text-muted-foreground">Téléchargez vos données dans différents formats</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Types de Données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{selectedCount}/7</div>
                <p className="text-sm text-muted-foreground">Catégories sélectionnées</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Download className="h-5 w-5" />
                Taille Estimée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{totalSize.toFixed(1)} MB</div>
                <p className="text-sm text-muted-foreground">Archive compressée</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Période
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last_7_days">7 derniers jours</SelectItem>
                    <SelectItem value="last_30_days">30 derniers jours</SelectItem>
                    <SelectItem value="last_3_months">3 derniers mois</SelectItem>
                    <SelectItem value="last_year">Dernière année</SelectItem>
                    <SelectItem value="all_time">Toutes les données</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Sélection des Données
              </CardTitle>
              <CardDescription>Choisissez les types de données à inclure dans l'export</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dataTypes.map((dataType) => (
                <div key={dataType.key} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    checked={selectedData[dataType.key as keyof typeof selectedData]}
                    onCheckedChange={() => handleToggleData(dataType.key)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{dataType.label}</p>
                      <Badge variant="outline">{dataType.size}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{dataType.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Options d'Export</CardTitle>
              <CardDescription>Configurez le format et les paramètres d'export</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Format de fichier</label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV (Excel compatible)</SelectItem>
                      <SelectItem value="json">JSON (Données structurées)</SelectItem>
                      <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                      <SelectItem value="pdf">PDF (Rapport lisible)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isExporting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Préparation de l'export...</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <Progress value={exportProgress} />
                </div>
              )}

              <Button 
                onClick={handleExport}
                disabled={selectedCount === 0 || isExporting}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? 'Export en cours...' : `Exporter ${selectedCount} types de données`}
              </Button>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note :</strong> L'export peut prendre quelques minutes selon la quantité de données. 
                  Vous recevrez un email avec le lien de téléchargement une fois l'export terminé.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExportCSVPage;

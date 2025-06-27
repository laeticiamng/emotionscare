
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { Download, FileText, Calendar, Database } from 'lucide-react';
import { toast } from 'sonner';
import { addDays } from 'date-fns';

const ExportCSVPage: React.FC = () => {
  const [selectedData, setSelectedData] = useState<string[]>(['emotions', 'journal']);
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date()
  });
  const [isExporting, setIsExporting] = useState(false);

  const dataTypes = [
    { id: 'emotions', label: 'Analyses émotionnelles', description: 'Historique des scans et scores' },
    { id: 'journal', label: 'Entrées journal', description: 'Vos réflexions et notes personnelles' },
    { id: 'music', label: 'Historique musical', description: 'Playlists et préférences musicales' },
    { id: 'vr', label: 'Sessions VR', description: 'Historique des expériences immersives' },
    { id: 'breathing', label: 'Exercices de respiration', description: 'Sessions et progrès' },
    { id: 'social', label: 'Activité sociale', description: 'Interactions et partages (anonymisés)' },
    { id: 'preferences', label: 'Préférences', description: 'Paramètres et configurations' }
  ];

  const handleDataToggle = (dataId: string) => {
    setSelectedData(prev => 
      prev.includes(dataId) 
        ? prev.filter(id => id !== dataId)
        : [...prev, dataId]
    );
  };

  const handleExport = async () => {
    if (selectedData.length === 0) {
      toast.error('Veuillez sélectionner au moins un type de données');
      return;
    }

    setIsExporting(true);
    
    // Simulation de l'export
    setTimeout(() => {
      setIsExporting(false);
      toast.success('Export terminé ! Téléchargement en cours...');
      
      // Simulation du téléchargement
      const filename = `emotionscare_export_${new Date().toISOString().split('T')[0]}.zip`;
      toast.success(`Fichier ${filename} téléchargé avec succès !`);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Export de vos Données</h1>
        <p className="text-xl text-muted-foreground">
          Téléchargez vos données personnelles au format CSV
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Sélection des Données
              </CardTitle>
              <CardDescription>
                Choisissez les types de données à exporter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataTypes.map((dataType) => (
                  <div key={dataType.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={dataType.id}
                      checked={selectedData.includes(dataType.id)}
                      onCheckedChange={() => handleDataToggle(dataType.id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={dataType.id} className="font-medium">
                        {dataType.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {dataType.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Période d'Export
              </CardTitle>
              <CardDescription>
                Définissez la plage de dates pour l'export
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <DatePickerWithRange
                  date={dateRange}
                  onDateChange={setDateRange}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDateRange({
                      from: addDays(new Date(), -7),
                      to: new Date()
                    })}
                  >
                    7 derniers jours
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDateRange({
                      from: addDays(new Date(), -30),
                      to: new Date()
                    })}
                  >
                    30 derniers jours
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDateRange({
                      from: addDays(new Date(), -365),
                      to: new Date()
                    })}
                  >
                    Toutes les données
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Format d'Export
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Fichier ZIP contenant :</h4>
                  <ul className="space-y-1">
                    <li>• Fichiers CSV séparés par type</li>
                    <li>• Métadonnées JSON</li>
                    <li>• Documentation des champs</li>
                    <li>• Certificat d'authenticité</li>
                  </ul>
                </div>
                <p className="text-xs text-muted-foreground">
                  Compatible Excel, Google Sheets, et outils d'analyse
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lancer l'Export</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleExport}
                disabled={isExporting || selectedData.length === 0}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? 'Export en cours...' : 'Télécharger'}
              </Button>
              
              {selectedData.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {selectedData.length} type(s) de données sélectionné(s)
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Confidentialité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                <p>• Données chiffrées durant le transit</p>
                <p>• Lien de téléchargement temporaire (24h)</p>
                <p>• Aucune donnée stockée côté serveur</p>
                <p>• Conforme RGPD</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExportCSVPage;

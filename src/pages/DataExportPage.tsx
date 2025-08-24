import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, FileText, Database, Calendar, Settings, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DataExportPage: React.FC = () => {
  const [selectedData, setSelectedData] = useState<string[]>(['profile', 'activities']);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const dataTypes = [
    {
      id: 'profile',
      name: 'Profil personnel',
      description: 'Informations de base, préférences, paramètres',
      icon: Settings,
      size: '2.3 KB'
    },
    {
      id: 'activities',
      name: 'Historique des activités',
      description: 'Sessions, exercices, progression',
      icon: Calendar,
      size: '156.7 KB'
    },
    {
      id: 'emotions',
      name: 'Données émotionnelles',
      description: 'Scans, analyses, tendances',
      icon: Database,
      size: '89.2 KB'
    },
    {
      id: 'social',
      name: 'Données sociales',
      description: 'Interactions, communauté, partages',
      icon: Users,
      size: '12.8 KB'
    },
    {
      id: 'media',
      name: 'Fichiers multimédias',
      description: 'Enregistrements audio, images, vidéos',
      icon: FileText,
      size: '2.1 MB'
    }
  ];

  const handleExport = async () => {
    if (selectedData.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un type de données à exporter",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    
    // Simulation de l'export
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Export terminé",
        description: `Vos données ont été exportées avec succès (${selectedData.length} types de données)`,
      });
      
      // Simulation du téléchargement
      const blob = new Blob([JSON.stringify({
        exportDate: new Date().toISOString(),
        dataTypes: selectedData,
        user: 'user@example.com',
        data: 'Données simulées pour la démonstration'
      }, null, 2)], { type: 'application/json' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emotionscare-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 3000);
  };

  const toggleDataType = (dataType: string) => {
    setSelectedData(prev => 
      prev.includes(dataType) 
        ? prev.filter(d => d !== dataType)
        : [...prev, dataType]
    );
  };

  const totalSize = selectedData.reduce((total, type) => {
    const dataType = dataTypes.find(d => d.id === type);
    if (!dataType) return total;
    
    const sizeStr = dataType.size;
    if (sizeStr.includes('MB')) {
      return total + parseFloat(sizeStr) * 1024;
    } else if (sizeStr.includes('KB')) {
      return total + parseFloat(sizeStr);
    }
    return total;
  }, 0);

  const formatSize = (kb: number) => {
    if (kb > 1024) {
      return `${(kb / 1024).toFixed(1)} MB`;
    }
    return `${kb.toFixed(1)} KB`;
  };

  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Export de Données</h1>
          <p className="text-muted-foreground">
            Exportez vos données personnelles au format JSON conforme au RGPD
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Sélection des données
              </CardTitle>
              <CardDescription>
                Choisissez les types de données que vous souhaitez exporter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dataTypes.map((dataType) => {
                const Icon = dataType.icon;
                const isSelected = selectedData.includes(dataType.id);
                
                return (
                  <div 
                    key={dataType.id}
                    className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors ${
                      isSelected ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
                    }`}
                  >
                    <Checkbox
                      id={dataType.id}
                      checked={isSelected}
                      onCheckedChange={() => toggleDataType(dataType.id)}
                    />
                    <div className="flex-1 flex items-start gap-3">
                      <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div className="flex-1">
                        <Label htmlFor={dataType.id} className="font-medium cursor-pointer">
                          {dataType.name}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {dataType.description}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                        {dataType.size}
                      </span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Résumé de l'export</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Types de données sélectionnés :</span>
                  <span className="font-medium">{selectedData.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taille estimée :</span>
                  <span className="font-medium">{formatSize(totalSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Format :</span>
                  <span className="font-medium">JSON</span>
                </div>
                <div className="flex justify-between">
                  <span>Conformité RGPD :</span>
                  <span className="font-medium text-green-600">✓ Conforme</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              L'export sera téléchargé au format JSON
            </div>
            <Button 
              onClick={handleExport} 
              disabled={selectedData.length === 0 || isExporting}
              size="lg"
            >
              {isExporting ? (
                <>Export en cours...</>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Exporter mes données
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DataExportPage;
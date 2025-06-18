
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Mic, Type, Activity } from 'lucide-react';

const ScanPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const handleScan = (type: string) => {
    setIsScanning(true);
    // Simulation d'un scan
    setTimeout(() => {
      setLastResult(`Scan ${type} terminé - Émotion détectée: Joie (85% de confiance)`);
      setIsScanning(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Scanner d'émotions</h1>
        <p className="text-muted-foreground">
          Analysez vos émotions grâce à différentes méthodes d'IA avancée
        </p>
      </div>

      <Tabs defaultValue="facial" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="facial">Analyse faciale</TabsTrigger>
          <TabsTrigger value="voice">Analyse vocale</TabsTrigger>
          <TabsTrigger value="text">Analyse textuelle</TabsTrigger>
        </TabsList>

        <TabsContent value="facial">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Scan facial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="border-2 border-dashed border-muted rounded-lg p-12">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Activez votre caméra pour analyser vos expressions faciales
                  </p>
                </div>
                <Button 
                  onClick={() => handleScan('facial')} 
                  disabled={isScanning}
                  className="w-full"
                >
                  {isScanning ? 'Analyse en cours...' : 'Démarrer l\'analyse faciale'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Scan vocal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="border-2 border-dashed border-muted rounded-lg p-12">
                  <Mic className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Parlez pendant 10-15 secondes pour analyser votre état émotionnel
                  </p>
                </div>
                <Button 
                  onClick={() => handleScan('vocal')} 
                  disabled={isScanning}
                  className="w-full"
                >
                  {isScanning ? 'Écoute en cours...' : 'Démarrer l\'enregistrement'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Analyse de texte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <textarea 
                  className="w-full h-32 p-3 border rounded-md resize-none"
                  placeholder="Décrivez comment vous vous sentez actuellement..."
                />
                <Button 
                  onClick={() => handleScan('textuel')} 
                  disabled={isScanning}
                  className="w-full"
                >
                  {isScanning ? 'Analyse en cours...' : 'Analyser le texte'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {lastResult && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Dernier résultat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{lastResult}</p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Recommandations:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Continuez sur cette lancée positive</li>
                <li>Pratiquez 5 minutes de méditation</li>
                <li>Écoutez votre playlist préférée</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScanPage;

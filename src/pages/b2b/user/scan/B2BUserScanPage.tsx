
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Mic, Play, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const B2BUserScanPage: React.FC = () => {
  const [scanMode, setScanMode] = useState<'camera' | 'voice' | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const startScan = async (mode: 'camera' | 'voice') => {
    setScanMode(mode);
    setIsScanning(true);
    
    // Simuler le scan pendant 3 secondes
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: "Scan terminé",
        description: `Analyse ${mode === 'camera' ? 'visuelle' : 'vocale'} effectuée avec succès`,
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Scanner Émotionnel</h1>
          <p className="text-muted-foreground">
            Analysez votre état émotionnel en temps réel
          </p>
        </div>
        <BarChart3 className="h-8 w-8 text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scan par caméra */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Analyse visuelle
            </CardTitle>
            <CardDescription>
              Scannez vos expressions faciales pour analyser vos émotions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              {scanMode === 'camera' && isScanning ? (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-sm text-muted-foreground">Analyse en cours...</p>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Caméra non activée</p>
                </div>
              )}
            </div>
            
            <Button
              onClick={() => startScan('camera')}
              disabled={isScanning}
              className="w-full"
            >
              <Camera className="mr-2 h-4 w-4" />
              {scanMode === 'camera' && isScanning ? 'Scan en cours...' : 'Démarrer le scan visuel'}
            </Button>
          </CardContent>
        </Card>

        {/* Scan par voix */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Analyse vocale
            </CardTitle>
            <CardDescription>
              Analysez le ton de votre voix pour détecter vos émotions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              {scanMode === 'voice' && isScanning ? (
                <div className="text-center">
                  <div className="flex justify-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 bg-primary rounded-full animate-pulse"
                        style={{
                          height: Math.random() * 40 + 20,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Écoute en cours...</p>
                </div>
              ) : (
                <div className="text-center">
                  <Mic className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Microphone non activé</p>
                </div>
              )}
            </div>
            
            <Button
              onClick={() => startScan('voice')}
              disabled={isScanning}
              className="w-full"
            >
              <Mic className="mr-2 h-4 w-4" />
              {scanMode === 'voice' && isScanning ? 'Scan en cours...' : 'Démarrer le scan vocal'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Résultats du scan */}
      {!isScanning && scanMode && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats de l'analyse</CardTitle>
            <CardDescription>
              Votre état émotionnel actuel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">😊</div>
                  <p className="font-medium">Joie</p>
                  <p className="text-sm text-muted-foreground">75%</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">😌</div>
                  <p className="font-medium">Calme</p>
                  <p className="text-sm text-muted-foreground">60%</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">🤔</div>
                  <p className="font-medium">Concentration</p>
                  <p className="text-sm text-muted-foreground">45%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default B2BUserScanPage;

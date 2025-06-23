
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scan, Camera, Mic, Heart, Brain, Play, Pause } from 'lucide-react';

const ScanPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanType, setScanType] = useState<'face' | 'voice' | null>(null);

  const handleStartScan = (type: 'face' | 'voice') => {
    setScanType(type);
    setIsScanning(true);
    
    // Simuler un scan
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Scan className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Scanner Émotionnel
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Analysez votre état émotionnel en temps réel grâce à notre IA avancée
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Face Scan */}
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Camera className="h-6 w-6 text-primary" />
                <CardTitle>Analyse Faciale</CardTitle>
              </div>
              <CardDescription>
                Détection d'émotions par reconnaissance faciale
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                {scanType === 'face' && isScanning ? (
                  <div className="text-center">
                    <div className="animate-pulse">
                      <Camera className="h-12 w-12 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Analyse en cours...</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Caméra prête</p>
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => handleStartScan('face')}
                disabled={isScanning}
              >
                {scanType === 'face' && isScanning ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Lancer l'analyse faciale
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Voice Scan */}
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Mic className="h-6 w-6 text-primary" />
                <CardTitle>Analyse Vocale</CardTitle>
              </div>
              <CardDescription>
                Détection d'émotions par analyse de la voix
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                {scanType === 'voice' && isScanning ? (
                  <div className="text-center">
                    <div className="animate-pulse">
                      <Mic className="h-12 w-12 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Écoute en cours...</p>
                      <div className="flex justify-center space-x-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-8 bg-primary rounded animate-pulse"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Mic className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Microphone prêt</p>
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => handleStartScan('voice')}
                disabled={isScanning}
                variant="outline"
              >
                {scanType === 'voice' && isScanning ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Lancer l'analyse vocale
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        {!isScanning && scanType && (
          <Card className="max-w-2xl mx-auto mt-8">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Heart className="h-6 w-6 text-red-500" />
                <CardTitle>Résultats d'Analyse</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold">Émotion dominante</p>
                  <p className="text-lg text-primary">Sérénité</p>
                </div>
                <div className="text-center p-4 bg-green-500/10 rounded-lg">
                  <Heart className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="font-semibold">Niveau de stress</p>
                  <p className="text-lg text-green-500">Faible</p>
                </div>
              </div>
              
              <div className="text-center pt-4">
                <p className="text-muted-foreground mb-4">
                  Basé sur votre analyse, nous vous recommandons :
                </p>
                <div className="flex justify-center space-x-4">
                  <Button asChild>
                    <a href="/music">Musicothérapie adaptée</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/coach">Parler avec le coach</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ScanPage;

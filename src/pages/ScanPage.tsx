
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Camera, Mic, Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanResult, setScanResult] = useState<any>(null);

  const startScan = async () => {
    setIsScanning(true);
    setProgress(0);
    
    // Simulation du scan avec progression
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Simulation d'un résultat
          setScanResult({
            emotion: 'calme',
            confidence: 0.85,
            recommendations: [
              'Continuez cette belle sérénité',
              'Une musique douce pourrait vous accompagner',
              'Moment idéal pour de la méditation'
            ]
          });
          setIsScanning(false);
          toast.success('Scan émotionnel terminé !');
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const resetScan = () => {
    setScanResult(null);
    setProgress(0);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Scan Émotionnel</h1>
          <p className="text-muted-foreground">Analysez votre état émotionnel actuel</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              Analyse en Temps Réel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!scanResult ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Camera className="h-6 w-6 text-blue-500" />
                      <h3 className="font-medium">Analyse Faciale</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Détection des micro-expressions
                    </p>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Mic className="h-6 w-6 text-green-500" />
                      <h3 className="font-medium">Analyse Vocale</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Détection du stress vocal
                    </p>
                  </Card>
                </div>

                {isScanning && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-lg font-medium">Analyse en cours...</p>
                      <p className="text-sm text-muted-foreground">
                        Restez naturel et regardez l'écran
                      </p>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <p className="text-center text-sm text-muted-foreground">
                      {progress}% complété
                    </p>
                  </div>
                )}

                <div className="text-center">
                  <Button 
                    size="lg"
                    onClick={startScan}
                    disabled={isScanning}
                    className="px-8"
                  >
                    {isScanning ? 'Analyse en cours...' : 'Démarrer le Scan'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">😌</div>
                  <h2 className="text-2xl font-bold capitalize">
                    État: {scanResult.emotion}
                  </h2>
                  <p className="text-muted-foreground">
                    Confiance: {Math.round(scanResult.confidence * 100)}%
                  </p>
                </div>

                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800">Recommandations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {scanResult.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600 font-bold">•</span>
                          <span className="text-green-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <div className="flex gap-3 justify-center">
                  <Button onClick={resetScan} variant="outline">
                    Nouveau Scan
                  </Button>
                  <Button onClick={() => navigate('/music')}>
                    Écouter de la Musique
                  </Button>
                  <Button onClick={() => navigate('/coach')}>
                    Parler au Coach
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScanPage;

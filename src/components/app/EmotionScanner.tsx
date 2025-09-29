import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Camera, Play, Square, RotateCcw, Brain, Heart } from 'lucide-react';

const EmotionScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startScanning = async () => {
    setIsScanning(true);
    setProgress(0);
    setScanResult(null);

    // Simulate scanning progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          // Mock result
          setScanResult({
            primaryEmotion: 'Calme',
            confidence: 87,
            emotions: [
              { name: 'Calme', percentage: 87, color: 'bg-blue-500' },
              { name: 'Concentré', percentage: 65, color: 'bg-green-500' },
              { name: 'Optimiste', percentage: 43, color: 'bg-yellow-500' },
              { name: 'Énergique', percentage: 21, color: 'bg-orange-500' },
            ],
            recommendations: [
              'Continuez votre session de méditation',
              'Écoutez de la musique relaxante',
              'Prenez quelques respirations profondes'
            ]
          });
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    // Simulate camera access
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.log('Camera access denied, using simulation mode');
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    setProgress(0);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const resetScanning = () => {
    setScanResult(null);
    setProgress(0);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            Scanner émotionnel
          </h1>
          <p className="text-muted-foreground">Analysez votre état émotionnel en temps réel grâce à l'IA</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Camera/Scanner Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Caméra
              </CardTitle>
              <CardDescription>
                Positionnez votre visage dans le cadre pour commencer l'analyse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden mb-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {!videoRef.current?.srcObject && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Cliquez sur "Commencer" pour activer la caméra</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Scanning overlay */}
                  {isScanning && (
                    <div className="absolute inset-0 border-4 border-primary animate-pulse">
                      <div className="absolute inset-4 border-2 border-white/50 rounded-lg"></div>
                    </div>
                  )}
                </div>

                {/* Progress */}
                {isScanning && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Analyse en cours...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                {/* Controls */}
                <div className="flex gap-2">
                  {!isScanning && !scanResult ? (
                    <Button onClick={startScanning} className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Commencer l'analyse
                    </Button>
                  ) : isScanning ? (
                    <Button onClick={stopScanning} variant="destructive" className="flex-1">
                      <Square className="h-4 w-4 mr-2" />
                      Arrêter
                    </Button>
                  ) : (
                    <Button onClick={resetScanning} variant="outline" className="flex-1">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Nouvelle analyse
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Résultats
              </CardTitle>
              <CardDescription>
                {scanResult ? 'Votre analyse émotionnelle' : 'Les résultats apparaîtront ici'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scanResult ? (
                <div className="space-y-6">
                  {/* Primary Emotion */}
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Émotion principale</p>
                    <h3 className="text-2xl font-bold">{scanResult.primaryEmotion}</h3>
                    <Badge variant="outline" className="mt-2">
                      {scanResult.confidence}% de confiance
                    </Badge>
                  </div>

                  {/* Emotion Breakdown */}
                  <div>
                    <h4 className="font-medium mb-3">Détail des émotions</h4>
                    <div className="space-y-3">
                      {scanResult.emotions.map((emotion: any, index: number) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{emotion.name}</span>
                            <span>{emotion.percentage}%</span>
                          </div>
                          <Progress value={emotion.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-medium mb-3">Recommandations</h4>
                    <ul className="space-y-2">
                      {scanResult.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Sauvegarder
                    </Button>
                    <Button size="sm" className="flex-1">
                      Voir musique adaptée
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Lancez une analyse pour voir vos résultats émotionnels
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmotionScanner;

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Play, Pause, Square, Mic, Camera, Heart, Zap, TrendingUp } from 'lucide-react';

const ScanPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanType, setScanType] = useState<'voice' | 'face' | 'text'>('voice');

  const startScan = () => {
    setIsScanning(true);
    setProgress(0);
    setScanResult(null);
    
    // Simulation du scan
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          // Simulation d'un résultat
          setScanResult({
            emotion: 'Calme',
            confidence: 87,
            stress: 23,
            energy: 65,
            mood: 'Positif',
            recommendations: [
              'Continuez vos activités actuelles',
              'Une courte méditation pourrait être bénéfique',
              'Votre niveau d\'énergie est optimal'
            ]
          });
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const stopScan = () => {
    setIsScanning(false);
    setProgress(0);
  };

  const scanTypes = [
    {
      id: 'voice',
      name: 'Analyse vocale',
      icon: <Mic className="h-6 w-6" />,
      description: 'Analysez votre état émotionnel via votre voix',
      duration: '30 secondes'
    },
    {
      id: 'face',
      name: 'Analyse faciale',
      icon: <Camera className="h-6 w-6" />,
      description: 'Détection des émotions par reconnaissance faciale',
      duration: '15 secondes'
    },
    {
      id: 'text',
      name: 'Analyse textuelle',
      icon: <Brain className="h-6 w-6" />,
      description: 'Analysez vos émotions via un questionnaire',
      duration: '2 minutes'
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Scan Émotionnel</h1>
        <p className="text-muted-foreground">
          Découvrez votre état émotionnel actuel grâce à notre IA avancée
        </p>
      </div>

      {/* Scan Type Selection */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {scanTypes.map((type) => (
          <Card 
            key={type.id}
            className={`cursor-pointer transition-all ${
              scanType === type.id 
                ? 'border-primary shadow-md' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => setScanType(type.id as any)}
          >
            <CardHeader className="text-center pb-2">
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                scanType === type.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                {type.icon}
              </div>
              <CardTitle className="text-lg">{type.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="mb-2">{type.description}</CardDescription>
              <Badge variant="outline">{type.duration}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scan Control */}
      <Card className="mb-8">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            {isScanning ? 'Analyse en cours...' : 'Prêt pour l\'analyse'}
          </CardTitle>
          <CardDescription>
            {isScanning 
              ? 'Restez détendu pendant que notre IA analyse vos données'
              : `Cliquez sur "Commencer" pour lancer votre ${scanTypes.find(t => t.id === scanType)?.name.toLowerCase()}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isScanning && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-center text-sm text-muted-foreground">
                {progress}% - Analyse des patterns émotionnels...
              </p>
            </div>
          )}
          
          <div className="flex justify-center gap-4">
            {!isScanning ? (
              <Button onClick={startScan} size="lg" className="px-8">
                <Play className="h-4 w-4 mr-2" />
                Commencer l'analyse
              </Button>
            ) : (
              <Button onClick={stopScan} variant="outline" size="lg" className="px-8">
                <Square className="h-4 w-4 mr-2" />
                Arrêter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {scanResult && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-500" />
                Résultats de votre scan
              </CardTitle>
              <CardDescription>
                Analyse complétée avec un taux de confiance de {scanResult.confidence}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Heart className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="font-semibold text-lg">{scanResult.emotion}</div>
                  <div className="text-sm text-muted-foreground">Émotion dominante</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="font-semibold text-lg">{scanResult.energy}%</div>
                  <div className="text-sm text-muted-foreground">Niveau d'énergie</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="font-semibold text-lg">{scanResult.stress}%</div>
                  <div className="text-sm text-muted-foreground">Niveau de stress</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="font-semibold text-lg">{scanResult.mood}</div>
                  <div className="text-sm text-muted-foreground">Humeur générale</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommandations personnalisées</CardTitle>
              <CardDescription>
                Basées sur votre profil émotionnel actuel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {scanResult.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm font-semibold">{index + 1}</span>
                    </div>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex gap-4 mt-6 pt-6 border-t">
                <Button variant="outline">
                  Sauvegarder les résultats
                </Button>
                <Button>
                  Voir les recommandations détaillées
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Historical Data Preview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Votre évolution émotionnelle</CardTitle>
          <CardDescription>
            Aperçu de vos derniers scans émotionnels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Effectuez votre premier scan pour voir votre évolution</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanPage;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Scan, Camera, Play, RotateCcw, TrendingUp, Calendar } from 'lucide-react';

interface EmotionResult {
  emotion: string;
  confidence: number;
  intensity: number;
  timestamp: Date;
}

const B2CScan: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentResult, setCurrentResult] = useState<EmotionResult | null>(null);
  const [scanHistory, setScanHistory] = useState<EmotionResult[]>([
    {
      emotion: 'calm',
      confidence: 0.85,
      intensity: 0.6,
      timestamp: new Date(Date.now() - 3600000) // 1h ago
    },
    {
      emotion: 'focused',
      confidence: 0.78,
      intensity: 0.7,
      timestamp: new Date(Date.now() - 7200000) // 2h ago
    },
    {
      emotion: 'happy',
      confidence: 0.92,
      intensity: 0.8,
      timestamp: new Date(Date.now() - 86400000) // Yesterday
    }
  ]);

  const emotions = {
    calm: { label: 'Calme', color: 'bg-green-100 text-green-800', emoji: '😌' },
    happy: { label: 'Heureux', color: 'bg-yellow-100 text-yellow-800', emoji: '😊' },
    focused: { label: 'Concentré', color: 'bg-blue-100 text-blue-800', emoji: '🎯' },
    stressed: { label: 'Stressé', color: 'bg-red-100 text-red-800', emoji: '😰' },
    excited: { label: 'Excité', color: 'bg-purple-100 text-purple-800', emoji: '🤩' },
    sad: { label: 'Triste', color: 'bg-gray-100 text-gray-800', emoji: '😢' },
    tired: { label: 'Fatigué', color: 'bg-orange-100 text-orange-800', emoji: '😴' },
    confident: { label: 'Confiant', color: 'bg-indigo-100 text-indigo-800', emoji: '💪' }
  };

  const mockEmotions = Object.keys(emotions);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setCurrentResult(null);

    // Simulation du processus de scan
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          
          // Générer un résultat aléatoire
          const randomEmotion = mockEmotions[Math.floor(Math.random() * mockEmotions.length)];
          const result: EmotionResult = {
            emotion: randomEmotion,
            confidence: 0.7 + Math.random() * 0.3, // Entre 70% et 100%
            intensity: 0.3 + Math.random() * 0.7, // Entre 30% et 100%
            timestamp: new Date()
          };
          
          setCurrentResult(result);
          setScanHistory(prev => [result, ...prev.slice(0, 9)]); // Garder les 10 derniers
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  };

  const getEmotionInfo = (emotion: string) => {
    return emotions[emotion as keyof typeof emotions] || emotions.calm;
  };

  const getRecommendation = (emotion: string, intensity: number) => {
    const recommendations = {
      stressed: 'Prenez quelques minutes pour faire des exercices de respiration profonde.',
      sad: 'Écoutez de la musique apaisante ou parlez à quelqu\'un en qui vous avez confiance.',
      tired: 'Accordez-vous une pause ou planifiez un moment de repos.',
      happy: 'Profitez de ce moment positif et partagez votre bonne humeur !',
      calm: 'Maintenez cet état en pratiquant la pleine conscience.',
      focused: 'C\'est le moment idéal pour vous concentrer sur vos tâches importantes.',
      excited: 'Canalisez cette énergie dans des activités créatives ou physiques.',
      confident: 'Profitez de cette confiance pour relever de nouveaux défis.'
    };

    return recommendations[emotion as keyof typeof recommendations] || 
           'Prenez soin de votre bien-être émotionnel aujourd\'hui.';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Scan className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Scan Émotionnel</h1>
          <p className="text-muted-foreground">Analysez votre état émotionnel en temps réel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner principal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Scanner Émotionnel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Zone de scan */}
              <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center border-2 border-dashed border-primary/30">
                {isScanning ? (
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium">Analyse en cours...</p>
                      <Progress value={scanProgress} className="w-48 mx-auto" />
                      <p className="text-sm text-muted-foreground">{scanProgress}%</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <Camera className="h-16 w-16 text-primary/50 mx-auto" />
                    <div>
                      <p className="text-lg font-medium mb-2">Prêt à scanner vos émotions</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Regardez la caméra et restez naturel pendant le scan
                      </p>
                      <Button onClick={startScan} size="lg" disabled={isScanning}>
                        <Play className="h-4 w-4 mr-2" />
                        Démarrer le scan
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Résultat actuel */}
              {currentResult && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Résultat de l'analyse</span>
                      <span className="text-2xl">{getEmotionInfo(currentResult.emotion).emoji}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold">
                          Émotion détectée : {getEmotionInfo(currentResult.emotion).label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Confiance : {Math.round(currentResult.confidence * 100)}%
                        </p>
                      </div>
                      <Badge className={getEmotionInfo(currentResult.emotion).color}>
                        Intensité : {Math.round(currentResult.intensity * 100)}%
                      </Badge>
                    </div>

                    <div className="p-3 bg-background rounded-lg">
                      <p className="text-sm">
                        <strong>Recommandation :</strong> {getRecommendation(currentResult.emotion, currentResult.intensity)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Écouter musique adaptée
                      </Button>
                      <Button variant="outline" size="sm">
                        Parler au coach IA
                      </Button>
                      <Button variant="outline" size="sm">
                        Ajouter au journal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panneau latéral */}
        <div className="space-y-4">
          {/* Statistiques rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Scans effectués</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Émotion dominante</span>
                <Badge className={getEmotionInfo('calm').color}>
                  Calme
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Bien-être général</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-green-600">+12%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historique */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Historique récent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scanHistory.slice(0, 5).map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-secondary/20">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getEmotionInfo(result.emotion).emoji}</span>
                      <div>
                        <p className="text-sm font-medium">{getEmotionInfo(result.emotion).label}</p>
                        <p className="text-xs text-muted-foreground">{formatTime(result.timestamp)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {Math.round(result.confidence * 100)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {scanHistory.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucun scan effectué aujourd'hui
                </p>
              )}
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full" onClick={startScan}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Nouveau scan
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Voir tendances
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Paramètres scan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2CScan;

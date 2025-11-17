import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, TrendingUp, Heart, Zap, Loader2 } from 'lucide-react';
import { useHumeWebSocket } from '@/hooks/useHumeWebSocket';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export default function VoiceAnalysisPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const { isConnected, error, latestResult } = useHumeWebSocket({
    enabled: isAnalyzing,
    onEmotions: (result) => {
      logger.debug('Emotions detected:', result, 'PAGE');
    }
  });

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    toast({
      title: '🎭 Analyse démarrée',
      description: 'Analyse faciale en temps réel activée'
    });
  };

  const handleStopAnalysis = () => {
    setIsAnalyzing(false);
    toast({
      title: 'Analyse arrêtée',
      description: 'Analyse faciale désactivée'
    });
  };

  // Calculate emotion state from valence/arousal
  const getEmotionState = () => {
    if (!latestResult) return { state: 'Neutre', color: 'text-muted-foreground' };

    const { valence = 0.5, arousal = 0.5 } = latestResult;

    if (valence > 0.6 && arousal > 0.6) return { state: 'Joyeux', color: 'text-green-600' };
    if (valence > 0.6 && arousal < 0.4) return { state: 'Calme', color: 'text-blue-600' };
    if (valence < 0.4 && arousal > 0.6) return { state: 'Stressé', color: 'text-red-600' };
    if (valence < 0.4 && arousal < 0.4) return { state: 'Triste', color: 'text-gray-600' };

    return { state: 'Neutre', color: 'text-muted-foreground' };
  };

  const getEnergyLevel = () => {
    if (!latestResult) return 'Moyen';
    if (!latestResult.arousal) return 'Moyen';

    if (latestResult.arousal > 0.7) return 'Élevé';
    if (latestResult.arousal < 0.3) return 'Faible';
    return 'Moyen';
  };

  const getArousalPercentage = (): number => {
    if (!latestResult) return 50;
    return latestResult.arousal ? latestResult.arousal * 100 : 50;
  };

  const getValencePercentage = (): number => {
    if (!latestResult) return 50;
    return latestResult.valence ? latestResult.valence * 100 : 50;
  };

  const emotionState = getEmotionState();
  const energyLevel = getEnergyLevel();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Analyse Émotionnelle Temps Réel</h1>
        <p className="text-muted-foreground">
          Analysez vos émotions en direct avec l'IA Hume
        </p>
      </div>

      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold">État émotionnel</h3>
          <p className={`text-2xl font-bold ${emotionState.color}`}>
            {emotionState.state}
          </p>
          <p className="text-sm text-muted-foreground">
            {isAnalyzing ? 'Analyse en cours...' : 'En attente'}
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold">Niveau d'énergie</h3>
          <p className="text-2xl font-bold">{energyLevel}</p>
          <p className="text-sm text-muted-foreground">
            Arousal: {getArousalPercentage().toFixed(0)}%
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold">Valence</h3>
          <p className="text-2xl font-bold">
            {getValencePercentage().toFixed(0)}%
          </p>
          <p className="text-sm text-muted-foreground">Positivité émotionnelle</p>
        </Card>
      </div>

      {latestResult?.emotions && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Émotions détectées</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {latestResult.emotions.slice(0, 8).map((emotion) => (
              <div key={emotion.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{emotion.name}</span>
                  <span className="font-mono">{(emotion.score * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${emotion.score * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-8 text-center space-y-6">
        <h3 className="text-xl font-semibold">
          {isAnalyzing ? 'Analyse en cours' : 'Nouvelle analyse'}
        </h3>
        <p className="text-muted-foreground">
          {isAnalyzing 
            ? 'Votre visage est analysé en temps réel via la caméra'
            : 'Activez votre caméra pour commencer l\'analyse faciale'
          }
        </p>
        
        {isConnected && (
          <div className="flex items-center justify-center gap-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            Connecté à Hume AI
          </div>
        )}

        {!isAnalyzing ? (
          <Button size="lg" onClick={handleStartAnalysis}>
            <Camera className="mr-2 h-5 w-5" />
            Démarrer l'analyse
          </Button>
        ) : (
          <Button size="lg" variant="secondary" onClick={handleStopAnalysis}>
            {isConnected ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Arrêter l'analyse
              </>
            ) : (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connexion...
              </>
            )}
          </Button>
        )}
      </Card>
    </div>
  );
}

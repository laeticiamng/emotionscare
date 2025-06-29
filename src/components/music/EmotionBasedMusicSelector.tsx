
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Brain, Music, Play, Loader2 } from 'lucide-react';
import { useHumeAnalysis } from '@/hooks/useHumeAnalysis';
import { useMusicGeneration } from '@/hooks/useMusicGeneration';
import { useMusicControls } from '@/hooks/useMusicControls';
import { toast } from 'sonner';

const EMOTION_PRESETS = {
  joy: {
    label: 'Joyeux',
    description: 'Musique uplifting et énergique',
    prompt: 'musique joyeuse et énergique avec des mélodies uplifting',
    color: 'bg-yellow-500'
  },
  calm: {
    label: 'Calme',
    description: 'Ambiance relaxante et apaisante',
    prompt: 'musique douce et relaxante avec des sons apaisants',
    color: 'bg-blue-500'
  },
  excitement: {
    label: 'Excité',
    description: 'Rythmes dynamiques et motivants',
    prompt: 'musique dynamique et motivante avec des rythmes énergiques',
    color: 'bg-orange-500'
  },
  sadness: {
    label: 'Mélancolique',
    description: 'Mélodies douces et contemplatives',
    prompt: 'musique douce et mélancolique pour la réflexion',
    color: 'bg-purple-500'
  },
  anger: {
    label: 'Tendu',
    description: 'Musique pour évacuer les tensions',
    prompt: 'musique puissante pour libérer les tensions',
    color: 'bg-red-500'
  },
  neutral: {
    label: 'Neutre',
    description: 'Ambiance équilibrée et harmonieuse',
    prompt: 'musique équilibrée et harmonieuse',
    color: 'bg-gray-500'
  }
};

const EmotionBasedMusicSelector: React.FC = () => {
  const { startVoiceAnalysis, isAnalyzing, currentEmotion, emotionData } = useHumeAnalysis();
  const { generateMusic, isGenerating } = useMusicGeneration();
  const { playTrack } = useMusicControls();
  const [suggestedEmotions, setSuggestedEmotions] = useState<string[]>([]);

  useEffect(() => {
    if (emotionData) {
      // Prendre les 3 émotions les plus fortes
      const topEmotions = emotionData.emotions
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3)
        .map(e => e.name);
      setSuggestedEmotions(topEmotions);
    }
  }, [emotionData]);

  const handleEmotionSelect = async (emotion: string) => {
    const preset = EMOTION_PRESETS[emotion as keyof typeof EMOTION_PRESETS];
    if (!preset) return;

    try {
      toast.info(`Génération de musique ${preset.label.toLowerCase()}...`);
      const track = await generateMusic(emotion, preset.prompt);
      if (track) {
        await playTrack(track);
        toast.success(`Musique ${preset.label.toLowerCase()} générée !`);
      }
    } catch (error) {
      console.error('Erreur génération:', error);
      toast.error('Erreur lors de la génération');
    }
  };

  return (
    <div className="space-y-6">
      {/* Scanner émotionnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Scanner Émotionnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Analysez votre état émotionnel pour une musique parfaitement adaptée
            </p>
            
            <Button 
              onClick={startVoiceAnalysis}
              disabled={isAnalyzing}
              size="lg"
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Scanner mon humeur
                </>
              )}
            </Button>

            {currentEmotion && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">Émotion détectée: {currentEmotion}</p>
                {emotionData && (
                  <p className="text-sm text-muted-foreground">
                    Confiance: {Math.round(emotionData.confidence_score * 100)}%
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Suggestions basées sur l'analyse */}
      {suggestedEmotions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5 text-green-500" />
              Recommandations Personnalisées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Basé sur votre analyse émotionnelle
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {suggestedEmotions.map((emotion) => {
                const preset = EMOTION_PRESETS[emotion as keyof typeof EMOTION_PRESETS];
                if (!preset) return null;
                
                return (
                  <Button
                    key={emotion}
                    onClick={() => handleEmotionSelect(emotion)}
                    disabled={isGenerating}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start"
                  >
                    <div className={`w-3 h-3 rounded-full ${preset.color} mb-2`} />
                    <div className="text-left">
                      <div className="font-medium">{preset.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {preset.description}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Presets généraux */}
      <Card>
        <CardHeader>
          <CardTitle>Ambiances Prêtes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(EMOTION_PRESETS).map(([key, preset]) => (
              <Button
                key={key}
                onClick={() => handleEmotionSelect(key)}
                disabled={isGenerating}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <div className={`w-4 h-4 rounded-full ${preset.color}`} />
                <div className="text-center">
                  <div className="font-medium text-sm">{preset.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {preset.description}
                  </div>
                </div>
                {isGenerating ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionBasedMusicSelector;

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdaptiveMusic } from '@/hooks/useAdaptiveMusic';
import PremiumMusicPlayer from './player/PremiumMusicPlayer';
import { EmotionResult } from '@/types';
import { Music2, Heart } from 'lucide-react';

interface EmotionMusicIntegrationProps {
  emotionResult?: EmotionResult | null;
  autoStart?: boolean;
  className?: string;
}

const EmotionMusicIntegration: React.FC<EmotionMusicIntegrationProps> = ({
  emotionResult,
  autoStart = false,
  className = ""
}) => {
  const emotion = emotionResult?.emotion || 'calm';
  
  const {
    currentTrack,
    currentEmotion,
    adaptToEmotion,
    isAdaptiveEnabled
  } = useAdaptiveMusic({ emotion, autoStart });

  // Adapter automatiquement la musique quand l'émotion change
  useEffect(() => {
    if (emotionResult && isAdaptiveEnabled) {
      adaptToEmotion(emotionResult.emotion);
    }
  }, [emotionResult, adaptToEmotion, isAdaptiveEnabled]);

  const getEmotionDescription = (emotion: string): string => {
    const descriptions = {
      calm: 'Musique apaisante pour maintenir votre sérénité',
      happy: 'Musique joyeuse pour amplifier votre bonheur',
      anxious: 'Musique relaxante pour réduire votre anxiété',
      sad: 'Musique douce pour vous accompagner',
      angry: 'Musique calmante pour apaiser vos tensions',
      energetic: 'Musique dynamique pour votre énergie'
    };
    
    return descriptions[emotion as keyof typeof descriptions] || 'Musique adaptée à votre état émotionnel';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {emotionResult && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Émotion détectée
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium capitalize">{emotionResult.emotion}</p>
                <p className="text-sm text-muted-foreground">
                  Confiance: {Math.round((typeof emotionResult.confidence === 'number' ? emotionResult.confidence : emotionResult.confidence.overall) * 100)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  {getEmotionDescription(emotionResult.emotion)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <PremiumMusicPlayer
        className="adaptive-mode"
      />

      {isAdaptiveEnabled && currentTrack && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Music2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Recommandation musicale</p>
                <p className="text-xs text-muted-foreground">
                  Basée sur votre état émotionnel actuel ({currentEmotion})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmotionMusicIntegration;

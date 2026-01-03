/**
 * EmotionLinkBanner - Lien entre scan émotionnel et musique adaptative
 * Propose de la musique basée sur l'état émotionnel détecté
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Music, 
  Sparkles, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface DetectedEmotion {
  name: string;
  intensity: number;
  color?: string;
}

interface EmotionLinkBannerProps {
  lastEmotion?: DetectedEmotion | null;
  lastScanTime?: Date | null;
  suggestedMood?: string;
  onGenerateForEmotion?: (emotion: string) => void;
  className?: string;
}

const EMOTION_TO_MOOD: Record<string, { mood: string; description: string; color: string }> = {
  joy: { mood: 'energize', description: 'Musique énergique', color: 'text-yellow-500' },
  happy: { mood: 'energize', description: 'Musique positive', color: 'text-yellow-500' },
  sadness: { mood: 'calm', description: 'Musique apaisante', color: 'text-blue-500' },
  sad: { mood: 'calm', description: 'Musique réconfortante', color: 'text-blue-500' },
  anger: { mood: 'calm', description: 'Musique relaxante', color: 'text-red-500' },
  fear: { mood: 'meditation', description: 'Musique rassurante', color: 'text-purple-500' },
  anxiety: { mood: 'calm', description: 'Musique anti-stress', color: 'text-orange-500' },
  stress: { mood: 'calm', description: 'Musique destressante', color: 'text-orange-500' },
  neutral: { mood: 'focus', description: 'Musique focus', color: 'text-gray-500' },
  calm: { mood: 'focus', description: 'Musique de concentration', color: 'text-teal-500' },
  surprise: { mood: 'creative', description: 'Musique créative', color: 'text-pink-500' },
  disgust: { mood: 'calm', description: 'Musique purifiante', color: 'text-green-500' },
};

export const EmotionLinkBanner: React.FC<EmotionLinkBannerProps> = ({
  lastEmotion,
  lastScanTime,
  suggestedMood,
  onGenerateForEmotion,
  className,
}) => {
  const navigate = useNavigate();

  // Pas d'émotion détectée récemment
  if (!lastEmotion) {
    return (
      <Card className={cn("bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Musique adaptée à vos émotions</p>
                <p className="text-xs text-muted-foreground">
                  Scannez votre état émotionnel pour des recommandations personnalisées
                </p>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => navigate('/app/scan')}
              className="gap-1"
            >
              Scanner
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const emotionKey = lastEmotion.name.toLowerCase();
  const mapping = EMOTION_TO_MOOD[emotionKey] || EMOTION_TO_MOOD.neutral;
  const intensity = Math.round(lastEmotion.intensity * 100);
  
  // Temps depuis le dernier scan
  const timeSinceScan = lastScanTime 
    ? Math.round((Date.now() - lastScanTime.getTime()) / 60000)
    : null;

  return (
    <Card className={cn(
      "bg-gradient-to-r from-primary/10 via-background to-accent/10 border-primary/20",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm">Émotion détectée :</p>
                <Badge 
                  variant="secondary" 
                  className={cn("capitalize", mapping.color)}
                >
                  {lastEmotion.name}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  ({intensity}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Music className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Suggestion : {mapping.description}
                </p>
                {timeSinceScan !== null && (
                  <span className="text-xs text-muted-foreground">
                    • il y a {timeSinceScan < 1 ? 'moins d\'1' : timeSinceScan} min
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => onGenerateForEmotion?.(mapping.mood)}
              className="gap-1"
            >
              <Music className="h-4 w-4" />
              Générer
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => navigate('/app/scan')}
              title="Nouveau scan"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionLinkBanner;

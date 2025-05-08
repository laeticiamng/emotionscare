
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, PlayCircle } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import type { EmotionResult } from '@/lib/scanService';

interface EmotionBasedMusicRecommendationProps {
  emotionResult: EmotionResult | null;
  isLoading?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'standalone';
}

// Mapping des émotions vers les types de musique
const EMOTION_TO_MUSIC: Record<string, string> = {
  happy: 'happy',
  excited: 'energetic',
  joyful: 'happy',
  calm: 'calm',
  relaxed: 'calm',
  sad: 'calm',
  anxious: 'calm',
  stressed: 'calm',
  neutral: 'neutral',
  focused: 'focused',
  default: 'neutral'
};

// Descriptions associées à chaque type d'émotion
const MUSIC_DESCRIPTIONS: Record<string, string> = {
  happy: "Des mélodies enjouées pour accompagner votre bonne humeur",
  energetic: "Des rythmes dynamiques pour canaliser votre énergie",
  calm: "Des sons apaisants pour vous aider à vous détendre",
  neutral: "Une ambiance musicale équilibrée pour votre journée",
  focused: "Des sons qui favorisent la concentration et la productivité"
};

const EmotionBasedMusicRecommendation: React.FC<EmotionBasedMusicRecommendationProps> = ({ 
  emotionResult,
  isLoading = false,
  className = '',
  variant = 'default'
}) => {
  const { loadPlaylistForEmotion, openDrawer } = useMusic();
  const { toast } = useToast();
  
  if (!emotionResult) return null;
  
  const emotion = emotionResult.emotion?.toLowerCase() || 'neutral';
  const musicType = EMOTION_TO_MUSIC[emotion] || EMOTION_TO_MUSIC.default;
  const description = MUSIC_DESCRIPTIONS[musicType] || MUSIC_DESCRIPTIONS.neutral;
  
  const handlePlayMusic = () => {
    loadPlaylistForEmotion(musicType);
    openDrawer();
    
    toast({
      title: "Playlist activée",
      description: `Votre ambiance musicale "${musicType}" est prête à être écoutée`,
    });
  };

  // Classes et styles selon la variante
  const cardClasses = `${className} ${variant === 'standalone' ? 'border-t-4 border-t-primary' : ''}`;
  const headerClasses = variant === 'compact' ? "pb-1 pt-3" : variant === 'standalone' ? "pb-2" : "pb-2";
  const contentClasses = variant === 'compact' ? 'pt-0' : '';
  const buttonVariant = variant === 'standalone' ? 'default' : 'outline';
  
  return (
    <Card className={cardClasses}>
      <CardHeader className={headerClasses}>
        <CardTitle className="flex items-center text-lg">
          <Music className="mr-2 h-5 w-5" />
          Recommandation musicale
        </CardTitle>
      </CardHeader>
      <CardContent className={contentClasses}>
        <div className="mb-3">
          <h4 className="font-medium mb-1">
            Basé sur votre état émotionnel: <span className="text-primary">{emotion}</span>
          </h4>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        
        <Button 
          onClick={handlePlayMusic}
          className="w-full flex items-center justify-center gap-2"
          disabled={isLoading}
          variant={buttonVariant}
        >
          <PlayCircle className="h-5 w-5" />
          Écouter la playlist recommandée
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmotionBasedMusicRecommendation;

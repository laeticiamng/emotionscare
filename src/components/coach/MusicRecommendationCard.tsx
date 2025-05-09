
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Sparkles } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import { safeOpen } from '@/lib/utils';

interface MusicRecommendationCardProps {
  emotion?: string;
  intensity?: number;
  standalone?: boolean;
}

const emotionDescriptions: Record<string, string> = {
  happy: "Des mélodies positives pour maintenir votre bonne humeur",
  calm: "Des sons apaisants pour favoriser la détente et la sérénité",
  focused: "Des rythmes soutenus pour améliorer votre concentration",
  energetic: "Des tempos dynamiques pour stimuler votre énergie",
  sad: "Des mélodies apaisantes pour adoucir vos moments difficiles",
  neutral: "Une ambiance équilibrée adaptée à votre journée"
};

const MusicRecommendationCard: React.FC<MusicRecommendationCardProps> = ({
  emotion = 'neutral',
  intensity = 50,
  standalone = false,
}) => {
  const { loadPlaylistForEmotion, setOpenDrawer } = useMusic();
  const { toast } = useToast();

  const handlePlayRecommendedMusic = () => {
    // Map emotion to music type if needed
    const musicType = emotion.toLowerCase();
    
    loadPlaylistForEmotion(musicType);
    setOpenDrawer(true);
    
    toast({
      title: "Musique recommandée activée",
      description: `Playlist "${emotion}" chargée pour accompagner votre humeur.`
    });
  };
  
  const description = emotionDescriptions[emotion.toLowerCase()] || emotionDescriptions.neutral;

  return (
    <Card className={standalone ? 'border-t-4 border-t-primary' : ''}>
      <CardHeader className={standalone ? "pb-2" : "pb-1 pt-3"}>
        <CardTitle className="flex items-center text-lg">
          <Music className="mr-2 h-5 w-5" />
          Recommandation musicale
        </CardTitle>
      </CardHeader>
      <CardContent className={standalone ? '' : 'pt-0'}>
        <div className="mb-3">
          <h4 className="font-medium mb-1">
            {emotion === 'neutral' 
              ? "Ambiance musicale équilibrée" 
              : `Ambiance adaptée à votre humeur: ${emotion}`}
          </h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        
        <Button 
          onClick={handlePlayRecommendedMusic}
          className="w-full flex items-center justify-center gap-2"
          variant={standalone ? 'default' : 'outline'}
        >
          <Sparkles className="h-4 w-4" />
          Écouter la playlist recommandée
        </Button>
      </CardContent>
    </Card>
  );
};

export default MusicRecommendationCard;

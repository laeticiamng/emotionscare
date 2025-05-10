
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Music, Play } from 'lucide-react';
import { EmotionResult } from '@/types';
import { useMusic } from '@/contexts/MusicContext';

interface MusicEmotionRecommendationProps {
  emotionResult: EmotionResult;
}

const MusicEmotionRecommendation: React.FC<MusicEmotionRecommendationProps> = ({ emotionResult }) => {
  const { loadPlaylistForEmotion, setOpenDrawer } = useMusic();
  
  const handlePlayMusic = async () => {
    // Extract the emotion from the result, with fallbacks
    const emotion = emotionResult.primaryEmotion?.name || emotionResult.emotion || 'neutral';
    await loadPlaylistForEmotion(emotion.toLowerCase());
    setOpenDrawer(true);
  };
  
  const getRecommendationText = (emotion: string): string => {
    switch(emotion.toLowerCase()) {
      case 'happy':
      case 'joy':
      case 'excited':
        return "Des morceaux énergiques pour maintenir votre bonne humeur";
      case 'sad':
      case 'depressed':
        return "Des mélodies douces et réconfortantes pour vous accompagner";
      case 'angry':
      case 'frustrated':
        return "Des morceaux qui vous aideront à transformer cette énergie";
      case 'anxious':
      case 'stressed':
        return "Des compositions apaisantes pour réduire votre anxiété";
      case 'calm':
      case 'relaxed':
        return "Des sons ambiants pour maintenir votre état de calme";
      default:
        return "Une sélection musicale adaptée à votre état émotionnel";
    }
  };

  return (
    <Card className="border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Music className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-medium">Recommandation musicale</h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          {getRecommendationText(emotionResult.emotion)}
        </p>
        
        <Button 
          onClick={handlePlayMusic}
          className="w-full"
          size="sm"
        >
          <Play className="h-4 w-4 mr-2" /> Écouter la playlist
        </Button>
      </CardContent>
    </Card>
  );
};

export default MusicEmotionRecommendation;

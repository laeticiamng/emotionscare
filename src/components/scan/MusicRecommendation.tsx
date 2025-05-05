
import React from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, PlayCircle } from 'lucide-react';
import type { Emotion } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Map des émotions vers les types de musique
const EMOTION_TO_MUSIC: Record<string, string> = {
  happy: 'happy',
  sad: 'calm',
  angry: 'calm',
  anxious: 'calm',
  calm: 'neutral',
  excited: 'energetic',
  stressed: 'calm',
  tired: 'calm',
  neutral: 'neutral',
  focused: 'focused',
  energetic: 'energetic',
  relaxed: 'calm'
};

interface MusicRecommendationProps {
  emotion?: Emotion | null;
}

const MusicRecommendation: React.FC<MusicRecommendationProps> = ({ emotion }) => {
  const { loadPlaylistForEmotion, openDrawer } = useMusic();
  const { toast } = useToast();

  if (!emotion) {
    return null;
  }

  // Déterminer le type de musique recommandé en fonction de l'émotion
  // Use emotion.emotion instead of emotion.name
  const emotionName = emotion.emotion?.toLowerCase() || 'neutral';
  const musicType = EMOTION_TO_MUSIC[emotionName] || 'neutral';
  
  // Descriptions des effets musicaux selon l'émotion
  const musicDescription = {
    happy: "Profitez de cette énergie positive avec une playlist enjouée",
    calm: "Une ambiance apaisante pour vous aider à retrouver la sérénité",
    energetic: "Une sélection dynamique pour canaliser votre énergie",
    neutral: "Une musique équilibrée pour maintenir votre état stable",
    focused: "Des morceaux pour favoriser la concentration et la clarté mentale"
  };

  const handlePlayMusic = () => {
    loadPlaylistForEmotion(musicType);
    openDrawer();
    
    toast({
      title: "Playlist activée",
      description: `Votre ambiance musicale "${musicType}" est prête à être écoutée`,
    });
  };

  return (
    <Card className="mt-6 border-t-4" style={{ borderTopColor: '#6366F1' }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Music className="mr-2 h-5 w-5" />
          Recommandation musicale
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <h4 className="font-medium mb-1">Basé sur votre état émotionnel: <span className="text-primary">{emotion.emotion}</span></h4>
          <p className="text-sm text-muted-foreground">{musicDescription[musicType] || "Une sélection musicale adaptée à votre état émotionnel"}</p>
        </div>
        
        <Button 
          onClick={handlePlayMusic}
          className="w-full flex items-center justify-center gap-2"
          variant="outline"
        >
          <PlayCircle className="h-5 w-5" />
          Écouter la playlist {musicType}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MusicRecommendation;

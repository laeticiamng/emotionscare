
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, PlayCircle } from 'lucide-react';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { useToast } from '@/hooks/use-toast';

interface MusicRecommendationProps {
  emotion: string;
  intensity?: number;
}

const MusicRecommendation: React.FC<MusicRecommendationProps> = ({ emotion, intensity = 0.5 }) => {
  const { activateMusicForEmotion, getEmotionMusicDescription } = useMusicEmotionIntegration();
  const { toast } = useToast();

  const handlePlayMusic = async () => {
    try {
      if (emotion) {
        await activateMusicForEmotion({
          emotion: emotion,
          intensity: intensity
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la musique:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la musique recommandée."
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Music className="mr-2 h-5 w-5" />
          Recommandation musicale
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-medium">Basée sur votre état: {emotion}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {getEmotionMusicDescription(emotion)}
          </p>
        </div>
        
        <Button 
          onClick={handlePlayMusic}
          className="w-full flex items-center justify-center gap-2"
        >
          <PlayCircle size={16} />
          Jouer la musique recommandée
        </Button>
      </CardContent>
    </Card>
  );
};

export default MusicRecommendation;

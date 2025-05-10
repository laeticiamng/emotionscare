
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, PlayCircle } from 'lucide-react';
import { Emotion } from '@/types';
import useMusicEmotionIntegration from '@/hooks/useMusicEmotionIntegration';
import { useToast } from '@/components/ui/use-toast';

interface MusicRecommendationProps {
  emotion: Emotion;
}

const MusicRecommendation: React.FC<MusicRecommendationProps> = ({ emotion }) => {
  const { activateMusicForEmotion, getEmotionMusicDescription } = useMusicEmotionIntegration();
  const { toast } = useToast();

  const handlePlayMusic = async () => {
    try {
      if (emotion) {
        const result = await activateMusicForEmotion({
          emotion: emotion.emotion,
          intensity: emotion.intensity || 0.5,
          confidence: emotion.confidence || 0.7
        });
        
        if (!result) {
          toast({
            title: "Musique non disponible",
            description: "Aucune playlist n'est disponible pour cette émotion pour le moment."
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la musique:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la musique recommandée.",
        variant: "destructive"
      });
    }
  };

  // Obtenir la description de la musique pour cette émotion
  const musicDescription = getEmotionMusicDescription(emotion.emotion);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Music className="h-4 w-4" />
          Musique pour votre humeur
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">
          {musicDescription}
        </p>
        <Button onClick={handlePlayMusic} className="w-full flex items-center gap-2">
          <PlayCircle className="h-4 w-4" />
          Écouter une musique adaptée
        </Button>
      </CardContent>
    </Card>
  );
};

export default MusicRecommendation;

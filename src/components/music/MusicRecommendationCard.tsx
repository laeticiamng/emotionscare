
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Music } from 'lucide-react';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { useToast } from '@/hooks/use-toast';

interface MusicRecommendationCardProps {
  title: string;
  emotion: string;
  icon?: React.ReactNode;
}

const MusicRecommendationCard: React.FC<MusicRecommendationCardProps> = ({ title, emotion, icon }) => {
  const [intensity, setIntensity] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const { activateMusicForEmotion } = useMusicEmotionIntegration();
  const { toast } = useToast();

  const handleGenerateMusic = async () => {
    setIsLoading(true);
    try {
      await activateMusicForEmotion({
        emotion: emotion,
        intensity: intensity / 100
      });
    } catch (error) {
      console.error('Error generating music:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la musique. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon || <Music className="h-5 w-5" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Intensité</span>
            <span className="font-medium">{intensity}%</span>
          </div>
          <Slider
            value={[intensity]}
            min={0}
            max={100}
            step={5}
            onValueChange={(vals) => setIntensity(vals[0])}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant="default"
          onClick={handleGenerateMusic}
          disabled={isLoading}
        >
          <Play className="h-4 w-4 mr-2" />
          {isLoading ? 'Génération...' : 'Générer'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MusicRecommendationCard;

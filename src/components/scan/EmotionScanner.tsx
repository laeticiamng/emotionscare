
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { HeartPulse, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMusicRecommendation } from '@/components/scan/live/useMusicRecommendation';
import type { Emotion } from '@/types';

interface EmotionScannerProps {
  latestEmotion: Emotion | null;
  isLoading?: boolean;
}

const EmotionScanner: React.FC<EmotionScannerProps> = ({ latestEmotion, isLoading = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handlePlayMusic } = useMusicRecommendation();
  
  const handleMusicTherapy = () => {
    if (latestEmotion) {
      // Convert Emotion to EmotionResult for handlePlayMusic
      const emotionResult = {
        emotion: latestEmotion.emotion || 'neutral',
        confidence: latestEmotion.confidence || 0.5,
        score: latestEmotion.score || 50
      };
      
      // First play the recommended music
      handlePlayMusic(emotionResult);
      
      // Then navigate to the music therapy page
      setTimeout(() => {
        navigate('/music');
        toast({
          title: 'Musicothérapie activée',
          description: 'Profitez de cette playlist adaptée à votre humeur',
        });
      }, 500);
    } else {
      // Just navigate to the music therapy page if no emotion is detected
      navigate('/music');
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <HeartPulse className="mr-2 h-5 w-5 text-primary" />
          Scanner émotionnel
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Analyse en cours...</p>
          </div>
        ) : latestEmotion ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">État émotionnel détecté:</h3>
                <p className="text-xl font-semibold">
                  {latestEmotion.emojis || ''} {latestEmotion.emotion || 'Neutre'}
                </p>
                {latestEmotion.text && (
                  <p className="text-sm text-muted-foreground mt-1 italic">
                    "{latestEmotion.text.slice(0, 60)}{latestEmotion.text.length > 60 ? '...' : ''}"
                  </p>
                )}
              </div>
              {latestEmotion.score !== undefined && (
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Score</div>
                  <div className="text-2xl font-bold">{latestEmotion.score}</div>
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleMusicTherapy} 
              variant="outline" 
              className="w-full"
            >
              <Music className="mr-2 h-4 w-4" />
              Thérapie musicale adaptée
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Aucune donnée émotionnelle récente disponible.
            </p>
            <Button 
              onClick={() => navigate('/scan')} 
              variant="outline" 
              className="mt-3"
              size="sm"
            >
              Faire un scan émotionnel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionScanner;

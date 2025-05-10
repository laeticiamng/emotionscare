
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import { Emotion, EmotionResult } from '@/types';
import MusicRecommendationCard from '../music/MusicRecommendationCard';
import VREmotionRecommendation from '../vr/VREmotionRecommendation';
import { Separator } from '@/components/ui/separator';
import { safeOpen } from '@/lib/utils';

interface EnhancedCoachAIProps {
  emotionResult: EmotionResult;
  onRequestNewScan?: () => void;
}

const EnhancedCoachAI: React.FC<EnhancedCoachAIProps> = ({ 
  emotionResult,
  onRequestNewScan
}) => {
  const [showMusicRec, setShowMusicRec] = useState(false);
  const [showVRRec, setShowVRRec] = useState(false);
  const { loadPlaylistForEmotion, setOpenDrawer } = useMusic();
  const { toast } = useToast();
  
  // Show recommendations based on emotion intensity
  useEffect(() => {
    if (emotionResult && emotionResult.intensity && emotionResult.intensity > 0.7) {
      setShowMusicRec(true);
      
      // Only show VR for certain emotions
      const vrEmotions = ['stressed', 'anxious', 'sad', 'angry'];
      const primaryEmotion = emotionResult.primaryEmotion?.name?.toLowerCase() || emotionResult.emotion?.toLowerCase() || '';
      if (vrEmotions.includes(primaryEmotion)) {
        setShowVRRec(true);
      }
    }
  }, [emotionResult]);
  
  const handlePlayMusic = async () => {
    const emotion = emotionResult.primaryEmotion?.name?.toLowerCase() || emotionResult.emotion?.toLowerCase() || 'neutral';
    await loadPlaylistForEmotion(emotion);
    // Use our safeOpen utility properly
    setOpenDrawer(true);
    
    toast({
      title: "Musique activée",
      description: `Playlist adaptée à votre humeur "${emotion}" chargée.`
    });
  };

  // Create a valid Emotion object from primaryEmotion
  const createEmotionFromPrimary = (): Emotion | null => {
    if (!emotionResult.primaryEmotion && !emotionResult.emotion) return null;
    
    return {
      id: emotionResult.id || 'temp-id',
      user_id: emotionResult.user_id || 'user-id',
      date: new Date(),
      emotion: emotionResult.primaryEmotion?.name || emotionResult.emotion || 'neutral',
      score: emotionResult.score || 0,
      confidence: emotionResult.confidence || 0.5,
      intensity: emotionResult.intensity || 0.5,
      name: emotionResult.primaryEmotion?.name || emotionResult.emotion || 'neutral',
      category: "emotion"
    };
  };
  
  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Brain className="mr-2 h-5 w-5" />
          Recommandations IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-primary/10 rounded-lg">
            <h3 className="font-medium flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              Analyse de votre état émotionnel
            </h3>
            <p className="mt-2 text-sm">
              {emotionResult.feedback || emotionResult.ai_feedback || 
                `Votre état émotionnel actuel est "${emotionResult.primaryEmotion?.name || emotionResult.emotion || 'neutre'}" avec une intensité de ${Math.round((emotionResult.intensity || 0.5) * 100)}%. 
                Voici quelques recommandations personnalisées pour vous aider à optimiser votre bien-être.`
              }
            </p>
            
            {onRequestNewScan && (
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs text-muted-foreground mt-2"
                onClick={onRequestNewScan}
              >
                Refaire un scan
              </Button>
            )}
          </div>
          
          {showMusicRec && (
            <>
              <Separator />
              <MusicRecommendationCard 
                emotion={emotionResult.primaryEmotion?.name || emotionResult.emotion || 'neutral'} 
                intensity={Math.round((emotionResult.intensity || 0.5) * 100)}
                standalone={true}
                className="mt-4"
              />
            </>
          )}
          
          {showVRRec && (
            <VREmotionRecommendation emotion={createEmotionFromPrimary()} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedCoachAI;

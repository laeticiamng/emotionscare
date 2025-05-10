
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Clock3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Emotion } from '@/types';

interface VREmotionRecommendationProps {
  emotion: Emotion | null;
}

const VREmotionRecommendation: React.FC<VREmotionRecommendationProps> = ({ emotion }) => {
  const navigate = useNavigate();
  
  if (!emotion) return null;
  
  // Get the emotion name safely
  const emotionName = emotion.name || emotion.emotion || 'neutral';
  
  // Determine if this is a stressful emotion
  const isStressfulEmotion = ['stressed', 'anxious', 'overwhelmed', 'angry', 'sad'].includes(emotionName.toLowerCase());
  
  // Recommend different VR sessions based on emotion type
  const recommendedSession = isStressfulEmotion
    ? {
        title: "Séance de relaxation profonde",
        duration: 5,
        description: "Une expérience immersive pour réduire votre niveau de stress et retrouver calme intérieur."
      }
    : {
        title: "Renforcement émotionnel positif",
        duration: 8,
        description: "Une expérience pour amplifier et ancrer vos émotions positives."
      };
  
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Calendar className="mr-2 h-5 w-5" />
          Séance VR recommandée
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">{recommendedSession.title}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Clock3 className="h-3.5 w-3.5 mr-1" />
              {recommendedSession.duration} minutes
            </div>
            <p className="text-sm mt-2">
              {recommendedSession.description}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={() => navigate('/vr/schedule')}
              variant="outline"
              className="flex-1"
            >
              Planifier
            </Button>
            <Button 
              onClick={() => navigate('/vr/sessions')}
              className="flex-1"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Explorer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VREmotionRecommendation;

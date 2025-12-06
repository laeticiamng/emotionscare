
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { EmotionResult } from '@/types';

interface VREmotionRecommendationProps {
  emotion: EmotionResult;
  onStartSession?: () => void;
}

const VREmotionRecommendation: React.FC<VREmotionRecommendationProps> = ({ 
  emotion,
  onStartSession 
}) => {
  const getRecommendation = (emotionName: string): { title: string, description: string } => {
    const recommendations = {
      joy: {
        title: "Amplify Your Joy",
        description: "Experience our joy-enhancing VR session that will help you fully embrace and expand your positive emotions."
      },
      calm: {
        title: "Tranquility Oasis",
        description: "Maintain and deepen your peaceful state with our guided meditation VR experience in a serene natural setting."
      },
      sad: {
        title: "Comfort Journey",
        description: "Our gentle VR session acknowledges your feelings while guiding you towards emotional balance and perspective."
      },
      anxious: {
        title: "Anxiety Relief",
        description: "Experience our specialized VR session designed to reduce anxiety through guided breathing and nature immersion."
      },
      angry: {
        title: "Emotion Transform",
        description: "Channel and transform intense emotions with our interactive VR experience focused on release and perspective."
      },
      default: {
        title: "Personalized VR Experience",
        description: "Discover a VR session tailored to your current emotional state to enhance your well-being."
      }
    };
    
    return recommendations[emotionName.toLowerCase() as keyof typeof recommendations] || recommendations.default;
  };
  
  // Get the recommendation object
  const recommendation = getRecommendation(emotion.emotion);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 pb-3">
        <CardTitle className="text-lg">VR Session Recommendation</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <h3 className="font-medium text-lg mb-2">{recommendation.title}</h3>
        <p className="text-muted-foreground">{recommendation.description}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onStartSession} className="w-full">
          Start Recommended Session <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VREmotionRecommendation;

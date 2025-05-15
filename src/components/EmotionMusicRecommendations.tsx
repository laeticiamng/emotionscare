
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionResult, MusicPlaylist, MusicTrack } from '@/types';
import { Music, Play } from 'lucide-react';

interface EmotionMusicRecommendationsProps {
  emotion: EmotionResult;
  onPlay?: (emotion: string) => void;
}

const EmotionMusicRecommendations: React.FC<EmotionMusicRecommendationsProps> = ({ 
  emotion,
  onPlay 
}) => {
  // Get appropriate playlist based on emotion
  const getRecommendationsByEmotion = (emotionName: string): { title: string, description: string } => {
    const recommendations = {
      joy: { 
        title: "Uplifting Tunes", 
        description: "Energetic and happy music to enhance your positive mood."
      },
      calm: { 
        title: "Peaceful Melodies", 
        description: "Soothing sounds to maintain your state of tranquility."
      },
      sad: { 
        title: "Comforting Sounds", 
        description: "Gentle music that acknowledges your feelings and provides comfort."
      },
      stressed: { 
        title: "Relaxation Mix", 
        description: "Calming compositions to help reduce stress and anxiety."
      },
      angry: { 
        title: "Mood Shifters", 
        description: "Music to help channel and transform intense emotions."
      },
      default: { 
        title: "Personalized Selection", 
        description: "Music curated for your current emotional state."
      }
    };
    
    return recommendations[emotionName.toLowerCase() as keyof typeof recommendations] || recommendations.default;
  };
  
  const recommendation = getRecommendationsByEmotion(emotion.emotion);
  
  const handlePlay = () => {
    if (onPlay) {
      onPlay(emotion.emotion);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" /> 
          {recommendation.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{recommendation.description}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handlePlay} className="w-full">
          <Play className="mr-2 h-4 w-4" /> 
          Play Music for this Mood
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmotionMusicRecommendations;

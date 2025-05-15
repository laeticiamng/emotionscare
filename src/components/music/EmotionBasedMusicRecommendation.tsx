
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, PlayCircle } from 'lucide-react';
import { EmotionResult } from '@/types/emotion';
import { MusicPlaylist } from '@/types/types';

interface EmotionBasedMusicRecommendationProps {
  emotion: EmotionResult;
  onPlay?: () => void;
}

const EmotionBasedMusicRecommendation: React.FC<EmotionBasedMusicRecommendationProps> = ({ emotion, onPlay }) => {
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [loading, setLoading] = useState(false);

  // Get description of music based on emotion
  const getMusicDescription = (emotionName: string) => {
    switch (emotionName.toLowerCase()) {
      case 'joy':
      case 'happy':
        return "Upbeat and energetic music to elevate your mood and celebrate your positive emotions.";
      case 'calm':
      case 'relaxed':
        return "Soothing melodies to maintain your peaceful state of mind and enhance relaxation.";
      case 'sad':
      case 'melancholic':
        return "Comforting and reflective music to accompany your emotions and provide a sense of understanding.";
      case 'anxious':
      case 'stressed':
        return "Calming compositions to help reduce anxiety and bring a sense of peace to your mind.";
      case 'angry':
      case 'frustrated':
        return "Rhythmic music to channel your energy positively and help manage intense emotions.";
      default:
        return "Music curated to complement your current emotional state and enhance your wellbeing.";
    }
  };

  const handlePlayMusic = () => {
    setLoading(true);
    // In a real app, this would call an API or service to get music recommendations
    setTimeout(() => {
      setLoading(false);
      if (onPlay) onPlay();
    }, 1000);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Music className="h-4 w-4" />
          Music for Your Mood
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">
          {getMusicDescription(emotion.emotion)}
        </p>
        <Button 
          onClick={handlePlayMusic} 
          className="w-full flex items-center gap-2"
          disabled={loading}
        >
          <PlayCircle className="h-4 w-4" />
          {loading ? "Loading music..." : "Listen to mood-based music"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmotionBasedMusicRecommendation;

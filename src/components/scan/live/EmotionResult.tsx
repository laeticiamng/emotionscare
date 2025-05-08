
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface EmotionResultProps {
  emotion: string;
  confidence: number;
  transcript: string;
}

const EmotionResult: React.FC<EmotionResultProps> = ({ emotion, confidence, transcript }) => {
  // Map emotion names to background colors
  const getEmotionColor = (emotion: string): string => {
    const emotionColors = {
      'happy': 'bg-green-100 text-green-800',
      'sad': 'bg-blue-100 text-blue-800',
      'angry': 'bg-red-100 text-red-800',
      'calm': 'bg-sky-100 text-sky-800',
      'anxious': 'bg-amber-100 text-amber-800',
      'neutral': 'bg-gray-100 text-gray-800',
      'stressed': 'bg-orange-100 text-orange-800',
      'excited': 'bg-purple-100 text-purple-800'
    };
    
    return emotionColors[emotion.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };
  
  // Format confidence as percentage
  const confidencePercentage = Math.round(confidence * 100);
  
  // Get confidence level class
  const getConfidenceClass = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const confidenceClass = getConfidenceClass(confidencePercentage);
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Émotion détectée</h3>
          <Badge className={`text-sm font-medium px-3 py-1 ${getEmotionColor(emotion)}`}>
            {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
          </Badge>
        </div>
        <div className="text-right space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Confiance</h3>
          <span className={`text-sm font-bold ${confidenceClass}`}>{confidencePercentage}%</span>
        </div>
      </div>
      
      <div className="space-y-1">
        <Progress 
          value={confidencePercentage}
          className="h-2"
        />
      </div>
      
      {transcript && (
        <div className="mt-4 space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Transcription</h3>
          <Card className="bg-muted/50">
            <CardContent className="p-3">
              <p className="text-sm italic">"{transcript}"</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EmotionResult;

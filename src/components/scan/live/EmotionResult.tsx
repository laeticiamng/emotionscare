
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface EmotionResultProps {
  emotion: string;
  confidence: number;
  transcript?: string;
  className?: string;
}

const EmotionResult: React.FC<EmotionResultProps> = ({
  emotion,
  confidence,
  transcript,
  className = ''
}) => {
  // Map emotion to French
  const emotionMap: Record<string, string> = {
    happy: 'Joie',
    sad: 'Tristesse',
    angry: 'Colère',
    fearful: 'Peur',
    surprised: 'Surprise',
    disgusted: 'Dégoût',
    neutral: 'Neutre'
  };

  // Map emotion to emoji
  const emojiMap: Record<string, string> = {
    happy: '😊',
    sad: '😔',
    angry: '😠',
    fearful: '😨',
    surprised: '😮',
    disgusted: '🤢',
    neutral: '😐'
  };

  const displayEmotion = emotionMap[emotion.toLowerCase()] || emotion;
  const emoji = emojiMap[emotion.toLowerCase()] || '❓';
  const confidencePercent = Math.round(confidence * 100);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <span className="text-2xl mr-2">{emoji}</span>
          <span>{displayEmotion}</span>
        </CardTitle>
        <CardDescription>
          Niveau de confiance: {confidencePercent}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={confidencePercent} className="h-2 mb-4" />
        
        {transcript && (
          <>
            <h4 className="text-sm font-medium mb-1">Transcription:</h4>
            <p className="text-sm text-muted-foreground italic">"{transcript}"</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionResult;

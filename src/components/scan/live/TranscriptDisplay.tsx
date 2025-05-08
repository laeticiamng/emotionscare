
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TranscriptDisplayProps {
  text: string;
  emotion?: string;
  className?: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ 
  text, 
  emotion,
  className
}) => {
  if (!text) return null;
  
  // Obtenir une couleur d'arrière-plan en fonction de l'émotion
  const getEmotionColor = () => {
    if (!emotion) return '';
    
    const colorMap: Record<string, string> = {
      'happy': 'border-l-green-500',
      'sad': 'border-l-blue-500',
      'calm': 'border-l-sky-500',
      'anxious': 'border-l-amber-500',
      'angry': 'border-l-red-500',
      'neutral': 'border-l-gray-500',
      'excited': 'border-l-purple-500',
      'stressed': 'border-l-orange-500'
    };
    
    return colorMap[emotion.toLowerCase()] || '';
  };
  
  return (
    <Card className={`shadow-sm overflow-hidden ${className || ''}`}>
      <CardHeader className="bg-muted/30 px-4 py-2">
        <CardTitle className="text-sm">Transcription</CardTitle>
      </CardHeader>
      <CardContent className={`p-3 border-l-4 ${getEmotionColor()}`}>
        <p className="text-sm whitespace-pre-wrap">{text}</p>
      </CardContent>
    </Card>
  );
};

export default TranscriptDisplay;

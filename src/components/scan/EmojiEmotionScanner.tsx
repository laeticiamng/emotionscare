
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmotionResult, EmojiEmotionScannerProps } from '@/types/emotion';
import { Smile, X } from 'lucide-react';

const EmojiEmotionScanner: React.FC<EmojiEmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  onResult,
  onProcessingChange,
  isProcessing,
  setIsProcessing,
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // List of emojis with associated emotions
  const emojis = [
    { emoji: '😊', emotion: 'happy', description: 'Heureux' },
    { emoji: '😢', emotion: 'sad', description: 'Triste' },
    { emoji: '😡', emotion: 'angry', description: 'En colère' },
    { emoji: '😮', emotion: 'surprised', description: 'Surpris' },
    { emoji: '😕', emotion: 'confused', description: 'Confus' },
    { emoji: '😨', emotion: 'anxious', description: 'Anxieux' },
    { emoji: '😐', emotion: 'neutral', description: 'Neutre' },
    { emoji: '🥰', emotion: 'love', description: 'Amoureux' },
    { emoji: '🤔', emotion: 'thoughtful', description: 'Pensif' }
  ];

  const handleEmojiSelect = (emoji: string, emotion: string) => {
    setSelectedEmoji(emoji);
    setProcessing(true);
    
    // Notify parent component that processing is in progress
    if (onProcessingChange) onProcessingChange(true);
    if (setIsProcessing) setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      const result: EmotionResult = {
        emotion: emotion,
        confidence: 0.8,
        secondaryEmotions: ['neutral'],
        timestamp: new Date().toISOString(),
        source: 'emoji',
        text: `Sélection emoji: ${emoji}`,
        recommendations: [
          {
            id: 'music-recommendation',
            type: 'music',
            title: 'Écoutez de la musique apaisante',
            description: "Nous vous recommandons d'écouter une playlist adaptée à votre émotion.",
            icon: 'music',
            emotion: emotion,
          },
          {
            id: 'activity-recommendation',
            type: 'activity',
            title: 'Activité recommandée',
            description: 'Une activité pour vous aider à maintenir ou améliorer votre état émotionnel.',
            icon: 'activity',
            emotion: emotion,
          },
        ],
      };
      
      // Notify parent component that processing is complete
      if (onProcessingChange) onProcessingChange(false);
      if (setIsProcessing) setIsProcessing(false);
      setProcessing(false);
      
      // Call callback with result
      if (onScanComplete) onScanComplete(result);
      if (onResult) onResult(result);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Smile className="mr-2" />
          <span>Comment vous sentez-vous ?</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {emojis.map(({emoji, emotion, description}) => (
            <Button
              key={emotion}
              variant={selectedEmoji === emoji ? "default" : "outline"}
              className="h-16 text-2xl"
              disabled={processing}
              onClick={() => handleEmojiSelect(emoji, emotion)}
            >
              <span className="text-2xl mr-2">{emoji}</span>
              <span className="text-xs text-muted-foreground">{description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Annuler
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmojiEmotionScanner;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmotionResult, EmojiEmotionScannerProps, EmotionRecommendation } from '@/types/emotion';
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

  // Liste des émojis avec les émotions associées
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
    
    // Notifier le composant parent que le traitement est en cours
    if (onProcessingChange) onProcessingChange(true);
    if (setIsProcessing) setIsProcessing(true);

    // Simuler un délai de traitement
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
            type: 'music',
            title: 'Écoutez de la musique apaisante',
            description: 'Nous vous recommandons d\'écouter une playlist adaptée à votre émotion.',
            icon: 'music',
            id: 'music-recommendation'
          } as unknown as string,
          {
            type: 'activity',
            title: 'Activité recommandée',
            description: 'Une activité pour vous aider à maintenir ou améliorer votre état émotionnel.',
            icon: 'activity',
            id: 'activity-recommendation'
          } as unknown as string,
        ],
      };
      
      // Notifier le composant parent que le traitement est terminé
      if (onProcessingChange) onProcessingChange(false);
      if (setIsProcessing) setIsProcessing(false);
      setProcessing(false);
      
      // Appeler le callback avec le résultat
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

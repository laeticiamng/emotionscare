
import React, { useState } from 'react';
import { EmotionResult, EmojiEmotionScannerProps } from '@/types/emotion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

// Liste d'émojis pour exprimer des émotions
const emotionEmojis = [
  { emoji: "😊", emotion: "joy" },
  { emoji: "😢", emotion: "sadness" },
  { emoji: "😡", emotion: "anger" },
  { emoji: "😮", emotion: "surprise" },
  { emoji: "😨", emotion: "fear" },
  { emoji: "😐", emotion: "neutral" },
  { emoji: "🤢", emotion: "disgust" },
  { emoji: "😍", emotion: "love" },
  { emoji: "😴", emotion: "tired" },
  { emoji: "😎", emotion: "cool" },
  { emoji: "🤔", emotion: "thoughtful" },
  { emoji: "😒", emotion: "annoyed" },
  { emoji: "😳", emotion: "embarrassed" },
  { emoji: "🙄", emotion: "bored" },
  { emoji: "😇", emotion: "grateful" }
];

const EmojiEmotionScanner: React.FC<EmojiEmotionScannerProps> = ({ 
  onResult,
  onProcessingChange,
  isProcessing: externalIsProcessing,
  setIsProcessing: externalSetIsProcessing
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [localIsProcessing, setLocalIsProcessing] = useState(false);
  
  // Use external state if provided, otherwise use local state
  const isProcessing = externalIsProcessing !== undefined ? externalIsProcessing : localIsProcessing;
  const setIsProcessing = externalSetIsProcessing || setLocalIsProcessing;

  const handleEmojiSelect = (emoji: string, emotion: string) => {
    setSelectedEmoji(emoji);
  };

  const handleSubmit = () => {
    if (!selectedEmoji) return;
    
    if (onProcessingChange) {
      onProcessingChange(true);
    }
    setIsProcessing(true);

    // Trouver l'émotion correspondant à l'emoji sélectionné
    const selectedEmojiData = emotionEmojis.find(item => item.emoji === selectedEmoji);
    const emotionName = selectedEmojiData ? selectedEmojiData.emotion : 'neutral';

    // Simuler un délai de traitement
    setTimeout(() => {
      const result: EmotionResult = {
        id: `emoji-${Date.now()}`,
        emotion: emotionName,
        confidence: 0.9,
        intensity: 0.8,
        source: 'emoji',
        timestamp: new Date().toISOString(),
        emojis: [selectedEmoji],
        recommendations: [
          {
            id: `rec-emoji-1-${Date.now()}`,
            type: "activity",
            title: "Activité recommandée",
            description: "Une activité pour vous aider à vous sentir mieux",
            emotion: emotionName
          },
          {
            id: `rec-emoji-2-${Date.now()}`,
            type: "music",
            title: "Musique recommandée",
            description: "Une playlist adaptée à votre humeur",
            emotion: emotionName
          }
        ]
      };
      
      if (onResult) {
        onResult(result);
      }
      
      if (onProcessingChange) {
        onProcessingChange(false);
      }
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sélectionnez un émoji qui représente votre humeur</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-5 gap-3 text-center">
          {emotionEmojis.map((item, index) => (
            <button
              key={index}
              onClick={() => handleEmojiSelect(item.emoji, item.emotion)}
              className={`text-4xl p-2 rounded-lg transition-all ${
                selectedEmoji === item.emoji 
                  ? 'bg-primary/20 scale-110' 
                  : 'hover:bg-secondary/50'
              }`}
              disabled={isProcessing}
              aria-label={`Emoji représentant ${item.emotion}`}
            >
              {item.emoji}
            </button>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit}
          disabled={!selectedEmoji || isProcessing}
          className="w-full"
        >
          {isProcessing ? 'Analyse en cours...' : 'Analyser mon émotion'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmojiEmotionScanner;

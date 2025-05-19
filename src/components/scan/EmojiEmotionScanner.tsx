import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EmotionResult, EmotionRecommendation } from '@/types/emotion';

interface EmojiEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  onSelect?: (emotion: string) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmojiEmotionScanner: React.FC<EmojiEmotionScannerProps> = ({
  onResult,
  onSelect,
  isProcessing: externalIsProcessing,
  setIsProcessing: externalSetIsProcessing
}) => {
  const [localIsProcessing, setLocalIsProcessing] = useState(false);
  
  // Use external state if provided, otherwise use local state
  const isProcessing = externalIsProcessing !== undefined ? externalIsProcessing : localIsProcessing;
  const setIsProcessing = externalSetIsProcessing || setLocalIsProcessing;
  
  const emotions = [
    { emoji: "😊", name: "happy", label: "Heureux" },
    { emoji: "😔", name: "sad", label: "Triste" },
    { emoji: "😠", name: "angry", label: "En colère" },
    { emoji: "😌", name: "calm", label: "Calme" },
    { emoji: "😰", name: "anxious", label: "Anxieux" },
    { emoji: "😴", name: "tired", label: "Fatigué" },
    { emoji: "😲", name: "surprised", label: "Surpris" },
    { emoji: "🤔", name: "confused", label: "Perplexe" }
  ];
  
  const handleSelectEmotion = async (emotion: string) => {
    if (isProcessing) return;
    
    if (onSelect) {
      onSelect(emotion);
    }
    
    if (onResult) {
      setIsProcessing(true);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create recommendations
      const recommendations: EmotionRecommendation[] = [
        {
          type: "activity",
          title: "Activité recommandée",
          description: "Une activité adaptée à votre état émotionnel",
          category: "general",
          content: "Try a new activity"
        },
        {
          type: "music",
          title: "Playlist recommandée",
          description: "Musique pour accompagner votre humeur",
          category: "music",
          content: "Listen to a curated playlist"
        }
      ];
      
      const result: EmotionResult = {
        id: `emoji-${Date.now()}`,
        emotion: emotion,
        primaryEmotion: emotion,
        confidence: 1.0, // User selected, so 100% confidence
        intensity: 0.8,
        timestamp: new Date().toISOString(),
        recommendations: recommendations,
        emojis: [emotions.find(e => e.name === emotion)?.emoji || "😊"]
      };
      
      onResult(result);
      setIsProcessing(false);
    }
  };
  
  return (
    <Card>
      <CardContent className="grid grid-cols-4 gap-4">
        {emotions.map((emotion) => (
          <button
            key={emotion.name}
            className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            onClick={() => handleSelectEmotion(emotion.name)}
            disabled={isProcessing}
          >
            <span className="text-3xl">{emotion.emoji}</span>
            <p className="text-sm text-muted-foreground mt-1">{emotion.label}</p>
          </button>
        ))}
      </CardContent>
    </Card>
  );
};

export default EmojiEmotionScanner;

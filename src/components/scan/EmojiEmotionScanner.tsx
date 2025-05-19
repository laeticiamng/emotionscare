
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmotionResult } from '@/types/emotion';
import { motion } from 'framer-motion';

interface EmojiEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmojiEmotionScanner: React.FC<EmojiEmotionScannerProps> = ({
  onResult,
  isProcessing = false,
  setIsProcessing,
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  
  const emojis = [
    { emoji: '😊', emotion: 'happy', label: 'Heureux' },
    { emoji: '😌', emotion: 'calm', label: 'Calme' },
    { emoji: '😢', emotion: 'sad', label: 'Triste' },
    { emoji: '😡', emotion: 'anger', label: 'En colère' },
    { emoji: '😰', emotion: 'anxious', label: 'Anxieux' },
    { emoji: '😴', emotion: 'tired', label: 'Fatigué' },
    { emoji: '🤔', emotion: 'confused', label: 'Pensif' },
    { emoji: '😮', emotion: 'surprised', label: 'Surpris' },
  ];
  
  const handleEmojiSelect = (emoji: string, emotion: string) => {
    if (isProcessing) return;
    
    setSelectedEmoji(emoji);
    
    if (setIsProcessing) {
      setIsProcessing(true);
    }
    
    // Simulate processing delay
    setTimeout(() => {
      const result: EmotionResult = {
        emotion: emotion,
        confidence: 0.9, // High confidence as user directly selected the emotion
        timestamp: new Date().toISOString(),
        source: 'emoji',
        recommendations: [
          {
            title: 'Activité recommandée',
            description: `Une activité adaptée à votre humeur ${emotion}`,
            category: 'activité'
          },
          {
            title: 'Musique',
            description: `Une playlist pour accompagner votre humeur ${emotion}`,
            category: 'musique'
          }
        ]
      };
      
      if (onResult) {
        onResult(result);
      }
      
      if (setIsProcessing) {
        setIsProcessing(false);
      }
    }, 1000);
  };
  
  return (
    <div className="space-y-4">
      <div className="text-sm text-center text-muted-foreground mb-2">
        Sélectionnez l'emoji qui représente le mieux votre humeur actuelle
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {emojis.map((item) => (
          <motion.div
            key={item.emotion}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card 
              className={`cursor-pointer transition-all ${
                selectedEmoji === item.emoji 
                  ? 'border-primary bg-primary/5' 
                  : 'hover:border-primary/50'
              } ${isProcessing && selectedEmoji !== item.emoji ? 'opacity-50' : ''}`}
              onClick={() => handleEmojiSelect(item.emoji, item.emotion)}
            >
              <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                <div className="text-3xl mb-1">{item.emoji}</div>
                <div className="text-xs font-medium">{item.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {isProcessing && (
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 border-2 border-t-transparent border-primary rounded-full animate-spin"></div>
            <span className="text-sm">Analyse en cours...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiEmotionScanner;

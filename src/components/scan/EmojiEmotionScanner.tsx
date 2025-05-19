
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionResult, EmojiEmotionScannerProps } from '@/types/emotion';

const emojis = [
  { emoji: "😊", emotion: "happy", description: "Joyeux" },
  { emoji: "😢", emotion: "sad", description: "Triste" },
  { emoji: "😠", emotion: "angry", description: "En colère" },
  { emoji: "😨", emotion: "afraid", description: "Effrayé" },
  { emoji: "😮", emotion: "surprised", description: "Surpris" },
  { emoji: "🤢", emotion: "disgusted", description: "Dégoûté" },
  { emoji: "😌", emotion: "relaxed", description: "Détendu" },
  { emoji: "😴", emotion: "tired", description: "Fatigué" },
  { emoji: "🥰", emotion: "loved", description: "Aimé" },
  { emoji: "😐", emotion: "neutral", description: "Neutre" },
  { emoji: "😰", emotion: "anxious", description: "Anxieux" },
  { emoji: "🤔", emotion: "thoughtful", description: "Pensif" }
];

const EmojiEmotionScanner: React.FC<EmojiEmotionScannerProps> = ({ onResult, onProcessingChange, isProcessing, setIsProcessing }) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<number>(50);
  const [processing, setProcessing] = useState(false);

  // Use external state if provided, otherwise use local state
  const isLoading = isProcessing !== undefined ? isProcessing : processing;
  const setIsLoading = setIsProcessing || setProcessing;

  const handleEmojiSelect = (emoji: string, emotion: string) => {
    setSelectedEmoji(emoji);
  };

  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntensity(parseInt(e.target.value));
  };

  const handleSubmit = () => {
    if (!selectedEmoji) return;
    
    if (onProcessingChange) {
      onProcessingChange(true);
    }
    setIsLoading(true);
    
    const selectedEmojiObj = emojis.find(e => e.emoji === selectedEmoji);
    
    // Simulate processing delay
    setTimeout(() => {
      const result: EmotionResult = {
        id: `emoji-${Date.now()}`,
        emotion: selectedEmojiObj?.emotion || 'neutral',
        primaryEmotion: selectedEmojiObj?.emotion || 'neutral', // Added missing property
        confidence: 0.9, // High confidence since user selected directly
        intensity: intensity / 100,
        source: 'emoji',
        timestamp: new Date().toISOString(),
        emojis: [selectedEmoji],
        recommendations: [
          {
            title: "Activité recommandée",
            description: "Une activité adaptée à votre humeur actuelle"
          },
          {
            title: "Musique recommandée",
            description: "Une playlist qui correspond à votre état émotionnel"
          }
        ],
        score: intensity // Added missing property
      };
      
      if (onResult) {
        onResult(result);
      }
      
      if (onProcessingChange) {
        onProcessingChange(false);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Exprimez votre émotion avec un emoji</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-6 gap-2">
          {emojis.map((item) => (
            <Button
              key={item.emoji}
              variant={selectedEmoji === item.emoji ? "default" : "ghost"}
              className={`h-14 text-2xl ${selectedEmoji === item.emoji ? 'ring-2 ring-primary' : ''}`}
              onClick={() => handleEmojiSelect(item.emoji, item.emotion)}
              disabled={isLoading}
            >
              {item.emoji}
            </Button>
          ))}
        </div>
        
        {selectedEmoji && (
          <div className="space-y-2 pt-4">
            <label className="block text-sm font-medium">
              Intensité: {intensity}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={intensity}
              onChange={handleIntensityChange}
              className="w-full"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Réglez le curseur pour indiquer l'intensité de cette émotion.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          className="w-full" 
          disabled={!selectedEmoji || isLoading}
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⏳</span> 
              Traitement en cours...
            </>
          ) : (
            'Confirmer cette émotion'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmojiEmotionScanner;

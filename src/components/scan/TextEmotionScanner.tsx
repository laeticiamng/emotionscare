
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { EmotionResult, TextEmotionScannerProps, EmotionRecommendation } from '@/types/emotion';
import { getEmotionEmojis } from '@/utils/emotionUtils';

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({ 
  onResult, 
  onProcessingChange,
  isProcessing: externalIsProcessing,
  setIsProcessing: externalSetIsProcessing
}) => {
  const [text, setText] = useState("");
  const [localIsProcessing, setLocalIsProcessing] = useState(false);
  
  // Use external state if provided, otherwise use local state
  const isProcessing = externalIsProcessing !== undefined ? externalIsProcessing : localIsProcessing;
  const setIsProcessing = externalSetIsProcessing || setLocalIsProcessing;

  const handleSubmit = () => {
    if (!text.trim()) return;
    
    if (onProcessingChange) {
      onProcessingChange(true);
    }
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // Create fake emotion analysis result
      const emotions = ["joy", "sadness", "anger", "fear", "surprise", "disgust"];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const confidence = 0.5 + Math.random() * 0.5; // Random between 0.5 and 1.0
      const emojis = getEmotionEmojis(randomEmotion);
      
      // Create recommendations with proper id and emotion fields
      const recommendations: EmotionRecommendation[] = [
        {
          id: `rec-text-1-${uuidv4()}`,
          type: "activity",
          title: "Exercice de respiration",
          description: "Un exercice de respiration peut vous aider à vous sentir mieux",
          emotion: randomEmotion,
          content: "Respirez profondément pendant 5 minutes"
        },
        {
          id: `rec-text-2-${uuidv4()}`,
          type: "music",
          title: "Musique recommandée",
          description: "Écoutez cette playlist pour vous détendre",
          emotion: randomEmotion,
          content: "Playlist de relaxation disponible dans l'onglet musique"
        }
      ];
      
      const result: EmotionResult = {
        id: `text-${Date.now()}`,
        emotion: randomEmotion,
        confidence: confidence,
        intensity: confidence * 0.8,
        timestamp: new Date().toISOString(),
        source: 'text',
        text: text,
        textInput: text,
        emojis: emojis,
        recommendations: recommendations
      };
      
      if (onResult) {
        onResult(result);
      }
      
      if (onProcessingChange) {
        onProcessingChange(false);
      }
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Analyse d'émotions par texte</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="emotion-text">Décrivez votre état émotionnel actuel</Label>
          <Textarea
            id="emotion-text"
            placeholder="Comment vous sentez-vous aujourd'hui? Décrivez vos émotions..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            disabled={isProcessing}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit}
          className="w-full"
          disabled={!text.trim() || isProcessing}
        >
          {isProcessing ? 'Analyse en cours...' : 'Analyser mes émotions'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TextEmotionScanner;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmotionResult } from '@/types/emotion';
import { emotions } from '@/types/emotion';

interface TextEmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onCancel: () => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
}

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  isProcessing,
  setIsProcessing
}) => {
  const [text, setText] = useState('');
  
  const handleSubmit = async () => {
    if (!text.trim()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulated emotional analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dummy algorithm to pick an emotion from text (in real life, would be connected to NLP API)
      // For now, just pick a random emotion weighted by text length
      const textLength = text.length;
      const randomIndex = Math.floor(Math.random() * emotions.length);
      const secondaryIndex = (randomIndex + 1 + Math.floor(Math.random() * (emotions.length - 1))) % emotions.length;
      
      // Determine intensity based on punctuation and capitalization
      const exclamations = (text.match(/!/g) || []).length;
      const questions = (text.match(/\?/g) || []).length;
      const capitals = (text.match(/[A-Z]/g) || []).length;
      
      // Calculate intensity - more exclamations and capitals suggest stronger emotion
      let calculatedIntensity = 3; // Default intensity
      if (exclamations > 2 || capitals > textLength * 0.2) {
        calculatedIntensity = 5;
      } else if (exclamations > 0 || capitals > textLength * 0.1) {
        calculatedIntensity = 4;
      } else if (questions > 2) {
        calculatedIntensity = 2;
      }
      
      const emotionResult: EmotionResult = {
        primaryEmotion: emotions[randomIndex].name,
        secondaryEmotion: emotions[secondaryIndex].name,
        intensity: calculatedIntensity as 1 | 2 | 3 | 4 | 5,
        source: 'text',
        timestamp: new Date().toISOString(),
        notes: text
      };
      
      onScanComplete(emotionResult);
    } catch (error) {
      console.error('Error analyzing text:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-muted-foreground">
          Décrivez votre état émotionnel actuel en quelques phrases
        </p>
      </div>
      
      <Textarea
        placeholder="Comment vous sentez-vous aujourd'hui ? Qu'est-ce qui vous préoccupe ?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        className="w-full resize-none"
        disabled={isProcessing}
      />
      
      <div className="flex justify-between gap-4">
        <Button 
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!text.trim() || isProcessing}
          className="flex-1"
        >
          {isProcessing ? 'Analyse en cours...' : 'Analyser'}
        </Button>
      </div>
    </div>
  );
};

export default TextEmotionScanner;

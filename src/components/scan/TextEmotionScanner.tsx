
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmotionResult } from '@/types/types';

interface TextEmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
}

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({ 
  onScanComplete 
}) => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // In a real app, this would call an API
      // For this demo, we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result: EmotionResult = {
        id: `text-${Date.now()}`,
        emotion: getRandomEmotion(),
        score: Math.floor(Math.random() * 40) + 60, // 60-99
        confidence: (Math.random() * 0.3) + 0.6, // 0.6-0.9
        text: text,
        date: new Date().toISOString()
      };
      
      if (onScanComplete) {
        onScanComplete(result);
      }
    } catch (error) {
      console.error('Error analyzing text:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Helper to get a random emotion for the demo
  const getRandomEmotion = () => {
    const emotions = ['joy', 'calm', 'anxious', 'focused', 'tired', 'excited'];
    return emotions[Math.floor(Math.random() * emotions.length)];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Textarea
          placeholder="Comment vous sentez-vous aujourd'hui ? Décrivez vos pensées et émotions..."
          value={text}
          onChange={handleTextChange}
          className="min-h-32 resize-none"
          disabled={isAnalyzing}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {text.length} caractères
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!text.trim() || isAnalyzing}
        >
          {isAnalyzing ? 'Analyse en cours...' : 'Analyser'}
        </Button>
      </div>
    </form>
  );
};

export default TextEmotionScanner;

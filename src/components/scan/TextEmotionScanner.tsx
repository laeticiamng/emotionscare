
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { EmotionResult } from '@/types/emotion';

interface TextEmotionScannerProps {
  onEmotionDetected?: (result: EmotionResult) => void;
  text?: string;
  onTextChange?: (text: string) => void;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
}

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({
  onEmotionDetected,
  text: initialText = '',
  onTextChange,
  onAnalyze: externalAnalyze,
  isAnalyzing: externalAnalyzing = false
}) => {
  const [text, setText] = useState(initialText);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    
    if (onTextChange) {
      onTextChange(newText);
    }
  };

  const handleAnalyze = async () => {
    if (externalAnalyze) {
      externalAnalyze();
      return;
    }

    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      // In a real implementation, this would call an API for sentiment analysis
      // For now, we'll simulate a response with mock data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create mock result based on text length and content
      const textLower = text.toLowerCase();
      
      // Very simple emotion detection based on keywords
      let dominantEmotion = { name: 'neutral', score: 0.5 };
      
      if (textLower.includes('heureux') || textLower.includes('content') || textLower.includes('joie')) {
        dominantEmotion = { name: 'joy', score: 0.8 };
      } else if (textLower.includes('triste') || textLower.includes('peine') || textLower.includes('chagrin')) {
        dominantEmotion = { name: 'sadness', score: 0.7 };
      } else if (textLower.includes('colère') || textLower.includes('énervé') || textLower.includes('furieux')) {
        dominantEmotion = { name: 'anger', score: 0.9 };
      } else if (textLower.includes('peur') || textLower.includes('effrayé') || textLower.includes('terrifié')) {
        dominantEmotion = { name: 'fear', score: 0.85 };
      } else if (textLower.includes('dégoût') || textLower.includes('répugnant')) {
        dominantEmotion = { name: 'disgust', score: 0.65 };
      } else if (textLower.includes('surprise') || textLower.includes('étonné')) {
        dominantEmotion = { name: 'surprise', score: 0.75 };
      } else if (textLower.includes('calme') || textLower.includes('paisible') || textLower.includes('serein')) {
        dominantEmotion = { name: 'calm', score: 0.6 };
      } else if (textLower.includes('fatigué') || textLower.includes('épuisé')) {
        dominantEmotion = { name: 'fatigue', score: 0.7 };
      }
      
      // Create emotion result
      const emotionResult: EmotionResult = {
        dominantEmotion,
        source: 'text',
        text,
        timestamp: new Date().toISOString()
      };
      
      if (onEmotionDetected) {
        onEmotionDetected(emotionResult);
      }
      
    } catch (error) {
      console.error('Error analyzing text:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <Textarea
          placeholder="Comment vous sentez-vous aujourd'hui ? Décrivez votre état émotionnel..."
          value={text}
          onChange={handleTextChange}
          className="min-h-[120px]"
          disabled={isAnalyzing || externalAnalyzing}
        />
        
        <Button
          onClick={handleAnalyze}
          disabled={!text.trim() || isAnalyzing || externalAnalyzing}
          className="w-full"
        >
          {(isAnalyzing || externalAnalyzing) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            'Analyser mon texte'
          )}
        </Button>
      </div>
    </Card>
  );
};

export default TextEmotionScanner;

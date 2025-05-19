
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { EmotionResult, TextEmotionScannerProps } from '@/types/emotion';

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({ 
  onResult, 
  onProcessingChange,
  isProcessing: externalIsProcessing,
  setIsProcessing: externalSetIsProcessing
}) => {
  const [text, setText] = useState<string>('');
  const [localIsProcessing, setLocalIsProcessing] = useState(false);
  
  // Use external state if provided, otherwise use local state
  const isProcessing = externalIsProcessing !== undefined ? externalIsProcessing : localIsProcessing;
  const setIsProcessing = externalSetIsProcessing || setLocalIsProcessing;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = () => {
    if (text.trim().length < 3) return;
    
    if (onProcessingChange) {
      onProcessingChange(true);
    }
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // Create a sample emotion result (in a real app, this would come from an API)
      const result: EmotionResult = {
        id: `text-${Date.now()}`,
        emotion: determineMockEmotion(text),
        primaryEmotion: determineMockEmotion(text), // Added for components that use primaryEmotion
        confidence: 0.85,
        intensity: 0.75,
        source: 'text',
        timestamp: new Date().toISOString(),
        text: text,
        recommendations: [
          {
            title: "Take a break",
            description: "Consider taking a short break to reset your mind",
            content: "Taking a break can help you refocus and recharge."
          },
          {
            title: "Mindfulness exercise",
            description: "A quick mindfulness exercise to center yourself",
            content: "Focus on your breathing for 2 minutes to recenter your thoughts."
          }
        ],
        score: Math.round(Math.random() * 100) // Added for components that use score
      };
      
      if (onResult) {
        onResult(result);
      }
      
      if (onProcessingChange) {
        onProcessingChange(false);
      }
      setIsProcessing(false);
    }, 2000);
  };

  // Simple mock emotion detector based on keywords
  const determineMockEmotion = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('excited')) {
      return 'joy';
    } else if (lowerText.includes('sad') || lowerText.includes('depressed') || lowerText.includes('unhappy')) {
      return 'sadness';
    } else if (lowerText.includes('angry') || lowerText.includes('frustrated') || lowerText.includes('mad')) {
      return 'anger';
    } else if (lowerText.includes('scared') || lowerText.includes('fear') || lowerText.includes('anxious')) {
      return 'fear';
    } else if (lowerText.includes('calm') || lowerText.includes('peaceful') || lowerText.includes('relaxed')) {
      return 'calm';
    } else {
      return 'neutral';
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-4">
        <Textarea
          placeholder="Décrivez comment vous vous sentez en ce moment..."
          value={text}
          onChange={handleTextChange}
          className="min-h-[120px]"
          disabled={isProcessing}
        />
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit}
          disabled={text.trim().length < 3 || isProcessing}
          className="w-full"
        >
          {isProcessing ? 'Analyse en cours...' : 'Analyser mes émotions'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TextEmotionScanner;

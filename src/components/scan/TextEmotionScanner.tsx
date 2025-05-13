
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { EmotionResult } from '@/types/emotion';

export interface TextEmotionScannerProps {
  onEmotionDetected: (result: EmotionResult) => void;
}

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({ onEmotionDetected }) => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      // Mock API call - in a real app this would call your emotion API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate an emotion analysis result
      const mockResult: EmotionResult = {
        emotion: 'joy',
        score: 0.75,
        text: text,
        confidence: 0.8,
        recommendations: [
          'Continuez à cultiver cette énergie positive',
          'Partagez votre joie avec votre entourage'
        ],
        primaryEmotion: {
          name: 'joy',
          intensity: 0.75
        }
      };
      
      onEmotionDetected(mockResult);
    } catch (error) {
      console.error('Error analyzing text:', error);
      // Return error result
      onEmotionDetected({
        error: 'Impossible d\'analyser le texte. Veuillez réessayer.',
        emotion: 'neutral',
        score: 0.5
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Décrivez comment vous vous sentez..."
        value={text}
        onChange={handleTextChange}
        rows={4}
        className="resize-none"
      />
      
      <Button 
        onClick={handleSubmit} 
        disabled={!text.trim() || isAnalyzing}
        className="w-full"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyse en cours...
          </>
        ) : (
          'Analyser mes émotions'
        )}
      </Button>
    </div>
  );
};

export default TextEmotionScanner;

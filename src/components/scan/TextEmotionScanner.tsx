
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmotionResult } from '@/types';
import { Send } from 'lucide-react';

interface TextEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  placeholder?: string;
}

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({
  onResult,
  placeholder = "Décrivez comment vous vous sentez aujourd'hui..."
}) => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeText = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    
    try {
      // Mock API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock result
      const result: EmotionResult = {
        id: 'text-analysis-' + Date.now(),
        user_id: 'user-123',
        emotion: ['joy', 'calm', 'anxious', 'sad', 'excited'][Math.floor(Math.random() * 5)],
        score: Math.random() * 0.5 + 0.5,
        confidence: Math.random() * 0.3 + 0.7,
        text: text,
        timestamp: new Date().toISOString(),
        recommendations: [
          'Take a moment to reflect on your feelings',
          'Consider journaling about your thoughts',
          'Practice a short breathing exercise'
        ],
        ai_feedback: "Votre texte révèle un état émotionnel intéressant. Continuez à être attentif à vos émotions."
      };
      
      if (onResult) {
        onResult(result);
      }
    } catch (error) {
      console.error('Error analyzing text:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        className="resize-none"
      />
      
      <Button 
        onClick={analyzeText} 
        disabled={!text.trim() || isAnalyzing}
        className="w-full"
      >
        {isAnalyzing ? (
          <>
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            Analyse en cours...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Analyser mon texte
          </>
        )}
      </Button>
      
      <p className="text-xs text-muted-foreground text-center">
        Pour une analyse plus précise, écrivez au moins quelques phrases décrivant vos émotions actuelles.
      </p>
    </div>
  );
};

export default TextEmotionScanner;

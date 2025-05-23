
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmotionResult } from '@/types/emotion';
import { Loader2 } from 'lucide-react';

interface TextEmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onCancel?: () => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  isProcessing,
  setIsProcessing
}) => {
  const [text, setText] = useState('');
  
  const handleScan = async () => {
    if (!text.trim() || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate API call to emotion detection service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock emotion detection result
      const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'calm'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const intensity = Math.floor(Math.random() * 100);
      
      const result: EmotionResult = {
        emotion: randomEmotion,
        intensity: intensity,
        source: 'text',
        text: text,
        score: intensity / 100,
        ai_feedback: `D'après votre texte, il semble que vous ressentiez du ${randomEmotion} à un niveau ${intensity > 70 ? 'élevé' : intensity > 40 ? 'modéré' : 'faible'}.`,
        date: new Date().toISOString()
      };
      
      onScanComplete(result);
    } catch (error) {
      console.error('Error scanning text:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Décrivez ce que vous ressentez en ce moment..."
        className="min-h-[120px] resize-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isProcessing}
      />
      
      <div className="flex justify-between">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={isProcessing}>
            Annuler
          </Button>
        )}
        
        <Button 
          onClick={handleScan} 
          disabled={!text.trim() || isProcessing}
          className="ml-auto"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            'Analyser mes émotions'
          )}
        </Button>
      </div>
    </div>
  );
};

export default TextEmotionScanner;

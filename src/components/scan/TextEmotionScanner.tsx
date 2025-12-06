// @ts-nocheck

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmotionResult, EmotionScannerProps } from '@/types/emotion';
import { FileText, Send } from 'lucide-react';

const TextEmotionScanner: React.FC<EmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  isProcessing,
  setIsProcessing
}) => {
  const [text, setText] = useState('');

  const analyzeText = async () => {
    if (!text.trim()) return;

    setIsProcessing(true);

    // Simulate API call delay
    setTimeout(() => {
      // Mock emotion analysis
      const mockResult: EmotionResult = {
        emotions: [
          { name: 'Calme', intensity: 75 },
          { name: 'Optimisme', intensity: 68 },
          { name: 'Confiance', intensity: 82 }
        ],
        confidence: 87,
        timestamp: new Date(),
        recommendations: 'Votre état émotionnel semble positif. Continuez à cultiver cette sérénité !',
        analysisType: 'text'
      };

      onScanComplete(mockResult);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit">
          <FileText className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Analyse textuelle</h3>
        <p className="text-muted-foreground">
          Décrivez comment vous vous sentez en ce moment
        </p>
      </div>

      <div className="space-y-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écrivez librement sur vos émotions, votre humeur, ce que vous ressentez..."
          className="min-h-[150px]"
          disabled={isProcessing}
        />

        <div className="flex space-x-2">
          <Button 
            onClick={onCancel} 
            variant="outline" 
            disabled={isProcessing}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button 
            onClick={analyzeText}
            disabled={!text.trim() || isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Analyser
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TextEmotionScanner;

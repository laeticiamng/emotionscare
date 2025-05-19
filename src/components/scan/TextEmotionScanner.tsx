
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmotionResult } from '@/types/emotion';
import { Send, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface TextEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
}

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({
  onResult,
  isProcessing = false,
  setIsProcessing,
}) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Veuillez entrer du texte pour l\'analyse.');
      return;
    }
    
    if (text.trim().length < 10) {
      setError('Veuillez entrer un texte plus long pour une meilleure analyse.');
      return;
    }
    
    // Set processing state
    if (setIsProcessing) {
      setIsProcessing(true);
    }
    
    try {
      // Simulate API call for emotion analysis
      setTimeout(() => {
        const fakeEmotions = ['happy', 'calm', 'sad', 'anxious', 'relaxed', 'energetic', 'focused'];
        const randomEmotion = fakeEmotions[Math.floor(Math.random() * fakeEmotions.length)];
        const randomConfidence = 0.5 + Math.random() * 0.4;
        
        // Create result
        const result: EmotionResult = {
          emotion: randomEmotion,
          confidence: randomConfidence,
          timestamp: new Date().toISOString(),
          source: 'text',
          text: text,
          recommendations: [
            {
              title: 'Activité recommandée',
              description: `Une activité adaptée à votre humeur ${randomEmotion}`,
              category: 'activité'
            },
            {
              title: 'Musique',
              description: `Une playlist pour accompagner votre humeur ${randomEmotion}`,
              category: 'musique'
            }
          ]
        };
        
        if (onResult) {
          onResult(result);
        }
        
        // Reset processing state
        if (setIsProcessing) {
          setIsProcessing(false);
        }
        
      }, 1500);
      
    } catch (err) {
      console.error('Error analyzing text:', err);
      setError('Une erreur est survenue lors de l\'analyse. Veuillez réessayer.');
      
      // Reset processing state
      if (setIsProcessing) {
        setIsProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Textarea
          placeholder="Décrivez votre journée, vos pensées ou vos émotions actuelles..."
          value={text}
          onChange={handleInputChange}
          rows={4}
          disabled={isProcessing}
          className="resize-none focus-visible:ring-1 focus-visible:ring-primary"
        />
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center mt-2 text-destructive gap-2 text-sm"
          >
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isProcessing || text.length < 10}
          className="flex items-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              <span>Analyse en cours...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Analyser</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default TextEmotionScanner;

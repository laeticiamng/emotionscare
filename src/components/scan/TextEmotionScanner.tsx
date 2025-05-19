
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmotionResult, EmotionRecommendation } from '@/types/emotion';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TextEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
  minLength?: number;
}

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({
  onResult,
  isProcessing: externalIsProcessing,
  setIsProcessing: externalSetIsProcessing,
  minLength = 10
}) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [localIsProcessing, setLocalIsProcessing] = useState(false);
  
  // Use external state if provided, otherwise use local state
  const isProcessing = externalIsProcessing !== undefined ? externalIsProcessing : localIsProcessing;
  const setIsProcessing = externalSetIsProcessing || setLocalIsProcessing;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (error) setError(null);
  };
  
  const analyzeText = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (text.trim().length < minLength) {
      setError(`Veuillez entrer au moins ${minLength} caractères`);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data - in a real app, this would come from the API
      const emotions = ['happy', 'calm', 'anxious', 'sad', 'excited', 'frustrated'];
      const emotion = emotions[Math.floor(Math.random() * emotions.length)];
      
      const recommendations: EmotionRecommendation[] = [
        {
          type: "general",
          title: "Mindful reading", 
          description: "Take time to read something enjoyable",
          category: "mindfulness",
          content: "Find a book or article that interests you and read for 15 minutes"
        },
        {
          type: "exercise",
          title: "Quick walk", 
          description: "A short walk can help clear your mind",
          category: "physical",
          content: "Take a 10-minute walk outside to refresh your mind"
        }
      ];
      
      const result: EmotionResult = {
        id: `text-analysis-${Date.now()}`,
        emotion: emotion,
        primaryEmotion: emotion,
        confidence: 0.75 + Math.random() * 0.2,
        intensity: 0.5 + Math.random() * 0.5,
        text: text,
        timestamp: new Date().toISOString(),
        recommendations: recommendations,
        emojis: ["😊", "😌"],
        emotions: {} // Add empty emotions object to satisfy type
      };
      
      onResult(result);
    } catch (err) {
      console.error('Error analyzing text:', err);
      setError('Une erreur est survenue lors de l\'analyse');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <form onSubmit={analyzeText} className="space-y-4">
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
            <Loader2 className="h-4 w-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isProcessing || text.length < minLength}
          className="flex items-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              <span>Analyse en cours...</span>
            </>
          ) : (
            <>
              <Loader2 className="h-4 w-4" />
              <span>Analyser</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default TextEmotionScanner;

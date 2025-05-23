
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { TextEmotionScannerProps } from '@/types/emotion';

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({ 
  onScanComplete, 
  onCancel,
  isProcessing,
  setIsProcessing
}) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (text.trim().length < 10) {
      setError("Veuillez saisir au moins 10 caractères pour une analyse précise.");
      return;
    }
    
    setError(null);
    setIsProcessing(true);
    
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Génération de résultat simulé
      const emotionScore = Math.floor(Math.random() * 100);
      const primaryEmotion = emotionScore > 70 ? "Joie" : 
                             emotionScore > 50 ? "Sérénité" : 
                             emotionScore > 30 ? "Inquiétude" : "Stress";
      
      // Résultat simulé
      const result = {
        score: emotionScore,
        primaryEmotion,
        text,
        emotions: {
          joie: Math.random(),
          tristesse: Math.random(),
          colère: Math.random(),
          peur: Math.random(),
          surprise: Math.random(),
        }
      };
      
      onScanComplete(result);
    } catch (error) {
      console.error('Error analyzing text:', error);
      setError("Une erreur s'est produite lors de l'analyse. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div>
        <Textarea 
          placeholder="Décrivez ce que vous ressentez actuellement..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-32"
          disabled={isProcessing}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {text.length} caractères (minimum 10)
        </p>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing}
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={text.trim().length < 10 || isProcessing}
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
    </form>
  );
};

export default TextEmotionScanner;

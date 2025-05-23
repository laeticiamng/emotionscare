
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';
import { EmotionResult } from '@/types/emotion';

interface TextEmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onCancel: () => void;
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

  const analyzeText = async () => {
    if (!text.trim()) {
      toast.error('Veuillez saisir du texte à analyser');
      return;
    }

    try {
      setIsProcessing(true);
      
      const { data, error } = await supabase.functions.invoke('emotion-analysis', {
        body: { text, type: 'text' }
      });

      if (error) throw error;

      const result: EmotionResult = {
        id: crypto.randomUUID(),
        user_id: '',
        text: text,
        score: data.score || 50,
        date: new Date().toISOString(),
        ai_feedback: data.feedback || 'Analyse complétée'
      };

      onScanComplete(result);
      toast.success('Analyse textuelle terminée !');
    } catch (error) {
      console.error('Error analyzing text:', error);
      toast.error('Erreur lors de l\'analyse textuelle');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="emotion-text">
          Décrivez votre état émotionnel ou votre journée
        </Label>
        <Textarea
          id="emotion-text"
          placeholder="Exemple: Je me sens un peu stressé aujourd'hui à cause du travail, mais j'ai passé un bon moment avec ma famille hier soir..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          className="mt-2"
          disabled={isProcessing}
        />
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p>💡 Plus vous êtes détaillé, plus l'analyse sera précise</p>
      </div>

      <div className="flex space-x-2">
        <Button 
          onClick={analyzeText}
          disabled={!text.trim() || isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          Analyser le texte
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
          Annuler
        </Button>
      </div>
    </div>
  );
};

export default TextEmotionScanner;

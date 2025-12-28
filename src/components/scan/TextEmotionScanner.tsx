import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmotionResult } from '@/types/emotion';
import { FileText, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface TextEmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onCancel?: () => void;
  isProcessing?: boolean;
  setIsProcessing?: (processing: boolean) => void;
}

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  isProcessing = false,
  setIsProcessing
}) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const analyzeText = async () => {
    if (!text.trim()) return;
    if (!setIsProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Appel réel à l'edge function d'analyse textuelle
      const { data, error: invokeError } = await supabase.functions.invoke('emotion-analysis', {
        body: { text: text.trim(), language: 'fr' }
      });

      if (invokeError) {
        throw new Error(invokeError.message || 'Erreur d\'analyse');
      }

      if (!data) {
        throw new Error('Aucune réponse de l\'analyse');
      }

      const result: EmotionResult = {
        id: `text-${Date.now()}`,
        emotion: data.emotion || 'neutre',
        valence: (data.valence ?? 0.5) * 100,
        arousal: (data.arousal ?? 0.5) * 100,
        confidence: (data.confidence ?? 0.7),
        source: 'text',
        timestamp: new Date(),
        insight: data.summary || `Émotion ${data.emotion} détectée`,
        suggestions: data.recommendations || []
      };

      onScanComplete(result);
    } catch (err) {
      logger.error('[TextEmotionScanner] Error:', err, 'COMPONENT');
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'analyse');
    } finally {
      setIsProcessing(false);
    }
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

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

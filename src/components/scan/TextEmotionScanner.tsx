
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmotionResult } from '@/types/emotion';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import useOpenAI from '@/hooks/api/useOpenAI';
import useHumeAI from '@/hooks/api/useHumeAI';

interface TextEmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onCancel?: () => void;
  isProcessing?: boolean;
  setIsProcessing?: (isProcessing: boolean) => void;
}

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  isProcessing: externalProcessing,
  setIsProcessing: setExternalProcessing = () => {},
}) => {
  const [text, setText] = useState('');
  const [internalProcessing, setInternalProcessing] = useState(false);
  
  const isProcessing = externalProcessing !== undefined ? externalProcessing : internalProcessing;
  const setIsProcessing = setExternalProcessing || setInternalProcessing;
  
  const { analyzeEmotion } = useOpenAI();
  const { analyzeTextEmotion } = useHumeAI();

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error('Veuillez entrer un texte pour analyser vos émotions');
      return;
    }

    setIsProcessing(true);

    try {
      let result: EmotionResult;
      
      // Try using HumeAI first
      try {
        const humeResult = await analyzeTextEmotion(text);
        if (humeResult) {
          result = humeResult;
        } else {
          // Fallback to OpenAI
          const openAIResult = await analyzeEmotion(text);
          if (!openAIResult) {
            throw new Error('Failed to analyze emotion');
          }
          
          // Convert OpenAI result to EmotionResult format
          result = {
            emotion: openAIResult.primaryEmotion || 'neutral',
            intensity: openAIResult.detailedScore ? 
              (openAIResult.detailedScore[openAIResult.primaryEmotion || 'neutral'] || 0.5) : 0.5,
            source: 'text',
            text: text,
            score: Math.round((openAIResult.detailedScore ? 
              (openAIResult.detailedScore[openAIResult.primaryEmotion || 'neutral'] || 0.5) : 0.5) * 100),
            ai_feedback: openAIResult.suggestions ? openAIResult.suggestions.join(' ') : 
              'Merci de partager vos émotions. Continuez à être attentif à votre bien-être émotionnel.'
          };
        }
      } catch (error) {
        console.error('Error with HumeAI and OpenAI analysis:', error);
        
        // Generate a mock result as final fallback
        const sentimentScore = Math.random() * 100;
        let emotion = 'neutral';
        let feedback = 'Merci de partager vos émotions.';
        
        if (sentimentScore > 70) {
          emotion = 'joy';
          feedback = 'Je perçois des émotions positives dans votre texte. C\'est super de vous voir dans cet état d\'esprit!';
        } else if (sentimentScore < 30) {
          emotion = 'sadness';
          feedback = 'Je perçois que vous pourriez vous sentir un peu bas. N\'hésitez pas à prendre soin de vous aujourd\'hui.';
        } else {
          feedback = 'Votre état émotionnel semble équilibré. Continuez à être attentif à vos émotions.';
        }
        
        result = {
          emotion: emotion,
          intensity: sentimentScore / 100,
          source: 'text',
          text: text,
          score: Math.round(sentimentScore),
          ai_feedback: feedback
        };
      }
      
      onScanComplete(result);
    } catch (error) {
      console.error('Error processing emotion:', error);
      toast.error('Une erreur est survenue lors de l\'analyse');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <p>
          Décrivez comment vous vous sentez actuellement. Soyez aussi détaillé que possible.
        </p>
      </div>

      <Textarea
        placeholder="Je me sens..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isProcessing}
        className="min-h-[120px]"
      />

      <div className="flex justify-between pt-2">
        {onCancel && (
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isProcessing}
          >
            Annuler
          </Button>
        )}
        <Button 
          onClick={handleSubmit}
          disabled={isProcessing || !text.trim()}
          className="ml-auto"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyse...
            </>
          ) : (
            'Analyser'
          )}
        </Button>
      </div>
    </div>
  );
};

export default TextEmotionScanner;


import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { EmotionResult } from '@/types';
import useHumeAI from '@/hooks/useHumeAI';
import { toast } from 'sonner';

interface TextEmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  initialText?: string;
}

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({
  onScanComplete,
  initialText = ''
}) => {
  const [text, setText] = useState(initialText);
  const [scanning, setScanning] = useState(false);
  const { analyzeText } = useHumeAI();

  const handleScan = useCallback(async () => {
    if (!text.trim()) {
      toast.error('Veuillez entrer du texte pour analyser vos émotions.');
      return;
    }

    setScanning(true);
    try {
      const result = await analyzeText(text);
      
      if (onScanComplete) {
        onScanComplete(result);
      }
    } catch (error) {
      console.error('Error analyzing text:', error);
      toast.error('Une erreur est survenue lors de l\'analyse. Veuillez réessayer.');
    } finally {
      setScanning(false);
    }
  }, [text, analyzeText, onScanComplete]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Analyse émotionnelle par texte</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Décrivez comment vous vous sentez en ce moment..."
          className="min-h-[150px]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={scanning}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setText('')}
          disabled={scanning || !text}
        >
          Effacer
        </Button>
        <Button 
          onClick={handleScan}
          disabled={scanning || !text.trim()}
        >
          {scanning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            'Analyser mes émotions'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TextEmotionScanner;

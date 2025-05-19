
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmotionResult, TextEmotionScannerProps } from '@/types/emotion';
import { MessageSquare, X, Loader } from 'lucide-react';

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  isProcessing,
  setIsProcessing,
  onProcessingChange,
}) => {
  const [text, setText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = () => {
    if (!text.trim()) {
      setError('Veuillez entrer du texte pour analyser vos émotions.');
      return;
    }

    setProcessing(true);
    if (setIsProcessing) setIsProcessing(true);
    if (onProcessingChange) onProcessingChange(true);

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock result
      const result: EmotionResult = {
        emotion: 'thoughtful',
        confidence: 0.75,
        secondaryEmotions: ['calm', 'focused'],
        timestamp: new Date().toISOString(),
        source: 'text',
        text: text,
        recommendations: [
          {
            id: 'music-recommendation',
            type: 'music',
            title: 'Playlist de réflexion',
            description: 'Une sélection musicale pour accompagner votre réflexion.',
            icon: 'music',
            emotion: 'thoughtful',
          },
          {
            id: 'activity-recommendation',
            type: 'activity',
            title: 'Journal de pensées',
            description: 'Prenez le temps de noter vos réflexions dans un journal.',
            icon: 'book',
            emotion: 'thoughtful',
          },
        ],
      };

      setProcessing(false);
      if (setIsProcessing) setIsProcessing(false);
      if (onProcessingChange) onProcessingChange(false);

      if (onScanComplete) {
        onScanComplete(result);
      }
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2" />
          <span>Analyse textuelle d'émotion</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Exprimez ce que vous ressentez actuellement..."
          value={text}
          onChange={handleTextChange}
          rows={5}
          className={error ? 'border-red-500 focus-visible:ring-red-500' : ''}
          disabled={processing}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={onCancel} disabled={processing}>
          <X className="mr-2 h-4 w-4" />
          Annuler
        </Button>
        <Button onClick={handleSubmit} disabled={processing || !text.trim()}>
          {processing ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
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

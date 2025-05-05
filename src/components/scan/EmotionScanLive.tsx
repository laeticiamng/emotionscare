
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import AudioProcessor from './live/AudioProcessor';
import EmotionResult from './live/EmotionResult';
import { useToast } from '@/hooks/use-toast';
import type { Emotion, EmotionResult as EmotionResultType } from '@/types';
import { saveRealtimeEmotionScan } from '@/lib/scanService';

interface EmotionScanLiveProps {
  userId?: string;
  onComplete?: (emotion: Emotion) => void;
  onResultSaved?: () => Promise<void>;
}

const EmotionScanLive: React.FC<EmotionScanLiveProps> = ({ userId = '', onComplete, onResultSaved }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [emotion, setEmotion] = useState<Emotion | null>(null);
  const [result, setResult] = useState<EmotionResultType | null>(null);
  const [isConfidential, setIsConfidential] = useState(true);
  const { toast } = useToast();

  const handleToggleListen = () => {
    setIsListening(!isListening);
    if (isListening) {
      setProgress('');
      setEmotion(null);
      setResult(null);
    } else {
      toast({
        title: 'Scan en direct activé',
        description: 'Parlez normalement, votre voix est analysée en temps réel.'
      });
    }
  };

  const handleError = (message: string) => {
    toast({
      title: 'Erreur lors du scan',
      description: message,
      variant: 'destructive'
    });
    setIsListening(false);
    setIsProcessing(false);
  };

  const handleAnalysisComplete = (emotionData: Emotion, resultData: EmotionResultType) => {
    setEmotion(emotionData);
    setResult(resultData);
    setIsListening(false);
    setIsProcessing(false);
    
    // Save the emotion scan
    saveRealtimeEmotionScan(emotionData, userId)
      .then(() => {
        toast({
          title: 'Scan sauvegardé',
          description: 'Votre scan émotionnel a été enregistré.'
        });
        
        if (onComplete) {
          onComplete(emotionData);
        }
        
        if (onResultSaved) {
          onResultSaved();
        }
      })
      .catch((error) => {
        console.error('Error saving emotion scan:', error);
        toast({
          title: 'Erreur de sauvegarde',
          description: 'Impossible de sauvegarder le scan.',
          variant: 'destructive'
        });
      });
  };

  return (
    <Card className="p-6 shadow-md">
      <div className="flex flex-col items-center space-y-6">
        <h3 className="text-xl font-semibold">Scan émotionnel en direct</h3>
        
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleToggleListen}
            variant={isListening ? "destructive" : "default"}
            disabled={isProcessing}
            className="relative h-14 w-14 rounded-full p-0"
          >
            {isListening ? 
              <MicOff className="h-6 w-6" /> : 
              <Mic className="h-6 w-6" />
            }
          </Button>
          <div>
            <p className="text-sm text-muted-foreground">
              {isListening ? 'Cliquez pour arrêter...' : 'Cliquez pour démarrer'}
            </p>
            <p className="text-xs text-muted-foreground">{progress}</p>
          </div>
        </div>
        
        {isProcessing && (
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Analyse en cours...</span>
          </div>
        )}
        
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isConfidential}
            onChange={() => setIsConfidential(!isConfidential)}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2"
          />
          <span className="text-sm text-muted-foreground">Mode confidentiel (pas de stockage de l'audio)</span>
        </label>
        
        {result && emotion && (
          <EmotionResult emotion={result.emotion || ''} confidence={result.confidence || 0} transcript={result.transcript || ''} />
        )}
      </div>
      
      {isListening && (
        <AudioProcessor
          isListening={isListening}
          userId={userId}
          isConfidential={isConfidential}
          onProcessingChange={setIsProcessing}
          onProgressUpdate={setProgress}
          onAnalysisComplete={handleAnalysisComplete}
          onError={handleError}
        />
      )}
    </Card>
  );
};

export default EmotionScanLive;

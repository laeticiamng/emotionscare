
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Save, Trash } from 'lucide-react';
import StatusIndicator from './live/StatusIndicator';
import AudioProcessor from './live/AudioProcessor';
import { EmotionResult } from '@/types';
import { saveRealtimeEmotionScan } from '@/lib/scanService';
import LiveEmotionResults from './live/LiveEmotionResults';
import TranscriptDisplay from './live/TranscriptDisplay';
import EmptyState from './live/EmptyState';
import { useToast } from '@/hooks/use-toast';
import MusicEmotionRecommendation from './live/MusicEmotionRecommendation';

interface EmotionScanLiveProps {
  userId: string;
  isConfidential?: boolean;
  onScanComplete?: (result: EmotionResult) => void;
  onResultSaved?: () => Promise<void>;
}

const EmotionScanLive: React.FC<EmotionScanLiveProps> = ({ 
  userId, 
  isConfidential = false,
  onScanComplete,
  onResultSaved
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('Prêt à analyser');
  const [currentEmotion, setCurrentEmotion] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<EmotionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isListening && !isProcessing) {
      setStatusText('Prêt à analyser');
    }
  }, [isListening, isProcessing]);

  const toggleListening = () => {
    if (!isProcessing) {
      setIsListening(!isListening);
      setError(null);
      
      if (!isListening) {
        setStatusText('Début de l\'enregistrement...');
        setIsSaved(false);
        setCurrentEmotion(null);
        setAnalysisResult(null);
      } else {
        setStatusText('Arrêt de l\'enregistrement...');
      }
    }
  };

  const handleAnalysisComplete = (emotion: any, result: EmotionResult) => {
    setCurrentEmotion(emotion);
    setAnalysisResult(result);
    setStatusText('Analyse terminée');
    setIsListening(false);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setStatusText('Erreur');
    setIsListening(false);
    setIsProcessing(false);
    toast({
      title: 'Erreur',
      description: errorMessage,
      variant: 'destructive',
    });
  };

  const clearResults = () => {
    setCurrentEmotion(null);
    setAnalysisResult(null);
    setStatusText('Prêt à analyser');
    setError(null);
    setIsSaved(false);
  };

  const saveResults = async () => {
    if (!analysisResult) return;
    
    try {
      setStatusText('Enregistrement en cours...');
      // Add userId to the result and save it
      const result = await saveRealtimeEmotionScan({
        ...analysisResult,
        user_id: userId
      });
      
      setIsSaved(true);
      setStatusText('Résultat enregistré');
      
      toast({
        title: 'Émotion enregistrée',
        description: 'Votre analyse émotionnelle a été sauvegardée avec succès.',
      });
      
      if (onScanComplete) {
        onScanComplete(result);
      }
      
      if (onResultSaved) {
        await onResultSaved();
      }
    } catch (err) {
      console.error('Error saving emotion scan:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'enregistrer l\'analyse. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <StatusIndicator 
            isListening={isListening} 
            isProcessing={isProcessing} 
            statusText={statusText} 
            error={error !== null}
          />
          
          <div className="flex gap-2">
            {!isListening && analysisResult && !isSaved && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={saveResults} 
                disabled={isProcessing}
              >
                <Save className="w-4 h-4 mr-1" /> Enregistrer
              </Button>
            )}
            
            {!isListening && analysisResult && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearResults} 
                disabled={isProcessing}
              >
                <Trash className="w-4 h-4 mr-1" /> Effacer
              </Button>
            )}
            
            <Button 
              onClick={toggleListening} 
              disabled={isProcessing}
              variant={isListening ? "destructive" : "default"}
              size="sm"
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 mr-1" /> Arrêter
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-1" /> Démarrer
                </>
              )}
            </Button>
          </div>
        </div>

        {(isListening || isProcessing) && (
          <div className="flex items-center justify-center h-40 border rounded-md bg-muted/50">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2">
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping"></div>
                  <div className="absolute inset-2 bg-primary/20 rounded-full animate-ping animation-delay-300"></div>
                  <Mic className="w-full h-full text-primary/80 relative z-10" />
                </div>
              </div>
              <p className="text-muted-foreground">{statusText}</p>
            </div>
          </div>
        )}

        {!isListening && !isProcessing && !analysisResult && !error && (
          <EmptyState />
        )}

        {error && (
          <div className="text-center p-6 border border-destructive/20 rounded-md bg-destructive/10">
            <p className="text-destructive font-medium">{error}</p>
            <p className="text-muted-foreground mt-2">Veuillez réessayer ou utiliser une autre méthode d'analyse.</p>
          </div>
        )}

        {!isListening && !isProcessing && analysisResult && (
          <>
            <LiveEmotionResults result={analysisResult} />
            
            {analysisResult.transcript && (
              <TranscriptDisplay transcript={analysisResult.transcript} />
            )}
            
            <MusicEmotionRecommendation emotionResult={analysisResult} />
          </>
        )}

        <AudioProcessor
          isListening={isListening}
          userId={userId}
          isConfidential={isConfidential}
          onProcessingChange={setIsProcessing}
          onProgressUpdate={setStatusText}
          onAnalysisComplete={handleAnalysisComplete}
          onError={handleError}
        />
      </CardContent>
    </Card>
  );
};

export default EmotionScanLive;

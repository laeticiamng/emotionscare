import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Loader2, AudioWaveform, Check } from 'lucide-react';
import AudioProcessor from './live/AudioProcessor';
import EmotionResult from './live/EmotionResult';
import { useToast } from '@/hooks/use-toast';
import type { Emotion, EmotionResult as EmotionResultType } from '@/types';
import { saveRealtimeEmotionScan } from '@/lib/scanService';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import EmptyState from './live/EmptyState';

interface EmotionScanLiveProps {
  userId?: string;
  onComplete?: (emotion: Emotion) => void;
  onResultSaved?: () => Promise<void>;
}

const EmotionScanLive: React.FC<EmotionScanLiveProps> = ({ userId = '', onComplete, onResultSaved }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [emotion, setEmotion] = useState<Emotion | null>(null);
  const [result, setResult] = useState<EmotionResultType | null>(null);
  const [isConfidential, setIsConfidential] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Reset recording duration when not listening
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isListening) {
      timer = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isListening]);

  const handleToggleListen = () => {
    // Reset state when toggling
    if (isListening) {
      setProgress('');
      setRecordingDuration(0);
      setIsListening(false);
    } else {
      setEmotion(null);
      setResult(null);
      setError(null);
      setIsListening(true);
      
      toast({
        title: 'Scan en direct activé',
        description: 'Parlez normalement, votre voix est analysée en temps réel.'
      });
    }
  };

  const handleError = (message: string) => {
    setError(message);
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
    saveResult(emotionData);
  };
  
  const saveResult = async (emotionData: Emotion) => {
    if (!userId) {
      toast({
        title: 'Non connecté',
        description: 'Connectez-vous pour sauvegarder vos scans.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsSaving(true);
      await saveRealtimeEmotionScan(emotionData, userId);
      
      toast({
        title: 'Scan sauvegardé',
        description: 'Votre scan émotionnel a été enregistré.'
      });
      
      if (onComplete) {
        onComplete(emotionData);
      }
      
      if (onResultSaved) {
        await onResultSaved();
      }
    } catch (error) {
      console.error('Error saving emotion scan:', error);
      toast({
        title: 'Erreur de sauvegarde',
        description: 'Impossible de sauvegarder le scan.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderRecordingStatus = () => {
    if (!isListening) return null;
    
    return (
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Enregistrement en cours...</span>
          <span className="text-sm font-medium">{recordingDuration}s</span>
        </div>
        <Progress value={recordingDuration % 100} className="h-1 animate-pulse" />
      </div>
    );
  };

  // Reset error if component is unmounted
  useEffect(() => {
    return () => {
      if (isListening) {
        // Clean up if component unmounts while still listening
        setIsListening(false);
      }
    };
  }, [isListening]);

  return (
    <Card className="p-6 shadow-md">
      <div className="flex flex-col items-center space-y-6">
        <h3 className="text-xl font-semibold">Scan émotionnel en direct</h3>
        
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleToggleListen}
            variant={isListening ? "destructive" : "default"}
            disabled={isProcessing || isSaving}
            className="relative h-14 w-14 rounded-full p-0"
            aria-label={isListening ? "Arrêter l'écoute" : "Démarrer l'écoute"}
          >
            {isListening ? 
              <MicOff className="h-6 w-6" /> : 
              <Mic className="h-6 w-6" />
            }
            {isListening && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-ping" />
            )}
          </Button>
          <div>
            <p className="text-sm text-muted-foreground">
              {isListening ? 'Cliquez pour arrêter...' : 'Cliquez pour démarrer'}
            </p>
            <p className="text-xs text-muted-foreground">{progress}</p>
          </div>
        </div>
        
        {renderRecordingStatus()}
        
        {error && (
          <div className="w-full p-3 bg-destructive/10 text-destructive rounded-md">
            <p className="text-sm">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setError(null)} 
              className="mt-2"
            >
              Réessayer
            </Button>
          </div>
        )}
        
        {isProcessing && (
          <div className="flex flex-col items-center justify-center space-y-2 w-full p-4">
            <AudioWaveform className="h-12 w-12 text-primary animate-pulse" />
            <p className="text-sm">Analyse en cours...</p>
            <Progress value={Math.random() * 100} className="w-full h-1" />
          </div>
        )}
        
        {isSaving && (
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin mr-2 text-primary" />
            <span className="text-sm">Sauvegarde en cours...</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2 w-full justify-center">
          <Switch
            id="confidential-mode"
            checked={isConfidential}
            onCheckedChange={setIsConfidential}
          />
          <Label htmlFor="confidential-mode" className="text-sm text-muted-foreground cursor-pointer">
            Mode confidentiel (pas de stockage de l'audio)
          </Label>
        </div>
        
        {result && emotion && (
          <div className="w-full bg-muted/30 rounded-lg p-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Check className="text-green-500 h-5 w-5" />
              <h4 className="font-medium">Analyse complétée</h4>
            </div>
            <EmotionResult 
              emotion={result.emotion || ''} 
              confidence={result.confidence || 0} 
              transcript={result.transcript || ''} 
            />
          </div>
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


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Loader2, AudioWaveform, Info } from 'lucide-react';
import AudioProcessor from './live/AudioProcessor';
import EmotionResult from './live/EmotionResult';
import { useToast } from '@/hooks/use-toast';
import type { Emotion, EmotionResult as EmotionResultType } from '@/types';
import { saveRealtimeEmotionScan } from '@/lib/scanService';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import EmptyState from './live/EmptyState';
import MusicEmotionRecommendation from './live/MusicEmotionRecommendation';
import LiveEmotionResults from './live/LiveEmotionResults';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const [micPermissionsChecked, setMicPermissionsChecked] = useState(false);
  const [micAllowed, setMicAllowed] = useState(true);
  const { toast } = useToast();
  
  // Vérifier les permissions de microphone au chargement
  useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setMicAllowed(permissionStatus.state !== 'denied');
        setMicPermissionsChecked(true);
        
        permissionStatus.addEventListener('change', () => {
          setMicAllowed(permissionStatus.state !== 'denied');
        });
      } catch (error) {
        console.log('Permission API not supported, assuming microphone is available');
        setMicPermissionsChecked(true);
      }
    };
    
    checkMicrophonePermission();
  }, []);

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
    
    toast({
      title: 'Analyse terminée',
      description: `Émotion détectée : ${resultData.emotion} (${Math.round(resultData.confidence * 100)}% de confiance)`,
    });
  };
  
  const saveResult = async () => {
    if (!userId) {
      toast({
        title: 'Non connecté',
        description: 'Connectez-vous pour sauvegarder vos scans.',
        variant: 'destructive'
      });
      return;
    }
    
    if (!emotion || !result) {
      toast({
        title: 'Aucun résultat',
        description: 'Aucun scan à sauvegarder.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsSaving(true);
      await saveRealtimeEmotionScan(emotion, userId);
      
      toast({
        title: 'Scan sauvegardé',
        description: 'Votre scan émotionnel a été enregistré avec succès.'
      });
      
      if (onComplete && emotion) {
        onComplete(emotion);
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
  
  const handleReset = () => {
    setEmotion(null);
    setResult(null);
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

  // Afficher un message différent si le microphone est refusé
  if (micPermissionsChecked && !micAllowed) {
    return (
      <Card className="p-6 shadow-md">
        <Alert variant="destructive" className="mb-4">
          <Info className="h-5 w-5" />
          <AlertTitle>Accès au microphone bloqué</AlertTitle>
          <AlertDescription>
            Pour utiliser la fonction de scan vocal, veuillez autoriser l'accès au microphone dans les paramètres de votre navigateur.
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-4">
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Réessayer
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-md">
      <div className="flex flex-col items-center space-y-6">
        <h3 className="text-xl font-semibold">Scan émotionnel en direct</h3>
        
        {!result && (
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
        )}
        
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
            <p className="text-xs text-muted-foreground">{progress}</p>
          </div>
        )}
        
        {!result && (
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
        )}
        
        {result && (
          <div className="w-full space-y-4">
            <LiveEmotionResults
              result={result}
              onSave={saveResult}
              onReset={handleReset}
              isSaving={isSaving}
            />
          </div>
        )}
        
        {!isListening && !isProcessing && !error && !result && (
          <EmptyState message="Cliquez sur le bouton pour commencer l'analyse vocale et obtenir des recommandations musicales personnalisées" />
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

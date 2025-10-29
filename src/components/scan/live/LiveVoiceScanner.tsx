// @ts-nocheck

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EmotionResult, LiveVoiceScannerProps, normalizeEmotionResult } from '@/types/emotion-unified';
import { Mic, Square, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';


/**
 * Convertit un Blob audio en base64
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const LiveVoiceScanner: React.FC<LiveVoiceScannerProps> = ({
  onScanComplete,
  onResult,
  isProcessing: externalIsProcessing,
  setIsProcessing: externalSetIsProcessing,
  autoStart = false,
  scanDuration = 10
}) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [localIsProcessing, setLocalIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const isProcessing = externalIsProcessing !== undefined ? externalIsProcessing : localIsProcessing;
  const setIsProcessing = externalSetIsProcessing || setLocalIsProcessing;

  /**
   * Traite l'audio enregistré et appelle l'edge function
   */
  const processAudioData = useCallback(async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      console.log('[LiveVoiceScanner] Processing audio, size:', audioBlob.size);
      
      // Convertir en base64
      const audioBase64 = await blobToBase64(audioBlob);
      
      // Appeler l'edge function
      const { data, error: invokeError } = await supabase.functions.invoke('analyze-voice-hume', {
        body: { audioBase64 }
      });

      if (invokeError) {
        console.error('[LiveVoiceScanner] Edge function error:', invokeError);
        throw new Error(invokeError.message || 'Failed to analyze voice');
      }

      if (!data) {
        throw new Error('No data returned from voice analysis');
      }

      console.log('[LiveVoiceScanner] Analysis result:', data);

      // Convertir la réponse en EmotionResult unifié
      const emotionResult: EmotionResult = normalizeEmotionResult({
        id: crypto.randomUUID(),
        emotion: data.emotion || 'neutre',
        valence: (data.valence || 0.5) * 100,
        arousal: (data.arousal || 0.5) * 100,
        confidence: (data.confidence || 0.7) * 100,
        source: 'voice',
        timestamp: new Date().toISOString(),
        emotions: data.emotions || {},
        summary: `Émotion ${data.emotion} détectée dans votre voix`,
        metadata: {
          latency_ms: data.latency_ms
        }
      });

      // Notifier les callbacks
      if (onScanComplete) onScanComplete(emotionResult);
      if (onResult) onResult(emotionResult);

      toast({
        title: 'Analyse vocale terminée',
        description: `Émotion détectée: ${emotionResult.emotion}`,
      });

    } catch (err) {
      console.error('[LiveVoiceScanner] Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      
      toast({
        title: 'Erreur d\'analyse',
        description: 'Impossible d\'analyser votre voix. Veuillez réessayer.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onScanComplete, onResult, setIsProcessing, toast]);

  /**
   * Démarre l'enregistrement audio
   */
  const startRecording = useCallback(async () => {
    setError(null);
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Créer le MediaRecorder avec format approprié
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        // Créer le blob audio
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        console.log('[LiveVoiceScanner] Recording stopped, blob size:', audioBlob.size);
        
        // Arrêter tous les tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Traiter l'audio
        if (audioBlob.size > 0) {
          await processAudioData(audioBlob);
        } else {
          setError('Aucun audio enregistré');
        }
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      
      setIsRecording(true);
      setProgress(0);
      
      console.log('[LiveVoiceScanner] Recording started');
      
    } catch (err) {
      console.error('[LiveVoiceScanner] Failed to start recording:', err);
      setError('Impossible d\'accéder au microphone');
      
      toast({
        title: 'Accès microphone refusé',
        description: 'Veuillez autoriser l\'accès au microphone pour utiliser l\'analyse vocale.',
        variant: 'destructive'
      });
    }
  }, [processAudioData, toast]);
  
  /**
   * Arrête l'enregistrement
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      console.log('[LiveVoiceScanner] Stopping recording');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  useEffect(() => {
    if (autoStart) {
      startRecording();
    }
  }, [autoStart, startRecording]);
  
  useEffect(() => {
    let timer: number | null = null;
    
    if (isRecording) {
      const interval = 100; // Update every 100ms for smoother progress
      const steps = (scanDuration * 1000) / interval;
      let currentStep = 0;
      
      timer = window.setInterval(() => {
        currentStep++;
        const newProgress = (currentStep / steps) * 100;
        setProgress(newProgress);
        
        if (newProgress >= 100) {
          stopRecording();
        }
      }, interval);
    }
    
    return () => {
      if (timer !== null) {
        clearInterval(timer);
      }
    };
  }, [isRecording, scanDuration, stopRecording]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Scan vocal en direct</span>
          {isRecording && (
            <span className="text-sm font-normal text-muted-foreground">
              {Math.round((progress / 100) * scanDuration)}s / {scanDuration}s
            </span>
          )}
        </CardTitle>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      
      <CardContent className="flex flex-col items-center space-y-4 pt-2">
        <div className="relative h-24 w-24">
          <div className={`absolute inset-0 rounded-full ${isRecording ? 'animate-pulse bg-primary/20' : 'bg-muted'}`}></div>
          <div className={`absolute inset-0 scale-[0.8] rounded-full ${isRecording ? 'animate-pulse-fast bg-primary/30' : 'bg-muted/80'}`}></div>
          <div className="absolute inset-0 scale-[0.6] rounded-full bg-background flex items-center justify-center">
            <Mic className={`h-10 w-10 ${isRecording || isProcessing ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
        </div>
        
        {isProcessing ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Analyse en cours...</p>
          </div>
        ) : (
          <Button 
            variant={isRecording ? "destructive" : "default"}
            disabled={isProcessing}
            onClick={isRecording ? stopRecording : startRecording}
            className="mt-4"
          >
            {isRecording ? (
              <>
                <Square className="mr-2 h-4 w-4" />
                Arrêter l'enregistrement
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Commencer l'analyse
              </>
            )}
          </Button>
        )}
        
        <p className="text-xs text-muted-foreground text-center max-w-md">
          {isRecording 
            ? "Parlez naturellement pendant que nous analysons votre voix..." 
            : "L'analyse vocale permet de détecter les émotions à travers les modulations et intonations de votre voix."}
        </p>
        
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveVoiceScanner;

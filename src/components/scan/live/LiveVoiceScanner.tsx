// @ts-nocheck

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EmotionResult, LiveVoiceScannerProps, normalizeEmotionResult } from '@/types/emotion-unified';
import { Mic, Square, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';


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
      logger.debug('[LiveVoiceScanner] Processing audio, size:', audioBlob.size, 'COMPONENT');
      
      // Convertir en base64
      const audioBase64 = await blobToBase64(audioBlob);
      
      // Appeler l'edge function
      const { data, error: invokeError } = await supabase.functions.invoke('analyze-voice-hume', {
        body: { audioBase64 }
      });

      if (invokeError) {
        logger.error('[LiveVoiceScanner] Edge function error:', invokeError, 'COMPONENT');
        throw new Error(invokeError.message || 'Failed to analyze voice');
      }

      if (!data) {
        throw new Error('No data returned from voice analysis');
      }

      logger.debug('[LiveVoiceScanner] Analysis result:', data, 'COMPONENT');

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

      // Sauvegarder dans clinical_signals
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user?.id) {
          const valenceLevel = Math.floor(emotionResult.valence / 20); // 0-4
          const arousalLevel = Math.floor(emotionResult.arousal / 20); // 0-4
          const avgLevel = Math.round((valenceLevel + arousalLevel) / 2);
          
          const now = new Date();
          const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 jours

          const { error: insertError } = await supabase.from('clinical_signals').insert({
            user_id: user.id,
            source_instrument: 'voice',
            domain: 'emotional',
            level: avgLevel,
            module_context: 'scan',
            window_type: 'instant',
            expires_at: expiresAt.toISOString(),
            metadata: {
              valence: emotionResult.valence,
              arousal: emotionResult.arousal,
              confidence: emotionResult.confidence / 100,
              summary: emotionResult.summary,
              emotion: emotionResult.emotion,
              timestamp: emotionResult.timestamp,
            },
          });

          if (insertError) {
            logger.error('[LiveVoiceScanner] Error saving to clinical_signals:', insertError, 'COMPONENT');
          } else {
            logger.debug('[LiveVoiceScanner] Successfully saved to clinical_signals', 'COMPONENT');
            // Invalider le cache pour rafraîchir l'historique
            window.dispatchEvent(new CustomEvent('scan-saved'));
          }
        }
      } catch (saveError) {
        logger.error('[LiveVoiceScanner] Exception saving to DB:', saveError, 'COMPONENT');
      }

      toast({
        title: 'Analyse vocale terminée',
        description: `Émotion détectée: ${emotionResult.emotion}`,
      });

    } catch (err) {
      logger.error('[LiveVoiceScanner] Error:', err, 'COMPONENT');
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
      // Contraintes audio optimisées pour la capture vocale
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true
        }
      });
      
      // Garder une référence au stream
      const streamRef = stream;
      
      // Déterminer le meilleur format supporté
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        mimeType = 'audio/ogg';
      }
      
      logger.debug('[LiveVoiceScanner] Using mimeType:', mimeType, 'COMPONENT');
      
      // Créer le MediaRecorder avec bitrate élevé
      const mediaRecorder = new MediaRecorder(stream, { 
        mimeType,
        audioBitsPerSecond: 128000
      });
      
      mediaRecorder.ondataavailable = (event) => {
        logger.debug('[LiveVoiceScanner] ondataavailable, size:', event.data.size, 'COMPONENT');
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const chunks = [...audioChunksRef.current];
        logger.debug('[LiveVoiceScanner] onstop, chunks:', chunks.length, 'total size:', chunks.reduce((acc, c) => acc + c.size, 0), 'COMPONENT');
        
        // Arrêter tous les tracks
        streamRef.getTracks().forEach(track => track.stop());
        
        // Vérifier qu'on a des chunks
        if (chunks.length === 0) {
          setError('Aucune donnée audio capturée. Vérifiez les permissions du microphone.');
          return;
        }
        
        // Créer le blob audio
        const audioBlob = new Blob(chunks, { type: mimeType });
        logger.debug('[LiveVoiceScanner] Final blob size:', audioBlob.size, 'bytes', 'COMPONENT');
        
        // Vérifier la taille minimale
        if (audioBlob.size < 1000) {
          setError('Enregistrement trop court. Parlez pendant au moins 3 secondes.');
          return;
        }
        
        // Traiter l'audio
        await processAudioData(audioBlob);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      
      // IMPORTANT: Démarrer SANS timeslice pour collecter tout à la fin
      // Le timeslice peut causer des problèmes sur certains navigateurs
      mediaRecorder.start();
      
      setIsRecording(true);
      setProgress(0);
      
      logger.debug('[LiveVoiceScanner] Recording started (continuous mode)', 'COMPONENT');
      
    } catch (err) {
      logger.error('[LiveVoiceScanner] Failed to start recording:', err, 'COMPONENT');
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
      logger.debug('[LiveVoiceScanner] Stopping recording, state:', mediaRecorderRef.current.state, 'COMPONENT');
      // Forcer la collecte des dernières données avant d'arrêter
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.requestData();
      }
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

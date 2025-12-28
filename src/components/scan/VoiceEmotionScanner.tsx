// @ts-nocheck

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, StopCircle, Loader2, AlertCircle } from 'lucide-react';
import { EmotionResult, VoiceEmotionScannerProps, normalizeEmotionResult } from '@/types/emotion-unified';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

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

const VoiceEmotionScanner: React.FC<VoiceEmotionScannerProps> = ({ onEmotionDetected }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const progressIntervalRef = useRef<number | null>(null);

  const processAudio = useCallback(async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);

    try {
      const audioBase64 = await blobToBase64(audioBlob);
      
      const { data, error: invokeError } = await supabase.functions.invoke('analyze-voice-hume', {
        body: { audioBase64 }
      });

      if (invokeError) {
        throw new Error(invokeError.message || 'Erreur d\'analyse vocale');
      }

      if (!data) {
        throw new Error('Aucune réponse de l\'analyse');
      }

      const result: EmotionResult = normalizeEmotionResult({
        id: `voice-${Date.now()}`,
        emotion: data.emotion || 'neutre',
        valence: (data.valence || 0.5) * 100,
        arousal: (data.arousal || 0.5) * 100,
        confidence: (data.confidence || 0.7) * 100,
        source: 'voice',
        timestamp: new Date().toISOString(),
        summary: `Émotion ${data.emotion} détectée`,
        emotions: data.emotions || {},
        recommendations: [
          {
            id: `rec-${Date.now()}-1`,
            type: 'exercise',
            title: 'Exercice de respiration',
            description: 'Un exercice pour vous recentrer',
            emotion: data.emotion,
            content: 'Respirez 4s, retenez 4s, expirez 6s.',
            category: 'wellness'
          }
        ]
      });
      
      onEmotionDetected(result);
    } catch (err) {
      logger.error('[VoiceEmotionScanner] Error:', err, 'COMPONENT');
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'analyse. Réessayez.');
    } finally {
      setIsProcessing(false);
    }
  }, [onEmotionDetected]);

  const startRecording = useCallback(async () => {
    setError(null);
    audioChunksRef.current = [];
    setProgress(0);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: true }
      });
      
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      }
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType, audioBitsPerSecond: 128000 });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioBlob.size < 1000) {
          setError('Enregistrement trop court. Parlez au moins 3 secondes.');
          return;
        }
        await processAudio(audioBlob);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      
      // Progress timer (5 seconds recording)
      let elapsed = 0;
      progressIntervalRef.current = window.setInterval(() => {
        elapsed += 100;
        setProgress((elapsed / 5000) * 100);
        if (elapsed >= 5000) {
          stopRecording();
        }
      }, 100);
      
    } catch (err) {
      setError('Impossible d\'accéder au microphone');
    }
  }, [processAudio]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.requestData();
      }
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Scan Vocal</CardTitle>
        <CardDescription className="text-center">
          Parlez pendant 5 secondes pour analyser vos émotions
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {isRecording && <Progress value={progress} className="w-full h-2" />}
        
        <div className="mb-4 text-center">
          <p className="text-muted-foreground">
            {isRecording 
              ? 'Parlez naturellement...' 
              : isProcessing 
                ? 'Analyse en cours...' 
                : 'Appuyez pour commencer'}
          </p>
        </div>
        
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        
        <Button 
          onClick={isRecording ? stopRecording : startRecording} 
          className={`rounded-full w-16 h-16 ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
          disabled={isProcessing}
        >
          {isRecording ? (
            <StopCircle className="h-8 w-8" />
          ) : isProcessing ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground mt-4">
          L'analyse vocale détecte les émotions dans les intonations
        </p>
      </CardContent>
    </Card>
  );
};

export default VoiceEmotionScanner;

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, StopCircle, AlertCircle, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EmotionResult, EmotionRecommendation } from '@/types/emotion';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AudioProcessorProps {
  onResult?: (result: EmotionResult) => void;
  onProcessingChange?: (processing: boolean) => void;
  isRecording?: boolean;
  duration?: number;
  autoStart?: boolean;
  className?: string;
  mode?: 'voice' | 'ambient';
  visualize?: boolean;
}

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

export const AudioProcessor: React.FC<AudioProcessorProps> = ({
  onResult,
  onProcessingChange,
  isRecording: externalIsRecording,
  duration = 15,
  autoStart = false,
  className = '',
  mode = 'voice',
  visualize = true,
}) => {
  const [isRecording, setIsRecording] = useState(autoStart || false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState(duration);
  const [audioLevel, setAudioLevel] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>(Array(32).fill(0));
  
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const updateVisualization = useCallback(() => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate average level
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    setAudioLevel(Math.min(100, average * 1.5));
    
    // Extract waveform data for visualization
    const step = Math.floor(dataArray.length / 32);
    const newWaveform = Array.from({ length: 32 }, (_, i) => {
      const val = dataArray[i * step] || 0;
      return (val / 255) * 100;
    });
    setWaveformData(newWaveform);
    
    animationFrameRef.current = requestAnimationFrame(updateVisualization);
  }, []);

  useEffect(() => {
    if (externalIsRecording !== undefined) {
      if (externalIsRecording && !isRecording) {
        startRecording();
      } else if (!externalIsRecording && isRecording) {
        stopRecording();
      }
    }
  }, [externalIsRecording, isRecording]);

  useEffect(() => {
    if (autoStart) {
      startRecording();
    }
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (mediaRecorderRef.current && isRecording) {
      stopRecording();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    streamRef.current?.getTracks().forEach(track => track.stop());
  };

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: mode === 'voice',
          noiseSuppression: mode === 'voice',
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;

      // Setup audio analyser
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      analyserRef.current = analyser;
      
      // Start visualization
      if (visualize) {
        animationFrameRef.current = requestAnimationFrame(updateVisualization);
      }
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : 'audio/webm'
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        setAudioLevel(0);
        setWaveformData(Array(32).fill(0));
        processAudio();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRemainingTime(duration);

      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setError('Impossible d\'accéder au microphone');
      toast({
        title: 'Erreur de microphone',
        description: 'Veuillez vérifier vos permissions.',
        variant: 'destructive'
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.requestData();
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      streamRef.current?.getTracks().forEach(track => track.stop());
    }
  };

  const processAudio = async () => {
    if (audioChunksRef.current.length === 0) return;

    setIsProcessing(true);
    onProcessingChange?.(true);

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const audioBase64 = await blobToBase64(audioBlob);
      
      // Call real API
      const { data, error: invokeError } = await supabase.functions.invoke('analyze-voice-hume', {
        body: { audioBase64 }
      });

      if (invokeError) throw invokeError;

      const recommendations: EmotionRecommendation[] = [
        {
          id: "breath-1",
          emotion: data?.emotion || 'calm',
          type: 'breathing',
          title: 'Respiration guidée',
          description: 'Prenez quelques respirations profondes',
          category: 'mindfulness',
          content: 'Inspirez 4s, retenez 4s, expirez 4s',
        },
        {
          id: "music-1",
          emotion: data?.emotion || 'calm',
          type: 'music',
          title: 'Musique adaptée',
          description: 'Écoutez de la musique qui correspond à votre humeur',
          category: 'music',
          content: 'Playlist personnalisée selon votre émotion',
        }
      ];
      
      const result: EmotionResult = {
        id: `audio-${Date.now()}`,
        emotion: data?.emotion || 'calm',
        confidence: data?.confidence || 0.85,
        intensity: data?.intensity || 0.7,
        valence: data?.valence || 0.6,
        arousal: data?.arousal || 0.5,
        timestamp: new Date(),
        source: 'voice',
        insight: `Émotion "${data?.emotion || 'calm'}" détectée avec ${Math.round((data?.confidence || 0.85) * 100)}% de confiance`,
        recommendations: recommendations,
        audio_url: URL.createObjectURL(audioBlob),
        emotions: data?.emotions || {},
        suggestions: [
          'Continuez à exprimer vos émotions',
          'Essayez une session de respiration'
        ]
      };
      
      onResult?.(result);
      
      toast({
        title: 'Analyse terminée',
        description: `Émotion détectée: ${result.emotion}`,
      });
      
    } catch (err) {
      setError('Erreur lors de l\'analyse');
      toast({
        title: 'Erreur d\'analyse',
        description: 'Veuillez réessayer.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
      onProcessingChange?.(false);
    }
  };

  const progressPercent = ((duration - remainingTime) / duration) * 100;

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Waveform visualization */}
      {visualize && isRecording && (
        <div className="w-full h-16 flex items-center justify-center gap-[2px] bg-muted/30 rounded-lg px-2">
          {waveformData.map((val, i) => (
            <motion.div
              key={i}
              className="w-1 bg-primary rounded-full"
              animate={{ height: Math.max(4, val * 0.6) }}
              transition={{ duration: 0.05 }}
            />
          ))}
        </div>
      )}

      {/* Progress bar during recording */}
      {isRecording && (
        <div className="w-full space-y-1">
          <Progress value={progressPercent} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Enregistrement...</span>
            <span>{remainingTime}s restantes</span>
          </div>
        </div>
      )}
      
      {!isRecording && !isProcessing && (
        <Button
          onClick={startRecording}
          size="lg"
          className="rounded-full h-20 w-20"
          disabled={isProcessing}
        >
          <Mic className="h-8 w-8" />
        </Button>
      )}
      
      {isRecording && (
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Button
              onClick={stopRecording}
              size="lg"
              variant="destructive"
              className="rounded-full h-20 w-20 animate-pulse"
            >
              <StopCircle className="h-8 w-8" />
            </Button>
            <Badge 
              className="absolute -top-2 -right-2 bg-background border"
              variant="outline"
            >
              <Activity className="h-3 w-3 mr-1 text-green-500" />
              {Math.round(audioLevel)}%
            </Badge>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Analyse IA en cours...</p>
        </div>
      )}
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-destructive bg-destructive/10 px-3 py-2 rounded-lg"
        >
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}
    </div>
  );
};

export default AudioProcessor;

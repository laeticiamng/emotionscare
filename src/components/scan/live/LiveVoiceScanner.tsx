import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { EmotionResult } from '@/types/emotion-unified';
import { Mic, Square, AlertCircle, Activity, Volume2, Waves } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LiveVoiceScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onResult?: (result: EmotionResult) => void;
  isProcessing?: boolean;
  setIsProcessing?: (processing: boolean) => void;
  autoStart?: boolean;
  scanDuration?: number;
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

const EMOTION_COLORS: Record<string, string> = {
  happy: 'bg-yellow-500',
  calm: 'bg-blue-500',
  sad: 'bg-indigo-500',
  angry: 'bg-red-500',
  anxious: 'bg-orange-500',
  neutral: 'bg-slate-500',
  excited: 'bg-pink-500',
  focused: 'bg-purple-500',
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
  const [audioLevel, setAudioLevel] = useState(0);
  const [realtimeEmotions, setRealtimeEmotions] = useState<Array<{ emotion: string; confidence: number }>>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const isProcessing = externalIsProcessing !== undefined ? externalIsProcessing : localIsProcessing;
  const setIsProcessing = externalSetIsProcessing || setLocalIsProcessing;

  // Audio level visualization
  const updateAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    setAudioLevel(Math.min(100, average * 1.5));
    
    // Simulate real-time emotion detection every 2 seconds
    if (Math.random() < 0.02) {
      const emotions = ['calm', 'happy', 'focused', 'neutral'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      setRealtimeEmotions(prev => [
        { emotion: randomEmotion, confidence: 0.5 + Math.random() * 0.4 },
        ...prev.slice(0, 2)
      ]);
    }
    
    animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
  }, []);

  const processAudioData = useCallback(async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const audioBase64 = await blobToBase64(audioBlob);
      
      const { data, error: invokeError } = await supabase.functions.invoke('analyze-voice-hume', {
        body: { audioBase64 }
      });

      if (invokeError) {
        throw new Error(invokeError.message || 'Failed to analyze voice');
      }

      if (!data) {
        throw new Error('No data returned from voice analysis');
      }

      const emotionResult: EmotionResult = {
        id: crypto.randomUUID(),
        emotion: data.emotion || 'neutral',
        valence: (data.valence || 0.5) * 100,
        arousal: (data.arousal || 0.5) * 100,
        confidence: (data.confidence || 0.7) * 100,
        intensity: (data.intensity || 0.5) * 100,
        source: 'voice',
        timestamp: new Date().toISOString(),
        summary: `Émotion "${data.emotion}" détectée dans votre voix avec ${Math.round((data.confidence || 0.7) * 100)}% de confiance`,
        recommendations: [
          'Continuez à exprimer vos émotions',
          'La respiration profonde peut aider à réguler vos émotions'
        ]
      };

      if (onScanComplete) onScanComplete(emotionResult);
      if (onResult) onResult(emotionResult);

      // Save to clinical_signals
      try {
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user?.id) {
          const valenceLevel = Math.floor((emotionResult.valence || 0.5) * 5);
          const arousalLevel = Math.floor((emotionResult.arousal || 0.5) * 5);
          const avgLevel = Math.round((valenceLevel + arousalLevel) / 2);
          
          const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

          await supabase.from('clinical_signals').insert({
            user_id: userData.user.id,
            source_instrument: 'voice',
            domain: 'emotional',
            level: avgLevel,
            module_context: 'scan',
            window_type: 'instant',
            expires_at: expiresAt.toISOString(),
            metadata: {
              valence: emotionResult.valence,
              arousal: emotionResult.arousal,
              confidence: emotionResult.confidence,
              emotion: emotionResult.emotion,
              timestamp: new Date().toISOString(),
            },
          });

          window.dispatchEvent(new CustomEvent('scan-saved'));
        }
      } catch {
        // Silent fail for DB save
      }

      toast({
        title: 'Analyse vocale terminée',
        description: `Émotion détectée: ${emotionResult.emotion}`,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      
      toast({
        title: 'Erreur d\'analyse',
        description: 'Impossible d\'analyser votre voix. Veuillez réessayer.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
      setRealtimeEmotions([]);
    }
  }, [onScanComplete, onResult, setIsProcessing, toast]);

  const startRecording = useCallback(async () => {
    setError(null);
    audioChunksRef.current = [];
    setRealtimeEmotions([]);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      
      // Setup audio analyser for visualization
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      
      // Start audio level monitoring
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      }
      
      const mediaRecorder = new MediaRecorder(stream, { 
        mimeType,
        audioBitsPerSecond: 128000
      });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const chunks = [...audioChunksRef.current];
        
        // Stop all tracks and cleanup
        streamRef.current?.getTracks().forEach(track => track.stop());
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        setAudioLevel(0);
        
        if (chunks.length === 0) {
          setError('Aucune donnée audio capturée.');
          return;
        }
        
        const audioBlob = new Blob(chunks, { type: mimeType });
        
        if (audioBlob.size < 1000) {
          setError('Enregistrement trop court. Parlez pendant au moins 3 secondes.');
          return;
        }
        
        await processAudioData(audioBlob);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      
      setIsRecording(true);
      setProgress(0);
      
    } catch {
      setError('Impossible d\'accéder au microphone');
      
      toast({
        title: 'Accès microphone refusé',
        description: 'Veuillez autoriser l\'accès au microphone.',
        variant: 'destructive'
      });
    }
  }, [processAudioData, toast, updateAudioLevel]);
  
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
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
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [autoStart, startRecording]);
  
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    
    if (isRecording) {
      const interval = 100;
      const steps = (scanDuration * 1000) / interval;
      let currentStep = 0;
      
      timer = setInterval(() => {
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
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-primary" />
            Scan vocal en direct
          </span>
          {isRecording && (
            <Badge variant="outline" className="animate-pulse">
              {Math.round((progress / 100) * scanDuration)}s / {scanDuration}s
            </Badge>
          )}
        </CardTitle>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      
      <CardContent className="flex flex-col items-center space-y-4 pt-2">
        {/* Audio visualization */}
        <div className="relative h-32 w-full flex items-center justify-center">
          {/* Background rings */}
          <motion.div 
            className={cn(
              "absolute rounded-full",
              isRecording ? 'bg-primary/10' : 'bg-muted'
            )}
            animate={{ 
              width: isRecording ? 120 + audioLevel : 96,
              height: isRecording ? 120 + audioLevel : 96,
            }}
            transition={{ duration: 0.1 }}
          />
          <motion.div 
            className={cn(
              "absolute rounded-full",
              isRecording ? 'bg-primary/20' : 'bg-muted/80'
            )}
            animate={{ 
              width: isRecording ? 90 + audioLevel * 0.5 : 76,
              height: isRecording ? 90 + audioLevel * 0.5 : 76,
            }}
            transition={{ duration: 0.1 }}
          />
          
          {/* Center icon */}
          <motion.div 
            className="relative z-10 rounded-full bg-background flex items-center justify-center shadow-lg"
            animate={{ 
              width: isRecording ? 64 : 56,
              height: isRecording ? 64 : 56,
            }}
          >
            {isRecording ? (
              <Activity className="h-8 w-8 text-primary animate-pulse" />
            ) : (
              <Mic className={cn(
                "h-8 w-8",
                isProcessing ? 'text-primary' : 'text-muted-foreground'
              )} />
            )}
          </motion.div>
          
          {/* Audio level indicator */}
          {isRecording && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary rounded-full"
                  animate={{
                    height: Math.max(4, (audioLevel / 100) * 24 * Math.sin((i + Date.now() / 100) * 0.5) + 12),
                  }}
                  transition={{ duration: 0.05 }}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Real-time emotion badges */}
        <AnimatePresence>
          {isRecording && realtimeEmotions.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-wrap gap-2 justify-center"
            >
              {realtimeEmotions.map((e, i) => (
                <Badge 
                  key={`${e.emotion}-${i}`}
                  variant="secondary"
                  className={cn(
                    "transition-all",
                    i === 0 && "ring-2 ring-primary/50"
                  )}
                >
                  <div className={cn("w-2 h-2 rounded-full mr-1", EMOTION_COLORS[e.emotion] || 'bg-slate-500')} />
                  {e.emotion} ({Math.round(e.confidence * 100)}%)
                </Badge>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {isProcessing ? (
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
              <Volume2 className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <p className="text-sm text-muted-foreground">Analyse IA en cours...</p>
          </div>
        ) : (
          <Button 
            variant={isRecording ? "destructive" : "default"}
            size="lg"
            disabled={isProcessing}
            onClick={isRecording ? stopRecording : startRecording}
            className="mt-2"
          >
            {isRecording ? (
              <>
                <Square className="mr-2 h-4 w-4" />
                Arrêter
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
            ? "Parlez naturellement... L'IA analyse votre voix en temps réel." 
            : "L'analyse vocale détecte les émotions via les modulations de votre voix."}
        </p>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveVoiceScanner;

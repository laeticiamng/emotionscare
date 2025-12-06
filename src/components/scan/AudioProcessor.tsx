// @ts-nocheck

import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EmotionResult, EmotionRecommendation } from '@/types/emotion';
import { AudioProcessorProps } from '@/types/audio';

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
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // Synchronize with external recording state if provided
  useEffect(() => {
    if (externalIsRecording !== undefined) {
      if (externalIsRecording && !isRecording) {
        startRecording();
      } else if (!externalIsRecording && isRecording) {
        stopRecording();
      }
    }
  }, [externalIsRecording]);

  useEffect(() => {
    if (autoStart) {
      startRecording();
    }
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        stopRecording();
      }
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        processAudio();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRemainingTime(duration);

      // Start countdown timer
      timerRef.current = window.setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      // Microphone access error
      setError('Could not access microphone. Please check permissions.');
      toast({
        title: 'Erreur de microphone',
        description: 'Impossible d\'accéder au microphone. Veuillez vérifier vos permissions.',
        variant: 'destructive'
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const processAudio = async () => {
    if (audioChunksRef.current.length === 0) {
      // No audio recorded
      return;
    }

    setIsProcessing(true);
    if (onProcessingChange) {
      onProcessingChange(true);
    }

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      
      // Simulate an analysis result (in a real app, send to server and process)
      setTimeout(() => {
        const recommendations: EmotionRecommendation[] = [
          {
            id: "med-1",
            emotion: "calm",
            type: 'meditation',
            title: 'Méditation guidée',
            description: 'Faites une courte méditation pour maintenir votre calme',
            category: 'méditation',
            content: 'Prenez 5 minutes pour respirer profondément',
          },
          {
            id: "music-1",
            emotion: "relaxed",
            type: 'music',
            title: 'Musique relaxante',
            description: 'Écoutez de la musique apaisante',
            category: 'musique',
            content: 'Une playlist de sons de nature et musique ambiante',
          }
        ];
        
        if (onResult) {
          const fakeResult: EmotionResult = {
            id: `scan-${Date.now()}`,
            emotion: 'calm',
            confidence: 0.85,
            intensity: 0.7,
            timestamp: new Date().toISOString(),
            source: 'voice',
            recommendations: recommendations,
            text: "J'ai passé une journée tranquille aujourd'hui.",
            audioUrl: URL.createObjectURL(audioBlob),
            transcript: "J'ai passé une journée tranquille aujourd'hui.",
            emotions: {},
            emojis: ['😌', '🧘‍♂️']
          };
          
          onResult(fakeResult);
        }
        
        setIsProcessing(false);
        if (onProcessingChange) {
          onProcessingChange(false);
        }
      }, 2000);
      
    } catch (error) {
      // Audio processing error
      setError('Failed to process audio');
      setIsProcessing(false);
      if (onProcessingChange) {
        onProcessingChange(false);
      }
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {!isRecording && !isProcessing && (
        <Button
          onClick={startRecording}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-6 h-auto w-auto"
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
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full p-6 h-auto w-auto animate-pulse"
            >
              <StopCircle className="h-8 w-8" />
            </Button>
            <div className="absolute top-0 right-0 bg-background rounded-full px-2 py-1 text-xs font-medium">
              {remainingTime}s
            </div>
          </div>
          <p className="text-sm text-center">Enregistrement en cours...</p>
        </div>
      )}

      {isProcessing && (
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="text-sm">Analyse en cours...</p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default AudioProcessor;

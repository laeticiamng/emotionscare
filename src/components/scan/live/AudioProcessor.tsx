
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Square } from 'lucide-react';
import { EmotionResult } from '@/types';

interface AudioProcessorProps {
  onResultReady?: (result: EmotionResult) => void;
  autoStart?: boolean;
  maxDuration?: number; // in seconds
}

const AudioProcessor: React.FC<AudioProcessorProps> = ({
  onResultReady,
  autoStart = false,
  maxDuration = 15
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<number | null>(null);
  
  // Start recording automatically if autoStart is true
  useEffect(() => {
    if (autoStart) {
      startRecording();
    }
    
    return () => {
      stopRecording();
    };
  }, [autoStart]);
  
  const startRecording = async () => {
    try {
      setError(null);
      setProgress(0);
      audioChunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        setIsRecording(false);
        setIsProcessing(true);
        
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          
          try {
            // In a real app, send this blob to your server or API for analysis
            // For demo, generate mock result after a delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const result: EmotionResult = {
              id: `live-${Date.now()}`,
              user_id: 'user-123',
              emotion: ['joy', 'calm', 'anxious', 'sad', 'focused'][Math.floor(Math.random() * 5)],
              score: Math.random() * 0.5 + 0.5,
              confidence: Math.random() * 0.3 + 0.7,
              intensity: Math.random() * 0.8 + 0.2,
              timestamp: new Date().toISOString(),
              audioUrl: URL.createObjectURL(audioBlob),
              ai_feedback: "Your voice patterns suggest you're feeling quite balanced today."
            };
            
            if (onResultReady) {
              onResultReady(result);
            }
          } catch (err) {
            console.error('Error processing audio:', err);
            setError('Une erreur est survenue lors de l\'analyse. Veuillez réessayer.');
          } finally {
            setIsProcessing(false);
          }
        } else {
          setIsProcessing(false);
          setError('Aucun audio enregistré. Veuillez réessayer.');
        }
      };
      
      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      
      // Set up progress tracking
      intervalRef.current = window.setInterval(() => {
        setProgress((prev) => {
          const newValue = prev + (100 / maxDuration);
          if (newValue >= 100) {
            stopRecording();
            return 100;
          }
          return newValue;
        });
      }, 1000);
      
      // Auto stop after maxDuration
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, maxDuration * 1000);
      
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Impossible d\'accéder au microphone. Vérifiez vos permissions.');
    }
  };
  
  const stopRecording = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };
  
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="text-center space-y-2">
          <div className={`relative mx-auto w-20 h-20 rounded-full 
            ${isRecording ? 'bg-primary/10' : 'bg-muted'}`}
          >
            {isRecording && (
              <div className="absolute inset-0 rounded-full animate-ping bg-primary/20"></div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <Mic className={`h-8 w-8 ${isRecording ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
          </div>
          
          <div className="text-sm">
            {isRecording && `${Math.round(progress / 100 * maxDuration)}s / ${maxDuration}s`}
            {isProcessing && 'Analyse en cours...'}
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress value={progress} className="h-1.5" />
          
          {error && (
            <div className="text-destructive text-sm text-center">{error}</div>
          )}
        </div>
        
        <div className="flex justify-center">
          {!isRecording && !isProcessing && (
            <Button onClick={startRecording}>
              <Mic className="mr-2 h-4 w-4" />
              Commencer
            </Button>
          )}
          
          {isRecording && (
            <Button variant="destructive" onClick={stopRecording}>
              <Square className="mr-2 h-4 w-4" />
              Arrêter
            </Button>
          )}
          
          {isProcessing && (
            <Button disabled>
              <div className="mr-2 h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              Analyse...
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioProcessor;

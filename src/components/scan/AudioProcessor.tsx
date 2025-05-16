
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Square } from 'lucide-react';
import { EmotionResult } from '@/types/emotion';
import { analyzeAudioEmotion } from '@/lib/scanService';
import { AudioProcessorProps } from '@/types/emotion';

const AudioProcessor: React.FC<AudioProcessorProps> = ({
  onResult,
  onResultReady,
  autoStart = false,
  maxDuration = 15,
  headerText = "Comment vous sentez-vous aujourd'hui ?",
  subHeaderText = "Parlez pendant quelques secondes pour que nous puissions analyser votre voix"
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const audioChunksRef = React.useRef<Blob[]>([]);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  
  const processAudioData = useCallback(async () => {
    if (audioChunksRef.current.length === 0) {
      setError('Aucun audio enregistré');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const result = await analyzeAudioEmotion(audioBlob);
      
      if (onResult) onResult(result);
      if (onResultReady) onResultReady(result);
      
      setIsProcessing(false);
    } catch (error) {
      console.error('Error processing audio:', error);
      setError('Erreur lors de l\'analyse audio');
      setIsProcessing(false);
    }
  }, [onResult, onResultReady]);
  
  const startRecording = useCallback(async () => {
    setError(null);
    setProgress(0);
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Timer to automatically stop recording after maxDuration
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          stopRecording();
        }
      }, maxDuration * 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Impossible d\'accéder au microphone');
    }
  }, [maxDuration]);
  
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks from the stream
      const tracks = mediaRecorderRef.current.stream.getTracks();
      tracks.forEach(track => track.stop());
      
      setIsRecording(false);
      processAudioData();
    }
  }, [processAudioData]);
  
  // Auto start recording if enabled
  useEffect(() => {
    if (autoStart) {
      startRecording();
    }
  }, [autoStart, startRecording]);
  
  // Update progress bar during recording
  useEffect(() => {
    let interval: number | undefined;
    
    if (isRecording) {
      const stepTime = 100; // Update every 100ms
      const totalSteps = maxDuration * 1000 / stepTime;
      let currentStep = 0;
      
      interval = window.setInterval(() => {
        currentStep++;
        const newProgress = Math.min(100, (currentStep / totalSteps) * 100);
        setProgress(newProgress);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          stopRecording();
        }
      }, stepTime);
    }
    
    return () => {
      if (interval !== undefined) {
        clearInterval(interval);
      }
    };
  }, [isRecording, maxDuration, stopRecording]);
  
  return (
    <div className="space-y-4">
      {headerText && (
        <h3 className="text-lg font-medium text-center">{headerText}</h3>
      )}
      
      {subHeaderText && (
        <p className="text-sm text-muted-foreground text-center">{subHeaderText}</p>
      )}
      
      <div className="space-y-4">
        <Progress value={progress} className="h-2" />
        
        <Card className="border-none shadow-none">
          <CardContent className="flex flex-col items-center p-0">
            <div className="relative h-24 w-24 mb-6">
              <div className={`absolute inset-0 rounded-full ${isRecording ? 'animate-pulse bg-primary/20' : 'bg-muted'}`}></div>
              <div className={`absolute inset-0 scale-[0.8] rounded-full ${isRecording ? 'animate-pulse bg-primary/30' : 'bg-muted/80'}`}></div>
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
              >
                {isRecording ? (
                  <>
                    <Square className="mr-2 h-4 w-4" />
                    Arrêter l'enregistrement
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Commencer l'enregistrement
                  </>
                )}
              </Button>
            )}
            
            {error && (
              <p className="text-sm text-destructive mt-4">{error}</p>
            )}
            
            {isRecording && (
              <p className="text-xs text-muted-foreground mt-4">
                Enregistrement en cours... {Math.floor((progress / 100) * maxDuration)}s / {maxDuration}s
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AudioProcessor;

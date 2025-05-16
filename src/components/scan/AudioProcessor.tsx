
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, StopCircle, Play, Loader2 } from 'lucide-react';
import { AudioProcessorProps, EmotionResult } from '@/types/emotion';
import { Progress } from '@/components/ui/progress';
import { scanService } from '@/services/scanService';

const AudioProcessor: React.FC<AudioProcessorProps> = ({
  onResultReady,
  autoStart = false,
  maxDuration = 30,
  headerText = "Analyse vocale",
  subHeaderText = "Parlez librement pour que nous puissions analyser votre état émotionnel",
  onResult
}) => {
  const [isRecording, setIsRecording] = useState(autoStart);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        processAudio(audioBlob);
      };
      
      setRecordingTime(0);
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const processAudio = async (blob: Blob) => {
    setIsProcessing(true);
    
    try {
      const result = await scanService.processVoiceEmotion(blob);
      
      // Add audio URL to result for playback
      const resultWithAudio: EmotionResult = {
        ...result,
        audioUrl: audioUrl || undefined
      };
      
      if (onResult) {
        onResult(resultWithAudio);
      }
      if (onResultReady) {
        onResultReady(resultWithAudio);
      }
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  useEffect(() => {
    if (autoStart) {
      startRecording();
    }
    
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Clean up objectURL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">{headerText}</CardTitle>
        <p className="text-center text-sm text-muted-foreground">{subHeaderText}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Recording indicator */}
        <div className="flex justify-center">
          <div 
            className={`w-24 h-24 rounded-full flex items-center justify-center ${
              isRecording 
                ? 'bg-red-100 dark:bg-red-900/30 animate-pulse' 
                : isProcessing 
                  ? 'bg-amber-100 dark:bg-amber-900/30' 
                  : 'bg-blue-100 dark:bg-blue-900/30'
            }`}
          >
            {isRecording ? (
              <Mic className="h-12 w-12 text-red-500" />
            ) : isProcessing ? (
              <Loader2 className="h-12 w-12 text-amber-500 animate-spin" />
            ) : audioBlob ? (
              <Play 
                className="h-12 w-12 text-blue-500 cursor-pointer" 
                onClick={playRecording}
              />
            ) : (
              <Mic className="h-12 w-12 text-blue-500" />
            )}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>{recordingTime}s</span>
            <span>{maxDuration}s</span>
          </div>
          <Progress value={(recordingTime / maxDuration) * 100} />
        </div>
        
        {/* Status message */}
        <div className="text-center text-sm">
          {isRecording ? (
            <p>Enregistrement... {maxDuration - recordingTime}s restantes</p>
          ) : isProcessing ? (
            <p>Analyse de votre voix en cours...</p>
          ) : audioBlob ? (
            <p>Enregistrement terminé. Vous pouvez le réécouter.</p>
          ) : (
            <p>Prêt à commencer l'enregistrement</p>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        {isRecording ? (
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={stopRecording}
          >
            <StopCircle className="mr-2 h-4 w-4" />
            Arrêter l'enregistrement
          </Button>
        ) : (
          <Button 
            className="w-full" 
            onClick={startRecording}
            disabled={isProcessing}
          >
            <Mic className="mr-2 h-4 w-4" />
            {audioBlob ? 'Recommencer' : 'Commencer l'enregistrement'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AudioProcessor;

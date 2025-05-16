
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { LiveVoiceScannerProps, EmotionResult } from "@/types/emotion";
import { scanService } from '@/services/scanService';
import { Progress } from '@/components/ui/progress';

const LiveVoiceScanner: React.FC<LiveVoiceScannerProps> = ({
  onResult,
  autoStart = false,
  stopAfterSeconds = 30,
  duration = 30, // Default duration
  className = ""
}) => {
  const [isRecording, setIsRecording] = useState(autoStart);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioData, setAudioData] = useState<Blob | null>(null);
  
  let mediaRecorder: MediaRecorder | null = null;
  let chunks: BlobPart[] = [];

  const startRecording = async () => {
    try {
      chunks = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data);
      });
      
      mediaRecorder.addEventListener("stop", async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioData(blob);
        processAudio(blob);
      });
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      
      // Stop all audio tracks
      if (mediaRecorder.stream) {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }
      
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // Simulating emotion detection API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result: EmotionResult = {
        id: `emo-${Date.now()}`,
        emotion: ['joy', 'neutral', 'calm', 'excitement'][Math.floor(Math.random() * 4)],
        score: Math.random() * 0.6 + 0.4,
        confidence: Math.random() * 0.5 + 0.5,
        timestamp: new Date().toISOString()
      };
      
      if (onResult) {
        onResult(result);
      }
    } catch (error) {
      console.error("Error processing audio:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (autoStart) {
      startRecording();
    }
    
    return () => {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
    };
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= stopAfterSeconds) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRecording, stopAfterSeconds]);

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="text-center">
        <h3 className="font-semibold text-lg">Analyse vocale en direct</h3>
        <p className="text-sm text-muted-foreground">
          Parlez naturellement et votre ton de voix sera analysé pour détecter vos émotions
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Voice Indicator */}
        <div className="flex justify-center my-4">
          <div className={`h-24 w-24 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'bg-red-100 dark:bg-red-900/30 animate-pulse' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
            {isProcessing ? (
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            ) : isRecording ? (
              <Mic className="h-10 w-10 text-red-500" />
            ) : (
              <MicOff className="h-10 w-10 text-blue-500" />
            )}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>{recordingTime} s</span>
            <span>{stopAfterSeconds} s</span>
          </div>
          <Progress value={(recordingTime / stopAfterSeconds) * 100} />
        </div>
        
        <div className="text-center text-sm">
          {isRecording ? (
            <p>Enregistrement en cours... {stopAfterSeconds - recordingTime}s restantes</p>
          ) : isProcessing ? (
            <p>Traitement de l'audio...</p>
          ) : (
            <p>Appuyez sur le bouton pour commencer l'analyse</p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="justify-center">
        <Button
          variant={isRecording ? "destructive" : "default"}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className="w-full"
        >
          {isRecording ? "Arrêter l'enregistrement" : "Commencer l'analyse"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LiveVoiceScanner;

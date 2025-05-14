
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, StopCircle, Loader2 } from 'lucide-react';
import { EmotionResult } from '@/types';

interface VoiceEmotionScannerProps {
  onEmotionDetected: (result: EmotionResult) => void;
  isSubmitting?: boolean;
  className?: string;
}

const VoiceEmotionScanner: React.FC<VoiceEmotionScannerProps> = ({ 
  onEmotionDetected, 
  isSubmitting = false,
  className = ''
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Clean up the stream tracks
        stream.getTracks().forEach(track => track.stop());
        
        if (recordingTime >= 3) { // Only process if recording is at least 3 seconds
          await processAudio(audioBlob);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer to track recording duration
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear the timer
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Create a URL for the audio blob
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Mock emotion analysis result for demo purposes
      // In a real app, you would send the audio to your backend for processing
      setTimeout(() => {
        const mockResult: EmotionResult = {
          emotion: "calm",
          confidence: 0.85,
          intensity: 65,
          transcript: "This is a simulated transcript of what was said during the recording.",
          audio_url: audioUrl // Include the audio URL in the result
        };
        
        setIsProcessing(false);
        onEmotionDetected(mockResult);
      }, 2000);
      
    } catch (error) {
      console.error("Error processing audio:", error);
      setIsProcessing(false);
      alert("Failed to process audio recording.");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Scan vocal</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pt-6 pb-8">
        <div 
          className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-all ${
            isRecording 
              ? 'bg-red-100 animate-pulse' 
              : isProcessing 
                ? 'bg-yellow-100' 
                : 'bg-primary/10'
          }`}
        >
          {isRecording ? (
            <StopCircle 
              className="h-12 w-12 text-red-500 cursor-pointer" 
              onClick={stopRecording}
            />
          ) : isProcessing ? (
            <Loader2 className="h-12 w-12 text-yellow-500 animate-spin" />
          ) : (
            <Mic 
              className="h-12 w-12 text-primary cursor-pointer" 
              onClick={startRecording}
            />
          )}
        </div>
        
        <div className="text-center">
          {isRecording ? (
            <div className="text-lg font-medium text-red-500">
              Enregistrement en cours... {formatTime(recordingTime)}
            </div>
          ) : isProcessing ? (
            <div className="text-lg font-medium text-yellow-500">
              Analyse en cours...
            </div>
          ) : (
            <div className="text-lg font-medium">
              Cliquez pour commencer l'enregistrement
            </div>
          )}
          
          <p className="text-sm text-muted-foreground mt-2">
            {isRecording 
              ? "Parlez clairement et décrivez comment vous vous sentez..."
              : isProcessing 
                ? "Analyse de votre voix et de vos émotions..."
                : "L'analyse vocale permet une détection plus précise de vos émotions"
            }
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        {isRecording ? (
          <Button 
            variant="destructive" 
            onClick={stopRecording}
            disabled={isSubmitting}
          >
            Arrêter l'enregistrement
          </Button>
        ) : !isProcessing && (
          <Button 
            variant="outline" 
            onClick={startRecording}
            disabled={isSubmitting || isProcessing}
          >
            Commencer l'enregistrement
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default VoiceEmotionScanner;

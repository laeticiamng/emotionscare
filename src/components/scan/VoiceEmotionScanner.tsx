
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Square, Loader2 } from 'lucide-react';
import { EmotionResult, VoiceEmotionScannerProps } from '@/types';
import { toast } from 'sonner';
import useHumeAI from '@/hooks/useHumeAI';

const VoiceEmotionScanner: React.FC<VoiceEmotionScannerProps> = ({
  onScanComplete
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { analyzeAudio } = useHumeAI();

  // Handle starting audio recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);

      toast.info('Enregistrement en cours...');
    } catch (err) {
      console.error('Error starting recording:', err);
      toast.error('Impossible d\'accéder au microphone. Veuillez vérifier les permissions.');
    }
  }, []);

  // Handle stopping audio recording
  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);
    setIsProcessing(true);

    setTimeout(async () => {
      if (audioChunksRef.current.length > 0) {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        try {
          // Generate a unique ID for this scan and use current date
          const result = await analyzeAudio(audioBlob);
          
          if (onScanComplete) {
            onScanComplete(result);
          }
        } catch (error) {
          console.error('Error analyzing audio:', error);
          toast.error('Une erreur est survenue lors de l\'analyse audio.');
        }
      } else {
        toast.error('Aucun audio enregistré. Veuillez réessayer.');
      }
      setIsProcessing(false);
      setRecordingTime(0);
    }, 1000);
  }, [onScanComplete, analyzeAudio]);

  // Format recording time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Analyse émotionnelle vocale</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center pb-4">
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold">
            {formatTime(recordingTime)}
          </div>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
            isRecording ? 'bg-red-100 animate-pulse' : 'bg-primary/10'
          }`}>
            {isProcessing ? (
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            ) : (
              <Mic className={`h-12 w-12 ${isRecording ? 'text-red-500' : 'text-primary'}`} />
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        {isRecording ? (
          <Button 
            variant="destructive" 
            onClick={stopRecording} 
            disabled={isProcessing}
            className="px-8"
          >
            <Square className="mr-2 h-4 w-4" />
            Arrêter
          </Button>
        ) : (
          <Button 
            onClick={startRecording} 
            disabled={isProcessing}
            className="px-8"
          >
            <Mic className="mr-2 h-4 w-4" />
            Commencer l'enregistrement
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default VoiceEmotionScanner;

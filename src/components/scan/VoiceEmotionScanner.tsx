
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, RotateCw } from 'lucide-react';
import { EmotionResult } from '@/types';
import { analyzeAudioStream } from '@/lib/scanService';
import { useToast } from '@/hooks/use-toast';

interface VoiceEmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  maxDuration?: number; // in seconds
}

const VoiceEmotionScanner: React.FC<VoiceEmotionScannerProps> = ({ 
  onScanComplete,
  maxDuration = 30 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = handleRecordingStop;
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start the timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= maxDuration) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);
      
      toast({
        title: "Enregistrement démarré",
        description: "Parlez clairement dans votre microphone",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Erreur de microphone",
        description: "Impossible d'accéder au microphone. Vérifiez vos permissions.",
        variant: "destructive"
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      // Clear the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setIsRecording(false);
    }
  };
  
  const handleRecordingStop = async () => {
    try {
      setIsProcessing(true);
      
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      // Analyze the audio
      const result = await analyzeAudioStream(audioBlob);
      setTranscript(result.transcript || null);
      
      // Complete with result
      onScanComplete({
        ...result,
        audio_url: url
      });
      
      toast({
        title: "Analyse terminée",
        description: `Émotion détectée : ${result.emotion}`,
      });
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Erreur d'analyse",
        description: "L'analyse audio a échoué. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const resetRecording = () => {
    setAudioUrl(null);
    setTranscript(null);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="flex flex-col items-center p-4">
      {!audioUrl ? (
        <>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Mic className={`h-8 w-8 ${isRecording ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
          </div>
          
          <p className="text-center mb-6">
            {isRecording 
              ? `Enregistrement en cours: ${formatTime(recordingTime)}`
              : "Appuyez sur le bouton pour commencer l'enregistrement"}
          </p>
          
          {isRecording ? (
            <Button 
              variant="destructive"
              size="lg"
              className="flex items-center"
              onClick={stopRecording}
            >
              <StopCircle className="mr-2 h-4 w-4" />
              Arrêter l'enregistrement
            </Button>
          ) : (
            <Button 
              variant="default"
              size="lg"
              className="flex items-center"
              onClick={startRecording}
              disabled={isProcessing}
            >
              <Mic className="mr-2 h-4 w-4" />
              Commencer à parler
            </Button>
          )}
        </>
      ) : (
        <>
          <div className="w-full max-w-md mb-6">
            <audio src={audioUrl} controls className="w-full mb-4" />
            
            {transcript && (
              <div className="bg-muted/30 p-4 rounded-md mb-4">
                <p className="text-sm font-medium mb-1">Transcription :</p>
                <p className="text-sm italic">{transcript}</p>
              </div>
            )}
            
            {isProcessing ? (
              <div className="flex justify-center">
                <RotateCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Button 
                variant="outline"
                onClick={resetRecording}
                className="w-full"
              >
                Refaire un enregistrement
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VoiceEmotionScanner;

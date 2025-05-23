
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types/emotion';
import { MicIcon, StopIcon, Loader2, PlayIcon, PauseIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AudioEmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onCancel?: () => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const AudioEmotionScanner: React.FC<AudioEmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  isProcessing,
  setIsProcessing
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const MAX_RECORDING_TIME = 30; // 30 seconds
  
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      setRecordingTime(0);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Stop tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= MAX_RECORDING_TIME - 1) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const handlePlayPause = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };
  
  const handleAnalyzeAudio = async () => {
    if (!audioUrl || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate API call to audio emotion detection service
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock emotion detection result
      const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'calm'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const intensity = Math.floor(Math.random() * 100);
      
      const result: EmotionResult = {
        emotion: randomEmotion,
        intensity: intensity,
        source: 'voice',
        audioUrl: audioUrl,
        score: intensity / 100,
        ai_feedback: `D'après votre voix, je détecte du ${randomEmotion} à un niveau ${intensity > 70 ? 'élevé' : intensity > 40 ? 'modéré' : 'faible'}.`,
        date: new Date().toISOString()
      };
      
      onScanComplete(result);
    } catch (error) {
      console.error('Error analyzing audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} onEnded={handleAudioEnded} className="hidden" />
      )}
      
      <div className="border rounded-md p-6 flex flex-col items-center justify-center">
        <div className="mb-4">
          {isRecording ? (
            <div 
              className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 border border-red-500 cursor-pointer"
              onClick={stopRecording}
            >
              <StopIcon className="h-8 w-8 text-red-500" />
            </div>
          ) : !audioUrl ? (
            <div 
              className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 border border-primary cursor-pointer"
              onClick={startRecording}
            >
              <MicIcon className="h-8 w-8 text-primary" />
            </div>
          ) : (
            <div 
              className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 border border-primary cursor-pointer"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <PauseIcon className="h-8 w-8 text-primary" />
              ) : (
                <PlayIcon className="h-8 w-8 text-primary" />
              )}
            </div>
          )}
        </div>
        
        <div className="w-full">
          <Progress
            value={(recordingTime / MAX_RECORDING_TIME) * 100}
            className="h-2"
          />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>{recordingTime}s</span>
            <span>{MAX_RECORDING_TIME}s</span>
          </div>
        </div>
        
        <p className="text-center mt-4 text-sm text-muted-foreground">
          {isRecording 
            ? 'Enregistrement en cours... Cliquez sur le bouton pour arrêter.'
            : !audioUrl 
              ? 'Cliquez sur le microphone pour commencer à enregistrer votre voix.'
              : 'Enregistrement terminé. Vous pouvez l\'écouter ou l\'analyser.'}
        </p>
      </div>
      
      <div className="flex justify-between">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={isProcessing}>
            Annuler
          </Button>
        )}
        
        <Button 
          onClick={handleAnalyzeAudio} 
          disabled={!audioUrl || isProcessing || isRecording}
          className="ml-auto"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            'Analyser ma voix'
          )}
        </Button>
      </div>
    </div>
  );
};

export default AudioEmotionScanner;

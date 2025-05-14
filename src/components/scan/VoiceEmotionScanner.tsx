
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, RefreshCw, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { EmotionResult } from '@/types/emotion';

interface VoiceEmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
}

const VoiceEmotionScanner: React.FC<VoiceEmotionScannerProps> = ({ onScanComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const MAX_RECORDING_TIME = 30; // Maximum recording time in seconds
  
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        
        // Stop all tracks of the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      setScanCompleted(false);
      
      // Start timer to update recording time
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          const newValue = prev + 1;
          if (newValue >= MAX_RECORDING_TIME) {
            stopRecording();
          }
          return newValue;
        });
      }, 1000);
      
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRecording(false);
  };
  
  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingSeconds(0);
    setScanCompleted(false);
  };
  
  const analyzeAudio = () => {
    if (!audioBlob) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call to analyze audio
    setTimeout(() => {
      // Mock result data
      const result: EmotionResult = {
        id: 'voice-scan-' + Date.now(),
        emotion: 'calm',
        score: 72,
        confidence: 0.85,
        timestamp: new Date().toISOString(),
        audio_url: audioUrl || undefined
      };
      
      setIsAnalyzing(false);
      setScanCompleted(true);
      onScanComplete(result);
    }, 2000);
  };
  
  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <p className="text-sm text-muted-foreground">
          Parlez pendant 10-30 secondes pour une analyse précise
        </p>
      </div>
      
      {isRecording && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Enregistrement en cours...</span>
            <span>{recordingSeconds}s / {MAX_RECORDING_TIME}s</span>
          </div>
          <Progress value={(recordingSeconds / MAX_RECORDING_TIME) * 100} className="h-2" />
        </div>
      )}
      
      {audioUrl && (
        <div className="rounded-lg overflow-hidden bg-muted/30 p-4">
          <audio ref={audioRef} src={audioUrl} controls className="w-full" />
        </div>
      )}
      
      <div className="flex justify-center gap-2">
        {!isRecording && !audioUrl && (
          <Button onClick={startRecording} className="w-full">
            <Mic className="mr-2 h-4 w-4" />
            Commencer l'enregistrement
          </Button>
        )}
        
        {isRecording && (
          <Button variant="destructive" onClick={stopRecording} className="w-full">
            <MicOff className="mr-2 h-4 w-4" />
            Arrêter l'enregistrement
          </Button>
        )}
        
        {audioUrl && !scanCompleted && (
          <>
            <Button variant="outline" onClick={resetRecording} disabled={isAnalyzing}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Nouvel enregistrement
            </Button>
            
            <Button onClick={analyzeAudio} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyse...
                </>
              ) : (
                <>
                  Analyser
                </>
              )}
            </Button>
          </>
        )}
        
        {scanCompleted && (
          <Card className="w-full">
            <CardContent className="p-4 flex items-center justify-center text-green-500">
              <CheckCircle className="mr-2 h-5 w-5" />
              <span>Analyse vocale complétée</span>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VoiceEmotionScanner;

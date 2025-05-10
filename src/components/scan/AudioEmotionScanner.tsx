
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, StopCircle } from 'lucide-react';
import { EmotionResult } from '@/types';

interface AudioEmotionScannerProps {
  onScan: (audioUrl: string) => Promise<EmotionResult>;
}

const AudioEmotionScanner: React.FC<AudioEmotionScannerProps> = ({ onScan }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  
  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);
  
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
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Stop all audio tracks
        stream.getAudioTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
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
  
  const handleScan = async () => {
    if (!audioUrl) return;
    
    try {
      setIsScanning(true);
      await onScan(audioUrl);
    } catch (error) {
      console.error("Error analyzing audio:", error);
    } finally {
      setIsScanning(false);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg">
            {isRecording ? (
              <>
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                    <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
                    <StopCircle className="w-10 h-10 text-red-500" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{formatTime(recordingDuration)}</p>
                  <p className="text-sm text-muted-foreground mt-1">Enregistrement en cours...</p>
                </div>
                <Button 
                  variant="destructive" 
                  className="mt-4" 
                  onClick={stopRecording}
                >
                  Arrêter l'enregistrement
                </Button>
              </>
            ) : (
              <>
                {audioUrl ? (
                  <div className="w-full space-y-4">
                    <audio src={audioUrl} controls className="w-full" />
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setAudioUrl(null)}>
                        Supprimer
                      </Button>
                      <Button 
                        onClick={handleScan}
                        disabled={isScanning}
                      >
                        {isScanning ? 'Analyse en cours...' : 'Analyser'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-20 h-20 rounded-full"
                        onClick={startRecording}
                      >
                        <Mic className="w-10 h-10 text-primary" />
                      </Button>
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                      Appuyez pour enregistrer votre voix
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioEmotionScanner;

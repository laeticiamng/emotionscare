
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Square, AlertCircle } from 'lucide-react';
import { EmotionResult } from '@/types';
import { toast } from 'sonner';

interface VoiceEmotionAnalyzerProps {
  onResult?: (result: EmotionResult) => void;
  onError?: (error: string) => void;
  maxDuration?: number; // in seconds
  autoStart?: boolean;
}

const VoiceEmotionAnalyzer: React.FC<VoiceEmotionAnalyzerProps> = ({
  onResult,
  onError,
  maxDuration = 30,
  autoStart = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setError(null);
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => {
          // Auto-stop if max duration reached
          if (prevTime >= maxDuration - 1) {
            stopRecording();
            return maxDuration;
          }
          return prevTime + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      const errorMessage = 'Impossible d\'accéder au microphone. Veuillez vérifier les permissions.';
      setError(errorMessage);
      if (onError) onError(errorMessage);
      toast.error(errorMessage);
    }
  };
  
  // Stop recording and process audio
  const stopRecording = () => {
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
    
    setTimeout(() => {
      processAudio();
    }, 500);
  };
  
  // Process recorded audio
  const processAudio = () => {
    if (audioChunksRef.current.length === 0) {
      const errorMessage = 'Aucun audio enregistré. Veuillez réessayer.';
      setError(errorMessage);
      if (onError) onError(errorMessage);
      toast.error(errorMessage);
      setIsProcessing(false);
      return;
    }
    
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    
    // In a real app, you would send this to your API
    // For demo purposes, we'll simulate the analysis with a timeout
    setTimeout(() => {
      const mockResult: EmotionResult = {
        id: `voice-${Date.now()}`,
        emotion: 'calm',
        score: 75,
        confidence: 0.87,
        text: 'Transcription would appear here...',
        timestamp: new Date().toISOString(),
        date: new Date().toISOString() // Add the required date property
      };
      
      if (onResult) onResult(mockResult);
      setIsProcessing(false);
      setRecordingTime(0);
    }, 1500);
  };
  
  // Auto-start if enabled
  useEffect(() => {
    if (autoStart) {
      startRecording();
    }
    
    return () => {
      // Cleanup on unmount
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Analyse Vocale</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center pb-6">
        {error ? (
          <div className="text-center text-red-500 mb-4">
            <AlertCircle className="h-12 w-12 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold mb-4">
              {formatTime(recordingTime)}
            </div>
            <div 
              className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
                isRecording ? 'bg-red-100 animate-pulse' : 'bg-slate-100 dark:bg-slate-800'
              }`}
            >
              <Mic className={`h-12 w-12 ${isRecording ? 'text-red-500' : ''}`} />
            </div>
            
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
                variant="default" 
                onClick={startRecording}
                disabled={isProcessing}
                className="px-8"
              >
                <Mic className="mr-2 h-4 w-4" />
                {isProcessing ? 'Traitement en cours...' : 'Commencer l\'enregistrement'}
              </Button>
            )}
            
            {isRecording && (
              <p className="text-sm text-muted-foreground mt-2">
                Parlez naturellement. Enregistrement automatique jusqu'à {maxDuration} secondes.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceEmotionAnalyzer;

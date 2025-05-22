
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types/emotion';
import { Mic, MicOff, CirclePause } from 'lucide-react';
import { emotions } from '@/types/emotion';
import { Progress } from '@/components/ui/progress';

interface LiveVoiceScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onCancel?: () => void;
  autoStart?: boolean;
  duration?: number; // in seconds
}

const LiveVoiceScanner: React.FC<LiveVoiceScannerProps> = ({
  onScanComplete,
  onCancel,
  autoStart = false,
  duration = 20 // Default to 20 seconds
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
  useEffect(() => {
    // Check microphone permissions
    navigator.permissions?.query({ name: 'microphone' as PermissionName })
      .then(result => {
        setPermission(result.state as 'granted' | 'denied' | 'prompt');
        
        if (result.state === 'granted' && autoStart) {
          startRecording();
        }
      })
      .catch(err => {
        console.log('Permissions API not supported', err);
      });
      
    return () => {
      // Clean up on unmount
      stopRecording();
    };
  }, [autoStart]);
  
  // Timer effect for recording duration
  useEffect(() => {
    let timer: number;
    
    if (isRecording) {
      timer = window.setInterval(() => {
        setElapsedTime(prevTime => {
          const newTime = prevTime + 1;
          
          // Auto-stop if we hit the duration limit
          if (newTime >= duration) {
            stopRecordingAndAnalyze();
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording, duration]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      const audioChunks: BlobPart[] = [];
      
      recorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
      });
      
      recorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
      });
      
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setElapsedTime(0);
      setPermission('granted');
    } catch (error) {
      console.error('Error starting recording:', error);
      setPermission('denied');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    setMediaRecorder(null);
    setIsRecording(false);
  };
  
  const stopRecordingAndAnalyze = () => {
    stopRecording();
    analyzeVoice();
  };
  
  const analyzeVoice = async () => {
    setIsProcessing(true);
    
    try {
      // In a real app, we would send audio to an analysis service
      // For demo, we'll simulate processing and return a random emotion
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const randomIndex = Math.floor(Math.random() * emotions.length);
      const secondaryIndex = (randomIndex + 2) % emotions.length;
      
      const emotionResult: EmotionResult = {
        primaryEmotion: emotions[randomIndex].name,
        secondaryEmotion: emotions[secondaryIndex].name,
        intensity: (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5,
        source: 'voice',
        timestamp: new Date().toISOString()
      };
      
      if (onScanComplete) {
        onScanComplete(emotionResult);
      }
    } catch (error) {
      console.error('Error analyzing voice:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleRequestPermission = () => {
    startRecording();
  };
  
  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-muted-foreground mb-2">
          Analysez votre voix pour détecter votre état émotionnel
        </p>
      </div>
      
      <div className="bg-accent/50 p-6 rounded-lg text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          {isRecording ? (
            <>
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center animate-pulse">
                  <Mic className="h-10 w-10 text-red-500" />
                </div>
              </div>
              <p className="font-medium">Enregistrement en cours...</p>
              <div className="w-full">
                <p className="text-sm mb-2">
                  {elapsedTime} / {duration} secondes
                </p>
                <Progress value={(elapsedTime / duration) * 100} className="h-2" />
              </div>
              
              <Button
                variant="outline"
                onClick={stopRecordingAndAnalyze}
                className="mt-4"
              >
                <CirclePause className="mr-2 h-4 w-4" />
                Arrêter et analyser
              </Button>
            </>
          ) : isProcessing ? (
            <div className="py-8">
              <p className="font-medium">Analyse en cours...</p>
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {permission === 'denied' ? (
                  <MicOff className="h-10 w-10 text-gray-400" />
                ) : (
                  <Mic className="h-10 w-10 text-gray-400" />
                )}
              </div>
              
              <p className="font-medium">
                {permission === 'denied'
                  ? "L'accès au microphone a été refusé"
                  : "Prêt à enregistrer votre voix"}
              </p>
              
              <Button
                onClick={handleRequestPermission}
                disabled={permission === 'denied' || isProcessing}
              >
                <Mic className="mr-2 h-4 w-4" />
                Commencer l'enregistrement
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="flex justify-between gap-4">
        <Button 
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Annuler
        </Button>
        
        {(audioBlob && !isProcessing && !isRecording) && (
          <Button 
            onClick={analyzeVoice}
            className="flex-1"
          >
            Analyser
          </Button>
        )}
      </div>
    </div>
  );
};

export default LiveVoiceScanner;

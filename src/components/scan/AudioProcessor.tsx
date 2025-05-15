
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Square, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { EmotionResult } from '@/types';

// Mock emotion analysis function (would be replaced with actual API call)
const analyzeAudio = async (audioBlob: Blob): Promise<EmotionResult> => {
  // Simulate API processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return a mock result
  return {
    id: 'analysis-' + Date.now(),
    user_id: 'user-123',
    emotion: ['joy', 'calm', 'anxious', 'sad'][Math.floor(Math.random() * 4)],
    score: Math.random() * 0.5 + 0.5,
    confidence: Math.random() * 0.3 + 0.7,
    intensity: Math.random() * 0.8 + 0.2,
    text: '',
    transcript: 'Transcription of the audio would appear here.',
    timestamp: new Date().toISOString(),
    recommendations: [
      'Take a 5-minute breathing exercise',
      'Listen to calming music',
      'Write in your journal about your day'
    ],
    ai_feedback: "You sound quite positive today, with good emotional balance. Keep up the great energy!"
  };
};

interface AudioProcessorProps {
  onResult?: (result: EmotionResult) => void;
  autoStart?: boolean;
  duration?: number; // Recording duration in seconds
  headerText?: string;
  subHeaderText?: string;
}

const AudioProcessor: React.FC<AudioProcessorProps> = ({
  onResult,
  autoStart = false,
  duration = 10,
  headerText = "Comment vous sentez-vous aujourd'hui?",
  subHeaderText = "Enregistrez votre voix pour l'analyser"
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (autoStart) {
      startRecording();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [autoStart]);
  
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      setRecordingTime(0);
      setRecordingComplete(false);
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        setIsProcessing(true);
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        try {
          const result = await analyzeAudio(audioBlob);
          
          if (onResult) {
            // Make sure the user_id property exists (required by EmotionResult interface)
            const completeResult: EmotionResult = {
              ...result,
              user_id: result.user_id || 'user-123', // Ensure user_id exists
              confidence: result.confidence || 0.8,
              transcript: result.transcript || '',
              audio_url: URL.createObjectURL(audioBlob)
            };
            
            onResult(completeResult);
          }
          
          // Record that the recording is complete and processing is done
          setRecordingComplete(true);
          setIsProcessing(false);
        } catch (error) {
          console.error('Error analyzing audio:', error);
          setError('Error analyzing audio. Please try again.');
          setIsProcessing(false);
        }
        
        // Close all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Set up a timer to track recording duration
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= duration) {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              mediaRecorderRef.current.stop();
            }
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
          }
          return newTime;
        });
      }, 1000);
      
      // Auto-stop after specified duration
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, duration * 1000);
      
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Microphone access denied. Please check your browser permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
  
  const resetRecording = () => {
    setRecordingComplete(false);
    setRecordingTime(0);
    setError(null);
    audioChunksRef.current = [];
  };
  
  return (
    <Card>
      <CardContent className="p-4 flex flex-col items-center">
        <h3 className="text-lg font-medium mb-2">{headerText}</h3>
        <p className="text-sm text-muted-foreground mb-6">{subHeaderText}</p>
        
        <div className="w-full mb-4">
          <Progress 
            value={(recordingTime / duration) * 100} 
            className="h-2"
          />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>0s</span>
            <span>{recordingTime}s</span>
            <span>{duration}s</span>
          </div>
        </div>
        
        {error && (
          <div className="text-red-500 mb-4 text-center text-sm">
            {error}
          </div>
        )}
        
        <div className="flex gap-4 justify-center mt-2">
          {!isRecording && !isProcessing && !recordingComplete && (
            <Button 
              variant="default" 
              size="lg"
              className="w-40"
              onClick={startRecording}
            >
              <Mic className="mr-2 h-4 w-4" />
              Démarrer
            </Button>
          )}
          
          {isRecording && (
            <Button 
              variant="destructive" 
              size="lg"
              className="w-40"
              onClick={stopRecording}
            >
              <Square className="mr-2 h-4 w-4" />
              Arrêter
            </Button>
          )}
          
          {isProcessing && (
            <Button 
              variant="outline" 
              size="lg"
              className="w-40"
              disabled
            >
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Analyse...
            </Button>
          )}
          
          {recordingComplete && (
            <Button 
              variant="outline" 
              size="lg"
              className="w-40"
              onClick={resetRecording}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioProcessor;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2 } from 'lucide-react';
import { EmotionResult } from '@/types/emotion';

export interface VoiceEmotionAnalyzerProps {
  onEmotionDetected: (result: EmotionResult) => void;
}

const VoiceEmotionAnalyzer: React.FC<VoiceEmotionAnalyzerProps> = ({ 
  onEmotionDetected 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  
  let recordingInterval: ReturnType<typeof setInterval>;
  
  const startRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    
    // Start a timer to track recording duration
    recordingInterval = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);
    
    // In a real implementation, you would use the MediaRecorder API here
    console.log('Voice recording started');
  };
  
  const stopRecording = async () => {
    setIsRecording(false);
    clearInterval(recordingInterval);
    setIsAnalyzing(true);
    
    // In a real implementation, you would stop the MediaRecorder and analyze the audio
    console.log('Voice recording stopped, analyzing...');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock emotion result
    const mockResult: EmotionResult = {
      emotion: 'calm',
      score: 0.85,
      confidence: 0.78,
      transcript: "J'ai passé une journée agréable aujourd'hui, je me sens plutôt bien.",
      primaryEmotion: {
        name: 'calm',
        intensity: 0.85
      }
    };
    
    onEmotionDetected(mockResult);
    setIsAnalyzing(false);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center py-4">
        {isRecording && (
          <div className="text-xl font-mono mb-4">
            {formatTime(recordingSeconds)}
          </div>
        )}
        
        <div className="flex justify-center">
          {!isRecording && !isAnalyzing ? (
            <Button 
              onClick={startRecording}
              size="lg"
              className="rounded-full h-16 w-16 flex items-center justify-center"
            >
              <Mic className="h-8 w-8" />
            </Button>
          ) : isRecording ? (
            <Button 
              onClick={stopRecording}
              variant="destructive"
              size="lg"
              className="rounded-full h-16 w-16 flex items-center justify-center"
            >
              <Square className="h-6 w-6" />
            </Button>
          ) : (
            <Button 
              disabled
              size="lg"
              className="rounded-full h-16 w-16 flex items-center justify-center"
            >
              <Loader2 className="h-8 w-8 animate-spin" />
            </Button>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mt-4">
          {isRecording 
            ? "Parlez de votre journée ou de comment vous vous sentez..." 
            : isAnalyzing 
              ? "Analyse de votre voix en cours..." 
              : "Appuyez pour commencer l'enregistrement"}
        </p>
      </div>
    </div>
  );
};

export default VoiceEmotionAnalyzer;

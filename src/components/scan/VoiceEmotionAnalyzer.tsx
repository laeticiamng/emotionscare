
import React, { useState } from 'react';
import { EmotionResult, EmotionRecommendation } from '@/types/emotion';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface VoiceEmotionAnalyzerProps {
  onResult: (result: EmotionResult) => void;
  onStartRecording?: () => void;
}

const VoiceEmotionAnalyzer: React.FC<VoiceEmotionAnalyzerProps> = ({ 
  onResult,
  onStartRecording 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const maxRecordingTime = 15;
  
  const startRecording = () => {
    setIsRecording(true);
    setProgress(0);
    setRecordingTime(0);
    
    if (onStartRecording) {
      onStartRecording();
    }
    
    // Simulate recording progress
    const interval = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= maxRecordingTime) {
          clearInterval(interval);
          stopRecording();
          return maxRecordingTime;
        }
        setProgress((prev + 1) / maxRecordingTime * 100);
        return prev + 1;
      });
    }, 1000);
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      
      // Create mock recommendations
      const recommendations: EmotionRecommendation[] = [
        { 
          type: "music", 
          title: "Calm playlist", 
          description: "Soothing music to relax",
          content: "Check out our curated relaxation playlist",
          category: "music"
        },
        { 
          type: "exercise", 
          title: "Quick stretch", 
          description: "Light exercise to release tension",
          content: "Try these simple desk stretches",
          category: "exercise"
        },
        { 
          type: "meditation", 
          title: "5-minute meditation", 
          description: "Brief mindfulness break",
          content: "Focus on your breath for 5 minutes",
          category: "mindfulness"
        }
      ];
      
      onResult({
        id: `voice-analysis-${Date.now()}`,
        emotion: 'calm',
        confidence: 0.85,
        intensity: 0.7,
        recommendations: recommendations,
        timestamp: new Date().toISOString(),
        emojis: ['😌', '🧘'],
        emotions: {} // Add empty emotions object to satisfy type
      });
    }, 2000);
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
      <Button
        onClick={startRecording}
        disabled={isRecording}
        className="p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {isRecording ? (
          <StopCircle className="h-8 w-8 animate-spin" />
        ) : (
          <Mic className="h-8 w-8" />
        )}
      </Button>
      <p className="mt-4 text-center text-sm">
        {isRecording
          ? "Enregistrement en cours... Veuillez parler naturellement."
          : isProcessing
          ? "Traitement de votre voix..."
          : "Cliquez pour enregistrer votre voix"}
      </p>
      {isRecording && (
        <Progress value={progress} max={100} className="mt-4" />
      )}
    </div>
  );
};

export default VoiceEmotionAnalyzer;

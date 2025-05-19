
import React, { useState } from 'react';
import { EmotionResult, EmotionRecommendation } from '@/types/emotion';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export interface VoiceEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
}

const VoiceEmotionScanner: React.FC<VoiceEmotionScannerProps> = ({ 
  onResult, 
  onProcessingChange,
  isProcessing: externalIsProcessing,
  setIsProcessing: externalSetIsProcessing 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [localIsProcessing, setLocalIsProcessing] = useState(false);
  
  const isProcessing = externalIsProcessing !== undefined ? externalIsProcessing : localIsProcessing;
  const setIsProcessing = externalSetIsProcessing || ((value) => {
    setLocalIsProcessing(value);
    if (onProcessingChange) {
      onProcessingChange(value);
    }
  });

  const startRecording = () => {
    setIsRecording(true);
    setProgress(0);
    
    // Simulate recording progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          stopRecording();
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      
      // Create mock recommendations that are proper EmotionRecommendation objects
      const recommendations: EmotionRecommendation[] = [
        { 
          type: "music", 
          title: "Calm playlist", 
          description: "Soothing music to relax",
          content: "Check out our curated relaxation playlist" 
        },
        { 
          type: "exercise", 
          title: "Quick stretch", 
          description: "Light exercise to release tension",
          content: "Try these simple desk stretches" 
        },
        { 
          type: "meditation", 
          title: "5-minute meditation", 
          description: "Brief mindfulness break",
          content: "Focus on your breath for 5 minutes" 
        }
      ];
      
      if (onResult) {
        onResult({
          id: `voice-analysis-${Date.now()}`,
          emotion: 'calm',
          confidence: 0.85,
          intensity: 0.7,
          recommendations,
          timestamp: new Date().toISOString(),
          emojis: ['😌', '🧘'],
          text: "Analyzing your voice detected calm emotional patterns"
        });
      }
    }, 2000);
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
      <Button
        onClick={startRecording}
        disabled={isRecording || isProcessing}
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

export default VoiceEmotionScanner;

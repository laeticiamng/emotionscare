
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Loader2, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { EmotionResult } from '@/types/emotion';

interface VoiceEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  onComplete?: (result: EmotionResult) => void;
}

const VoiceEmotionScanner: React.FC<VoiceEmotionScannerProps> = ({ onResult, onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      
      setIsRecording(true);
      
      toast({
        title: "Enregistrement démarré",
        description: "Parlez de comment vous vous sentez aujourd'hui...",
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Erreur d'accès au microphone",
        description: "Veuillez autoriser l'accès à votre microphone pour utiliser cette fonctionnalité.",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      setIsRecording(false);
      setIsAnalyzing(true);
      
      // Mock analysis delay
      setTimeout(analyzeVoice, 1500);
    }
  };

  const analyzeVoice = () => {
    // Mock result
    const mockResult: EmotionResult = {
      id: uuidv4(),
      emotion: "calm",
      confidence: 0.82,
      intensity: 0.65,
      emojis: ["😌"],
      text: "Je me sens plutôt bien aujourd'hui, même si j'ai eu quelques moments de stress ce matin.",
      feedback: "Votre voix indique un état de calme relatif avec une légère tension sous-jacente.",
      timestamp: new Date().toISOString(),
      source: "voice",
      score: 0.78
    };
    
    setIsAnalyzing(false);
    
    if (onResult) {
      onResult(mockResult);
    }
    
    if (onComplete) {
      onComplete(mockResult);
    }
    
    toast({
      title: "Analyse terminée",
      description: `Émotion détectée : ${mockResult.emotion}`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center border border-dashed border-border rounded-lg p-8 bg-muted/30">
        {isRecording ? (
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 bg-red-500 rounded-full opacity-75 animate-ping"></div>
            <div className="relative flex items-center justify-center w-16 h-16 bg-red-500 rounded-full">
              <Mic className="h-8 w-8 text-white" />
            </div>
          </div>
        ) : (
          <Mic className="h-12 w-12 text-muted-foreground mb-4" />
        )}
        
        <p className="text-center text-muted-foreground">
          {isRecording 
            ? "Enregistrement en cours... Parlez naturellement de votre journée et de vos sentiments." 
            : isAnalyzing
              ? "Analyse de votre voix en cours..."
              : "Enregistrez votre voix pour analyser votre état émotionnel"}
        </p>
      </div>
      
      {isRecording ? (
        <Button 
          onClick={handleStopRecording} 
          variant="destructive" 
          className="w-full"
          size="lg"
        >
          <Square className="mr-2 h-4 w-4" />
          Arrêter l'enregistrement
        </Button>
      ) : (
        <Button 
          onClick={handleStartRecording} 
          disabled={isAnalyzing} 
          className="w-full"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              Commencer l'enregistrement
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default VoiceEmotionScanner;


import React, { useState, useEffect } from 'react';
import { Mic, Loader } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { EmotionResult } from '@/types/emotion';

interface VoiceEmotionAnalyzerProps {
  userId: string;
  onResult?: (result: EmotionResult) => void;
}

const VoiceEmotionAnalyzer: React.FC<VoiceEmotionAnalyzerProps> = ({ userId, onResult }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const startAnalysis = () => {
    setIsAnalyzing(true);
    setIsListening(true);
    
    // Simuler une analyse après 2 secondes
    setTimeout(() => {
      const analyzeResult = analyzeVoice();
      setIsAnalyzing(false);
      setIsListening(false);
      
      if (onResult) {
        onResult(analyzeResult);
      }
    }, 2000);
  };
  
  const analyzeVoice = (): EmotionResult => {
    // Simuler un résultat d'analyse
    return {
      id: uuidv4(),
      userId: userId,
      emotion: "calm",
      score: 0.75,
      confidence: 0.82,
      intensity: 0.65,
      timestamp: new Date().toISOString(),
      recommendations: ["Musique relaxante", "Exercices de respiration", "Pause méditative"],
      ai_feedback: "Votre voix indique un état de calme qui pourrait être renforcé par des exercices de pleine conscience.",
      emojis: ["😌", "🧘‍♀️"]
    };
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
      <button
        onClick={startAnalysis}
        disabled={isAnalyzing}
        className="p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {isAnalyzing ? (
          <Loader className="h-8 w-8 animate-spin" />
        ) : (
          <Mic className="h-8 w-8" />
        )}
      </button>
      <p className="mt-4 text-center text-sm">
        {isListening
          ? "Écoute en cours... Veuillez parler naturellement."
          : isAnalyzing
          ? "Analyse de votre voix..."
          : "Cliquez pour analyser votre voix"}
      </p>
    </div>
  );
};

export default VoiceEmotionAnalyzer;

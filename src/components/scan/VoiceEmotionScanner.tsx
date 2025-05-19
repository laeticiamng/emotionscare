
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';
import { EmotionResult } from '@/types/emotion';
import { v4 as uuidv4 } from 'uuid';

// Définir les props explicitement pour inclure onProcessingChange
interface VoiceEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  onProcessingChange?: (processing: boolean) => void;
}

const VoiceEmotionScanner: React.FC<VoiceEmotionScannerProps> = ({ 
  onResult,
  onProcessingChange 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const startRecording = () => {
    setIsRecording(true);
    setProgress(0);
    setRecordingDuration(0);
    
    // Notifier le parent que le traitement commence
    if (onProcessingChange) {
      onProcessingChange(true);
    }
    
    // Simuler l'analyse vocale
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            completeAnalysis();
          }, 500);
          return 100;
        }
        return newProgress;
      });
      
      setRecordingDuration(prev => prev + 0.5);
    }, 500);
    
    return () => clearInterval(interval);
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    // Ici, vous arrêteriez normalement l'enregistrement audio réel
  };
  
  const completeAnalysis = () => {
    setIsRecording(false);
    
    // Simuler un résultat d'analyse émotionnelle
    const mockResult: EmotionResult = {
      emotion: ['joie', 'calme', 'inquiétude', 'excitation', 'fatigue'][Math.floor(Math.random() * 5)],
      confidence: 0.85,
      timestamp: new Date().toISOString(),
      recommendations: [
        {
          id: uuidv4(),
          type: 'breathing',
          title: 'Exercice de respiration',
          description: 'Un simple exercice de respiration pour vous recentrer',
          emotion: 'calm',
          content: 'Inspirez lentement pendant 4 secondes, retenez votre souffle pendant 2 secondes, puis expirez pendant 6 secondes.',
          category: 'mindfulness'
        },
        {
          id: uuidv4(),
          type: 'music',
          title: 'Playlist recommandée',
          description: 'Une playlist adaptée à votre humeur actuelle',
          emotion: 'calm',
          content: 'Écoutez notre sélection musicale pour vous aider à gérer vos émotions.',
          category: 'music'
        }
      ]
    };
    
    // Notifier le parent que le traitement est terminé
    if (onProcessingChange) {
      onProcessingChange(false);
    }
    
    onResult(mockResult);
  };
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium">Analyse émotionnelle vocale</h3>
        <p className="text-sm text-muted-foreground">
          {isRecording 
            ? 'Parlez de ce que vous ressentez...' 
            : 'Appuyez sur le bouton pour démarrer l\'enregistrement'}
        </p>
      </div>
      
      {isRecording && (
        <div className="w-full bg-secondary rounded-full h-2.5 mb-4">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
          <p className="text-xs text-muted-foreground mt-1 text-center">
            {recordingDuration.toFixed(1)}s
          </p>
        </div>
      )}
      
      <div className="flex justify-center">
        {!isRecording ? (
          <Button 
            onClick={startRecording}
            size="lg"
            className="rounded-full h-16 w-16 bg-primary hover:bg-primary/90"
          >
            <Mic className="h-6 w-6" />
            <span className="sr-only">Démarrer l'enregistrement</span>
          </Button>
        ) : (
          <Button 
            onClick={stopRecording}
            size="lg"
            variant="destructive"
            className="rounded-full h-16 w-16"
          >
            <Square className="h-6 w-6" />
            <span className="sr-only">Arrêter l'enregistrement</span>
          </Button>
        )}
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          {isRecording 
            ? 'Cliquez sur le bouton d\'arrêt quand vous avez terminé' 
            : 'L\'analyse vocale ne stocke pas votre enregistrement'}
        </p>
      </div>
    </div>
  );
};

export default VoiceEmotionScanner;

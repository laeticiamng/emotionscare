
import React, { useState } from 'react';
import { EmotionResult } from '@/types/emotion';
import VoiceEmotionAnalyzer from './VoiceEmotionAnalyzer';

interface VoiceEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
}

const VoiceEmotionScanner: React.FC<VoiceEmotionScannerProps> = ({ 
  onResult, 
  onProcessingChange 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Handler for when we get a result
  const handleResult = (result: EmotionResult) => {
    if (onProcessingChange) {
      onProcessingChange(false);
    }
    setIsProcessing(false);
    onResult(result);
  };

  // When the user starts recording
  const handleStartRecording = () => {
    if (onProcessingChange) {
      onProcessingChange(true);
    }
    setIsProcessing(true);
  };

  return (
    <div className="space-y-4">
      <VoiceEmotionAnalyzer 
        onResult={handleResult}
        onStartRecording={handleStartRecording}
      />
      
      {isProcessing && (
        <div className="text-center text-sm text-muted-foreground">
          Analyse de votre voix en cours...
        </div>
      )}
    </div>
  );
};

export default VoiceEmotionScanner;

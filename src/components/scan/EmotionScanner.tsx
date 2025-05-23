
import React from 'react';
import EmotionScanForm from './EmotionScanForm';
import { EmotionResult } from '@/types/emotion';

interface EmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onClose: () => void;
}

const EmotionScanner: React.FC<EmotionScannerProps> = ({ onScanComplete, onClose }) => {
  return (
    <EmotionScanForm 
      onComplete={onScanComplete} 
      onClose={onClose}
    />
  );
};

export default EmotionScanner;

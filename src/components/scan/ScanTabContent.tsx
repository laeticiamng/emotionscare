
import React from 'react';
import { EmotionResult } from '@/types/emotion'; 
import EmotionScanForm from './EmotionScanForm';

const ScanTabContent: React.FC<{ 
  onClose: () => void; 
  userId: string;
}> = ({ onClose, userId }) => {
  const onEmotionDetected = () => {
    // Handle emotion detection
    // This will be used by EmotionScanForm
  };

  return (
    <div className="space-y-4">
      <EmotionScanForm 
        onScanComplete={(result) => {
          // Handle scan result
          if (onEmotionDetected) {
            onEmotionDetected(); 
          }
          if (onClose) {
            onClose();
          }
        }}
        userId={userId}
        onEmotionDetected={onEmotionDetected}
        onClose={onClose}
      />
    </div>
  );
};

export default ScanTabContent;

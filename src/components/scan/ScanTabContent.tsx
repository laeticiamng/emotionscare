
import React from 'react';
import { EmotionScanFormProps } from '@/types/emotion'; 
import EmotionScanForm from './EmotionScanForm';

// Update the component props to match EmotionScanFormProps
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
          onEmotionDetected(); 
          onClose();
        }} 
        onClose={onClose}
        userId={userId}
        onEmotionDetected={onEmotionDetected}
      />
    </div>
  );
};

export default ScanTabContent;

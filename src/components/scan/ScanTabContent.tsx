
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import EmotionScanForm from './EmotionScanForm';

interface ScanTabContentProps {
  onScanComplete?: () => void;
}

const ScanTabContent: React.FC<ScanTabContentProps> = ({ onScanComplete }) => {
  const { user } = useAuth();
  
  const handleEmotionDetected = () => {
    if (onScanComplete) {
      onScanComplete();
    }
  };
  
  const handleClose = () => {
    if (onScanComplete) {
      onScanComplete();
    }
  };
  
  return (
    <div className="space-y-6">
      <EmotionScanForm 
        onEmotionDetected={handleEmotionDetected}
        onClose={handleClose}
        userId={user?.id}
      />
    </div>
  );
};

export default ScanTabContent;

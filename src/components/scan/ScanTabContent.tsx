
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import EmotionScanner from './EmotionScanner';
import { EmotionResult } from '@/types/emotion';
import EmotionScanForm from './EmotionScanForm';

interface ScanTabContentProps {
  onEmotionDetected?: () => void;
  onClose?: () => void;
}

const ScanTabContent: React.FC<ScanTabContentProps> = ({
  onEmotionDetected,
  onClose
}) => {
  const [showScanner, setShowScanner] = useState(false);
  const [emotion, setEmotion] = useState<EmotionResult | null>(null);
  
  const handleStartScan = () => {
    setShowScanner(true);
  };
  
  const handleScanComplete = (result: EmotionResult) => {
    setEmotion(result);
    setShowScanner(false);
    
    if (onEmotionDetected) {
      onEmotionDetected();
    }
  };
  
  const handleScanCancel = () => {
    setShowScanner(false);
  };
  
  return (
    <Card className="rounded-lg p-6">
      {showScanner ? (
        <EmotionScanner 
          onScanComplete={handleScanComplete}
          onCancel={handleScanCancel}
        />
      ) : (
        <EmotionScanForm 
          onScanComplete={handleScanComplete}
          onEmotionDetected={onEmotionDetected}
          onClose={onClose}
        />
      )}
    </Card>
  );
};

export default ScanTabContent;


import React from 'react';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types';
import EmotionScanForm from './EmotionScanForm';
import UnifiedEmotionCheckin from './UnifiedEmotionCheckin';

interface ScanTabContentProps {
  showScanForm: boolean;
  setShowScanForm: (show: boolean) => void;
  onScanComplete: (result: EmotionResult) => void;
}

const ScanTabContent: React.FC<ScanTabContentProps> = ({
  showScanForm,
  setShowScanForm,
  onScanComplete
}) => {
  return (
    <div className="space-y-6">
      {!showScanForm && (
        <div className="flex justify-end mb-4">
          <Button 
            onClick={() => setShowScanForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Nouvelle analyse
          </Button>
        </div>
      )}
      
      {showScanForm ? (
        <EmotionScanForm 
          onComplete={onScanComplete} 
          onClose={() => setShowScanForm(false)} 
        />
      ) : (
        <UnifiedEmotionCheckin />
      )}
    </div>
  );
};

export default ScanTabContent;

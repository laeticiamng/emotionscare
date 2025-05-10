
import React from 'react';
import { Card } from '@/components/ui/card';
import EmotionScanForm from '@/components/scan/EmotionScanForm';
import EmotionScanLive from '@/components/scan/EmotionScanLive';
import { useScanPage } from '@/hooks/useScanPage';
import EmotionHistory from './EmotionHistory';

interface ScanTabContentProps {
  userId: string;
  showScanForm: boolean;
  setShowScanForm: (show: boolean) => void;
  handleScanSaved: () => void;
  onResultSaved: () => Promise<void>;
}

const ScanTabContent: React.FC<ScanTabContentProps> = ({
  userId,
  showScanForm,
  setShowScanForm,
  handleScanSaved,
  onResultSaved
}) => {
  const { emotions, isLoading, error, refreshEmotions } = useScanPage();
  
  return (
    <div className="space-y-4">
      {showScanForm ? (
        <EmotionScanForm 
          onScanSaved={handleScanSaved}
          onClose={() => setShowScanForm(false)}
        />
      ) : (
        <EmotionHistory 
          emotions={emotions} 
          isLoading={isLoading} 
          error={error} 
        />
      )}
    </div>
  );
};

export default ScanTabContent;

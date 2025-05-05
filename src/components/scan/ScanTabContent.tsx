
import React from 'react';
import { Card } from '@/components/ui/card';
import EmotionScanForm from '@/components/scan/EmotionScanForm';
import EmotionScanLive from '@/components/scan/EmotionScanLive';

interface ScanTabContentProps {
  showScanForm: boolean;
  userId: string;
  handleScanSaved: () => void;
  setShowScanForm: (show: boolean) => void;
  onResultSaved: () => Promise<void>;
}

const ScanTabContent: React.FC<ScanTabContentProps> = ({
  showScanForm,
  userId,
  handleScanSaved,
  setShowScanForm,
  onResultSaved
}) => {
  return (
    <div className="space-y-4">
      {showScanForm ? (
        <Card className="p-6 shadow-md rounded-3xl">
          <EmotionScanForm
            onScanSaved={handleScanSaved}
            onClose={() => setShowScanForm(false)}
          />
        </Card>
      ) : (
        <EmotionScanLive 
          userId={userId} 
          onResultSaved={onResultSaved} 
        />
      )}
    </div>
  );
};

export default ScanTabContent;

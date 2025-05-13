
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import EmotionScanForm from '@/components/scan/EmotionScanForm';
import EmotionScanLive from '@/components/scan/EmotionScanLive';
import { useScanPage } from '@/hooks/useScanPage';
import EmotionHistory from './EmotionHistory';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
  const [showLiveScan, setShowLiveScan] = useState(false);
  const { user } = useAuth();
  
  return (
    <div className="space-y-4">
      {showScanForm ? (
        <EmotionScanForm 
          onScanSaved={handleScanSaved}
          onClose={() => setShowScanForm(false)}
          userId={userId || user?.id}
        />
      ) : showLiveScan ? (
        <EmotionScanLive 
          userId={userId}
          onScanComplete={() => setShowLiveScan(false)}
          onResultSaved={onResultSaved}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button 
              onClick={() => setShowLiveScan(true)} 
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Nouveau scan
            </Button>
          </div>
          <EmotionHistory 
            emotions={emotions} 
            isLoading={isLoading} 
            error={error} 
            onRefresh={refreshEmotions}
          />
        </div>
      )}
    </div>
  );
};

export default ScanTabContent;

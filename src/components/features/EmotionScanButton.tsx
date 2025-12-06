// @ts-nocheck

import React from 'react';
import { Eye, Scan } from 'lucide-react';
import ActionButton from '@/components/buttons/ActionButton';
import { useHume } from '@/hooks/useHume';
import { toast } from 'sonner';

const EmotionScanButton: React.FC = () => {
  const { startEmotionScan, isAnalyzing } = useHume();

  const handleScanMood = async () => {
    toast.info('Scan d\'humeur démarré', {
      description: 'Regardez la caméra pendant 10 secondes',
      duration: 3000
    });
    
    await startEmotionScan(10);
    
    toast.success('Scan terminé !', {
      description: 'Votre humeur a été analysée',
      duration: 3000
    });
  };

  return (
    <div className="flex flex-col items-center space-y-2" data-testid="emotion-scan-button">
      <ActionButton
        onClick={handleScanMood}
        icon={<Eye className="w-5 h-5" />}
        variant="primary"
        size="lg"
        isLoading={isAnalyzing}
      >
        Scanner mon humeur
      </ActionButton>
      <p className="text-sm text-muted-foreground text-center">
        <Scan className="w-4 h-4 inline mr-1" />
        Analyse faciale + vocale temps réel
      </p>
    </div>
  );
};

export default EmotionScanButton;

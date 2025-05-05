
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface ScanPageHeaderProps {
  showScanForm: boolean;
  activeTab: string;
  setShowScanForm: (show: boolean) => void;
}

const ScanPageHeader: React.FC<ScanPageHeaderProps> = ({
  showScanForm,
  activeTab,
  setShowScanForm
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-blue-900">Votre Scan Émotionnel</h1>
        <p className="text-muted-foreground mb-4 italic">
          Exprimez-vous en texte, émojis ou voix – nous sommes là pour vous comprendre
        </p>
      </div>

      {!showScanForm && activeTab === 'scan' && (
        <Button 
          onClick={() => setShowScanForm(true)} 
          className="mb-4 sm:mb-0 bg-wellness-coral hover:bg-wellness-coral/90 text-white shadow-sm"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouveau scan émotionnel
        </Button>
      )}
    </div>
  );
};

export default ScanPageHeader;

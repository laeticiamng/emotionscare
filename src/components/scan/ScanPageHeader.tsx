
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowLeft } from 'lucide-react';

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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Scanner émotionnel</h1>
        <p className="text-muted-foreground">
          Comprenez et suivez vos émotions quotidiennes
        </p>
      </div>
      
      <div>
        {activeTab === 'scan' ? (
          showScanForm ? (
            <Button 
              variant="outline" 
              onClick={() => setShowScanForm(false)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          ) : (
            <Button 
              onClick={() => setShowScanForm(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Scanner maintenant
            </Button>
          )
        ) : null}
      </div>
    </div>
  );
};

export default ScanPageHeader;

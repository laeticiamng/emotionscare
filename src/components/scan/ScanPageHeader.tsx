
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, BarChart3, ArrowLeft } from 'lucide-react';

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
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Scan Émotionnel</h1>
          <p className="text-muted-foreground">
            Analysez vos émotions et suivez votre bien-être émotionnel
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
                Nouveau scan
              </Button>
            )
          ) : (
            <Button variant="outline" onClick={() => setShowScanForm(true)}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Analyser les tendances
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanPageHeader;

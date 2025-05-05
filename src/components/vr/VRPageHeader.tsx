
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VRPageHeaderProps {
  onNavigateBack: () => void;
}

const VRPageHeader: React.FC<VRPageHeaderProps> = ({ onNavigateBack }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Micro-pauses VR</h1>
        <p className="text-muted-foreground">
          Accordez-vous un moment de détente immersive
        </p>
      </div>
      <Button variant="outline" onClick={onNavigateBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord
      </Button>
    </div>
  );
};

export default VRPageHeader;

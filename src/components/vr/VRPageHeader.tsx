// @ts-nocheck

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface VRPageHeaderProps {
  onNavigateBack?: () => void; // Made optional with ? to prevent props error
}

const VRPageHeader: React.FC<VRPageHeaderProps> = ({ onNavigateBack }) => {
  const navigate = useNavigate();
  
  const handleNavigateBack = () => {
    if (onNavigateBack) {
      onNavigateBack();
    } else {
      navigate('/dashboard');
    }
  };
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1>Micro-pauses VR</h1>
        <p className="text-muted-foreground">
          Accordez-vous un moment de détente immersive
        </p>
      </div>
      <Button variant="outline" onClick={handleNavigateBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord
      </Button>
    </div>
  );
};

export default VRPageHeader;

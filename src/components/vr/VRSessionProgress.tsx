// @ts-nocheck

import React from 'react';
import { Progress } from '@/components/ui/progress';

interface VRSessionProgressProps {
  percentComplete: number;
}

const VRSessionProgress: React.FC<VRSessionProgressProps> = ({ percentComplete }) => {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span>Progression de la session</span>
        <span>{Math.round(percentComplete)}%</span>
      </div>
      <Progress value={percentComplete} className="h-2" />
    </div>
  );
};

export default VRSessionProgress;

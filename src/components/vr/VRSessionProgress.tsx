
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Timer } from 'lucide-react';

interface VRSessionProgressProps {
  percentageComplete: number;
  timeRemaining: string;
}

const VRSessionProgress: React.FC<VRSessionProgressProps> = ({ 
  percentageComplete,
  timeRemaining
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center">
          <Timer className="h-4 w-4 mr-1" />
          <span>Temps restant</span>
        </div>
        <span className="font-mono">{timeRemaining}</span>
      </div>
      <Progress value={percentageComplete} className="h-2" />
    </div>
  );
};

export default VRSessionProgress;

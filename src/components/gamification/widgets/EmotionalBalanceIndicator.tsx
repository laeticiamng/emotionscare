
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface EmotionalBalanceIndicatorProps {
  emotionalBalance: number;
}

const EmotionalBalanceIndicator: React.FC<EmotionalBalanceIndicatorProps> = ({ emotionalBalance }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">Équilibre émotionnel</span>
        <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-full">
          {emotionalBalance}%
        </span>
      </div>
      <Progress value={emotionalBalance} className="h-2" />
    </div>
  );
};

export default EmotionalBalanceIndicator;

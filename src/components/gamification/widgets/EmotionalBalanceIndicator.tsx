// @ts-nocheck

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { HeartHandshake } from 'lucide-react';

interface EmotionalBalanceIndicatorProps {
  emotionalBalance: number;
}

const EmotionalBalanceIndicator: React.FC<EmotionalBalanceIndicatorProps> = ({ 
  emotionalBalance 
}) => {
  // Determine color based on emotional balance value
  const getBalanceColor = (value: number): string => {
    if (value < 30) return 'bg-red-500';
    if (value < 50) return 'bg-orange-500';
    if (value < 70) return 'bg-blue-500';
    return 'bg-green-500';
  };
  
  // Determine emotion status
  const getBalanceStatus = (value: number): string => {
    if (value < 30) return 'Déséquilibre négatif';
    if (value < 50) return 'Légèrement négatif';
    if (value < 70) return 'Légèrement positif';
    return 'Équilibre positif';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center text-sm font-medium">
          <HeartHandshake className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
          Équilibre émotionnel
        </div>
        <span className="text-xs text-muted-foreground">
          {getBalanceStatus(emotionalBalance)}
        </span>
      </div>
      
      <Progress
        value={emotionalBalance} 
        className={`h-2 ${getBalanceColor(emotionalBalance)}`} 
      />
      
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>Négatif</span>
        <span>Neutre</span>
        <span>Positif</span>
      </div>
    </div>
  );
};

export default EmotionalBalanceIndicator;

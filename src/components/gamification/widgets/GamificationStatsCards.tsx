// @ts-nocheck

import React from 'react';
import { Flame, TrendingUp } from 'lucide-react';

interface GamificationStatsCardsProps {
  streakDays: number;
  totalScans: number;
}

const GamificationStatsCards: React.FC<GamificationStatsCardsProps> = ({ 
  streakDays, 
  totalScans 
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-muted/30 p-3 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Séries</span>
          <Flame className="h-4 w-4 text-orange-500" />
        </div>
        <div className="mt-1">
          <span className="text-2xl font-bold">{streakDays}</span>
          <span className="text-xs text-muted-foreground ml-1">jours</span>
        </div>
      </div>
      
      <div className="bg-muted/30 p-3 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Scans</span>
          <TrendingUp className="h-4 w-4 text-blue-500" />
        </div>
        <div className="mt-1">
          <span className="text-2xl font-bold">{totalScans}</span>
          <span className="text-xs text-muted-foreground ml-1">total</span>
        </div>
      </div>
    </div>
  );
};

export default GamificationStatsCards;

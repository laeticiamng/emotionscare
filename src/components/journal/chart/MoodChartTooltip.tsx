// @ts-nocheck

import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card } from '@/components/ui/card';

interface MoodChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const MoodChartTooltip: React.FC<MoodChartTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    // Extract values and calculate deltas
    const sentiment = payload.find(p => p.dataKey === 'sentiment')?.value || 0;
    const anxiety = payload.find(p => p.dataKey === 'anxiety')?.value || 0;
    const energy = payload.find(p => p.dataKey === 'energy')?.value || 0;
    
    const prevSentiment = data.previousSentiment;
    const prevAnxiety = data.previousAnxiety;
    const prevEnergy = data.previousEnergy;
    
    // Calculate deltas if previous values exist
    const sentimentDelta = prevSentiment !== null ? Math.round(((sentiment - prevSentiment) / Math.abs(prevSentiment)) * 100) : null;
    const anxietyDelta = prevAnxiety !== null ? Math.round(((anxiety - prevAnxiety) / Math.abs(prevAnxiety)) * 100) : null;
    const energyDelta = prevEnergy !== null ? Math.round(((energy - prevEnergy) / Math.abs(prevEnergy)) * 100) : null;

    return (
      <Card 
        className="p-3 shadow-lg border bg-white transition-opacity duration-150 ease-out"
        role="tooltip"
      >
        <p className="font-semibold">{format(data.originalDate, 'EEEE dd MMMM', { locale: fr })}</p>
        <div className="text-sm mt-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span className="text-blue-600">Sentiment: {sentiment}/100</span>
            {sentimentDelta !== null && (
              <span className={`text-xs font-medium ${sentimentDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {sentimentDelta > 0 ? '+' : ''}{sentimentDelta}%
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-red-500">Anxiété: {anxiety}/100</span>
            {anxietyDelta !== null && (
              <span className={`text-xs font-medium ${anxietyDelta >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {anxietyDelta > 0 ? '+' : ''}{anxietyDelta}%
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-600"></span>
            <span className="text-green-600">Énergie: {energy}/100</span>
            {energyDelta !== null && (
              <span className={`text-xs font-medium ${energyDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {energyDelta > 0 ? '+' : ''}{energyDelta}%
              </span>
            )}
          </div>
        </div>
      </Card>
    );
  }
  return null;
};

export default MoodChartTooltip;

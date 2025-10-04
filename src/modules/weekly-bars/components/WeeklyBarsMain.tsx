import React from 'react';
import { useWeeklyBars } from '../hooks/useWeeklyBars';

interface WeeklyBarsMainProps {
  className?: string;
}

/**
 * Composant principal du module Weekly Bars
 * Visualisation des barres émotionnelles hebdomadaires
 */
export const WeeklyBarsMain: React.FC<WeeklyBarsMainProps> = ({ className = '' }) => {
  const { weekData, currentWeek } = useWeeklyBars();

  return (
    <div className={`weekly-bars-container ${className}`}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Barres Hebdomadaires 📊</h2>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">Semaine {currentWeek}</p>
          
          <div className="space-y-2">
            {weekData.map((day, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-20">{day.label}</span>
                <div className="flex-1 bg-muted rounded-full h-8 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${day.value}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-foreground w-12 text-right">
                  {day.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyBarsMain;

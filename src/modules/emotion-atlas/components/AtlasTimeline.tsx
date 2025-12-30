import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, eachDayOfInterval, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { AtlasData } from '../types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AtlasTimelineProps {
  data: AtlasData;
  className?: string;
}

interface DayData {
  date: Date;
  emotions: { emotion: string; color: string; intensity: number }[];
}

export const AtlasTimeline: React.FC<AtlasTimelineProps> = ({ data, className }) => {
  // Générer les données par jour (30 derniers jours)
  const timelineData = useMemo((): DayData[] => {
    const endDate = new Date();
    const startDate = subDays(endDate, 29);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    // Simuler des données basées sur les nodes existants
    return days.map((date) => {
      // Sélectionner aléatoirement 0-3 émotions pour chaque jour (simulation)
      const randomEmotions = data.nodes
        .filter(() => Math.random() > 0.6)
        .slice(0, 3)
        .map((node) => ({
          emotion: node.emotion,
          color: node.color,
          intensity: Math.round(20 + Math.random() * 80)
        }));

      return {
        date,
        emotions: randomEmotions
      };
    });
  }, [data.nodes]);

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-sm font-semibold text-foreground">Historique émotionnel</h3>
      
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1 min-w-max">
          <TooltipProvider delayDuration={0}>
            {timelineData.map((day, index) => (
              <Tooltip key={day.date.toISOString()}>
                <TooltipTrigger asChild>
                  <motion.div
                    className={cn(
                      'w-8 h-20 rounded-md overflow-hidden cursor-pointer',
                      'border border-border/50 hover:border-primary/50',
                      'bg-muted/50 transition-colors'
                    )}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    {day.emotions.length > 0 ? (
                      <div className="flex flex-col h-full">
                        {day.emotions.map((em, i) => (
                          <div
                            key={`${em.emotion}-${i}`}
                            className="flex-1"
                            style={{ 
                              backgroundColor: em.color,
                              opacity: em.intensity / 100 
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                      </div>
                    )}
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px]">
                  <div className="space-y-1">
                    <p className="font-medium">
                      {format(day.date, 'EEEE d MMMM', { locale: fr })}
                    </p>
                    {day.emotions.length > 0 ? (
                      <ul className="text-xs space-y-0.5">
                        {day.emotions.map((em, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: em.color }}
                            />
                            <span className="capitalize">{em.emotion}</span>
                            <span className="text-muted-foreground">({em.intensity}%)</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-muted-foreground">Aucune donnée</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>

      {/* Légende des jours */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Il y a 30 jours</span>
        <span>Aujourd'hui</span>
      </div>
    </div>
  );
};

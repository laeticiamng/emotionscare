/**
 * EnergyBar - Barre d'énergie avec régénération
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EnergyBarProps {
  current: number;
  max: number;
  regenRate: number; // per hour
  className?: string;
}

export function EnergyBar({ current, max, regenRate, className = '' }: EnergyBarProps) {
  const [timeToFull, setTimeToFull] = useState<string>('');
  const percentage = Math.min(100, (current / max) * 100);

  useEffect(() => {
    if (current >= max) {
      setTimeToFull('');
      return;
    }

    const remaining = max - current;
    const hoursToFull = remaining / regenRate;
    
    if (hoursToFull < 1) {
      const minutes = Math.ceil(hoursToFull * 60);
      setTimeToFull(`${minutes} min`);
    } else {
      const hours = Math.floor(hoursToFull);
      const minutes = Math.ceil((hoursToFull - hours) * 60);
      setTimeToFull(`${hours}h ${minutes}min`);
    }
  }, [current, max, regenRate]);

  const getEnergyColor = () => {
    if (percentage >= 70) return 'from-green-500 to-emerald-500';
    if (percentage >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const getGlowColor = () => {
    if (percentage >= 70) return 'shadow-green-500/50';
    if (percentage >= 40) return 'shadow-yellow-500/50';
    return 'shadow-red-500/50';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-2 ${className}`}>
            <motion.div
              animate={{ scale: current < max * 0.3 ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 1, repeat: current < max * 0.3 ? Infinity : 0 }}
            >
              <Zap className={`h-4 w-4 ${percentage < 30 ? 'text-red-500' : 'text-yellow-500'}`} />
            </motion.div>
            
            <div className="flex-1 relative">
              <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${getEnergyColor()} rounded-full shadow-lg ${getGlowColor()}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              {/* Animated glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full opacity-50"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                  width: '50%'
                }}
                animate={{ x: ['0%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            <span className="text-xs font-medium tabular-nums min-w-[3rem] text-right">
              {Math.round(current)}/{max}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-medium flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Énergie: {Math.round(current)}/{max}
            </p>
            {timeToFull && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" />
                Plein dans: {timeToFull}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Régénération: +{regenRate}/heure
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default EnergyBar;

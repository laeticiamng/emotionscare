/**
 * DurationSelector - Sélecteur de durée de session (nombre de cycles)
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface DurationOption {
  cycles: number;
  label: string;
  duration: string;
  description: string;
}

const DURATION_OPTIONS: DurationOption[] = [
  {
    cycles: 3,
    label: 'Express',
    duration: '~2 min',
    description: 'Pause rapide',
  },
  {
    cycles: 6,
    label: 'Standard',
    duration: '~4 min',
    description: 'Session équilibrée',
  },
  {
    cycles: 10,
    label: 'Profonde',
    duration: '~7 min',
    description: 'Relaxation complète',
  },
];

interface DurationSelectorProps {
  value: number;
  onChange: (cycles: number) => void;
  className?: string;
}

export const DurationSelector = memo(({ value, onChange, className }: DurationSelectorProps) => {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Durée de la session</span>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {DURATION_OPTIONS.map((option) => {
          const isSelected = value === option.cycles;
          
          return (
            <motion.button
              key={option.cycles}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(option.cycles)}
              className={cn(
                'relative rounded-xl border p-3 text-left transition-all',
                'focus:outline-none focus:ring-2 focus:ring-primary/50',
                isSelected
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border/50 bg-card/40 text-muted-foreground hover:border-primary/30 hover:bg-card/60'
              )}
              aria-pressed={isSelected}
            >
              {isSelected && (
                <motion.div
                  layoutId="duration-indicator"
                  className="absolute inset-0 rounded-xl border-2 border-primary"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              
              <div className="relative z-10">
                <p className={cn(
                  'font-semibold',
                  isSelected ? 'text-foreground' : 'text-foreground'
                )}>
                  {option.label}
                </p>
                <p className={cn(
                  'text-lg font-bold',
                  isSelected ? 'text-primary' : 'text-muted-foreground'
                )}>
                  {option.duration}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {option.cycles} cycles
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});

DurationSelector.displayName = 'DurationSelector';

export default DurationSelector;

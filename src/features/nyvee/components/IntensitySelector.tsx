/**
 * IntensitySelector - Composant de sélection d'intensité pour Nyvee
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Wind, Zap, Flame } from 'lucide-react';
import type { BreathingIntensity } from '@/modules/nyvee/types';
import { intensityLabels, intensityDescriptions } from '@/modules/nyvee/types';

interface IntensitySelectorProps {
  value: BreathingIntensity;
  onChange: (intensity: BreathingIntensity) => void;
  className?: string;
}

const intensityIcons = {
  calm: Wind,
  moderate: Zap,
  intense: Flame,
};

const intensityColors = {
  calm: {
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/50',
    text: 'text-emerald-400',
    ring: 'ring-emerald-500/30',
    selected: 'bg-emerald-500/30 border-emerald-400',
  },
  moderate: {
    bg: 'bg-violet-500/20',
    border: 'border-violet-500/50',
    text: 'text-violet-400',
    ring: 'ring-violet-500/30',
    selected: 'bg-violet-500/30 border-violet-400',
  },
  intense: {
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/50',
    text: 'text-orange-400',
    ring: 'ring-orange-500/30',
    selected: 'bg-orange-500/30 border-orange-400',
  },
};

export const IntensitySelector = memo(({ value, onChange, className }: IntensitySelectorProps) => {
  const intensities: BreathingIntensity[] = ['calm', 'moderate', 'intense'];

  return (
    <div className={cn('grid grid-cols-3 gap-3', className)}>
      {intensities.map((intensity) => {
        const Icon = intensityIcons[intensity];
        const colors = intensityColors[intensity];
        const isSelected = value === intensity;

        return (
          <motion.button
            key={intensity}
            type="button"
            onClick={() => onChange(intensity)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'relative flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
              'focus:outline-none focus:ring-2',
              colors.ring,
              isSelected
                ? cn(colors.selected, 'ring-2')
                : cn(colors.bg, colors.border, 'hover:border-opacity-80')
            )}
            aria-pressed={isSelected}
            aria-label={`Intensité ${intensityLabels[intensity]}: ${intensityDescriptions[intensity]}`}
          >
            <Icon className={cn('h-6 w-6', colors.text)} />
            <span className={cn('text-sm font-medium', isSelected ? 'text-foreground' : 'text-foreground/80')}>
              {intensityLabels[intensity]}
            </span>
            <span className="text-xs text-muted-foreground text-center line-clamp-2">
              {intensityDescriptions[intensity]}
            </span>
            
            {isSelected && (
              <motion.div
                layoutId="intensity-indicator"
                className={cn('absolute -bottom-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full', colors.text.replace('text-', 'bg-'))}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
});

IntensitySelector.displayName = 'IntensitySelector';

export default IntensitySelector;

/**
 * Pattern Selector - Sélection des motifs visuels
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SilkPattern } from './types';

interface PatternSelectorProps {
  patterns: SilkPattern[];
  selectedPattern: SilkPattern | null;
  onSelect: (pattern: SilkPattern) => void;
  disabled?: boolean;
}

const INTENSITY_COLORS = {
  low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  high: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
} as const;

const INTENSITY_LABELS = {
  low: 'Doux',
  medium: 'Modéré',
  high: 'Intense'
} as const;

export const PatternSelector = memo(function PatternSelector({
  patterns,
  selectedPattern,
  onSelect,
  disabled = false
}: PatternSelectorProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins} min`;
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Choisir un motif
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {patterns.map((pattern) => {
          const isSelected = selectedPattern?.id === pattern.id;
          const intensityKey = pattern.intensity as keyof typeof INTENSITY_COLORS;
          
          return (
            <motion.button
              key={pattern.id}
              onClick={() => !disabled && onSelect(pattern)}
              disabled={disabled}
              whileHover={{ scale: disabled ? 1 : 1.02 }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
              className={cn(
                'relative p-4 rounded-xl border-2 text-left transition-all',
                'bg-card/50 backdrop-blur-sm',
                isSelected
                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                  : 'border-border/50 hover:border-border',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {/* Icon */}
              <div className="text-3xl mb-3">{pattern.icon}</div>
              
              {/* Name & Description */}
              <h4 className="font-semibold text-foreground mb-1">
                {pattern.name}
              </h4>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {pattern.description}
              </p>
              
              {/* Meta info */}
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatDuration(pattern.duration)}
                </span>
                
                <span className={cn(
                  'flex items-center gap-1 px-2 py-0.5 rounded-full border',
                  INTENSITY_COLORS[intensityKey]
                )}>
                  <Zap className="w-3 h-3" />
                  {INTENSITY_LABELS[intensityKey]}
                </span>
              </div>
              
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  layoutId="pattern-indicator"
                  className="absolute top-2 right-2 w-3 h-3 rounded-full bg-primary"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});

export default PatternSelector;

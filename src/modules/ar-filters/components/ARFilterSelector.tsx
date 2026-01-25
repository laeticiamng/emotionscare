/**
 * Sélecteur de filtres AR avec aperçu visuel
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ARFilter } from '../hooks/useARFilters';

interface ARFilterSelectorProps {
  filters: ARFilter[];
  currentFilter: ARFilter | null;
  onSelectFilter: (filter: ARFilter | null) => void;
  disabled?: boolean;
}

export const ARFilterSelector = memo<ARFilterSelectorProps>(({
  filters,
  currentFilter,
  onSelectFilter,
  disabled = false,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        Choisissez votre filtre émotionnel
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {filters.map((filter, index) => {
          const isActive = currentFilter?.id === filter.id;
          
          return (
            <motion.button
              key={filter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectFilter(isActive ? null : filter)}
              disabled={disabled}
              className={cn(
                'relative p-4 rounded-xl border-2 transition-all text-left',
                'hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                isActive
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border bg-card hover:border-primary/50'
              )}
              aria-label={`Sélectionner le filtre ${filter.name}`}
              aria-pressed={isActive}
            >
              {/* Gradient Background */}
              <div
                className={cn(
                  'absolute inset-0 rounded-xl opacity-10 bg-gradient-to-br',
                  filter.color
                )}
              />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl" aria-hidden="true">
                    {filter.emoji}
                  </span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </motion.div>
                  )}
                </div>
                
                <h4 className="font-semibold text-foreground">
                  {filter.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {filter.description}
                </p>
              </div>
              
              {/* Color Preview Bar */}
              <div
                className={cn(
                  'absolute bottom-0 left-0 right-0 h-1 rounded-b-xl bg-gradient-to-r',
                  filter.color,
                  isActive ? 'opacity-100' : 'opacity-50'
                )}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});

ARFilterSelector.displayName = 'ARFilterSelector';

export default ARFilterSelector;
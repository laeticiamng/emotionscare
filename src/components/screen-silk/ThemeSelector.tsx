/**
 * Theme Selector - Sélection des thèmes visuels
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { SilkTheme } from './types';

interface ThemeSelectorProps {
  themes: SilkTheme[];
  selectedTheme: SilkTheme;
  onSelect: (theme: SilkTheme) => void;
  disabled?: boolean;
}

export const ThemeSelector = memo(function ThemeSelector({
  themes,
  selectedTheme,
  onSelect,
  disabled = false
}: ThemeSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Thème ambiant
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {themes.map((theme) => {
          const isSelected = selectedTheme.id === theme.id;
          
          return (
            <motion.button
              key={theme.id}
              onClick={() => !disabled && onSelect(theme)}
              disabled={disabled}
              whileHover={{ scale: disabled ? 1 : 1.05 }}
              whileTap={{ scale: disabled ? 1 : 0.95 }}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all',
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-border/50 bg-card/50 hover:border-border',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {/* Color preview */}
              <div
                className="w-4 h-4 rounded-full ring-2 ring-background shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
                }}
              />
              
              <span className="text-sm font-medium">
                {theme.name}
              </span>
              
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  layoutId="theme-indicator"
                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary"
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

export default ThemeSelector;

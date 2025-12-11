// @ts-nocheck
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Monitor, Sun, Moon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Theme } from '@/store/settings.store';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  value: Theme;
  onChange: (theme: Theme) => void;
  variant?: 'default' | 'cards' | 'buttons';
}

const themes = [
  {
    value: 'system' as const,
    label: 'Système',
    description: 'Suit les préférences de votre appareil',
    icon: Monitor,
    preview: {
      bg: 'bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-700 dark:to-slate-900',
      accent: 'bg-blue-500'
    }
  },
  {
    value: 'light' as const,
    label: 'Clair',
    description: 'Thème clair en permanence',
    icon: Sun,
    preview: {
      bg: 'bg-gradient-to-br from-white to-slate-100',
      accent: 'bg-amber-400'
    }
  },
  {
    value: 'dark' as const,
    label: 'Sombre',
    description: 'Thème sombre en permanence',
    icon: Moon,
    preview: {
      bg: 'bg-gradient-to-br from-slate-800 to-slate-950',
      accent: 'bg-purple-500'
    }
  }
];

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ value, onChange, variant = 'default' }) => {
  if (variant === 'buttons') {
    return (
      <div className="space-y-2">
        <Label className="text-base font-medium">Thème</Label>
        <div className="flex gap-2">
          {themes.map((theme) => {
            const Icon = theme.icon;
            const isSelected = value === theme.value;
            
            return (
              <motion.button
                key={theme.value}
                onClick={() => onChange(theme.value)}
                className={cn(
                  "flex-1 p-3 rounded-lg border-2 transition-all",
                  isSelected 
                    ? "border-primary bg-primary/10" 
                    : "border-border hover:border-primary/50"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className={cn(
                  "w-5 h-5 mx-auto mb-1",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "text-xs font-medium",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )}>
                  {theme.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className="space-y-3">
        <Label className="text-base font-medium">Thème</Label>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((theme) => {
            const Icon = theme.icon;
            const isSelected = value === theme.value;
            
            return (
              <motion.div
                key={theme.value}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Card 
                  className={cn(
                    "cursor-pointer overflow-hidden transition-all",
                    isSelected && "ring-2 ring-primary"
                  )}
                  onClick={() => onChange(theme.value)}
                >
                  {/* Preview */}
                  <div className={cn(
                    "h-16 relative",
                    theme.preview.bg
                  )}>
                    <div className={cn(
                      "absolute bottom-2 left-2 w-8 h-2 rounded",
                      theme.preview.accent
                    )} />
                    <div className="absolute bottom-2 right-2 w-4 h-4 rounded bg-white/20" />
                    
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Label */}
                  <div className="p-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Icon className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs font-medium">{theme.label}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // Variant par défaut
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">Thème</Label>
      
      <RadioGroup
        value={value}
        onValueChange={(value) => onChange(value as Theme)}
        className="space-y-3"
        role="radiogroup"
        aria-labelledby="theme-label"
      >
        {themes.map((theme) => {
          const Icon = theme.icon;
          const isSelected = value === theme.value;
          
          return (
            <motion.div 
              key={theme.value} 
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer",
                isSelected 
                  ? "border-primary bg-primary/5" 
                  : "border-transparent hover:bg-muted/50"
              )}
              onClick={() => onChange(theme.value)}
              whileHover={{ x: 4 }}
            >
              <RadioGroupItem 
                value={theme.value} 
                id={`theme-${theme.value}`}
                className="mt-0"
              />
              
              <div className="flex items-center gap-3 flex-1">
                <motion.div
                  className={cn(
                    "p-2 rounded-lg",
                    isSelected ? "bg-primary/20" : "bg-muted"
                  )}
                  animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className={cn(
                    "w-4 h-4",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )} />
                </motion.div>
                
                <div className="flex-1">
                  <Label 
                    htmlFor={`theme-${theme.value}`}
                    className={cn(
                      "font-medium cursor-pointer",
                      isSelected && "text-primary"
                    )}
                  >
                    {theme.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {theme.description}
                  </p>
                </div>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="w-4 h-4 text-primary" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </RadioGroup>
    </div>
  );
};
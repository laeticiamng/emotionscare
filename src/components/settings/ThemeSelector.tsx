// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, Monitor, Palette, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeName } from '@/types/theme';
import { cn } from '@/lib/utils';

interface ThemeSelectorProps {
  currentTheme: ThemeName;
  onChange: (theme: ThemeName) => void;
  minimal?: boolean;
  showPreview?: boolean;
}

const THEME_CONFIG = {
  light: {
    icon: Sun,
    label: 'Clair',
    description: 'Interface lumineuse et aérée',
    colors: {
      bg: 'bg-white',
      card: 'bg-slate-50',
      accent: 'bg-blue-500',
      text: 'bg-slate-900'
    }
  },
  dark: {
    icon: Moon,
    label: 'Sombre',
    description: 'Repose les yeux en soirée',
    colors: {
      bg: 'bg-slate-900',
      card: 'bg-slate-800',
      accent: 'bg-purple-500',
      text: 'bg-slate-100'
    }
  },
  system: {
    icon: Monitor,
    label: 'Système',
    description: 'Suit les préférences système',
    colors: {
      bg: 'bg-gradient-to-br from-white to-slate-900',
      card: 'bg-slate-500',
      accent: 'bg-blue-500',
      text: 'bg-white'
    }
  },
  pastel: {
    icon: Palette,
    label: 'Pastel',
    description: 'Couleurs douces et apaisantes',
    colors: {
      bg: 'bg-gradient-to-br from-pink-100 to-purple-100',
      card: 'bg-white/80',
      accent: 'bg-pink-400',
      text: 'bg-purple-900'
    },
    isNew: true
  }
};

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  currentTheme, 
  onChange, 
  minimal = false,
  showPreview = true 
}) => {
  const [hoveredTheme, setHoveredTheme] = useState<ThemeName | null>(null);

  const handleThemeChange = (value: string) => {
    if (value === 'light' || value === 'dark' || value === 'system' || value === 'pastel') {
      onChange(value as ThemeName);
    }
  };

  const ThemePreview = ({ theme }: { theme: keyof typeof THEME_CONFIG }) => {
    const config = THEME_CONFIG[theme];
    return (
      <div className={cn(
        "w-full h-12 rounded-lg overflow-hidden relative",
        config.colors.bg
      )}>
        <div className={cn(
          "absolute top-2 left-2 w-6 h-3 rounded",
          config.colors.card
        )} />
        <div className={cn(
          "absolute top-2 right-2 w-3 h-3 rounded-full",
          config.colors.accent
        )} />
        <div className={cn(
          "absolute bottom-2 left-2 right-4 h-1.5 rounded",
          config.colors.text,
          "opacity-30"
        )} />
      </div>
    );
  };
  
  if (minimal) {
    return (
      <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
        {Object.entries(THEME_CONFIG).map(([key, config]) => {
          const Icon = config.icon;
          const isSelected = currentTheme === key;
          
          return (
            <motion.button
              key={key}
              onClick={() => handleThemeChange(key)}
              className={cn(
                "p-2 rounded-md transition-all",
                isSelected ? "bg-background shadow-sm" : "hover:bg-background/50"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={config.label}
            >
              <Icon className={cn(
                "w-4 h-4",
                isSelected ? "text-primary" : "text-muted-foreground"
              )} />
            </motion.button>
          );
        })}
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Thème
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={currentTheme}
          onValueChange={handleThemeChange}
          className="grid grid-cols-2 gap-4"
        >
          {Object.entries(THEME_CONFIG).map(([key, config]) => {
            const Icon = config.icon;
            const isSelected = currentTheme === key;
            const isHovered = hoveredTheme === key;
            
            return (
              <motion.div
                key={key}
                onHoverStart={() => setHoveredTheme(key as ThemeName)}
                onHoverEnd={() => setHoveredTheme(null)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Label
                  htmlFor={key}
                  className={cn(
                    "flex flex-col cursor-pointer rounded-lg border-2 p-3 transition-all",
                    isSelected 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {/* Preview */}
                  {showPreview && (
                    <div className="mb-3 relative">
                      <ThemePreview theme={key as keyof typeof THEME_CONFIG} />
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <RadioGroupItem value={key} id={key} className="sr-only" />
                    <motion.div
                      className={cn(
                        "p-1.5 rounded-md",
                        isSelected ? "bg-primary/20" : "bg-muted"
                      )}
                      animate={isSelected ? { rotate: [0, 10, -10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className={cn(
                        "w-4 h-4",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )} />
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-medium text-sm",
                          isSelected && "text-primary"
                        )}>
                          {config.label}
                        </span>
                        {config.isNew && (
                          <Badge className="text-[10px] px-1 py-0 bg-gradient-to-r from-pink-500 to-purple-500">
                            <Sparkles className="w-2 h-2 mr-0.5" />
                            Nouveau
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {config.description}
                      </p>
                    </div>
                  </div>
                </Label>
              </motion.div>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default ThemeSelector;

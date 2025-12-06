// @ts-nocheck
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Monitor, Sun, Moon } from 'lucide-react';
import { type Theme } from '@/store/settings.store';

interface ThemeToggleProps {
  value: Theme;
  onChange: (theme: Theme) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ value, onChange }) => {
  const themes = [
    {
      value: 'system' as const,
      label: 'Système',
      description: 'Suit les préférences de votre appareil',
      icon: Monitor
    },
    {
      value: 'light' as const,
      label: 'Clair',
      description: 'Thème clair en permanence',
      icon: Sun
    },
    {
      value: 'dark' as const,
      label: 'Sombre',
      description: 'Thème sombre en permanence',
      icon: Moon
    }
  ];

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
          
          return (
            <div key={theme.value} className="flex items-center space-x-3">
              <RadioGroupItem 
                value={theme.value} 
                id={`theme-${theme.value}`}
                className="mt-1"
              />
              
              <div className="flex items-center gap-3 flex-1">
                <Icon className="w-4 h-4 text-muted-foreground" />
                
                <div className="flex-1">
                  <Label 
                    htmlFor={`theme-${theme.value}`}
                    className="font-medium cursor-pointer"
                  >
                    {theme.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {theme.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};
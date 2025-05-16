
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Theme, ThemeSettingsTabProps } from '@/types/theme';

const ThemeSettingsTab: React.FC<ThemeSettingsTabProps> = ({
  currentTheme,
  onThemeChange
}) => {
  const themeOptions: { value: Theme, label: string, description: string }[] = [
    { 
      value: 'light', 
      label: 'Clair', 
      description: 'Idéal pour une utilisation en journée avec un contraste optimal'
    },
    { 
      value: 'dark', 
      label: 'Sombre', 
      description: 'Réduit la fatigue oculaire dans les environnements peu éclairés'
    },
    { 
      value: 'system', 
      label: 'Système', 
      description: 'S\'adapte automatiquement aux préférences de votre appareil'
    },
    { 
      value: 'pastel', 
      label: 'Pastel', 
      description: 'Une ambiance douce et colorée pour une expérience apaisante'
    }
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Thème</h3>
          
          <RadioGroup
            value={currentTheme}
            onValueChange={(value: Theme) => onThemeChange(value)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {themeOptions.map((option) => (
              <div key={option.value} className="relative flex items-center space-x-2 rounded-lg border p-3 shadow-sm transition-all hover:bg-accent">
                <RadioGroupItem value={option.value} id={`theme-${option.value}`} />
                <div className="ml-2">
                  <Label htmlFor={`theme-${option.value}`} className="font-medium">{option.label}</Label>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSettingsTab;

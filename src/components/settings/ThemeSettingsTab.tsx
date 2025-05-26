
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeName } from '@/types/theme';

interface ThemeSettingsTabProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

const ThemeSettingsTab: React.FC<ThemeSettingsTabProps> = ({
  currentTheme,
  onThemeChange
}) => {
  const themes: { value: ThemeName; label: string; description: string }[] = [
    {
      value: 'light',
      label: 'Clair',
      description: 'Thème clair classique'
    },
    {
      value: 'dark',
      label: 'Sombre',
      description: 'Thème sombre pour les yeux'
    },
    {
      value: 'system',
      label: 'Système',
      description: 'Suit les préférences du système'
    },
    {
      value: 'pastel',
      label: 'Pastel',
      description: 'Couleurs douces et apaisantes'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences de thème</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {themes.map((theme) => (
            <Button
              key={theme.value}
              variant={currentTheme === theme.value ? 'default' : 'outline'}
              onClick={() => onThemeChange(theme.value)}
              className="h-auto p-4 flex flex-col items-start"
            >
              <div className="font-medium">{theme.label}</div>
              <div className="text-sm text-muted-foreground">{theme.description}</div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSettingsTab;

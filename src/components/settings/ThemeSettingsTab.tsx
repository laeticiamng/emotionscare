
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';
import { ThemeName } from '@/types/theme';

interface ThemeSettingsTabProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

const ThemeSettingsTab: React.FC<ThemeSettingsTabProps> = ({
  currentTheme,
  onThemeChange
}) => {
  const themes = [
    {
      name: 'light' as ThemeName,
      label: 'Clair',
      description: 'Thème clair pour une utilisation en journée',
      icon: Sun
    },
    {
      name: 'dark' as ThemeName,
      label: 'Sombre',
      description: 'Thème sombre pour réduire la fatigue oculaire',
      icon: Moon
    },
    {
      name: 'system' as ThemeName,
      label: 'Système',
      description: 'Suit les préférences de votre système',
      icon: Monitor
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apparence</CardTitle>
        <CardDescription>
          Choisissez le thème qui vous convient le mieux
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {themes.map((theme) => {
            const IconComponent = theme.icon;
            const isActive = currentTheme === theme.name;
            
            return (
              <Button
                key={theme.name}
                variant={isActive ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => onThemeChange(theme.name)}
              >
                <IconComponent className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">{theme.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {theme.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSettingsTab;

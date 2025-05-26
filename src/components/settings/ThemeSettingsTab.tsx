
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  const themes: { name: ThemeName; label: string; description: string }[] = [
    {
      name: 'light',
      label: 'Clair',
      description: 'Thème clair pour une utilisation en journée'
    },
    {
      name: 'dark',
      label: 'Sombre',
      description: 'Thème sombre pour réduire la fatigue oculaire'
    },
    {
      name: 'system',
      label: 'Système',
      description: 'Suit automatiquement les préférences de votre système'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apparence</CardTitle>
        <CardDescription>
          Personnalisez l'apparence de l'application selon vos préférences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <Card 
              key={theme.name}
              className={`cursor-pointer transition-colors ${
                currentTheme === theme.name 
                  ? 'ring-2 ring-primary' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => onThemeChange(theme.name)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{theme.label}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  {theme.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="pt-4">
          <Button
            variant="outline"
            onClick={() => onThemeChange('system')}
            className="w-full"
          >
            Réinitialiser aux paramètres système
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSettingsTab;

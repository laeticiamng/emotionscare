
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeName } from '@/types/theme';

interface ThemeSettingsTabProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

const ThemeSettingsTab: React.FC<ThemeSettingsTabProps> = ({ currentTheme, onThemeChange }) => {
  const themes: { name: ThemeName; label: string; description: string }[] = [
    { name: 'light', label: 'Clair', description: 'Interface claire et lumineuse' },
    { name: 'dark', label: 'Sombre', description: 'Interface sombre pour les yeux' },
    { name: 'system', label: 'Système', description: 'Suit les préférences du système' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thème de l'application</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <div
              key={theme.name}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                currentTheme === theme.name ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => onThemeChange(theme.name)}
            >
              <h3 className="font-medium">{theme.label}</h3>
              <p className="text-sm text-muted-foreground mt-1">{theme.description}</p>
            </div>
          ))}
        </div>
        
        <div className="pt-4">
          <Button 
            onClick={() => onThemeChange(currentTheme)}
            variant="outline"
          >
            Appliquer le thème
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSettingsTab;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeName } from '@/types/theme';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeSettingsTabProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

const ThemeSettingsTab: React.FC<ThemeSettingsTabProps> = ({ 
  currentTheme, 
  onThemeChange 
}) => {
  const themes = [
    { name: 'light' as ThemeName, label: 'Clair', icon: Sun },
    { name: 'dark' as ThemeName, label: 'Sombre', icon: Moon },
    { name: 'system' as ThemeName, label: 'Système', icon: Monitor }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thème de l'application</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {themes.map((theme) => {
            const Icon = theme.icon;
            return (
              <Button
                key={theme.name}
                variant={currentTheme === theme.name ? 'default' : 'outline'}
                onClick={() => onThemeChange(theme.name)}
                className="flex flex-col items-center gap-2 h-20"
              >
                <Icon className="h-6 w-6" />
                {theme.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSettingsTab;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeName } from '@/types';
import { MoonIcon, SunIcon, Palette, Laptop } from 'lucide-react';
import { usePreferences } from '@/hooks/usePreferences';

interface ThemeSettingsFormProps {
  onUpdate?: (key: string, value: any) => void;
}

const ThemeSettingsForm: React.FC<ThemeSettingsFormProps> = ({
  onUpdate
}) => {
  const { preferences, theme = 'light', updatePreferences } = usePreferences();

  const handleThemeChange = (selectedTheme: ThemeName) => {
    updatePreferences({ theme: selectedTheme });
    if (onUpdate) {
      onUpdate('theme', selectedTheme);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thème de l'application</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue={theme} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="light" onClick={() => handleThemeChange('light')}>
              <SunIcon className="mr-2 h-4 w-4" />
              Clair
            </TabsTrigger>
            <TabsTrigger value="dark" onClick={() => handleThemeChange('dark')}>
              <MoonIcon className="mr-2 h-4 w-4" />
              Sombre
            </TabsTrigger>
            <TabsTrigger value="system" onClick={() => handleThemeChange('system')}>
              <Laptop className="mr-2 h-4 w-4" />
              Système
            </TabsTrigger>
            <TabsTrigger value="pastel" onClick={() => handleThemeChange('pastel')}>
              <Palette className="mr-2 h-4 w-4" />
              Pastel
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ThemeSettingsForm;

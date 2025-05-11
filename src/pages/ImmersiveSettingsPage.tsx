
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme, FontFamily, FontSize } from '@/contexts/ThemeContext';
import ThemeSelector from '@/components/settings/ThemeSelector';
import FontSettings from '@/components/settings/FontSettings';

const ImmersiveSettingsPage: React.FC = () => {
  const { 
    theme, 
    setTheme, 
    fontFamily = 'inter',
    setFontFamily = () => {},
    fontSize = 'medium',
    setFontSize = () => {}
  } = useTheme() || {};
  
  const handleThemeChange = (newTheme: string) => {
    if (setTheme && (newTheme === 'light' || newTheme === 'dark' || newTheme === 'system' || newTheme === 'pastel')) {
      setTheme(newTheme as any);
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Paramètres d'expérience</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ThemeSelector 
          currentTheme={theme} 
          onChange={handleThemeChange}
        />
        
        <FontSettings 
          currentFontFamily={fontFamily as FontFamily}
          onChangeFontFamily={(value) => setFontFamily(value as FontFamily)}
          currentFontSize={fontSize as FontSize}
          onChangeFontSize={(value) => setFontSize(value as FontSize)}
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Animation & Effets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Les paramètres d'animation seront bientôt disponibles.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Accessibilité</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Les paramètres d'accessibilité seront bientôt disponibles.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImmersiveSettingsPage;

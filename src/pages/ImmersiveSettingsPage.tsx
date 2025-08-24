
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/components/theme-provider';
import ThemeSelector from '@/components/settings/ThemeSelector';
import FontSettings from '@/components/settings/FontSettings';
import { FontFamily, FontSize } from '@/types';

const ImmersiveSettingsPage: React.FC = () => {
  const themeContext = useTheme();
  const theme = themeContext?.theme || 'system';
  const setTheme = themeContext?.setTheme;
  const fontFamily = themeContext?.fontFamily as FontFamily || ('inter' as FontFamily);
  const setFontFamily = themeContext?.setFontFamily;
  const fontSize = themeContext?.fontSize as FontSize || ('medium' as FontSize);
  const setFontSize = themeContext?.setFontSize;
  
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Paramètres d'expérience</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ThemeSelector 
          currentTheme={theme} 
          onChange={(newTheme) => setTheme && setTheme(newTheme)}
        />
        
        {setFontFamily && setFontSize && (
          <FontSettings 
            currentFontFamily={fontFamily}
            onChangeFontFamily={(value) => {
              if (setFontFamily) {
                // Ensure value is of type FontFamily before passing it
                const typedValue = value as FontFamily;
                setFontFamily(typedValue);
              }
            }}
            currentFontSize={fontSize}
            onChangeFontSize={(value) => {
              if (setFontSize) {
                // Ensure value is of type FontSize before passing it
                const typedValue = value as FontSize;
                setFontSize(typedValue);
              }
            }}
          />
        )}
        
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

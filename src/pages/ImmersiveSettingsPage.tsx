
import React, { useState } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { ThemeName, FontFamily, FontSize } from '@/types/user';
import ProtectedLayoutWrapper from '@/components/ProtectedLayoutWrapper';
import ThemeSelector from '@/components/settings/ThemeSelector';
import FontSettings from '@/components/settings/FontSettings';

const ImmersiveSettingsPage = () => {
  const { theme, setTheme, fontFamily, setFontFamily, fontSize, setFontSize } = useTheme();
  
  // Convertir en types corrects pour la sécurité TypeScript
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as ThemeName);
  };
  
  const handleFontFamilyChange = (newFont: string) => {
    setFontFamily(newFont as FontFamily);
  };
  
  const handleFontSizeChange = (newSize: string) => {
    setFontSize(newSize as FontSize);
  };
  
  return (
    <ProtectedLayoutWrapper>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Paramètres d'immersion</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ThemeSelector 
              currentTheme={theme} 
              onChange={handleThemeChange}
            />
            
            <FontSettings 
              currentFont={fontFamily}
              currentSize={fontSize}
              onFontChange={handleFontFamilyChange}
              onSizeChange={handleFontSizeChange}
            />
          </div>
          
          <div className="bg-card p-8 rounded-lg border">
            <h3 className="text-xl font-medium mb-4">Aperçu</h3>
            <div className="space-y-4">
              <p className="text-lg">Ceci est un exemple de texte avec les paramètres actuels.</p>
              <p>Thème: <span className="font-medium">{theme}</span></p>
              <p>Police: <span className="font-medium">{fontFamily}</span></p>
              <p>Taille: <span className="font-medium">{fontSize}</span></p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayoutWrapper>
  );
};

export default ImmersiveSettingsPage;


import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeSelector from '@/components/settings/ThemeSelector';
import FontSettings from '@/components/settings/FontSettings';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FontFamily, FontSize, Theme } from '@/types';

const ThemeSettingsTab: React.FC = () => {
  const themeContext = useTheme();
  const { preferences, updatePreferences, resetPreferences } = useUserPreferences();
  const { toast } = useToast();
  
  const [pendingChanges, setPendingChanges] = useState({
    theme: themeContext?.theme || 'light' as Theme,
    fontFamily: (themeContext?.fontFamily || 'system') as FontFamily,
    fontSize: (themeContext?.fontSize || 'medium') as FontSize
  });
  
  const handleSaveChanges = () => {
    // Update theme via context if available
    if (themeContext) {
      if (themeContext.theme !== pendingChanges.theme) {
        themeContext.setTheme(pendingChanges.theme);
      }
      
      if (themeContext.fontFamily !== pendingChanges.fontFamily && themeContext.setFontFamily) {
        themeContext.setFontFamily(pendingChanges.fontFamily);
      }
      
      if (themeContext.fontSize !== pendingChanges.fontSize && themeContext.setFontSize) {
        themeContext.setFontSize(pendingChanges.fontSize);
      }
    }
    
    // Also save to user preferences
    updatePreferences({
      theme: pendingChanges.theme,
      font: pendingChanges.fontFamily,
      fontSize: pendingChanges.fontSize
    });
    
    toast({
      title: "Paramètres d'apparence sauvegardés",
      description: "Les modifications ont bien été appliquées."
    });
  };
  
  const handleReset = () => {
    // Reset to default values
    setPendingChanges({
      theme: 'light' as Theme,
      fontFamily: 'system' as FontFamily,
      fontSize: 'medium' as FontSize
    });
    
    // Apply resets immediately
    if (themeContext) {
      themeContext.setTheme('light');
      if (themeContext.setFontFamily) themeContext.setFontFamily('system' as FontFamily);
      if (themeContext.setFontSize) themeContext.setFontSize('medium' as FontSize);
    }
    
    resetPreferences();
  };
  
  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold mb-4">
        Paramètres d'apparence
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ThemeSelector 
          currentTheme={pendingChanges.theme} 
          onChange={(theme) => setPendingChanges({...pendingChanges, theme})} 
        />
        
        <FontSettings 
          currentFontFamily={pendingChanges.fontFamily}
          onChangeFontFamily={(fontFamily) => setPendingChanges({...pendingChanges, fontFamily})}
          currentFontSize={pendingChanges.fontSize}
          onChangeFontSize={(fontSize) => setPendingChanges({...pendingChanges, fontSize})}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button onClick={handleSaveChanges}>
            <Save className="mr-2 h-4 w-4" />
            Enregistrer les modifications
          </Button>
          
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Réinitialiser
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeSettingsTab;

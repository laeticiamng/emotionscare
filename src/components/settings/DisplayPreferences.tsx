
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { usePreferences } from '@/contexts/PreferencesContext';

const DisplayPreferences: React.FC = () => {
  const { preferences, updatePreferences } = usePreferences();
  const [theme, setTheme] = useState<string>(preferences.theme || 'system');
  const [fontSize, setFontSize] = useState<string>(preferences.fontSize || 'medium');
  const [fontFamily, setFontFamily] = useState<string>(preferences.fontFamily || 'sans');
  const [reduceMotion, setReduceMotion] = useState<boolean>(preferences.reduceMotion || false);
  const [colorBlindMode, setColorBlindMode] = useState<boolean>(preferences.highContrast || false);

  const handleThemeChange = (value: string) => {
    setTheme(value);
    updatePreferences({ theme: value as 'light' | 'dark' | 'system' | 'pastel' });
    // Apply theme change
    document.documentElement.classList.remove('light', 'dark', 'system', 'pastel');
    document.documentElement.classList.add(value);
  };

  const handleFontSizeChange = (value: string) => {
    setFontSize(value);
    updatePreferences({ fontSize: value as 'small' | 'medium' | 'large' | 'xlarge' });
    // Apply font size change
    document.documentElement.dataset.fontSize = value;
  };

  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value);
    updatePreferences({ fontFamily: value as 'sans' | 'serif' | 'mono' | 'system' | 'rounded' });
    // Apply font family change
    document.documentElement.dataset.fontFamily = value;
  };
  
  const handleReduceMotionChange = (checked: boolean) => {
    setReduceMotion(checked);
    updatePreferences({ animationReduced: checked });
    // Apply reduce motion setting
    document.documentElement.dataset.reduceMotion = checked.toString();
  };
  
  const handleColorBlindModeChange = (checked: boolean) => {
    setColorBlindMode(checked);
    updatePreferences({ highContrast: checked });
    // Apply color blind mode
    document.documentElement.dataset.highContrast = checked.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences d'affichage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="theme-select">Thème</Label>
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger id="theme-select">
              <SelectValue placeholder="Sélectionnez un thème" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Lumineux</SelectItem>
              <SelectItem value="dark">Sombre</SelectItem>
              <SelectItem value="system">Système</SelectItem>
              <SelectItem value="pastel">Pastel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font-size-select">Taille de police</Label>
          <Select value={fontSize} onValueChange={handleFontSizeChange}>
            <SelectTrigger id="font-size-select">
              <SelectValue placeholder="Sélectionnez une taille de police" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Petite</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
              <SelectItem value="xlarge">Très grande</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font-family-select">Police</Label>
          <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
            <SelectTrigger id="font-family-select">
              <SelectValue placeholder="Sélectionnez une police" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sans">Sans-serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
              <SelectItem value="system">Système</SelectItem>
              <SelectItem value="rounded">Arrondie</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-4 pt-2">
          <h3 className="text-lg font-medium">Accessibilité</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="reduce-motion">Réduire les animations</Label>
              <p className="text-sm text-muted-foreground">
                Limiter les animations et les effets visuels
              </p>
            </div>
            <Switch
              id="reduce-motion"
              checked={reduceMotion}
              onCheckedChange={handleReduceMotionChange}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="high-contrast">Mode contraste élevé</Label>
              <p className="text-sm text-muted-foreground">
                Améliorer la lisibilité avec un contraste plus élevé
              </p>
            </div>
            <Switch
              id="high-contrast"
              checked={colorBlindMode}
              onCheckedChange={handleColorBlindModeChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplayPreferences;

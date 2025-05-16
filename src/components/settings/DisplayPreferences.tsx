
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Theme, FontSize, FontFamily } from '@/types/theme';

const DisplayPreferences: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('system');
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [fontFamily, setFontFamily] = useState<FontFamily>('system');

  const handleThemeChange = (value: Theme) => {
    setTheme(value);
    // Apply theme change
    document.documentElement.classList.remove('light', 'dark', 'system', 'pastel');
    document.documentElement.classList.add(value);
  };

  const handleFontSizeChange = (value: FontSize) => {
    setFontSize(value);
    // Apply font size change
    document.documentElement.dataset.fontSize = value;
  };

  const handleFontFamilyChange = (value: FontFamily) => {
    setFontFamily(value);
    // Apply font family change
    document.documentElement.dataset.fontFamily = value;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences d'affichage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="theme-select">Thème</Label>
          <Select value={theme} onValueChange={(value) => handleThemeChange(value as Theme)}>
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
          <Select value={fontSize} onValueChange={(value) => handleFontSizeChange(value as FontSize)}>
            <SelectTrigger id="font-size-select">
              <SelectValue placeholder="Sélectionnez une taille de police" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xs">Très petite</SelectItem>
              <SelectItem value="sm">Petite</SelectItem>
              <SelectItem value="md">Moyenne</SelectItem>
              <SelectItem value="lg">Grande</SelectItem>
              <SelectItem value="xl">Très grande</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font-family-select">Police</Label>
          <Select value={fontFamily} onValueChange={(value) => handleFontFamilyChange(value as FontFamily)}>
            <SelectTrigger id="font-family-select">
              <SelectValue placeholder="Sélectionnez une police" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">Système</SelectItem>
              <SelectItem value="sans">Sans-serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
              <SelectItem value="rounded">Arrondie</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplayPreferences;

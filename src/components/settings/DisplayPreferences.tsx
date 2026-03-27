// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { FontSize, FontFamily, Theme } from '@/types/preferences';

const DisplayPreferences: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  const handleThemeChange = (value: string) => {
    updatePreferences({ theme: value as Theme });
  };

  const handleFontSizeChange = (value: string) => {
    updatePreferences({ fontSize: value as FontSize });
  };

  const handleFontFamilyChange = (value: string) => {
    updatePreferences({ fontFamily: value as FontFamily });
  };

  const handleDarkModeChange = (checked: boolean) => {
    updatePreferences({ darkMode: checked });
  };

  const handleHighContrastChange = (checked: boolean) => {
    updatePreferences({
      accessibility: {
        ...(preferences.accessibility || { reduceMotion: false, screenReader: false, keyboardNavigation: false, largeText: false }),
        highContrast: checked,
      },
    });
  };

  const handleReduceMotionChange = (checked: boolean) => {
    updatePreferences({
      accessibility: {
        ...(preferences.accessibility || { highContrast: false, screenReader: false, keyboardNavigation: false, largeText: false }),
        reduceMotion: checked,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences d'affichage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="theme">Thème</Label>
          <Select
            value={preferences.theme || 'system'}
            onValueChange={handleThemeChange}
          >
            <SelectTrigger id="theme">
              <SelectValue placeholder="Choisir un thème" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Clair</SelectItem>
              <SelectItem value="dark">Sombre</SelectItem>
              <SelectItem value="system">Système</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font-size">Taille de police</Label>
          <Select
            value={preferences.fontSize || 'medium'}
            onValueChange={handleFontSizeChange}
          >
            <SelectTrigger id="font-size">
              <SelectValue placeholder="Choisir la taille" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Petit</SelectItem>
              <SelectItem value="medium">Moyen</SelectItem>
              <SelectItem value="large">Grand</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font-family">Police</Label>
          <Select
            value={preferences.fontFamily || 'sans'}
            onValueChange={handleFontFamilyChange}
          >
            <SelectTrigger id="font-family">
              <SelectValue placeholder="Choisir la police" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sans">Sans-serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dark-mode">Mode sombre</Label>
            <p className="text-sm text-muted-foreground">
              Activer le mode sombre pour l'interface
            </p>
          </div>
          <Switch
            id="dark-mode"
            checked={preferences.darkMode || false}
            onCheckedChange={handleDarkModeChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="high-contrast">Contraste élevé</Label>
            <p className="text-sm text-muted-foreground">
              Augmenter le contraste pour une meilleure lisibilité
            </p>
          </div>
          <Switch
            id="high-contrast"
            checked={preferences.accessibility?.highContrast || false}
            onCheckedChange={handleHighContrastChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="reduce-motion">Réduire les animations</Label>
            <p className="text-sm text-muted-foreground">
              Limiter les animations et effets visuels
            </p>
          </div>
          <Switch
            id="reduce-motion"
            checked={preferences.accessibility?.reduceMotion || false}
            onCheckedChange={handleReduceMotionChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplayPreferences;

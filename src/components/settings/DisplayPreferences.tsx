// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { FontSize, FontFamily, Theme } from '@/types/theme';

const DisplayPreferences: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  const handleThemeChange = (value: Theme) => {
    updatePreferences({ theme: value });
  };

  const handleFontSizeChange = (value: FontSize) => {
    updatePreferences({ fontSize: value });
  };

  const handleFontFamilyChange = (value: FontFamily) => {
    updatePreferences({ fontFamily: value });
  };

  const handleDarkModeChange = (checked: boolean) => {
    updatePreferences({ darkMode: checked });
  };

  const handleHighContrastChange = (checked: boolean) => {
    updatePreferences({ highContrast: checked });
  };

  const handleColorBlindModeChange = (checked: boolean) => {
    updatePreferences({ colorBlindMode: checked });
  };

  const handleReduceMotionChange = (checked: boolean) => {
    updatePreferences({
      reduceMotion: checked
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
            value={preferences.fontSize || 'md'}
            onValueChange={handleFontSizeChange}
          >
            <SelectTrigger id="font-size">
              <SelectValue placeholder="Choisir une taille" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Petite</SelectItem>
              <SelectItem value="md">Moyenne</SelectItem>
              <SelectItem value="lg">Grande</SelectItem>
              <SelectItem value="xl">Très grande</SelectItem>
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
              <SelectValue placeholder="Choisir une police" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sans">Sans-serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
              <SelectItem value="rounded">Arrondie</SelectItem>
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
            checked={preferences.highContrast || false}
            onCheckedChange={handleHighContrastChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="color-blind">Mode daltonien</Label>
            <p className="text-sm text-muted-foreground">
              Adapter les couleurs pour les personnes daltoniennes
            </p>
          </div>
          <Switch
            id="color-blind"
            checked={preferences.colorBlindMode || false}
            onCheckedChange={handleColorBlindModeChange}
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
            checked={preferences.reduceMotion || false}
            onCheckedChange={handleReduceMotionChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplayPreferences;

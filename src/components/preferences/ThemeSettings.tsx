
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Theme, FontSize, FontFamily } from '@/types/preferences';

const ThemeSettings: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  const handleThemeChange = (theme: Theme) => {
    updatePreferences({ theme });
  };

  const handleFontSizeChange = (fontSize: FontSize) => {
    updatePreferences({ fontSize });
  };

  const handleFontFamilyChange = (fontFamily: FontFamily) => {
    updatePreferences({ fontFamily });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="theme">Thème</Label>
        <Select value={preferences.theme} onValueChange={handleThemeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un thème" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Clair</SelectItem>
            <SelectItem value="dark">Sombre</SelectItem>
            <SelectItem value="system">Système</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fontSize">Taille de police</Label>
        <Select value={preferences.fontSize} onValueChange={handleFontSizeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une taille" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Petite</SelectItem>
            <SelectItem value="medium">Moyenne</SelectItem>
            <SelectItem value="large">Grande</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fontFamily">Police de caractères</Label>
        <Select value={preferences.fontFamily} onValueChange={handleFontFamilyChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une police" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sans">Sans-serif</SelectItem>
            <SelectItem value="serif">Serif</SelectItem>
            <SelectItem value="mono">Monospace</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ThemeSettings;

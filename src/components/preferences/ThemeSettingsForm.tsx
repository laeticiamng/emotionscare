
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme, FontFamily, FontSize } from '@/types/types';

const ThemeSettingsForm = () => {
  const { theme, setTheme, fontSize, setFontSize, fontFamily, setFontFamily } = useTheme();

  const themes: Theme[] = ['light', 'dark', 'system', 'pastel'];
  const fontSizes: FontSize[] = ['small', 'medium', 'large', 'extra-large'];
  const fontFamilies: FontFamily[] = ['system', 'system-ui', 'sans-serif', 'serif', 'mono', 'rounded'];

  const getFontSizeName = (size: FontSize): string => {
    switch (size) {
      case 'small': return 'Petit';
      case 'medium': return 'Moyen';
      case 'large': return 'Grand';
      case 'extra-large': return 'Très grand';
      default: return 'Moyen';
    }
  };

  const getFontFamilyName = (family: FontFamily): string => {
    switch (family) {
      case 'system': return 'Système';
      case 'system-ui': return 'Système';
      case 'sans-serif': return 'Sans-serif';
      case 'serif': return 'Serif';
      case 'mono': return 'Monospace';
      case 'rounded': return 'Arrondi';
      default: return 'Système';
    }
  };

  const getThemeName = (theme: Theme): string => {
    switch (theme) {
      case 'light': return 'Clair';
      case 'dark': return 'Sombre';
      case 'system': return 'Système';
      case 'pastel': return 'Pastel';
      default: return 'Système';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Thème</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {themes.map((t) => (
            <Button
              key={t}
              variant={theme === t ? "default" : "outline"}
              onClick={() => setTheme(t)}
              className="justify-center"
            >
              {getThemeName(t)}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Taille de police</h3>
        <div className="grid grid-cols-4 gap-2">
          {fontSizes.map((size) => (
            <Button
              key={size}
              variant={fontSize === size ? "default" : "outline"}
              onClick={() => setFontSize(size)}
              className="justify-center"
            >
              {getFontSizeName(size)}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Police</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {fontFamilies.map((font) => (
            <Button
              key={font}
              variant={fontFamily === font ? "default" : "outline"}
              onClick={() => setFontFamily(font)}
              className={`justify-center font-${font}`}
            >
              {getFontFamilyName(font)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSettingsForm;

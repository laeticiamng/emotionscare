
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from '@/contexts/ThemeContext';
import { FontFamily, FontSize } from '@/types/theme';

const ThemeSettingsTab: React.FC = () => {
  const { 
    theme, 
    setTheme, 
    isDarkMode, 
    fontFamily, 
    setFontFamily, 
    fontSize, 
    setFontSize 
  } = useTheme();

  const handleThemeChange = (value: string) => {
    setTheme(value);
  };

  const handleFontFamilyChange = (value: FontFamily) => {
    if (setFontFamily) {
      setFontFamily(value);
    }
  };

  const handleFontSizeChange = (value: FontSize) => {
    if (setFontSize) {
      setFontSize(value);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Apparence</CardTitle>
          <CardDescription>
            Personnalisez l'apparence de l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="theme-select">Thème</Label>
                <Select 
                  value={theme} 
                  onValueChange={handleThemeChange}
                >
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

              {fontFamily && setFontFamily && (
                <div>
                  <Label htmlFor="font-family-select">Police de caractères</Label>
                  <Select 
                    value={fontFamily} 
                    onValueChange={handleFontFamilyChange}
                  >
                    <SelectTrigger id="font-family-select">
                      <SelectValue placeholder="Sélectionnez une police" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">Système</SelectItem>
                      <SelectItem value="sans">Sans Serif</SelectItem>
                      <SelectItem value="serif">Serif</SelectItem>
                      <SelectItem value="monospace">Monospace</SelectItem>
                      <SelectItem value="rounded">Arrondi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {fontSize && setFontSize && (
                <div>
                  <Label htmlFor="font-size-select">Taille du texte</Label>
                  <Select 
                    value={fontSize} 
                    onValueChange={handleFontSizeChange}
                  >
                    <SelectTrigger id="font-size-select">
                      <SelectValue placeholder="Sélectionnez une taille" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Petit</SelectItem>
                      <SelectItem value="medium">Moyen</SelectItem>
                      <SelectItem value="large">Grand</SelectItem>
                      <SelectItem value="x-large">Très grand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast-mode" className="flex-1">
                  Mode contraste élevé
                </Label>
                <Switch id="high-contrast-mode" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="reduced-motion" className="flex-1">
                  Réduire les animations
                </Label>
                <Switch id="reduced-motion" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeSettingsTab;

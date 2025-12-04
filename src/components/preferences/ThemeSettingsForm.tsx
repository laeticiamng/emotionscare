import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useTheme, Theme } from '@/providers/theme';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Moon, Sun, Monitor, PenTool } from 'lucide-react';

type FontSize = 'sm' | 'md' | 'lg' | 'xl';
type FontFamily = 'sans' | 'serif' | 'mono' | 'rounded';

const FONT_SIZE_KEY = 'emotionscare-font-size';
const FONT_FAMILY_KEY = 'emotionscare-font-family';

const ThemeSettingsForm = () => {
  const { theme, setTheme } = useTheme();

  // Local state for font size and family (not part of ThemeProvider)
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    if (typeof window === 'undefined') return 'md';
    return (localStorage.getItem(FONT_SIZE_KEY) as FontSize) || 'md';
  });

  const [fontFamily, setFontFamilyState] = useState<FontFamily>(() => {
    if (typeof window === 'undefined') return 'sans';
    return (localStorage.getItem(FONT_FAMILY_KEY) as FontFamily) || 'sans';
  });

  // Persist font size to localStorage and apply to document
  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    if (typeof window !== 'undefined') {
      localStorage.setItem(FONT_SIZE_KEY, size);
      document.documentElement.setAttribute('data-font-size', size);
    }
  };

  // Persist font family to localStorage and apply to document
  const setFontFamily = (family: FontFamily) => {
    setFontFamilyState(family);
    if (typeof window !== 'undefined') {
      localStorage.setItem(FONT_FAMILY_KEY, family);
      document.documentElement.setAttribute('data-font-family', family);
    }
  };

  // Apply settings on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-font-size', fontSize);
      document.documentElement.setAttribute('data-font-family', fontFamily);
    }
  }, [fontSize, fontFamily]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            <span>Thème</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={theme}
            onValueChange={(value) => setTheme(value as Theme)}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light" className="flex items-center gap-1">
                <Sun className="h-4 w-4" /> Clair
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark" className="flex items-center gap-1">
                <Moon className="h-4 w-4" /> Sombre
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system" className="flex items-center gap-1">
                <Monitor className="h-4 w-4" /> Système
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pastel" id="pastel" />
              <Label htmlFor="pastel" className="flex items-center gap-1">
                <PenTool className="h-4 w-4" /> Pastel
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Font Size */}
      <Card>
        <CardHeader>
          <CardTitle>Taille de police</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={fontSize}
            onValueChange={(value) => setFontSize(value as FontSize)}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sm" id="size-sm" />
              <Label htmlFor="size-sm">Petite</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="md" id="size-md" />
              <Label htmlFor="size-md">Moyenne</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lg" id="size-lg" />
              <Label htmlFor="size-lg">Grande</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="xl" id="size-xl" />
              <Label htmlFor="size-xl">Très grande</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Font Family */}
      <Card>
        <CardHeader>
          <CardTitle>Police de caractères</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={fontFamily}
            onValueChange={(value) => setFontFamily(value as FontFamily)}
            className="grid grid-cols-2 gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sans" id="font-sans" />
              <Label htmlFor="font-sans">Sans-Serif</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="serif" id="font-serif" />
              <Label htmlFor="font-serif">Serif</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mono" id="font-mono" />
              <Label htmlFor="font-mono">Monospace</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rounded" id="font-rounded" />
              <Label htmlFor="font-rounded">Arrondie</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeSettingsForm;

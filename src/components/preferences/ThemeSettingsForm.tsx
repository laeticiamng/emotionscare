
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeName, FontSize, FontFamily } from '@/types/theme';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Moon, Sun, Monitor, PenTool } from 'lucide-react';

const ThemeSettingsForm = () => {
  const { theme, setTheme, fontSize, setFontSize, fontFamily, setFontFamily } = useTheme();
  
  // Map values to FontSize and FontFamily types
  const fontSizeOptions: FontSize[] = ['sm', 'md', 'lg', 'xl'];
  const fontFamilyOptions: FontFamily[] = ['sans', 'serif', 'mono', 'rounded'];
  
  // Map display names
  const fontSizeDisplayNames: Record<FontSize, string> = {
    sm: 'Small',
    md: 'Medium',
    lg: 'Large',
    xl: 'Extra Large',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    'x-large': 'Extra Large'
  };
  
  const fontFamilyDisplayNames: Record<FontFamily, string> = {
    sans: 'Sans-Serif',
    serif: 'Serif',
    mono: 'Monospace',
    rounded: 'Rounded',
    system: 'System',
    'sans-serif': 'Sans-Serif',
    monospace: 'Monospace',
    inter: 'Inter'
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            <span>Theme</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={theme}
            onValueChange={(value) => setTheme(value as ThemeName)}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light" className="flex items-center gap-1">
                <Sun className="h-4 w-4" /> Light
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark" className="flex items-center gap-1">
                <Moon className="h-4 w-4" /> Dark
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system" className="flex items-center gap-1">
                <Monitor className="h-4 w-4" /> System
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
          <CardTitle>Font Size</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={fontSize}
            onValueChange={(value) => setFontSize(value as FontSize)}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2"
          >
            {fontSizeOptions.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <RadioGroupItem value={size} id={`size-${size}`} />
                <Label htmlFor={`size-${size}`}>
                  {fontSizeDisplayNames[size]}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Font Family */}
      <Card>
        <CardHeader>
          <CardTitle>Font Family</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={fontFamily}
            onValueChange={(value) => setFontFamily(value as FontFamily)}
            className="grid grid-cols-2 gap-2"
          >
            {fontFamilyOptions.map((font) => (
              <div key={font} className="flex items-center space-x-2">
                <RadioGroupItem value={font} id={`font-${font}`} />
                <Label htmlFor={`font-${font}`}>
                  {fontFamilyDisplayNames[font]}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeSettingsForm;

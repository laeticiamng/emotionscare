
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Theme } from '@/contexts/ThemeContext';

interface ThemeSelectorProps {
  currentTheme: Theme;
  onChange: (theme: Theme) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onChange }) => {
  const handleThemeChange = (value: string) => {
    // Validate that the value is a valid Theme before passing it to onChange
    if (value === 'light' || value === 'dark' || value === 'system' || value === 'pastel') {
      onChange(value as Theme);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Thème</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={currentTheme}
          onValueChange={handleThemeChange}
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light">Clair</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="dark" />
            <Label htmlFor="dark">Sombre</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="system" id="system" />
            <Label htmlFor="system">Système</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pastel" id="pastel" />
            <Label htmlFor="pastel">Pastel</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default ThemeSelector;

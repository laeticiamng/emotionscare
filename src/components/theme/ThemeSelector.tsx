
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ThemeName } from '@/types/theme';

interface ThemeSelectorProps {
  currentTheme: ThemeName;
  onChange: (theme: ThemeName) => void;
  minimal?: boolean;
  className?: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  currentTheme, 
  onChange,
  minimal = false,
  className = ""
}) => {
  const handleThemeChange = (value: string) => {
    // Validate that the value is a valid ThemeName before passing it to onChange
    if (value === 'light' || value === 'dark' || value === 'system' || value === 'pastel') {
      onChange(value as ThemeName);
    }
  };
  
  if (minimal) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <RadioGroup
          value={currentTheme}
          onValueChange={handleThemeChange}
          className="flex items-center space-x-1"
        >
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="light" id="light-min" className="sr-only" />
            <Label 
              htmlFor="light-min" 
              className={`px-2 py-1 rounded-md cursor-pointer text-xs ${
                currentTheme === 'light' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Clair
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="dark" id="dark-min" className="sr-only" />
            <Label 
              htmlFor="dark-min" 
              className={`px-2 py-1 rounded-md cursor-pointer text-xs ${
                currentTheme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Sombre
            </Label>
          </div>
        </RadioGroup>
      </div>
    );
  }
  
  return (
    <Card className={className}>
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

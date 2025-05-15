
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { FontSize, FontFamily, ThemeName } from '@/types';
import { Button } from '@/components/ui/button';
import { Monitor, Moon, Sun } from 'lucide-react';

const DisplayPreferences: React.FC = () => {
  const { theme, setTheme, fontSize, setFontSize, fontFamily, setFontFamily } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences d'affichage</CardTitle>
        <CardDescription>
          Personnalisez l'apparence de l'application selon vos préférences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="theme">Thème</Label>
            <div className="flex items-center space-x-2">
              <Button 
                size="icon" 
                variant={theme === 'light' ? 'default' : 'ghost'}
                onClick={() => setTheme('light')} 
                className="h-8 w-8"
              >
                <Sun className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant={theme === 'dark' ? 'default' : 'ghost'}
                onClick={() => setTheme('dark')} 
                className="h-8 w-8"
              >
                <Moon className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant={theme === 'system' ? 'default' : 'ghost'}
                onClick={() => setTheme('system')} 
                className="h-8 w-8"
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Select value={theme as ThemeName} onValueChange={(value) => setTheme(value as ThemeName)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez un thème" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Clair</SelectItem>
              <SelectItem value="dark">Sombre</SelectItem>
              <SelectItem value="system">Système</SelectItem>
              <SelectItem value="pastel">Pastel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="font-size">Taille de police</Label>
          <RadioGroup
            value={fontSize as string}
            onValueChange={(value) => setFontSize && setFontSize(value as FontSize)}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem value="small" id="small" className="peer sr-only" />
              <Label
                htmlFor="small"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-xs">Aa</span>
                <span className="text-xs mt-1">Petite</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="medium" id="medium" className="peer sr-only" />
              <Label
                htmlFor="medium"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-sm">Aa</span>
                <span className="text-xs mt-1">Moyenne</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="large" id="large" className="peer sr-only" />
              <Label
                htmlFor="large"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-base">Aa</span>
                <span className="text-xs mt-1">Grande</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font-family">Police</Label>
          <Select value={fontFamily as string} onValueChange={(value) => setFontFamily && setFontFamily(value as FontFamily)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez une police" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">Système</SelectItem>
              <SelectItem value="sans-serif">Sans Serif</SelectItem>
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

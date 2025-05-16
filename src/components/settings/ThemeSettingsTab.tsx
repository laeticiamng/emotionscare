
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Theme } from '@/types/theme';

export interface ThemeSettingsTabProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const ThemeSettingsTab: React.FC<ThemeSettingsTabProps> = ({
  currentTheme,
  onThemeChange
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Thème</h3>
          
          <RadioGroup
            value={currentTheme}
            onValueChange={(value: Theme) => onThemeChange(value)}
            className="grid grid-cols-2 gap-4"
          >
            <div className="relative flex items-center space-x-2">
              <RadioGroupItem value="light" id="theme-light" />
              <Label htmlFor="theme-light">Clair</Label>
            </div>
            
            <div className="relative flex items-center space-x-2">
              <RadioGroupItem value="dark" id="theme-dark" />
              <Label htmlFor="theme-dark">Sombre</Label>
            </div>
            
            <div className="relative flex items-center space-x-2">
              <RadioGroupItem value="system" id="theme-system" />
              <Label htmlFor="theme-system">Système</Label>
            </div>
            
            <div className="relative flex items-center space-x-2">
              <RadioGroupItem value="pastel" id="theme-pastel" />
              <Label htmlFor="theme-pastel">Pastel</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSettingsTab;


import React from 'react';
import { useTheme, Theme } from '@/contexts/ThemeContext';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ThemePreview from './ThemePreview';

const ThemeSettingsForm: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  const handleThemeChange = (value: Theme) => {
    setTheme(value);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Thème de l'interface</h3>
        <p className="text-sm text-muted-foreground">
          Choisissez l'apparence visuelle de l'application
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <ThemePreview 
          theme="light" 
          isActive={theme === 'light'}
          onClick={() => handleThemeChange('light')}
        />
        
        <ThemePreview 
          theme="dark" 
          isActive={theme === 'dark'}
          onClick={() => handleThemeChange('dark')}
        />
        
        <ThemePreview 
          theme="system" 
          isActive={theme === 'system'}
          onClick={() => handleThemeChange('system')}
        />

        <ThemePreview 
          theme="pastel" 
          isActive={theme === 'pastel'}
          onClick={() => handleThemeChange('pastel' as Theme)}
        />
      </div>
      
      <RadioGroup 
        value={theme} 
        onValueChange={(value) => handleThemeChange(value as Theme)}
        className="grid grid-cols-2 sm:grid-cols-4 gap-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="light" id="theme-light" />
          <Label htmlFor="theme-light">Clair</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="dark" id="theme-dark" />
          <Label htmlFor="theme-dark">Sombre</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="system" id="theme-system" />
          <Label htmlFor="theme-system">Système</Label>
        </div>

        <div className="flex items-center space-x-2">
          <RadioGroupItem value="pastel" id="theme-pastel" />
          <Label htmlFor="theme-pastel">Pastel</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ThemeSettingsForm;

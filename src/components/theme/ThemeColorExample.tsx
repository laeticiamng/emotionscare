
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check, Sun, Moon, Laptop, Palette } from 'lucide-react';
import { Theme } from '@/contexts/ThemeContext';

interface ThemeColorExampleProps {
  initialTheme?: Theme;
  onThemeChange?: (theme: Theme) => void;
  className?: string;
}

const ThemeColorExample: React.FC<ThemeColorExampleProps> = ({
  initialTheme = 'system',
  onThemeChange,
  className
}) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(initialTheme);
  
  const handleThemeChange = (theme: Theme) => {
    setSelectedTheme(theme);
    if (onThemeChange) {
      onThemeChange(theme);
    }
  };
  
  const getThemeIcon = (theme: Theme) => {
    switch (theme) {
      case 'light': return <Sun size={16} />;
      case 'dark': return <Moon size={16} />;
      case 'system': return <Laptop size={16} />;
      case 'pastel': return <Palette size={16} />;
      default: return <Sun size={16} />;
    }
  };
  
  return (
    <Card className={`p-4 ${className || ''}`}>
      <RadioGroup 
        value={selectedTheme} 
        onValueChange={(value) => handleThemeChange(value as Theme)}
        className="grid grid-cols-2 gap-2"
      >
        <div>
          <RadioGroupItem 
            value="light" 
            id="light" 
            className="peer sr-only" 
          />
          <Label
            htmlFor="light"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Sun size={14} />
            </div>
            <div className="mt-2 font-medium">Clair</div>
            {selectedTheme === 'light' && (
              <Check className="h-4 w-4 text-primary absolute top-2 right-2" />
            )}
          </Label>
        </div>
        
        <div>
          <RadioGroupItem 
            value="dark" 
            id="dark" 
            className="peer sr-only" 
          />
          <Label
            htmlFor="dark"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Moon size={14} />
            </div>
            <div className="mt-2 font-medium">Sombre</div>
            {selectedTheme === 'dark' && (
              <Check className="h-4 w-4 text-primary absolute top-2 right-2" />
            )}
          </Label>
        </div>
        
        <div>
          <RadioGroupItem 
            value="pastel" 
            id="pastel" 
            className="peer sr-only" 
          />
          <Label
            htmlFor="pastel"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Palette size={14} />
            </div>
            <div className="mt-2 font-medium">Pastel</div>
            {selectedTheme === 'pastel' && (
              <Check className="h-4 w-4 text-primary absolute top-2 right-2" />
            )}
          </Label>
        </div>
        
        <div>
          <RadioGroupItem 
            value="system" 
            id="system" 
            className="peer sr-only" 
          />
          <Label
            htmlFor="system"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Laptop size={14} />
            </div>
            <div className="mt-2 font-medium">Système</div>
            {selectedTheme === 'system' && (
              <Check className="h-4 w-4 text-primary absolute top-2 right-2" />
            )}
          </Label>
        </div>
      </RadioGroup>
    </Card>
  );
};

export default ThemeColorExample;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Laptop, Palette } from 'lucide-react';
import { ThemeSettingsTabProps } from '@/types/theme';

export const ThemeSettingsTab: React.FC<ThemeSettingsTabProps> = ({
  currentTheme,
  onThemeChange
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Apparence</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Personnalisez l'apparence de l'application selon vos préférences.
        </p>
        
        <Card>
          <CardContent className="pt-6">
            <RadioGroup 
              value={currentTheme} 
              onValueChange={(value) => onThemeChange(value as any)}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <div>
                <RadioGroupItem value="light" id="light" className="sr-only" />
                <Label 
                  htmlFor="light"
                  className={`flex flex-col items-center p-4 border rounded-md hover:bg-accent cursor-pointer ${currentTheme === 'light' ? 'bg-accent border-primary' : ''}`}
                >
                  <Sun className="h-6 w-6 mb-2" />
                  <span>Clair</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem value="dark" id="dark" className="sr-only" />
                <Label 
                  htmlFor="dark" 
                  className={`flex flex-col items-center p-4 border rounded-md hover:bg-accent cursor-pointer ${currentTheme === 'dark' ? 'bg-accent border-primary' : ''}`}
                >
                  <Moon className="h-6 w-6 mb-2" />
                  <span>Sombre</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem value="system" id="system" className="sr-only" />
                <Label 
                  htmlFor="system" 
                  className={`flex flex-col items-center p-4 border rounded-md hover:bg-accent cursor-pointer ${currentTheme === 'system' ? 'bg-accent border-primary' : ''}`}
                >
                  <Laptop className="h-6 w-6 mb-2" />
                  <span>Système</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem value="blue-pastel" id="blue-pastel" className="sr-only" />
                <Label 
                  htmlFor="blue-pastel" 
                  className={`flex flex-col items-center p-4 border rounded-md hover:bg-accent cursor-pointer ${currentTheme === 'blue-pastel' ? 'bg-accent border-primary' : ''}`}
                >
                  <Palette className="h-6 w-6 mb-2" />
                  <span>Bleu Pastel</span>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThemeSettingsTab;

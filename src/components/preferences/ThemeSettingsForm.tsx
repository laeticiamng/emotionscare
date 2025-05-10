
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePreferences } from '@/hooks/usePreferences';
import { ThemeName } from '@/types';

const ThemeSettingsForm: React.FC = () => {
  const { preferences, updatePreferences } = usePreferences();
  
  const handleThemeChange = (theme: ThemeName) => {
    updatePreferences({ theme });
  };
  
  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6 space-y-4">
        <div>
          <h3 className="font-medium mb-4">Apparence</h3>
          <RadioGroup 
            defaultValue={preferences.theme} 
            onValueChange={(value) => handleThemeChange(value as ThemeName)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">System</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSettingsForm;

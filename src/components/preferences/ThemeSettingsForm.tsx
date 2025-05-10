
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { MoonStar, SunMedium, Palette, Sparkles } from "lucide-react";
import { ThemeName, UserPreferencesState } from '@/types';

interface ThemeSettingsFormProps {
  preferences: UserPreferencesState;
  onUpdate: (preferences: Partial<UserPreferencesState>) => void;
  isUpdating?: boolean;
}

const ThemeSettingsForm: React.FC<ThemeSettingsFormProps> = ({
  preferences,
  onUpdate,
  isUpdating = false,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>(preferences.theme || 'system');
  const [enableDynamicTheme, setEnableDynamicTheme] = useState(
    preferences.dynamicTheme?.enableEmotionBased || false
  );

  // Update the theme when the preferences change
  useEffect(() => {
    setSelectedTheme(preferences.theme || 'system');
    setEnableDynamicTheme(preferences.dynamicTheme?.enableEmotionBased || false);
  }, [preferences]);

  const handleThemeChange = (theme: ThemeName) => {
    setSelectedTheme(theme);
    onUpdate({ 
      theme: theme,
      dynamicTheme: {
        ...preferences.dynamicTheme,
        enableEmotionBased: enableDynamicTheme
      } 
    });
  };

  const handleDynamicThemeToggle = (enabled: boolean) => {
    setEnableDynamicTheme(enabled);
    onUpdate({
      dynamicTheme: {
        ...preferences.dynamicTheme,
        enableEmotionBased: enabled
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="h-5 w-5 mr-2" />
          Paramètres d'apparence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme selection */}
        <div className="space-y-3">
          <Label className="text-base">Thème visuel</Label>
          <RadioGroup 
            value={selectedTheme} 
            onValueChange={(value: string) => handleThemeChange(value as ThemeName)} 
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="border rounded-xl p-4 w-full aspect-square flex items-center justify-center bg-background transition-all hover:border-primary">
                <Label 
                  htmlFor="theme-light" 
                  className="cursor-pointer w-full h-full flex flex-col items-center justify-center space-y-2"
                >
                  <SunMedium className="h-8 w-8" />
                  <span>Clair</span>
                  <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                </Label>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="border rounded-xl p-4 w-full aspect-square flex items-center justify-center bg-background transition-all hover:border-primary">
                <Label 
                  htmlFor="theme-dark" 
                  className="cursor-pointer w-full h-full flex flex-col items-center justify-center space-y-2"
                >
                  <MoonStar className="h-8 w-8" />
                  <span>Sombre</span>
                  <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                </Label>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="border rounded-xl p-4 w-full aspect-square flex items-center justify-center bg-background transition-all hover:border-primary">
                <Label 
                  htmlFor="theme-pastel" 
                  className="cursor-pointer w-full h-full flex flex-col items-center justify-center space-y-2"
                >
                  <Palette className="h-8 w-8" />
                  <span>Pastel</span>
                  <RadioGroupItem value="pastel" id="theme-pastel" className="sr-only" />
                </Label>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="border rounded-xl p-4 w-full aspect-square flex items-center justify-center bg-background transition-all hover:border-primary">
                <Label 
                  htmlFor="theme-nature" 
                  className="cursor-pointer w-full h-full flex flex-col items-center justify-center space-y-2"
                >
                  <Sparkles className="h-8 w-8" />
                  <span>Nature</span>
                  <RadioGroupItem value="nature" id="theme-nature" className="sr-only" />
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Dynamic theme option */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="dynamic-theme-toggle" className="text-base font-medium">
              Thème dynamique émotionnel
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Adapte automatiquement les couleurs et l'ambiance à votre état émotionnel
            </p>
          </div>
          <Switch
            id="dynamic-theme-toggle"
            checked={enableDynamicTheme}
            onCheckedChange={handleDynamicThemeToggle}
            disabled={isUpdating}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSettingsForm;

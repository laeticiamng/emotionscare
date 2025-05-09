
import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ThemeName } from '@/types';
import { Sun, Moon, Palette, Clock, CloudRain, Heart } from 'lucide-react';

const ThemeSettingsForm = () => {
  const { theme, setThemePreference } = useTheme();
  const { toast } = useToast();
  const [themeMode, setThemeMode] = useState<ThemeName>(theme as ThemeName);
  const [dynamicTheme, setDynamicTheme] = useState<string>('none');
  const [fontFamily, setFontFamily] = useState('inter');
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState('');

  const handleThemeChange = (value: ThemeName) => {
    setThemeMode(value);
    setThemePreference(value);
  };

  const saveSettings = () => {
    toast({
      title: "Thème mis à jour",
      description: `Le thème a été changé pour "${themeMode}".`
    });
  };

  const getThemeIcon = (themeName: string) => {
    switch (themeName) {
      case 'light': return <Sun className="h-4 w-4" />;
      case 'dark': return <Moon className="h-4 w-4" />;
      case 'pastel': return <Palette className="h-4 w-4" />;
      default: return <Sun className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="font-medium">Thème de l'interface</h3>
        <RadioGroup 
          defaultValue={theme}
          onValueChange={(value) => handleThemeChange(value as ThemeName)}
          className="grid grid-cols-3 gap-4"
        >
          <div className="relative">
            <RadioGroupItem 
              value="light" 
              id="theme-light" 
              className="absolute inset-0 w-full h-full opacity-0 peer"
            />
            <Label 
              htmlFor="theme-light" 
              className="flex flex-col items-center justify-center p-4 border rounded-lg peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary h-full cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#f8f9fa] flex items-center justify-center mb-2 border">
                <Sun className="h-6 w-6 text-[#6E59A5]" />
              </div>
              <span>Clair</span>
            </Label>
          </div>
          
          <div className="relative">
            <RadioGroupItem 
              value="dark" 
              id="theme-dark" 
              className="absolute inset-0 w-full h-full opacity-0 peer"
            />
            <Label 
              htmlFor="theme-dark" 
              className="flex flex-col items-center justify-center p-4 border rounded-lg peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary h-full cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#1a1f2c] flex items-center justify-center mb-2 border">
                <Moon className="h-6 w-6 text-[#9b87f5]" />
              </div>
              <span>Sombre</span>
            </Label>
          </div>
          
          <div className="relative">
            <RadioGroupItem 
              value="pastel" 
              id="theme-pastel" 
              className="absolute inset-0 w-full h-full opacity-0 peer"
            />
            <Label 
              htmlFor="theme-pastel" 
              className="flex flex-col items-center justify-center p-4 border rounded-lg peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary h-full cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#f5f1ff] flex items-center justify-center mb-2 border">
                <Palette className="h-6 w-6 text-[#7E69AB]" />
              </div>
              <span>Pastel</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium">Thème dynamique</h3>
        <p className="text-sm text-muted-foreground">Ajuster automatiquement le thème selon:</p>
        
        <RadioGroup 
          defaultValue={dynamicTheme}
          onValueChange={setDynamicTheme}
          className="grid grid-cols-2 gap-3"
        >
          <div className="relative">
            <RadioGroupItem 
              value="time" 
              id="dynamic-time" 
              className="absolute inset-0 w-full h-full opacity-0 peer"
            />
            <Label 
              htmlFor="dynamic-time" 
              className="flex items-center p-3 border rounded-lg peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary h-full cursor-pointer"
            >
              <Clock className="h-4 w-4 mr-2" />
              <span>Heure de la journée</span>
            </Label>
          </div>
          
          <div className="relative">
            <RadioGroupItem 
              value="emotion" 
              id="dynamic-emotion" 
              className="absolute inset-0 w-full h-full opacity-0 peer"
            />
            <Label 
              htmlFor="dynamic-emotion" 
              className="flex items-center p-3 border rounded-lg peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary h-full cursor-pointer"
            >
              <Heart className="h-4 w-4 mr-2" />
              <span>Émotion détectée</span>
            </Label>
          </div>
          
          <div className="relative">
            <RadioGroupItem 
              value="weather" 
              id="dynamic-weather" 
              className="absolute inset-0 w-full h-full opacity-0 peer"
            />
            <Label 
              htmlFor="dynamic-weather" 
              className="flex items-center p-3 border rounded-lg peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary h-full cursor-pointer"
            >
              <CloudRain className="h-4 w-4 mr-2" />
              <span>Météo locale</span>
            </Label>
          </div>
          
          <div className="relative">
            <RadioGroupItem 
              value="none" 
              id="dynamic-none" 
              className="absolute inset-0 w-full h-full opacity-0 peer"
            />
            <Label 
              htmlFor="dynamic-none" 
              className="flex items-center p-3 border rounded-lg peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary h-full cursor-pointer"
            >
              <div className="h-4 w-4 mr-2 border rounded-full"></div>
              <span>Aucun (fixe)</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Police de caractères</h3>
        <Select defaultValue={fontFamily} onValueChange={setFontFamily}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir une police" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inter" className="font-['Inter']">Inter</SelectItem>
            <SelectItem value="dm-sans" className="font-['DM_Sans']">DM Sans</SelectItem>
            <SelectItem value="serif" className="font-serif">Serif élégant</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Arrière-plan personnalisé</h3>
        <p className="text-sm text-muted-foreground">URL de l'image (optionnelle)</p>
        <Input 
          placeholder="https://exemple.com/image.jpg" 
          value={customBackgroundUrl}
          onChange={(e) => setCustomBackgroundUrl(e.target.value)}
        />
      </div>

      <Button onClick={saveSettings} className="w-full">
        Enregistrer les préférences
      </Button>
    </div>
  );
};

export default ThemeSettingsForm;

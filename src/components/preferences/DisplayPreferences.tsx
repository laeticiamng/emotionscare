
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { UserPreferences } from '@/types/preferences';

interface DisplayPreferencesProps {
  theme: string;
  fontSize: string;
  language: string;
  reduceMotion?: boolean;
  colorBlindMode?: string;
  onUpdate: (values: Partial<UserPreferences>) => void;
}

const DisplayPreferences = ({
  theme,
  fontSize,
  language,
  reduceMotion = false,
  colorBlindMode,
  onUpdate
}: DisplayPreferencesProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Thème</h3>
        <RadioGroup
          value={theme}
          onValueChange={(value) => onUpdate({ theme: value as 'light' | 'dark' | 'pastel' | 'system' })}
          className="grid grid-cols-4 gap-4"
        >
          <div>
            <RadioGroupItem value="light" id="light" className="peer sr-only" />
            <Label
              htmlFor="light"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="rounded-full w-8 h-8 border bg-white mb-2"></div>
              <span className="block w-full text-center">Clair</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
            <Label
              htmlFor="dark"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gray-950 p-4 hover:bg-gray-900 hover:border-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="rounded-full w-8 h-8 border bg-gray-800 mb-2"></div>
              <span className="block w-full text-center text-white">Sombre</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="pastel" id="pastel" className="peer sr-only" />
            <Label
              htmlFor="pastel"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gradient-to-r from-pink-100 to-blue-100 p-4 hover:opacity-90 hover:border-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="rounded-full w-8 h-8 border bg-gradient-to-r from-pink-200 to-blue-200 mb-2"></div>
              <span className="block w-full text-center">Pastel</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="system" id="system" className="peer sr-only" />
            <Label
              htmlFor="system"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gradient-to-r from-white to-gray-900 p-4 hover:opacity-90 hover:border-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="rounded-full w-8 h-8 border bg-gradient-to-r from-white to-gray-800 mb-2"></div>
              <span className="block w-full text-center">Système</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Taille de police</h3>
        <RadioGroup
          value={fontSize}
          onValueChange={(value) => onUpdate({ fontSize: value as 'small' | 'medium' | 'large' | 'xlarge' })}
          className="grid grid-cols-4 gap-4"
        >
          <div>
            <RadioGroupItem value="small" id="small" className="peer sr-only" />
            <Label
              htmlFor="small"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="text-sm">Aa</span>
              <span className="block w-full text-center text-xs">Petite</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="medium" id="medium" className="peer sr-only" />
            <Label
              htmlFor="medium"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="text-base">Aa</span>
              <span className="block w-full text-center text-xs">Moyenne</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="large" id="large" className="peer sr-only" />
            <Label
              htmlFor="large"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="text-lg">Aa</span>
              <span className="block w-full text-center text-xs">Grande</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="xlarge" id="xlarge" className="peer sr-only" />
            <Label
              htmlFor="xlarge"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="text-xl">Aa</span>
              <span className="block w-full text-center text-xs">Très grande</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Langue</h3>
        <Select
          value={language}
          onValueChange={(value) => onUpdate({ language: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez une langue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="de">Deutsch</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Accessibilité</h3>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="reduce-motion" className="flex-grow">
            Réduire les animations
            <p className="text-sm text-muted-foreground">
              Limite les effets de mouvement et les transitions
            </p>
          </Label>
          <Switch
            id="reduce-motion"
            checked={reduceMotion}
            onCheckedChange={(checked) => onUpdate({ reduceMotion: checked })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="color-blind-mode">Mode daltonien</Label>
          <Select
            value={colorBlindMode || 'none'}
            onValueChange={(value) => onUpdate({ colorBlindMode: value === 'none' ? '' : value })}
          >
            <SelectTrigger id="color-blind-mode" className="w-full">
              <SelectValue placeholder="Sélectionnez un mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun</SelectItem>
              <SelectItem value="protanopia">Protanopie</SelectItem>
              <SelectItem value="deuteranopia">Deutéranopie</SelectItem>
              <SelectItem value="tritanopia">Tritanopie</SelectItem>
              <SelectItem value="achromatopsia">Achromatopsie</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DisplayPreferences;

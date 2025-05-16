
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { UserPreferences, FontSize, FontFamily } from '@/types/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface DisplayPreferencesProps {
  preferences: UserPreferences;
  onChange: (preferences: Partial<UserPreferences>) => void;
  className?: string;
}

const DisplayPreferences: React.FC<DisplayPreferencesProps> = ({
  preferences,
  onChange,
  className = ''
}) => {
  const handleFontSizeChange = (size: string) => {
    // Cast the string to FontSize type
    onChange({ fontSize: size as FontSize });
  };

  const handleFontFamilyChange = (family: string) => {
    // Cast the string to FontFamily type
    onChange({ fontFamily: family as FontFamily });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Mode sombre</Label>
            <p className="text-sm text-muted-foreground">
              Activer le thème sombre pour une utilisation nocturne
            </p>
          </div>
          <Switch
            checked={preferences.theme === 'dark'}
            onCheckedChange={(checked) => onChange({ theme: checked ? 'dark' : 'light' })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Réduire les animations</Label>
            <p className="text-sm text-muted-foreground">
              Réduire les animations pour améliorer les performances
            </p>
          </div>
          <Switch
            checked={preferences.reduceMotion}
            onCheckedChange={(checked) => onChange({ reduceMotion: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Mode daltonisme</Label>
            <p className="text-sm text-muted-foreground">
              Utiliser des couleurs adaptées aux daltoniens
            </p>
          </div>
          <Switch
            checked={preferences.colorBlindMode}
            onCheckedChange={(checked) => onChange({ colorBlindMode: checked })}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center mb-2">
          <Label className="text-base">Taille du texte</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 ml-1 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Ajustez la taille du texte pour une meilleure lisibilité</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <RadioGroup
          value={preferences.fontSize as string}
          onValueChange={handleFontSizeChange}
          className="flex items-center space-x-2"
        >
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="small" id="small" />
            <Label htmlFor="small" className="text-sm">S</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium" className="text-base">M</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="large" id="large" />
            <Label htmlFor="large" className="text-lg">L</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="x-large" id="x-large" />
            <Label htmlFor="x-large" className="text-xl">XL</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <div className="flex items-center mb-2">
          <Label className="text-base">Police de caractères</Label>
        </div>
        <RadioGroup
          value={preferences.fontFamily as string}
          onValueChange={handleFontFamilyChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="system" id="system" />
            <Label htmlFor="system" className="font-sans">Système</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="serif" id="serif" />
            <Label htmlFor="serif" className="font-serif">Serif</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sans-serif" id="sans-serif" />
            <Label htmlFor="sans-serif" className="font-sans">Sans Serif</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monospace" id="monospace" />
            <Label htmlFor="monospace" className="font-mono">Monospace</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default DisplayPreferences;

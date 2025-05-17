
import React from 'react';
import { UserPreferences } from '@/types/user';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

interface DisplayPreferencesProps {
  preferences: UserPreferences;
  onChange: (preferences: Partial<UserPreferences>) => void;
}

const DisplayPreferences: React.FC<DisplayPreferencesProps> = ({ 
  preferences,
  onChange
}) => {
  // Handle theme selection
  const handleThemeChange = (value: string) => {
    onChange({
      theme: value as 'light' | 'dark' | 'system' | 'pastel'
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base">Thème de l'application</Label>
        <RadioGroup
          value={preferences.theme || 'system'}
          onValueChange={handleThemeChange}
          className="grid grid-cols-2 gap-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light">Clair</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="dark" />
            <Label htmlFor="dark">Sombre</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="system" id="system" />
            <Label htmlFor="system">Système</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pastel" id="pastel" />
            <Label htmlFor="pastel">Pastel</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base">Police de caractères</Label>
        <RadioGroup
          value={preferences.fontFamily || 'system'}
          onValueChange={(value) => onChange({ fontFamily: value as 'system' | 'serif' | 'mono' | 'sans' })}
          className="grid grid-cols-2 gap-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="system" id="font-system" />
            <Label htmlFor="font-system" className="font-sans">Système</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="serif" id="font-serif" />
            <Label htmlFor="font-serif" className="font-serif">Serif</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sans" id="font-sans" />
            <Label htmlFor="font-sans" className="font-sans">Sans</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mono" id="font-mono" />
            <Label htmlFor="font-mono" className="font-mono">Mono</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base">Taille du texte</Label>
        <RadioGroup
          value={preferences.fontSize || 'medium'}
          onValueChange={(value) => onChange({ fontSize: value as 'small' | 'medium' | 'large' })}
          className="grid grid-cols-3 gap-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="small" id="size-small" />
            <Label htmlFor="size-small" className="text-xs">Petite</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="size-medium" />
            <Label htmlFor="size-medium" className="text-base">Moyenne</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="large" id="size-large" />
            <Label htmlFor="size-large" className="text-lg">Grande</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="reduceMotion" className="text-base">Réduire les animations</Label>
          <p className="text-sm text-muted-foreground">
            Désactiver ou simplifier les animations pour réduire la fatigue visuelle
          </p>
        </div>
        <Switch
          id="reduceMotion"
          checked={preferences.reduceMotion || false}
          onCheckedChange={(checked) => onChange({ reduceMotion: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="colorBlindMode" className="text-base">Mode daltonien</Label>
          <p className="text-sm text-muted-foreground">
            Adapter les couleurs pour améliorer la visibilité
          </p>
        </div>
        <Switch
          id="colorBlindMode"
          checked={preferences.colorBlindMode || false}
          onCheckedChange={(checked) => onChange({ colorBlindMode: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="autoplayMedia" className="text-base">Lecture automatique des médias</Label>
          <p className="text-sm text-muted-foreground">
            Lancer automatiquement les vidéos et sons
          </p>
        </div>
        <Switch
          id="autoplayMedia"
          checked={preferences.autoplayMedia || false}
          onCheckedChange={(checked) => onChange({ autoplayMedia: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="soundEnabled" className="text-base">Effets sonores</Label>
          <p className="text-sm text-muted-foreground">
            Activer les sons d'interaction et de notification
          </p>
        </div>
        <Switch
          id="soundEnabled"
          checked={preferences.soundEnabled || false}
          onCheckedChange={(checked) => onChange({ soundEnabled: checked })}
        />
      </div>
    </div>
  );
};

export default DisplayPreferences;

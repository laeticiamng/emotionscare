
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPreferences } from '@/types/types';

interface DisplayPreferencesProps {
  preferences: UserPreferences;
  onChange: (value: Partial<UserPreferences>) => void;
}

const DisplayPreferences: React.FC<DisplayPreferencesProps> = ({ preferences, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-base">Thème</Label>
        <RadioGroup
          value={preferences.theme}
          onValueChange={(value: "light" | "dark" | "system" | "pastel") => 
            onChange({ theme: value })
          }
          className="flex flex-col space-y-2"
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

      <div className="space-y-3">
        <Label htmlFor="fontFamily" className="text-base">Police</Label>
        <Select
          value={preferences.fontFamily}
          onValueChange={(value: "system" | "serif" | "sans-serif" | "monospace") => 
            onChange({ fontFamily: value })
          }
        >
          <SelectTrigger id="fontFamily">
            <SelectValue placeholder="Choisir une police" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="system">Système</SelectItem>
            <SelectItem value="sans-serif">Sans-serif</SelectItem>
            <SelectItem value="serif">Serif</SelectItem>
            <SelectItem value="monospace">Monospace</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label htmlFor="fontSize" className="text-base">Taille du texte</Label>
        <Select
          value={preferences.fontSize}
          onValueChange={(value: "small" | "medium" | "large") => 
            onChange({ fontSize: value })
          }
        >
          <SelectTrigger id="fontSize">
            <SelectValue placeholder="Choisir une taille" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Petite</SelectItem>
            <SelectItem value="medium">Moyenne</SelectItem>
            <SelectItem value="large">Grande</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-base">Accessibilité</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="reduceMotion"
              checked={preferences.reduceMotion}
              onCheckedChange={(checked) =>
                onChange({ reduceMotion: checked === true })
              }
            />
            <Label htmlFor="reduceMotion" className="font-normal">
              Réduire les animations
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="colorBlindMode"
              checked={preferences.colorBlindMode}
              onCheckedChange={(checked) =>
                onChange({ colorBlindMode: checked === true })
              }
            />
            <Label htmlFor="colorBlindMode" className="font-normal">
              Mode daltonisme
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-base">Média</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="autoplayMedia"
              checked={preferences.autoplayMedia}
              onCheckedChange={(checked) =>
                onChange({ autoplayMedia: checked === true })
              }
            />
            <Label htmlFor="autoplayMedia" className="font-normal">
              Lecture automatique des médias
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="soundEnabled"
              checked={preferences.soundEnabled}
              onCheckedChange={(checked) =>
                onChange({ soundEnabled: checked === true })
              }
            />
            <Label htmlFor="soundEnabled" className="font-normal">
              Sons activés
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayPreferences;

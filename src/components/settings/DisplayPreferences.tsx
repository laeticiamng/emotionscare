
import React from 'react';
import { UserPreferences } from '@/types/types';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DisplayPreferencesProps {
  preferences: UserPreferences;
  onChange: (preferences: Partial<UserPreferences>) => void;
}

const DisplayPreferences: React.FC<DisplayPreferencesProps> = ({ preferences, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="theme">Thème</Label>
          <Select
            value={preferences.theme}
            onValueChange={(value) => onChange({ theme: value })}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Sélectionner un thème" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Clair</SelectItem>
              <SelectItem value="dark">Sombre</SelectItem>
              <SelectItem value="system">Système</SelectItem>
              <SelectItem value="pastel">Pastel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="fontSize">Taille de police</Label>
          <Select
            value={preferences.fontSize}
            onValueChange={(value) => onChange({ fontSize: value })}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Sélectionner une taille" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Petite</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="fontFamily">Police</Label>
          <Select
            value={preferences.fontFamily}
            onValueChange={(value) => onChange({ fontFamily: value })}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Sélectionner une police" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">Système</SelectItem>
              <SelectItem value="sans-serif">Sans Serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="monospace">Monospace</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="reduceMotion">Réduire les animations</Label>
            <p className="text-sm text-muted-foreground">
              Minimiser les animations et transitions de l'interface
            </p>
          </div>
          <Switch
            id="reduceMotion"
            checked={preferences.reduceMotion}
            onCheckedChange={(checked) => onChange({ reduceMotion: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="colorBlindMode">Mode daltonien</Label>
            <p className="text-sm text-muted-foreground">
              Optimiser les couleurs pour le daltonisme
            </p>
          </div>
          <Switch
            id="colorBlindMode"
            checked={preferences.colorBlindMode}
            onCheckedChange={(checked) => onChange({ colorBlindMode: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="autoplayMedia">Lecture automatique des médias</Label>
            <p className="text-sm text-muted-foreground">
              Activer la lecture automatique des médias
            </p>
          </div>
          <Switch
            id="autoplayMedia"
            checked={preferences.autoplayMedia}
            onCheckedChange={(checked) => onChange({ autoplayMedia: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="soundEnabled">Sons activés</Label>
            <p className="text-sm text-muted-foreground">
              Activer les sons de l'interface
            </p>
          </div>
          <Switch
            id="soundEnabled"
            checked={preferences.soundEnabled}
            onCheckedChange={(checked) => onChange({ soundEnabled: checked })}
          />
        </div>
      </div>
    </div>
  );
};

export default DisplayPreferences;

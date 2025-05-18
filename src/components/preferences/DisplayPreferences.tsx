
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/use-theme';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Theme } from '@/types/theme';

const DisplayPreferences: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { preferences, updatePreferences } = useUserPreferences();

  const handleThemeChange = (value: string) => {
    // Convertir la valeur en type Theme avant de la passer à setTheme
    const themeValue = value as Theme;
    setTheme(themeValue);
    updatePreferences({ theme: themeValue });
  };

  const handleFontFamilyChange = (value: string) => {
    updatePreferences({ 
      fontFamily: value 
    });
  };

  const handleFontSizeChange = (value: string) => {
    updatePreferences({ 
      fontSize: value as 'small' | 'medium' | 'large' | 'xlarge'
    });
  };

  const handleToggleReduceMotion = (checked: boolean) => {
    updatePreferences({ 
      reduceMotion: checked 
    });
  };

  const handleToggleColorBlindMode = (checked: boolean) => {
    updatePreferences({ 
      colorBlindMode: checked ? 'enabled' : undefined
    });
  };

  const handleToggleAutoplayMedia = (checked: boolean) => {
    updatePreferences({ 
      autoplayMedia: checked 
    });
  };

  const handleToggleSoundEnabled = (checked: boolean) => {
    updatePreferences({ 
      soundEnabled: checked 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences d'affichage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="theme-select">Thème</Label>
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger id="theme-select">
              <SelectValue placeholder="Sélectionnez un thème" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Lumineux</SelectItem>
              <SelectItem value="dark">Sombre</SelectItem>
              <SelectItem value="system">Système</SelectItem>
              <SelectItem value="pastel">Pastel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font-family-select">Police</Label>
          <Select 
            value={preferences?.fontFamily || 'system'} 
            onValueChange={handleFontFamilyChange}
          >
            <SelectTrigger id="font-family-select">
              <SelectValue placeholder="Sélectionnez une police" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">Système</SelectItem>
              <SelectItem value="sans">Sans-serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
              <SelectItem value="rounded">Arrondie</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font-size-select">Taille de police</Label>
          <Select 
            value={preferences?.fontSize || 'medium'} 
            onValueChange={handleFontSizeChange}
          >
            <SelectTrigger id="font-size-select">
              <SelectValue placeholder="Sélectionnez une taille de police" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Petite</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
              <SelectItem value="xlarge">Très grande</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="reduce-motion">Réduire les animations</Label>
          <Switch 
            id="reduce-motion" 
            checked={Boolean(preferences?.reduceMotion)} 
            onCheckedChange={handleToggleReduceMotion}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="colorblind-mode">Mode daltonien</Label>
          <Switch 
            id="colorblind-mode" 
            checked={Boolean(preferences?.colorBlindMode)} 
            onCheckedChange={handleToggleColorBlindMode}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="autoplay-media">Lecture automatique des médias</Label>
          <Switch 
            id="autoplay-media" 
            checked={Boolean(preferences?.autoplayMedia)} 
            onCheckedChange={handleToggleAutoplayMedia}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="sound-enabled">Sons activés</Label>
          <Switch 
            id="sound-enabled" 
            checked={Boolean(preferences?.soundEnabled)} 
            onCheckedChange={handleToggleSoundEnabled}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplayPreferences;

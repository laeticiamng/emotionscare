
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { AccessibilityPreferences } from '@/types/preferences';

const AccessibilitySettings: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const accessibility = preferences.accessibility as AccessibilityPreferences;

  const updateAccessibilitySetting = (key: keyof AccessibilityPreferences, value: boolean) => {
    updatePreferences({
      accessibility: {
        ...accessibility,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Options d'accessibilité</h3>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="high-contrast">Contraste élevé</Label>
            <p className="text-sm text-muted-foreground">
              Améliore la lisibilité avec des couleurs plus contrastées
            </p>
          </div>
          <Switch
            id="high-contrast"
            checked={accessibility.highContrast}
            onCheckedChange={(checked) => updateAccessibilitySetting('highContrast', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="reduce-motion">Réduire les animations</Label>
            <p className="text-sm text-muted-foreground">
              Diminue les mouvements et animations pour plus de confort
            </p>
          </div>
          <Switch
            id="reduce-motion"
            checked={accessibility.reduceMotion}
            onCheckedChange={(checked) => updateAccessibilitySetting('reduceMotion', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="screen-reader">Support lecteur d'écran</Label>
            <p className="text-sm text-muted-foreground">
              Optimise l'interface pour les lecteurs d'écran
            </p>
          </div>
          <Switch
            id="screen-reader"
            checked={accessibility.screenReader}
            onCheckedChange={(checked) => updateAccessibilitySetting('screenReader', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="keyboard-navigation">Navigation clavier</Label>
            <p className="text-sm text-muted-foreground">
              Active les raccourcis clavier pour la navigation
            </p>
          </div>
          <Switch
            id="keyboard-navigation"
            checked={accessibility.keyboardNavigation}
            onCheckedChange={(checked) => updateAccessibilitySetting('keyboardNavigation', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="large-text">Texte agrandi</Label>
            <p className="text-sm text-muted-foreground">
              Augmente la taille du texte dans toute l'application
            </p>
          </div>
          <Switch
            id="large-text"
            checked={accessibility.largeText}
            onCheckedChange={(checked) => updateAccessibilitySetting('largeText', checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySettings;

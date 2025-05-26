
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Keyboard, Volume2, Type, Contrast } from 'lucide-react';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

const AccessibilityEnhancer: React.FC = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Détecter les préférences système
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

    setSettings(prev => ({
      ...prev,
      reducedMotion: prefersReducedMotion,
      highContrast: prefersHighContrast,
    }));

    // Appliquer les styles d'accessibilité
    applyAccessibilityStyles(settings);
  }, []);

  const applyAccessibilityStyles = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;

    // Contraste élevé
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Texte agrandi
    if (newSettings.largeText) {
      root.style.fontSize = '120%';
    } else {
      root.style.fontSize = '';
    }

    // Mouvement réduit
    if (newSettings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Navigation clavier
    if (newSettings.keyboardNavigation) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }
  };

  const updateSetting = (key: keyof AccessibilitySettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    applyAccessibilityStyles(newSettings);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
  };

  const togglePanel = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <Button
        onClick={togglePanel}
        size="sm"
        variant="outline"
        className="fixed top-4 right-20 z-50"
        aria-label="Ouvrir les paramètres d'accessibilité"
      >
        <Eye className="h-4 w-4" />
        <span className="sr-only">Accessibilité</span>
      </Button>

      {isVisible && (
        <Card className="fixed top-16 right-4 z-50 w-80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Accessibilité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                onClick={() => updateSetting('highContrast')}
                variant={settings.highContrast ? 'default' : 'outline'}
                className="w-full justify-start"
                aria-pressed={settings.highContrast}
              >
                <Contrast className="h-4 w-4 mr-2" />
                Contraste élevé
              </Button>

              <Button
                onClick={() => updateSetting('largeText')}
                variant={settings.largeText ? 'default' : 'outline'}
                className="w-full justify-start"
                aria-pressed={settings.largeText}
              >
                <Type className="h-4 w-4 mr-2" />
                Texte agrandi
              </Button>

              <Button
                onClick={() => updateSetting('reducedMotion')}
                variant={settings.reducedMotion ? 'default' : 'outline'}
                className="w-full justify-start"
                aria-pressed={settings.reducedMotion}
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Mouvement réduit
              </Button>

              <Button
                onClick={() => updateSetting('keyboardNavigation')}
                variant={settings.keyboardNavigation ? 'default' : 'outline'}
                className="w-full justify-start"
                aria-pressed={settings.keyboardNavigation}
              >
                <Keyboard className="h-4 w-4 mr-2" />
                Navigation clavier
              </Button>
            </div>

            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Ces paramètres améliorent l'accessibilité de l'interface
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AccessibilityEnhancer;

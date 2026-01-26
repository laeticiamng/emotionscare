import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import {
  Accessibility,
  Type,
  MousePointer,
  Volume2,
  Contrast,
  X
} from 'lucide-react';
import {
  safeClassAdd,
  safeClassRemove,
  safeGetDocumentRoot
} from '@/lib/safe-helpers';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  enhancedFocus: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  colorBlind: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  fontSize: number;
}

export const AccessibilityToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    enhancedFocus: false,
    screenReader: false,
    keyboardNavigation: false,
    colorBlind: 'none',
    fontSize: 16
  });

  // Charger les paramètres depuis localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem('accessibility-settings');
    } catch (error) {
      logger.warn('Failed to read accessibility settings', error, 'UI');
    }

    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setSettings(parsedSettings);
        applySettings(parsedSettings);
      } catch (error) {
        logger.error('Error loading accessibility settings', error, 'UI');
      }
    }
  }, []);

  // Sauvegarder et appliquer les paramètres
  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
      }
    } catch (error) {
      logger.warn('Failed to persist accessibility settings', error, 'UI');
    }
    applySettings(newSettings);
  };

  // Appliquer les paramètres au DOM
  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = safeGetDocumentRoot();
    const body = typeof document !== 'undefined' ? document.body : null;

    // Contraste élevé
    if (newSettings.highContrast) {
      safeClassAdd(body, 'high-contrast');
    } else {
      safeClassRemove(body, 'high-contrast');
    }

    // Texte large
    if (newSettings.largeText) {
      safeClassAdd(body, 'large-text');
    } else {
      safeClassRemove(body, 'large-text');
    }

    // Mouvement réduit
    if (newSettings.reducedMotion) {
      safeClassAdd(body, 'reduced-motion');
    } else {
      safeClassRemove(body, 'reduced-motion');
    }

    // Focus amélioré
    if (newSettings.enhancedFocus) {
      safeClassAdd(body, 'enhanced-focus');
    } else {
      safeClassRemove(body, 'enhanced-focus');
    }

    // Taille de police
    root.style.fontSize = `${newSettings.fontSize}px`;

    // Filtre daltonisme
    safeClassRemove(body, 'protanopia', 'deuteranopia', 'tritanopia');
    if (newSettings.colorBlind !== 'none') {
      safeClassAdd(body, newSettings.colorBlind);
    }
  };

  // Lecteur d'écran virtuel (simulation)
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    if (typeof document === 'undefined') return;
    document.body.appendChild(announcement);
    setTimeout(() => {
      if (announcement.parentNode) {
        announcement.parentNode.removeChild(announcement);
      }
    }, 1000);
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      enhancedFocus: false,
      screenReader: false,
      keyboardNavigation: false,
      colorBlind: 'none',
      fontSize: 16
    };
    setSettings(defaultSettings);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('accessibility-settings');
      }
    } catch (error) {
      logger.warn('Failed to clear accessibility settings', error, 'UI');
    }
    applySettings(defaultSettings);
    announceToScreenReader('Paramètres d\'accessibilité réinitialisés');
  };

  return (
    <>
      {/* Bouton d'ouverture */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Ouvrir les paramètres d'accessibilité"
        title="Accessibilité"
      >
        <Accessibility className="h-6 w-6" />
      </button>

      {/* Panel des paramètres */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-foreground">
                Paramètres d'accessibilité
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-accent rounded"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Contraste et couleurs */}
              <section>
                <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Contrast className="h-4 w-4" />
                  Contraste et couleurs
                </h3>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Contraste élevé</span>
                    <input
                      type="checkbox"
                      checked={settings.highContrast}
                      onChange={(e) => updateSetting('highContrast', e.target.checked)}
                      className="h-4 w-4"
                    />
                  </label>

                  <div>
                    <label className="text-sm text-foreground mb-2 block">
                      Assistance daltonisme
                    </label>
                    <select
                      value={settings.colorBlind}
                      onChange={(e) => updateSetting('colorBlind', e.target.value as any)}
                      className="w-full p-2 border rounded text-sm"
                    >
                      <option value="none">Aucun</option>
                      <option value="protanopia">Protanopie (rouge-vert)</option>
                      <option value="deuteranopia">Deutéranopie (rouge-vert)</option>
                      <option value="tritanopia">Tritanopie (bleu-jaune)</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Texte et typographie */}
              <section>
                <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Texte et typographie
                </h3>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Texte large</span>
                    <input
                      type="checkbox"
                      checked={settings.largeText}
                      onChange={(e) => updateSetting('largeText', e.target.checked)}
                      className="h-4 w-4"
                    />
                  </label>

                  <div>
                    <label className="text-sm text-foreground mb-2 block">
                      Taille de police: {settings.fontSize}px
                    </label>
                    <input
                      type="range"
                      min="14"
                      max="24"
                      value={settings.fontSize}
                      onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </section>

              {/* Navigation et interaction */}
              <section>
                <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <MousePointer className="h-4 w-4" />
                  Navigation et interaction
                </h3>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Focus amélioré</span>
                    <input
                      type="checkbox"
                      checked={settings.enhancedFocus}
                      onChange={(e) => updateSetting('enhancedFocus', e.target.checked)}
                      className="h-4 w-4"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Mouvement réduit</span>
                    <input
                      type="checkbox"
                      checked={settings.reducedMotion}
                      onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                      className="h-4 w-4"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Navigation clavier</span>
                    <input
                      type="checkbox"
                      checked={settings.keyboardNavigation}
                      onChange={(e) => updateSetting('keyboardNavigation', e.target.checked)}
                      className="h-4 w-4"
                    />
                  </label>
                </div>
              </section>

              {/* Lecteur d'écran */}
              <section>
                <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Lecteur d'écran
                </h3>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Mode lecteur d'écran</span>
                  <input
                    type="checkbox"
                    checked={settings.screenReader}
                    onChange={(e) => updateSetting('screenReader', e.target.checked)}
                    className="h-4 w-4"
                  />
                </label>
              </section>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={resetSettings}
                  className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
                >
                  Réinitialiser
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lien d'accès rapide (skip link) */}
      <a
        href="#main-content"
        className="skip-link"
        onFocus={() => announceToScreenReader('Lien d\'accès rapide au contenu principal')}
      >
        Aller au contenu principal
      </a>
    </>
  );
};

export default AccessibilityToolbar;
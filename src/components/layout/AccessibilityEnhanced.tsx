/**
 * Composants d'accessibilité enrichis
 * Skip links, indicateurs de focus, annonces dynamiques
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Settings, Eye, EyeOff, Type, Contrast, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from '@/lib/i18n-core';

// ============= Types et contexte =============

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  enhancedFocus: boolean;
  screenReaderMode: boolean;
  fontSize: number;
  announcements: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: any) => void;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

// ============= Hook d'utilisation =============

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

// ============= Provider d'accessibilité =============

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Charger depuis localStorage avec fallbacks
    const saved = localStorage.getItem('accessibility-settings');
    const defaults: AccessibilitySettings = {
      highContrast: false,
      largeText: false,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      enhancedFocus: false,
      screenReaderMode: false,
      fontSize: 100,
      announcements: true,
    };
    
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  });

  // Sauvegarder les changements
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  // Appliquer les classes CSS dynamiquement
  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;
    
    // Classes conditionnelles
    body.classList.toggle('high-contrast', settings.highContrast);
    body.classList.toggle('large-text', settings.largeText);
    body.classList.toggle('reduced-motion', settings.reducedMotion);
    body.classList.toggle('enhanced-focus', settings.enhancedFocus);
    body.classList.toggle('screen-reader-mode', settings.screenReaderMode);
    
    // Taille de police
    root.style.setProperty('--accessibility-font-scale', `${settings.fontSize / 100}`);
    
    return () => {
      // Cleanup
      body.classList.remove('high-contrast', 'large-text', 'reduced-motion', 'enhanced-focus', 'screen-reader-mode');
      root.style.removeProperty('--accessibility-font-scale');
    };
  }, [settings]);

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!settings.announcements) return;
    
    // Créer un élément pour les annonces aux lecteurs d'écran
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    // Nettoyer après annonce
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, announce }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// ============= Skip links améliorés =============

export const EnhancedSkipLinks: React.FC = () => {
  const { t } = useTranslation();
  
  const skipTargets = [
    { href: '#main-content', label: 'Aller au contenu principal' },
    { href: '#navigation', label: 'Aller à la navigation' },
    { href: '#sidebar', label: 'Aller à la barre latérale' },
    { href: '#footer', label: 'Aller au pied de page' },
  ];

  return (
    <div className="sr-only focus-within:not-sr-only">
      <nav aria-label="Liens de navigation rapide">
        <ul className="fixed top-2 left-2 z-50 space-y-1">
          {skipTargets.map((target) => (
            <li key={target.href}>
              <a
                href={target.href}
                className="skip-link bg-primary text-primary-foreground px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-foreground"
              >
                {target.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

// ============= Indicateur de navigation au clavier =============

export const KeyboardNavigationIndicator: React.FC = () => {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  if (!isKeyboardUser) return null;

  return (
    <div 
      className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-3 py-1 rounded text-sm"
      role="status"
      aria-live="polite"
    >
      Navigation clavier active
    </div>
  );
};

// ============= Annonces de changement de page =============

export const PageChangeAnnouncer: React.FC = () => {
  const location = useLocation();
  const { announce } = useAccessibility();

  useEffect(() => {
    // Annoncer les changements de page
    const pageTitle = document.title;
    announce(`Page chargée : ${pageTitle}`);
  }, [location.pathname, announce]);

  return null;
};

// ============= Panneau de contrôle d'accessibilité =============

export const AccessibilityControlPanel: React.FC = () => {
  const { settings, updateSetting } = useAccessibility();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bouton d'ouverture */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 rounded-full w-12 h-12 p-0"
        aria-label="Ouvrir les options d'accessibilité"
        title="Options d'accessibilité"
      >
        <Settings className="h-5 w-5" />
      </Button>

      {/* Panneau de contrôle */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-title"
        >
          <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 id="accessibility-title" className="text-lg font-semibold">
                  Options d'accessibilité
                </h2>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="sm"
                  aria-label="Fermer"
                >
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                {/* Contraste élevé */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Contrast className="h-4 w-4" />
                    <label htmlFor="high-contrast">Contraste élevé</label>
                  </div>
                  <Switch
                    id="high-contrast"
                    checked={settings.highContrast}
                    onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                  />
                </div>

                {/* Texte agrandi */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Type className="h-4 w-4" />
                    <label htmlFor="large-text">Texte agrandi</label>
                  </div>
                  <Switch
                    id="large-text"
                    checked={settings.largeText}
                    onCheckedChange={(checked) => updateSetting('largeText', checked)}
                  />
                </div>

                {/* Taille de police */}
                <div className="space-y-2">
                  <label htmlFor="font-size" className="flex items-center space-x-2">
                    <Type className="h-4 w-4" />
                    <span>Taille de police: {settings.fontSize}%</span>
                  </label>
                  <Slider
                    id="font-size"
                    min={75}
                    max={150}
                    step={5}
                    value={[settings.fontSize]}
                    onValueChange={([value]) => updateSetting('fontSize', value)}
                    className="w-full"
                  />
                </div>

                {/* Mouvements réduits */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4" />
                    <label htmlFor="reduced-motion">Mouvements réduits</label>
                  </div>
                  <Switch
                    id="reduced-motion"
                    checked={settings.reducedMotion}
                    onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                  />
                </div>

                {/* Focus amélioré */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <label htmlFor="enhanced-focus">Focus amélioré</label>
                  </div>
                  <Switch
                    id="enhanced-focus"
                    checked={settings.enhancedFocus}
                    onCheckedChange={(checked) => updateSetting('enhancedFocus', checked)}
                  />
                </div>

                {/* Mode lecteur d'écran */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <EyeOff className="h-4 w-4" />
                    <label htmlFor="screen-reader">Mode lecteur d'écran</label>
                  </div>
                  <Switch
                    id="screen-reader"
                    checked={settings.screenReaderMode}
                    onCheckedChange={(checked) => updateSetting('screenReaderMode', checked)}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => {
                    // Reset à défaut
                    Object.keys(settings).forEach(key => {
                      const typedKey = key as keyof AccessibilitySettings;
                      if (typedKey === 'fontSize') {
                        updateSetting(typedKey, 100);
                      } else if (typeof settings[typedKey] === 'boolean') {
                        updateSetting(typedKey, false);
                      }
                    });
                  }}
                  variant="outline"
                  size="sm"
                >
                  Réinitialiser
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  size="sm"
                >
                  Fermer
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

// ============= Composant de focus trap pour modales =============

export const FocusTrap: React.FC<{ 
  children: React.ReactNode; 
  isActive: boolean 
}> = ({ children, isActive }) => {
  const trapRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !trapRef.current) return;

    const focusableElements = trapRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    
    // Focus initial
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return (
    <div ref={trapRef}>
      {children}
    </div>
  );
};
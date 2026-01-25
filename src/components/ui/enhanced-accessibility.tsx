import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Eye, EyeOff, Volume2, VolumeX, Type, Contrast,
  MousePointer, Keyboard, Settings, X, Check,
  Zap, Moon, Sun, Palette, Move, RotateCcw
} from 'lucide-react';
import { useTheme } from '@/providers/theme';
import {
  safeClassAdd,
  safeClassRemove,
  safeGetDocumentRoot
} from '@/lib/safe-helpers';

// Accessibility Settings Context
interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  focusIndicator: boolean;
  colorBlindFriendly: boolean;
  keyboardNavigation: boolean;
  fontSize: number;
  letterSpacing: number;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  screenReader: false,
  focusIndicator: true,
  colorBlindFriendly: false,
  keyboardNavigation: true,
  fontSize: 16,
  letterSpacing: 0,
};

// Enhanced Skip Links
export const EnhancedSkipLinks: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const skipLinks = [
    { href: '#main-content', label: 'Aller au contenu principal' },
    { href: '#navigation', label: 'Aller à la navigation' },
    { href: '#footer', label: 'Aller au pied de page' },
    { href: '#search', label: 'Aller à la recherche' },
  ];

  return (
    <div className="sr-only focus-within:not-sr-only">
      <nav aria-label="Liens d'évitement" className="fixed top-0 left-0 z-50 bg-primary text-primary-foreground p-2 space-x-2">
        {skipLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="inline-block px-4 py-2 bg-background text-foreground rounded focus:outline-none focus:ring-2 focus:ring-ring"
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
};

// Accessibility Control Panel
export const AccessibilityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem('accessibility-settings');
        return saved ? JSON.parse(saved) : defaultSettings;
      } catch (error) {
        // Settings read error - non-critical
      }
    }
    return defaultSettings;
  });
  const { theme, setTheme } = useTheme();

  // Apply settings to document
  useEffect(() => {
    const root = safeGetDocumentRoot();

    // High contrast
    if (settings.highContrast) {
      safeClassAdd(root, 'high-contrast');
    } else {
      safeClassRemove(root, 'high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      safeClassAdd(root, 'reduce-motion');
    } else {
      safeClassRemove(root, 'reduce-motion');
    }

    // Large text
    if (settings.largeText) {
      root.style.fontSize = `${settings.fontSize + 4}px`;
    } else {
      root.style.fontSize = `${settings.fontSize}px`;
    }

    // Letter spacing
    root.style.setProperty('--letter-spacing', `${settings.letterSpacing}px`);

    // Color blind friendly
    if (settings.colorBlindFriendly) {
      safeClassAdd(root, 'color-blind-friendly');
    } else {
      safeClassRemove(root, 'color-blind-friendly');
    }

    // Save settings
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('accessibility-settings', JSON.stringify(settings));
      }
    } catch (error) {
      // Settings persist error - non-critical
    }
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <>
      {/* Floating Accessibility Button */}
      <motion.button
        className="fixed bottom-20 right-4 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Ouvrir les options d'accessibilité"
      >
        <Eye className="h-6 w-6" />
      </motion.button>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} aria-label="Fermer le panneau d'accessibilité" role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)} />
            
            <motion.div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              <Card className="bg-background/95 backdrop-blur-xl border shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center space-x-2">
                    <Eye className="h-6 w-6" />
                    <span>Accessibilité</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetSettings}
                      className="text-xs"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Réinitialiser
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Visual Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center space-x-2">
                      <Contrast className="h-5 w-5" />
                      <span>Paramètres visuels</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        {/* High Contrast */}
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Contrast className="h-4 w-4" />
                            <span className="font-medium">Contraste élevé</span>
                          </div>
                          <Button
                            variant={settings.highContrast ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateSetting('highContrast', !settings.highContrast)}
                          >
                            {settings.highContrast ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                          </Button>
                        </div>

                        {/* Large Text */}
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Type className="h-4 w-4" />
                            <span className="font-medium">Texte agrandi</span>
                          </div>
                          <Button
                            variant={settings.largeText ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateSetting('largeText', !settings.largeText)}
                          >
                            {settings.largeText ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                          </Button>
                        </div>

                        {/* Color Blind Friendly */}
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Palette className="h-4 w-4" />
                            <span className="font-medium">Daltonisme</span>
                          </div>
                          <Button
                            variant={settings.colorBlindFriendly ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateSetting('colorBlindFriendly', !settings.colorBlindFriendly)}
                          >
                            {settings.colorBlindFriendly ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {/* Font Size */}
                        <div className="p-3 border rounded-lg space-y-2">
                          <label className="flex items-center space-x-3 font-medium">
                            <Type className="h-4 w-4" />
                            <span>Taille de police: {settings.fontSize}px</span>
                          </label>
                          <input
                            type="range"
                            min="12"
                            max="24"
                            value={settings.fontSize}
                            onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        {/* Letter Spacing */}
                        <div className="p-3 border rounded-lg space-y-2">
                          <label className="flex items-center space-x-3 font-medium">
                            <Move className="h-4 w-4" />
                            <span>Espacement: {settings.letterSpacing}px</span>
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="3"
                            step="0.5"
                            value={settings.letterSpacing}
                            onChange={(e) => updateSetting('letterSpacing', parseFloat(e.target.value))}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Motion Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center space-x-2">
                      <Zap className="h-5 w-5" />
                      <span>Mouvement et animations</span>
                    </h3>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Move className="h-4 w-4" />
                        <div>
                          <p className="font-medium">Réduire les animations</p>
                          <p className="text-sm text-muted-foreground">Désactive les effets de mouvement</p>
                        </div>
                      </div>
                      <Button
                        variant={settings.reducedMotion ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                      >
                        {settings.reducedMotion ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>

                  {/* Navigation Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center space-x-2">
                      <Keyboard className="h-5 w-5" />
                      <span>Navigation</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Keyboard className="h-4 w-4" />
                          <span className="font-medium">Navigation clavier</span>
                        </div>
                        <Button
                          variant={settings.keyboardNavigation ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateSetting('keyboardNavigation', !settings.keyboardNavigation)}
                        >
                          {settings.keyboardNavigation ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <MousePointer className="h-4 w-4" />
                          <span className="font-medium">Indicateur de focus</span>
                        </div>
                        <Button
                          variant={settings.focusIndicator ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateSetting('focusIndicator', !settings.focusIndicator)}
                        >
                          {settings.focusIndicator ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="flex items-center space-x-2"
                      >
                        {theme === 'dark' ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
                        <span>{theme === 'dark' ? 'Mode clair' : 'Mode sombre'}</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.speechSynthesis.speak(new SpeechSynthesisUtterance('Mode lecteur d\'écran activé'))}
                        className="flex items-center space-x-2"
                      >
                        <Volume2 className="h-3 w-3" />
                        <span>Test audio</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Screen Reader Announcements
export const ScreenReaderAnnouncer: React.FC = () => {
  const [announcements, setAnnouncements] = useState<string[]>([]);

  useEffect(() => {
    const handleAnnouncement = (event: CustomEvent) => {
      setAnnouncements(prev => [...prev, event.detail.message]);
      setTimeout(() => {
        setAnnouncements(prev => prev.slice(1));
      }, 1000);
    };

    window.addEventListener('announce' as any, handleAnnouncement);
    return () => window.removeEventListener('announce' as any, handleAnnouncement);
  }, []);

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {announcements.map((announcement, index) => (
        <div key={index}>{announcement}</div>
      ))}
    </div>
  );
};

// Utility function to announce to screen readers
export const announce = (message: string) => {
  window.dispatchEvent(new CustomEvent('announce', { detail: { message } }));
};

// Focus Management Hook
export const useFocusManagement = () => {
  const focusedElementRef = useRef<HTMLElement | null>(null);

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  };

  const saveFocus = () => {
    focusedElementRef.current = document.activeElement as HTMLElement;
  };

  const restoreFocus = () => {
    if (focusedElementRef.current) {
      focusedElementRef.current.focus();
    }
  };

  return { trapFocus, saveFocus, restoreFocus };
};

export default {
  EnhancedSkipLinks,
  AccessibilityPanel,
  ScreenReaderAnnouncer,
  announce,
  useFocusManagement
};
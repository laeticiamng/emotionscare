import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Eye, 
  Volume2, 
  Keyboard, 
  MousePointer, 
  Settings,
  Contrast,
  Type,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';
import {
  safeClassAdd,
  safeClassRemove,
  safeGetDocumentRoot
} from '@/lib/safe-helpers';

interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  dyslexicFont: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  colorBlindFriendly: boolean;
  announcements: boolean;
}

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
  fix?: () => void;
}

export function AccessibilityEnhancer() {
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    dyslexicFont: false,
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true,
    colorBlindFriendly: false,
    announcements: true
  });
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  
  // Function to announce to screen readers
  const announce = (message: string) => {
    const announcer = document.getElementById('announcements');
    if (announcer) {
      announcer.textContent = message;
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    }
  };
  const handleSkipLink = (id: string) => {
    if (typeof document === 'undefined') return;
    const element = document.getElementById(id);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Load localSettings from localStorage
    if (typeof window === 'undefined') return;

    try {
      const savedSettings = window.localStorage.getItem('accessibility-settings');
      if (savedSettings) {
        setLocalSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      // Settings read error - non-critical
    }

    // Check for accessibility issues
    checkAccessibilityIssues();
  }, []);

  useEffect(() => {
    // Apply localSettings to document
    applyAccessibilitySettings(localSettings);
    // Save localSettings to localStorage
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('accessibility-settings', JSON.stringify(localSettings));
      }
    } catch (error) {
      // Settings persist error - non-critical
    }
  }, [localSettings]);

  const applyAccessibilitySettings = (newSettings: AccessibilitySettings) => {
    const root = safeGetDocumentRoot();
    const body = typeof document !== 'undefined' ? document.body : null;

    // High contrast
    if (newSettings.highContrast) {
      safeClassAdd(body, 'high-contrast');
    } else {
      safeClassRemove(body, 'high-contrast');
    }

    // Reduced motion
    if (newSettings.reducedMotion) {
      safeClassAdd(body, 'reduce-motion');
    } else {
      safeClassRemove(body, 'reduce-motion');
    }

    // Large text
    if (newSettings.largeText) {
      root.style.setProperty('--font-scale', '1.25');
    } else {
      root.style.setProperty('--font-scale', '1');
    }

    // Dyslexic font
    if (newSettings.dyslexicFont) {
      safeClassAdd(body, 'dyslexic-font');
    } else {
      safeClassRemove(body, 'dyslexic-font');
    }

    // Color blind friendly
    if (newSettings.colorBlindFriendly) {
      safeClassAdd(body, 'color-blind-friendly');
    } else {
      safeClassRemove(body, 'color-blind-friendly');
    }

    // Focus indicators
    if (newSettings.focusIndicators) {
      root.style.setProperty('--focus-ring-width', '3px');
    } else {
      root.style.setProperty('--focus-ring-width', '2px');
    }
  };

  const checkAccessibilityIssues = () => {
    if (typeof document === 'undefined') {
      setIssues([]);
      return;
    }
    const foundIssues: AccessibilityIssue[] = [];

    // Check for images without alt text
    const images = document.querySelectorAll('img:not([alt])');
    if (images.length > 0) {
      foundIssues.push({
        type: 'error',
        message: `${images.length} image(s) sans attribut alt détectée(s)`,
        element: 'Images',
        fix: () => {
          images.forEach((img, index) => {
            img.setAttribute('alt', `Image ${index + 1}`);
          });
          announce('Attributs alt ajoutés aux images manquantes');
        }
      });
    }

    // Check for buttons without accessible names
    const unnamedButtons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    const buttonIssues = Array.from(unnamedButtons).filter(btn => !btn.textContent?.trim());
    if (buttonIssues.length > 0) {
      foundIssues.push({
        type: 'warning',
        message: `${buttonIssues.length} bouton(s) sans nom accessible`,
        element: 'Boutons'
      });
    }

    // Check for form inputs without labels
    const unlabeledInputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    const inputIssues = Array.from(unlabeledInputs).filter(input => {
      const id = input.getAttribute('id');
      return !id || !document.querySelector(`label[for="${id}"]`);
    });
    if (inputIssues.length > 0) {
      foundIssues.push({
        type: 'error',
        message: `${inputIssues.length} champ(s) de formulaire sans label`,
        element: 'Formulaires'
      });
    }

    // Check heading hierarchy
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const h1Count = headings.filter(h => h.tagName === 'H1').length;
    if (h1Count === 0) {
      foundIssues.push({
        type: 'warning',
        message: 'Aucun titre principal H1 trouvé',
        element: 'Titres'
      });
    } else if (h1Count > 1) {
      foundIssues.push({
        type: 'warning',
        message: `${h1Count} titres H1 trouvés (recommandation: 1 seul)`,
        element: 'Titres'
      });
    }

    setIssues(foundIssues);
  };

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    setLocalSettings((prev: AccessibilitySettings) => {
      const newSettings = { ...prev, [key]: !prev[key] };
      
      // Announce the change
      const settingName = {
        highContrast: 'Contraste élevé',
        reducedMotion: 'Mouvement réduit',
        largeText: 'Texte agrandi',
        dyslexicFont: 'Police dyslexie',
        screenReader: 'Lecteur d\'écran',
        keyboardNavigation: 'Navigation clavier',
        focusIndicators: 'Indicateurs de focus',
        colorBlindFriendly: 'Mode daltonien',
        announcements: 'Annonces'
      }[key];

      announce(`${settingName} ${newSettings[key] ? 'activé' : 'désactivé'}`);
      
      return newSettings;
    });
  };

  const settingsGroups = [
    {
      title: 'Vision',
      icon: Eye,
      settings: [
        { key: 'highContrast' as const, label: 'Contraste élevé', description: 'Augmente le contraste pour une meilleure lisibilité' },
        { key: 'largeText' as const, label: 'Texte agrandi', description: 'Augmente la taille du texte de 25%' },
        { key: 'dyslexicFont' as const, label: 'Police dyslexie', description: 'Utilise une police adaptée à la dyslexie' },
        { key: 'colorBlindFriendly' as const, label: 'Mode daltonien', description: 'Palette de couleurs adaptée au daltonisme' }
      ]
    },
    {
      title: 'Mouvement',
      icon: MousePointer,
      settings: [
        { key: 'reducedMotion' as const, label: 'Mouvement réduit', description: 'Réduit les animations et transitions' }
      ]
    },
    {
      title: 'Navigation',
      icon: Keyboard,
      settings: [
        { key: 'keyboardNavigation' as const, label: 'Navigation clavier', description: 'Optimise la navigation au clavier' },
        { key: 'focusIndicators' as const, label: 'Indicateurs de focus', description: 'Améliore la visibilité du focus clavier' }
      ]
    },
    {
      title: 'Assistance',
      icon: Volume2,
      settings: [
        { key: 'screenReader' as const, label: 'Support lecteur d\'écran', description: 'Optimise pour les lecteurs d\'écran' },
        { key: 'announcements' as const, label: 'Annonces vocales', description: 'Annonce les changements importants' }
      ]
    }
  ];

  const criticalIssues = issues.filter(issue => issue.type === 'error');
  const warnings = issues.filter(issue => issue.type === 'warning');

  return (
    <>
      {/* Accessibility Skip Links */}
      <div className="skip-links">
        <a 
          href="#main-content" 
          className="skip-link"
          onClick={(e) => {
            e.preventDefault();
            handleSkipLink('main-content');
          }}
        >
          Aller au contenu principal
        </a>
        <a 
          href="#navigation" 
          className="skip-link"
          onClick={(e) => {
            e.preventDefault();
            handleSkipLink('navigation');
          }}
        >
          Aller à la navigation
        </a>
      </div>

      {/* Accessibility Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 rounded-full p-3 shadow-lg"
        aria-label="Ouvrir les options d'accessibilité"
        title="Options d'accessibilité"
      >
        <Eye className="h-5 w-5" />
        {(criticalIssues.length > 0 || warnings.length > 0) && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
            {criticalIssues.length + warnings.length}
          </Badge>
        )}
      </Button>

      {/* Accessibility Panel */}
      <AnimatePresence mode="sync">
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-96 bg-background border-r shadow-2xl z-50 overflow-y-auto"
              role="dialog"
              aria-label="Panneau d'accessibilité"
              aria-modal="true"
            >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Eye className="h-6 w-6 text-primary" />
                    Accessibilité
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    aria-label="Fermer le panneau d'accessibilité"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Issues Summary */}
                {issues.length > 0 && (
                  <Card className={`${criticalIssues.length > 0 ? 'border-red-200 bg-red-50 dark:bg-red-950' : 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className={`h-5 w-5 mt-0.5 ${criticalIssues.length > 0 ? 'text-red-500' : 'text-yellow-500'}`} />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">
                            {criticalIssues.length > 0 ? 'Problèmes critiques détectés' : 'Améliorations suggérées'}
                          </h3>
                          <div className="space-y-2">
                            {issues.slice(0, 3).map((issue, index) => (
                              <div key={index} className="flex items-start justify-between gap-2">
                                <span className="text-sm">{issue.message}</span>
                                {issue.fix && (
                                  <Button size="sm" variant="outline" onClick={issue.fix}>
                                    Corriger
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                          {issues.length > 3 && (
                            <p className="text-xs text-muted-foreground mt-2">
                              +{issues.length - 3} autre(s) problème(s)
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Actions rapides</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSetting('highContrast')}
                      className="justify-start gap-2"
                    >
                      <Contrast className="h-4 w-4" />
                      Contraste
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSetting('largeText')}
                      className="justify-start gap-2"
                    >
                      <Type className="h-4 w-4" />
                      Texte+
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSetting('reducedMotion')}
                      className="justify-start gap-2"
                    >
                      <MousePointer className="h-4 w-4" />
                      Mouvement-
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={checkAccessibilityIssues}
                      className="justify-start gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Analyser
                    </Button>
                  </div>
                </div>

                {/* Settings Groups */}
                {settingsGroups.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div key={group.title} className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        {group.title}
                      </h3>
                      <div className="space-y-3">
                        {group.settings.map((setting) => (
                          <div key={setting.key} className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <label 
                                htmlFor={setting.key}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {setting.label}
                              </label>
                              <p className="text-xs text-muted-foreground">
                                {setting.description}
                              </p>
                            </div>
                            <Button
                              id={setting.key}
                              variant={localSettings[setting.key] ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleSetting(setting.key)}
                              aria-pressed={localSettings[setting.key]}
                              className="shrink-0"
                            >
                              {localSettings[setting.key] ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Info */}
                <div className="text-xs text-muted-foreground p-4 bg-muted rounded-lg">
                  <p className="mb-2">
                    <strong>Raccourcis clavier :</strong>
                  </p>
                  <ul className="space-y-1">
                    <li>• Tab : Navigation entre éléments</li>
                    <li>• Entrée/Espace : Activer un élément</li>
                    <li>• Échap : Fermer les dialogues</li>
                    <li>• Alt + A : Ouvrir ce panneau</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Keyboard shortcut listener */}
      {typeof window !== 'undefined' && (
        <KeyboardShortcuts onOpenAccessibility={() => setIsOpen(true)} />
      )}
    </>
  );
}

// Keyboard shortcuts component
function KeyboardShortcuts({ onOpenAccessibility }: { onOpenAccessibility: () => void }) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + A to open accessibility panel
      if (event.altKey && event.key === 'a') {
        event.preventDefault();
        onOpenAccessibility();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onOpenAccessibility]);

  return null;
}
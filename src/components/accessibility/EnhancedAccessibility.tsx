/**
 * 🎯 ACCESSIBILITÉ PREMIUM EMOTIONSCARE
 * Composant d'accessibilité complet WCAG AAA
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, VolumeX, Eye, EyeOff, Keyboard, Mouse, 
  ZoomIn, ZoomOut, Palette, RotateCcw, Settings 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface AccessibilityState {
  screenReader: boolean;
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  keyboardNav: boolean;
  voiceCommands: boolean;
  fontSize: number;
  soundEnabled: boolean;
  focusIndicator: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

const defaultState: AccessibilityState = {
  screenReader: false,
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  keyboardNav: true,
  voiceCommands: false,
  fontSize: 16,
  soundEnabled: true,
  focusIndicator: true,
  colorBlindMode: 'none'
};

export const EnhancedAccessibility: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilityState>(defaultState);
  const [isListening, setIsListening] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Chargement des préférences sauvegardées
  useEffect(() => {
    const saved = localStorage.getItem('emotionscare_accessibility');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (error) {
        console.warn('Erreur chargement préférences accessibilité:', error);
      }
    }
  }, []);

  // Sauvegarde automatique des préférences
  useEffect(() => {
    localStorage.setItem('emotionscare_accessibility', JSON.stringify(settings));
    applyAccessibilitySettings(settings);
  }, [settings]);

  // Application des paramètres d'accessibilité
  const applyAccessibilitySettings = useCallback((newSettings: AccessibilityState) => {
    const root = document.documentElement;
    
    // Taille de police
    root.style.fontSize = `${newSettings.fontSize}px`;
    
    // Contraste élevé
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Mouvement réduit
    if (newSettings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    // Mode daltonisme
    root.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
    if (newSettings.colorBlindMode !== 'none') {
      root.classList.add(newSettings.colorBlindMode);
    }
    
    // Indicateur de focus amélioré
    if (newSettings.focusIndicator) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }

    // Navigation clavier
    if (newSettings.keyboardNav) {
      enableKeyboardNavigation();
    }

    console.log('🎯 Paramètres d\'accessibilité appliqués:', newSettings);
  }, []);

  // Navigation clavier avancée
  const enableKeyboardNavigation = useCallback(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Raccourcis d'accessibilité
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        announceToScreenReader(isOpen ? 'Panneau d\'accessibilité fermé' : 'Panneau d\'accessibilité ouvert');
      }
      
      // Navigation par zones
      if (e.key === 'F6') {
        e.preventDefault();
        focusNextLandmark();
      }
      
      // Retour au contenu principal
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        const main = document.querySelector('main');
        if (main) {
          main.focus();
          announceToScreenReader('Navigation vers le contenu principal');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus sur les éléments landmark
  const focusNextLandmark = useCallback(() => {
    const landmarks = document.querySelectorAll('main, nav, aside, header, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
    const currentFocus = document.activeElement;
    
    let currentIndex = Array.from(landmarks).findIndex(el => el.contains(currentFocus));
    currentIndex = (currentIndex + 1) % landmarks.length;
    
    const nextLandmark = landmarks[currentIndex] as HTMLElement;
    if (nextLandmark) {
      nextLandmark.focus();
      nextLandmark.scrollIntoView({ behavior: 'smooth', block: 'center' });
      announceToScreenReader(`Navigation vers ${nextLandmark.tagName.toLowerCase()}`);
    }
  }, []);

  // Annonce pour lecteur d'écran
  const announceToScreenReader = useCallback((message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }, []);

  // Commandes vocales
  const toggleVoiceCommands = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "❌ Commandes vocales non supportées",
        description: "Votre navigateur ne supporte pas la reconnaissance vocale",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      setIsListening(false);
      announceToScreenReader('Commandes vocales désactivées');
    } else {
      setIsListening(true);
      announceToScreenReader('Commandes vocales activées. Dites "aide" pour voir les commandes disponibles');
      startVoiceRecognition();
    }
  }, [isListening, toast]);

  // Reconnaissance vocale
  const startVoiceRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'fr-FR';

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      handleVoiceCommand(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      announceToScreenReader('Erreur reconnaissance vocale');
    };

    recognition.start();
  }, []);

  // Traitement des commandes vocales
  const handleVoiceCommand = useCallback((command: string) => {
    if (command.includes('aide')) {
      announceToScreenReader('Commandes disponibles: augmenter texte, réduire texte, contraste élevé, mouvement réduit, fermer accessibilité');
      return;
    }

    if (command.includes('augmenter texte')) {
      setSettings(prev => ({ ...prev, fontSize: Math.min(24, prev.fontSize + 2) }));
      announceToScreenReader('Taille du texte augmentée');
    } else if (command.includes('réduire texte')) {
      setSettings(prev => ({ ...prev, fontSize: Math.max(12, prev.fontSize - 2) }));
      announceToScreenReader('Taille du texte réduite');
    } else if (command.includes('contraste')) {
      setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }));
      announceToScreenReader(settings.highContrast ? 'Contraste élevé désactivé' : 'Contraste élevé activé');
    } else if (command.includes('mouvement')) {
      setSettings(prev => ({ ...prev, reducedMotion: !prev.reducedMotion }));
      announceToScreenReader(settings.reducedMotion ? 'Mouvement réduit désactivé' : 'Mouvement réduit activé');
    } else if (command.includes('fermer')) {
      setIsOpen(false);
      announceToScreenReader('Panneau d\'accessibilité fermé');
    }
  }, [settings]);

  // Réinitialisation
  const resetSettings = useCallback(() => {
    setSettings(defaultState);
    toast({
      title: "🔄 Paramètres réinitialisés",
      description: "Les paramètres d'accessibilité ont été restaurés par défaut"
    });
    announceToScreenReader('Paramètres d\'accessibilité réinitialisés');
  }, [toast]);

  return (
    <>
      {/* Bouton d'activation rapide */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground hover:bg-primary/90"
        aria-label="Ouvrir les options d'accessibilité (Alt+A)"
        title="Accessibilité (Alt+A)"
      >
        <Eye className="h-5 w-5" />
      </Button>

      {/* Panneau d'accessibilité */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panneau */}
            <motion.div
              ref={panelRef}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-4 top-4 bottom-4 w-96 z-50"
            >
              <Card className="h-full p-6 overflow-y-auto bg-background border-2 border-primary">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Accessibilité</h2>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={resetSettings}
                      aria-label="Réinitialiser les paramètres"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      aria-label="Fermer le panneau d'accessibilité"
                    >
                      <EyeOff className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Taille du texte */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Taille du texte ({settings.fontSize}px)
                    </label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSettings(prev => ({ 
                          ...prev, 
                          fontSize: Math.max(12, prev.fontSize - 2) 
                        }))}
                        aria-label="Réduire la taille du texte"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Slider
                        value={[settings.fontSize]}
                        onValueChange={([value]) => 
                          setSettings(prev => ({ ...prev, fontSize: value }))
                        }
                        min={12}
                        max={24}
                        step={2}
                        className="flex-1"
                        aria-label="Ajuster la taille du texte"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSettings(prev => ({ 
                          ...prev, 
                          fontSize: Math.min(24, prev.fontSize + 2) 
                        }))}
                        aria-label="Augmenter la taille du texte"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Options visuelles */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Options visuelles</h3>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Contraste élevé</label>
                      <Switch
                        checked={settings.highContrast}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, highContrast: checked }))
                        }
                        aria-label="Activer le contraste élevé"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm">Texte agranди</label>
                      <Switch
                        checked={settings.largeText}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, largeText: checked }))
                        }
                        aria-label="Activer le texte agranди"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm">Mouvement réduit</label>
                      <Switch
                        checked={settings.reducedMotion}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, reducedMotion: checked }))
                        }
                        aria-label="Réduire les animations"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm">Indicateur de focus</label>
                      <Switch
                        checked={settings.focusIndicator}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, focusIndicator: checked }))
                        }
                        aria-label="Afficher l'indicateur de focus"
                      />
                    </div>
                  </div>

                  {/* Mode daltonisme */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Mode daltonisme</label>
                    <select
                      value={settings.colorBlindMode}
                      onChange={(e) => 
                        setSettings(prev => ({ 
                          ...prev, 
                          colorBlindMode: e.target.value as AccessibilityState['colorBlindMode']
                        }))
                      }
                      className="w-full p-2 border rounded-md bg-background"
                      aria-label="Sélectionner le mode daltonisme"
                    >
                      <option value="none">Aucun</option>
                      <option value="protanopia">Protanopia (Rouge-Vert)</option>
                      <option value="deuteranopia">Deuteranopia (Rouge-Vert)</option>
                      <option value="tritanopia">Tritanopia (Bleu-Jaune)</option>
                    </select>
                  </div>

                  {/* Navigation et contrôles */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Navigation et contrôles</h3>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Navigation clavier</label>
                      <Switch
                        checked={settings.keyboardNav}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, keyboardNav: checked }))
                        }
                        aria-label="Activer la navigation clavier"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm">Commandes vocales</label>
                      <Switch
                        checked={settings.voiceCommands}
                        onCheckedChange={(checked) => {
                          setSettings(prev => ({ ...prev, voiceCommands: checked }));
                          if (checked) toggleVoiceCommands();
                        }}
                        aria-label="Activer les commandes vocales"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm">Sons d'interface</label>
                      <Switch
                        checked={settings.soundEnabled}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, soundEnabled: checked }))
                        }
                        aria-label="Activer les sons d'interface"
                      />
                    </div>
                  </div>

                  {/* Indicateur commandes vocales */}
                  {isListening && (
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary">
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4 text-primary animate-pulse" />
                        <span className="text-sm">Écoute en cours... Dites "aide" pour les commandes</span>
                      </div>
                    </div>
                  )}

                  {/* Raccourcis clavier */}
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><kbd>Alt + A</kbd> : Ouvrir/fermer ce panneau</p>
                    <p><kbd>F6</kbd> : Naviguer entre les zones</p>
                    <p><kbd>Alt + 1</kbd> : Aller au contenu principal</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Skip links (pour lecteurs d'écran) */}
      <div className="sr-only">
        <a href="#main-content" className="skip-link">
          Aller au contenu principal
        </a>
        <a href="#navigation" className="skip-link">
          Aller à la navigation
        </a>
      </div>
    </>
  );
};
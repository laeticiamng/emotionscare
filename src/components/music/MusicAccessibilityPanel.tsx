/**
 * Music Accessibility Panel - Accessibilité complète
 * Raccourcis clavier, navigation focus, annonces ARIA, mode contraste élevé
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Accessibility,
  Keyboard,
  Eye,
  Volume2,
  Type,
  Contrast,
  MousePointer2,
  Settings,
  Info,
  Check,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
}

interface AccessibilitySettings {
  keyboardNavigation: boolean;
  screenReaderAnnouncements: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  focusIndicators: boolean;
  autoplay: boolean;
  hapticFeedback: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  keyboardNavigation: true,
  screenReaderAnnouncements: true,
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  focusIndicators: true,
  autoplay: false,
  hapticFeedback: true,
};

const KEYBOARD_SHORTCUTS: Omit<KeyboardShortcut, 'action'>[] = [
  { key: 'Space', description: 'Lecture / Pause' },
  { key: '←', description: 'Reculer 10 secondes' },
  { key: '→', description: 'Avancer 10 secondes' },
  { key: 'N', description: 'Piste suivante' },
  { key: 'P', description: 'Piste précédente' },
  { key: 'M', description: 'Couper le son' },
  { key: '↑', description: 'Augmenter le volume' },
  { key: '↓', description: 'Diminuer le volume' },
  { key: 'L', description: 'Ajouter aux favoris' },
  { key: 'F', description: 'Plein écran' },
  { key: 'Escape', description: 'Fermer le mode immersif' },
];

interface MusicAccessibilityPanelProps {
  onSettingsChange?: (settings: AccessibilitySettings) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onSeek?: (delta: number) => void;
  onVolumeChange?: (delta: number) => void;
  onMute?: () => void;
  onToggleLike?: () => void;
  onFullscreen?: () => void;
}

export const MusicAccessibilityPanel: React.FC<MusicAccessibilityPanelProps> = ({
  onSettingsChange,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onMute,
  onToggleLike,
  onFullscreen,
}) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Announce changes to screen readers
  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(''), 3000);
  }, []);

  // Handle setting changes
  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);

    // Apply settings to document
    if (key === 'highContrast') {
      document.documentElement.classList.toggle('high-contrast', value as boolean);
    }
    if (key === 'reducedMotion') {
      document.documentElement.classList.toggle('reduce-motion', value as boolean);
    }
    if (key === 'largeText') {
      document.documentElement.classList.toggle('large-text', value as boolean);
    }

    announce(`${key} ${value ? 'activé' : 'désactivé'}`);
    toast({
      title: value ? '✓ Activé' : '✗ Désactivé',
      description: key.replace(/([A-Z])/g, ' $1').trim(),
      duration: 1500,
    });
  };

  // Keyboard event handler
  useEffect(() => {
    if (!settings.keyboardNavigation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          onPlay?.();
          announce('Lecture / Pause');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onSeek?.(-10);
          announce('Reculé de 10 secondes');
          break;
        case 'ArrowRight':
          e.preventDefault();
          onSeek?.(10);
          announce('Avancé de 10 secondes');
          break;
        case 'ArrowUp':
          e.preventDefault();
          onVolumeChange?.(10);
          announce('Volume augmenté');
          break;
        case 'ArrowDown':
          e.preventDefault();
          onVolumeChange?.(-10);
          announce('Volume diminué');
          break;
        case 'KeyN':
          onNext?.();
          announce('Piste suivante');
          break;
        case 'KeyP':
          onPrevious?.();
          announce('Piste précédente');
          break;
        case 'KeyM':
          onMute?.();
          announce('Son coupé / rétabli');
          break;
        case 'KeyL':
          onToggleLike?.();
          announce('Ajouté aux favoris');
          break;
        case 'KeyF':
          onFullscreen?.();
          announce('Mode plein écran');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyboardNavigation, onPlay, onSeek, onVolumeChange, onNext, onPrevious, onMute, onToggleLike, onFullscreen, announce]);

  return (
    <>
      {/* Screen Reader Announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {announcement}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Accessibility className="h-5 w-5 text-primary" />
            Accessibilité
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Navigation clavier</span>
              </div>
              <Switch
                checked={settings.keyboardNavigation}
                onCheckedChange={(v) => updateSetting('keyboardNavigation', v)}
                aria-label="Activer la navigation clavier"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Annonces vocales</span>
              </div>
              <Switch
                checked={settings.screenReaderAnnouncements}
                onCheckedChange={(v) => updateSetting('screenReaderAnnouncements', v)}
                aria-label="Activer les annonces pour lecteur d'écran"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Contrast className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Contraste élevé</span>
              </div>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={(v) => updateSetting('highContrast', v)}
                aria-label="Activer le mode contraste élevé"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Réduire les animations</span>
              </div>
              <Switch
                checked={settings.reducedMotion}
                onCheckedChange={(v) => updateSetting('reducedMotion', v)}
                aria-label="Réduire les animations"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Texte agrandi</span>
              </div>
              <Switch
                checked={settings.largeText}
                onCheckedChange={(v) => updateSetting('largeText', v)}
                aria-label="Activer le texte agrandi"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MousePointer2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Indicateurs de focus</span>
              </div>
              <Switch
                checked={settings.focusIndicators}
                onCheckedChange={(v) => updateSetting('focusIndicators', v)}
                aria-label="Afficher les indicateurs de focus"
              />
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="w-full gap-2"
              aria-expanded={showShortcuts}
            >
              <Keyboard className="h-4 w-4" />
              {showShortcuts ? 'Masquer' : 'Afficher'} les raccourcis clavier
            </Button>

            <AnimatePresence>
              {showShortcuts && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1 pt-2"
                >
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {KEYBOARD_SHORTCUTS.map((shortcut) => (
                      <div
                        key={shortcut.key}
                        className="flex items-center justify-between p-2 rounded bg-muted/30 text-xs"
                      >
                        <Badge variant="outline" className="font-mono">
                          {shortcut.key}
                        </Badge>
                        <span className="text-muted-foreground truncate ml-2">
                          {shortcut.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info */}
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Ces paramètres améliorent l'accessibilité pour les utilisateurs de technologies d'assistance.
                Appuyez sur <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">?</kbd> pour afficher les raccourcis.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default MusicAccessibilityPanel;

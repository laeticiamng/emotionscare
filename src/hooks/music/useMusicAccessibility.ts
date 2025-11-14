/**
 * useMusicAccessibility Hook
 *
 * Hook pour améliorer l'accessibilité du lecteur musical.
 *
 * Features:
 * - Raccourcis clavier configurables
 * - Contrôle vocal (Web Speech API)
 * - Annonces screen reader
 * - Navigation au clavier
 * - Mode high contrast
 * - Préférences d'accessibilité
 *
 * @module hooks/music/useMusicAccessibility
 */

import { useEffect, useCallback, useState, useRef } from 'react';
import { logger } from '@/lib/logger';

// ============================================
// TYPES
// ============================================

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

export interface VoiceCommand {
  phrases: string[];
  action: () => void;
  description: string;
}

export interface AccessibilityPreferences {
  enableKeyboardShortcuts: boolean;
  enableVoiceControl: boolean;
  enableScreenReaderAnnouncements: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  largeControls: boolean;
  skipSilence: boolean;
}

export interface UseMusicAccessibilityOptions {
  shortcuts?: KeyboardShortcut[];
  voiceCommands?: VoiceCommand[];
  preferences?: Partial<AccessibilityPreferences>;
  onShortcutExecuted?: (shortcut: KeyboardShortcut) => void;
  onVoiceCommandExecuted?: (command: VoiceCommand) => void;
}

export interface UseMusicAccessibilityReturn {
  // État
  preferences: AccessibilityPreferences;
  isListeningToVoice: boolean;
  voiceRecognitionSupported: boolean;

  // Contrôles
  updatePreferences: (prefs: Partial<AccessibilityPreferences>) => void;
  startVoiceControl: () => void;
  stopVoiceControl: () => void;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;

  // Utilitaires
  registerShortcut: (shortcut: KeyboardShortcut) => void;
  unregisterShortcut: (key: string) => void;
  registerVoiceCommand: (command: VoiceCommand) => void;
  getShortcutsList: () => KeyboardShortcut[];
}

// ============================================
// DEFAULT PREFERENCES
// ============================================

const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  enableKeyboardShortcuts: true,
  enableVoiceControl: false,
  enableScreenReaderAnnouncements: true,
  reduceMotion: false,
  highContrast: false,
  largeControls: false,
  skipSilence: false
};

// ============================================
// HOOK
// ============================================

export function useMusicAccessibility(
  options: UseMusicAccessibilityOptions = {}
): UseMusicAccessibilityReturn {
  const {
    shortcuts: initialShortcuts = [],
    voiceCommands: initialVoiceCommands = [],
    preferences: initialPreferences = {},
    onShortcutExecuted,
    onVoiceCommandExecuted
  } = options;

  // State
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    ...DEFAULT_PREFERENCES,
    ...initialPreferences
  });

  const [isListeningToVoice, setIsListeningToVoice] = useState(false);
  const [voiceRecognitionSupported] = useState(
    'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
  );

  // Refs
  const shortcutsRef = useRef<Map<string, KeyboardShortcut>>(new Map());
  const voiceCommandsRef = useRef<VoiceCommand[]>([]);
  const recognitionRef = useRef<any>(null);
  const announcerRef = useRef<HTMLDivElement | null>(null);

  // ============================================
  // KEYBOARD SHORTCUTS
  // ============================================

  /**
   * Enregistre un raccourci clavier
   */
  const registerShortcut = useCallback((shortcut: KeyboardShortcut) => {
    const key = getShortcutKey(shortcut);
    shortcutsRef.current.set(key, shortcut);
    logger.debug(`Registered shortcut: ${key}`, undefined, 'MusicAccessibility');
  }, []);

  /**
   * Désenregistre un raccourci
   */
  const unregisterShortcut = useCallback((key: string) => {
    shortcutsRef.current.delete(key);
    logger.debug(`Unregistered shortcut: ${key}`, undefined, 'MusicAccessibility');
  }, []);

  /**
   * Obtient la liste des raccourcis
   */
  const getShortcutsList = useCallback((): KeyboardShortcut[] => {
    return Array.from(shortcutsRef.current.values());
  }, []);

  /**
   * Handler des événements clavier
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!preferences.enableKeyboardShortcuts) return;

    // Ignorer si focus dans un input/textarea
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    const shortcutKey = `${event.ctrlKey ? 'ctrl+' : ''}${event.shiftKey ? 'shift+' : ''}${event.altKey ? 'alt+' : ''}${event.key.toLowerCase()}`;

    const shortcut = shortcutsRef.current.get(shortcutKey);

    if (shortcut) {
      event.preventDefault();
      shortcut.action();
      onShortcutExecuted?.(shortcut);
      logger.debug(`Executed shortcut: ${shortcutKey}`, undefined, 'MusicAccessibility');
    }
  }, [preferences.enableKeyboardShortcuts, onShortcutExecuted]);

  // Enregistrer les raccourcis initiaux
  useEffect(() => {
    initialShortcuts.forEach(registerShortcut);
  }, [initialShortcuts, registerShortcut]);

  // Écouter les événements clavier
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ============================================
  // VOICE CONTROL
  // ============================================

  /**
   * Enregistre une commande vocale
   */
  const registerVoiceCommand = useCallback((command: VoiceCommand) => {
    voiceCommandsRef.current.push(command);
    logger.debug(`Registered voice command: ${command.description}`, undefined, 'MusicAccessibility');
  }, []);

  /**
   * Démarre le contrôle vocal
   */
  const startVoiceControl = useCallback(() => {
    if (!voiceRecognitionSupported) {
      logger.warn('Voice recognition not supported', undefined, 'MusicAccessibility');
      return;
    }

    if (!preferences.enableVoiceControl) {
      logger.warn('Voice control disabled in preferences', undefined, 'MusicAccessibility');
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'fr-FR';

      recognition.onstart = () => {
        setIsListeningToVoice(true);
        announce('Contrôle vocal activé', 'polite');
        logger.info('Voice control started', undefined, 'MusicAccessibility');
      };

      recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript.toLowerCase().trim();

        logger.debug(`Voice input: ${transcript}`, undefined, 'MusicAccessibility');

        // Trouver la commande correspondante
        const command = voiceCommandsRef.current.find(cmd =>
          cmd.phrases.some(phrase => transcript.includes(phrase.toLowerCase()))
        );

        if (command) {
          command.action();
          onVoiceCommandExecuted?.(command);
          announce(`Commande exécutée: ${command.description}`, 'assertive');
          logger.info(`Executed voice command: ${command.description}`, undefined, 'MusicAccessibility');
        } else {
          announce('Commande non reconnue', 'polite');
        }
      };

      recognition.onerror = (event: any) => {
        logger.error('Voice recognition error', new Error(event.error), 'MusicAccessibility');
        setIsListeningToVoice(false);
      };

      recognition.onend = () => {
        setIsListeningToVoice(false);
        logger.info('Voice control stopped', undefined, 'MusicAccessibility');
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (error) {
      logger.error('Failed to start voice control', error as Error, 'MusicAccessibility');
    }
  }, [voiceRecognitionSupported, preferences.enableVoiceControl, onVoiceCommandExecuted]);

  /**
   * Arrête le contrôle vocal
   */
  const stopVoiceControl = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListeningToVoice(false);
      announce('Contrôle vocal désactivé', 'polite');
      logger.info('Voice control manually stopped', undefined, 'MusicAccessibility');
    }
  }, []);

  // Enregistrer les commandes vocales initiales
  useEffect(() => {
    initialVoiceCommands.forEach(registerVoiceCommand);
  }, [initialVoiceCommands, registerVoiceCommand]);

  // Cleanup voice control
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // ============================================
  // SCREEN READER ANNOUNCEMENTS
  // ============================================

  /**
   * Crée l'élément d'annonce pour screen readers
   */
  useEffect(() => {
    if (!announcerRef.current) {
      const announcer = document.createElement('div');
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.position = 'absolute';
      announcer.style.left = '-10000px';
      announcer.style.width = '1px';
      announcer.style.height = '1px';
      announcer.style.overflow = 'hidden';
      document.body.appendChild(announcer);
      announcerRef.current = announcer;
    }

    return () => {
      if (announcerRef.current) {
        document.body.removeChild(announcerRef.current);
        announcerRef.current = null;
      }
    };
  }, []);

  /**
   * Annonce un message au screen reader
   */
  const announce = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      if (!preferences.enableScreenReaderAnnouncements) return;

      if (announcerRef.current) {
        announcerRef.current.setAttribute('aria-live', priority);
        announcerRef.current.textContent = message;

        // Clear after 1 second
        setTimeout(() => {
          if (announcerRef.current) {
            announcerRef.current.textContent = '';
          }
        }, 1000);

        logger.debug(`Screen reader announcement: ${message}`, undefined, 'MusicAccessibility');
      }
    },
    [preferences.enableScreenReaderAnnouncements]
  );

  // ============================================
  // PREFERENCES
  // ============================================

  /**
   * Met à jour les préférences
   */
  const updatePreferences = useCallback((prefs: Partial<AccessibilityPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...prefs };

      // Appliquer les préférences système
      if (updated.reduceMotion) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      } else {
        document.documentElement.style.removeProperty('--animation-duration');
      }

      if (updated.highContrast) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }

      if (updated.largeControls) {
        document.body.classList.add('large-controls');
      } else {
        document.body.classList.remove('large-controls');
      }

      // Sauvegarder dans localStorage
      localStorage.setItem('music-accessibility-prefs', JSON.stringify(updated));

      logger.info('Accessibility preferences updated', updated, 'MusicAccessibility');

      return updated;
    });
  }, []);

  // Charger les préférences sauvegardées
  useEffect(() => {
    const stored = localStorage.getItem('music-accessibility-prefs');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        updatePreferences(parsed);
      } catch (error) {
        logger.error('Failed to parse saved preferences', error as Error, 'MusicAccessibility');
      }
    }
  }, [updatePreferences]);

  // Détecter les préférences système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        updatePreferences({ reduceMotion: true });
      }
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener?.('change', handleChange);

    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, [updatePreferences]);

  return {
    preferences,
    isListeningToVoice,
    voiceRecognitionSupported,
    updatePreferences,
    startVoiceControl,
    stopVoiceControl,
    announce,
    registerShortcut,
    unregisterShortcut,
    registerVoiceCommand,
    getShortcutsList
  };
}

// ============================================
// UTILITIES
// ============================================

function getShortcutKey(shortcut: KeyboardShortcut): string {
  return `${shortcut.ctrlKey ? 'ctrl+' : ''}${shortcut.shiftKey ? 'shift+' : ''}${shortcut.altKey ? 'alt+' : ''}${shortcut.key.toLowerCase()}`;
}

// ============================================
// DEFAULT SHORTCUTS
// ============================================

export function getDefaultMusicShortcuts(player: {
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  volumeUp: () => void;
  volumeDown: () => void;
  mute: () => void;
}): KeyboardShortcut[] {
  return [
    {
      key: ' ',
      action: player.play,
      description: 'Lecture/Pause'
    },
    {
      key: 'arrowright',
      action: player.next,
      description: 'Piste suivante'
    },
    {
      key: 'arrowleft',
      action: player.previous,
      description: 'Piste précédente'
    },
    {
      key: 'arrowup',
      action: player.volumeUp,
      description: 'Augmenter le volume'
    },
    {
      key: 'arrowdown',
      action: player.volumeDown,
      description: 'Diminuer le volume'
    },
    {
      key: 'm',
      action: player.mute,
      description: 'Mute/Unmute'
    }
  ];
}

// ============================================
// DEFAULT VOICE COMMANDS
// ============================================

export function getDefaultMusicVoiceCommands(player: {
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
}): VoiceCommand[] {
  return [
    {
      phrases: ['jouer', 'play', 'lecture', 'démarre'],
      action: player.play,
      description: 'Lecture'
    },
    {
      phrases: ['pause', 'stop', 'arrête'],
      action: player.pause,
      description: 'Pause'
    },
    {
      phrases: ['suivant', 'next', 'piste suivante'],
      action: player.next,
      description: 'Piste suivante'
    },
    {
      phrases: ['précédent', 'previous', 'retour', 'piste précédente'],
      action: player.previous,
      description: 'Piste précédente'
    }
  ];
}

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Exemple 1: Configuration complète
 *
 * ```tsx
 * function AccessibleMusicPlayer() {
 *   const { play, pause, next, previous } = useMusic();
 *
 *   const {
 *     preferences,
 *     announce,
 *     startVoiceControl,
 *     updatePreferences
 *   } = useMusicAccessibility({
 *     shortcuts: getDefaultMusicShortcuts({
 *       play, pause, next, previous,
 *       volumeUp: () => setVolume(v => Math.min(1, v + 0.1)),
 *       volumeDown: () => setVolume(v => Math.max(0, v - 0.1)),
 *       mute: () => setMuted(m => !m)
 *     }),
 *     voiceCommands: getDefaultMusicVoiceCommands({ play, pause, next, previous })
 *   });
 *
 *   return (
 *     <div>
 *       <button onClick={startVoiceControl}>Activer Contrôle Vocal</button>
 *       <AccessibilitySettings
 *         preferences={preferences}
 *         onUpdate={updatePreferences}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */

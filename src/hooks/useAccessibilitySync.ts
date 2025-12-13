/**
 * Hook pour synchroniser les paramètres d'accessibilité avec Supabase
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface AccessibilitySettings {
  // Vision
  highContrast: boolean;
  largeText: boolean;
  textSize: number; // 100-200
  reduceMotion: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
  
  // Audition
  captions: boolean;
  signLanguage: boolean;
  monoAudio: boolean;
  audioDescriptions: boolean;
  
  // Moteur
  keyboardNavigation: boolean;
  stickyKeys: boolean;
  slowKeys: boolean;
  mouseKeys: boolean;
  
  // Cognitif
  simplifiedUI: boolean;
  readingGuide: boolean;
  focusIndicator: boolean;
  autoplayDisabled: boolean;
  
  // Préférences
  screenReaderOptimized: boolean;
  voiceControl: boolean;
  customCursor: boolean;
  cursorSize: 'normal' | 'large' | 'extra-large';
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  textSize: 100,
  reduceMotion: false,
  colorBlindMode: 'none',
  captions: false,
  signLanguage: false,
  monoAudio: false,
  audioDescriptions: false,
  keyboardNavigation: true,
  stickyKeys: false,
  slowKeys: false,
  mouseKeys: false,
  simplifiedUI: false,
  readingGuide: false,
  focusIndicator: true,
  autoplayDisabled: false,
  screenReaderOptimized: false,
  voiceControl: false,
  customCursor: false,
  cursorSize: 'normal',
};

export function useAccessibilitySync() {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Charger les paramètres au montage
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);

      try {
        // Vérifier l'utilisateur connecté
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);

          // Charger depuis Supabase
          const { data, error } = await supabase
            .from('accessibility_settings' as any)
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (!error && data) {
            const loadedSettings: AccessibilitySettings = {
              highContrast: data.high_contrast ?? defaultSettings.highContrast,
              largeText: data.large_text ?? defaultSettings.largeText,
              textSize: data.text_size ?? defaultSettings.textSize,
              reduceMotion: data.reduce_motion ?? defaultSettings.reduceMotion,
              colorBlindMode: data.color_blind_mode ?? defaultSettings.colorBlindMode,
              captions: data.captions ?? defaultSettings.captions,
              signLanguage: data.sign_language ?? defaultSettings.signLanguage,
              monoAudio: data.mono_audio ?? defaultSettings.monoAudio,
              audioDescriptions: data.audio_descriptions ?? defaultSettings.audioDescriptions,
              keyboardNavigation: data.keyboard_navigation ?? defaultSettings.keyboardNavigation,
              stickyKeys: data.sticky_keys ?? defaultSettings.stickyKeys,
              slowKeys: data.slow_keys ?? defaultSettings.slowKeys,
              mouseKeys: data.mouse_keys ?? defaultSettings.mouseKeys,
              simplifiedUI: data.simplified_ui ?? defaultSettings.simplifiedUI,
              readingGuide: data.reading_guide ?? defaultSettings.readingGuide,
              focusIndicator: data.focus_indicator ?? defaultSettings.focusIndicator,
              autoplayDisabled: data.autoplay_disabled ?? defaultSettings.autoplayDisabled,
              screenReaderOptimized: data.screen_reader_optimized ?? defaultSettings.screenReaderOptimized,
              voiceControl: data.voice_control ?? defaultSettings.voiceControl,
              customCursor: data.custom_cursor ?? defaultSettings.customCursor,
              cursorSize: data.cursor_size ?? defaultSettings.cursorSize,
            };

            setSettings(loadedSettings);
            applySettings(loadedSettings);
            setLastSyncAt(new Date(data.updated_at));
            logger.info('♿ Accessibility settings loaded from Supabase', undefined, 'A11Y');
          }
        } else {
          // Charger depuis localStorage pour les utilisateurs non connectés
          const localSettings = localStorage.getItem('accessibility_settings');
          if (localSettings) {
            const parsed = JSON.parse(localSettings);
            setSettings(parsed);
            applySettings(parsed);
          }
        }
      } catch (error) {
        logger.error('Failed to load accessibility settings', error as Error, 'A11Y');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Appliquer les paramètres au DOM
  const applySettings = useCallback((s: AccessibilitySettings) => {
    const root = document.documentElement;
    const body = document.body;

    // Contraste élevé
    root.classList.toggle('high-contrast', s.highContrast);

    // Taille du texte
    root.style.fontSize = `${s.textSize}%`;
    body.classList.toggle('large-text', s.largeText);

    // Réduction des mouvements
    root.classList.toggle('reduce-motion', s.reduceMotion);
    if (s.reduceMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
    }

    // Mode daltonien
    root.setAttribute('data-color-blind-mode', s.colorBlindMode);

    // Interface simplifiée
    body.classList.toggle('simplified-ui', s.simplifiedUI);

    // Indicateur de focus
    body.classList.toggle('enhanced-focus', s.focusIndicator);

    // Taille du curseur
    body.setAttribute('data-cursor-size', s.cursorSize);

    // Guide de lecture
    body.classList.toggle('reading-guide', s.readingGuide);

    // Screen reader optimized
    if (s.screenReaderOptimized) {
      root.setAttribute('role', 'application');
    } else {
      root.removeAttribute('role');
    }

    // Désactiver autoplay
    if (s.autoplayDisabled) {
      document.querySelectorAll('video, audio').forEach((el) => {
        (el as HTMLMediaElement).autoplay = false;
      });
    }

    logger.debug('♿ Accessibility settings applied', s, 'A11Y');
  }, []);

  // Mettre à jour un paramètre
  const updateSetting = useCallback(async <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);

    // Sauvegarder
    await saveSettings(newSettings);
  }, [settings, applySettings]);

  // Mettre à jour plusieurs paramètres
  const updateSettings = useCallback(async (updates: Partial<AccessibilitySettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    applySettings(newSettings);

    // Sauvegarder
    await saveSettings(newSettings);
  }, [settings, applySettings]);

  // Sauvegarder les paramètres
  const saveSettings = useCallback(async (s: AccessibilitySettings) => {
    setIsSyncing(true);

    try {
      if (userId) {
        // Sauvegarder dans Supabase
        const { error } = await supabase
          .from('accessibility_settings' as any)
          .upsert({
            user_id: userId,
            high_contrast: s.highContrast,
            large_text: s.largeText,
            text_size: s.textSize,
            reduce_motion: s.reduceMotion,
            color_blind_mode: s.colorBlindMode,
            captions: s.captions,
            sign_language: s.signLanguage,
            mono_audio: s.monoAudio,
            audio_descriptions: s.audioDescriptions,
            keyboard_navigation: s.keyboardNavigation,
            sticky_keys: s.stickyKeys,
            slow_keys: s.slowKeys,
            mouse_keys: s.mouseKeys,
            simplified_ui: s.simplifiedUI,
            reading_guide: s.readingGuide,
            focus_indicator: s.focusIndicator,
            autoplay_disabled: s.autoplayDisabled,
            screen_reader_optimized: s.screenReaderOptimized,
            voice_control: s.voiceControl,
            custom_cursor: s.customCursor,
            cursor_size: s.cursorSize,
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;

        setLastSyncAt(new Date());
        logger.info('♿ Accessibility settings saved to Supabase', undefined, 'A11Y');
      } else {
        // Sauvegarder dans localStorage
        localStorage.setItem('accessibility_settings', JSON.stringify(s));
      }
    } catch (error) {
      logger.error('Failed to save accessibility settings', error as Error, 'A11Y');
    } finally {
      setIsSyncing(false);
    }
  }, [userId]);

  // Réinitialiser aux valeurs par défaut
  const resetSettings = useCallback(async () => {
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    await saveSettings(defaultSettings);
  }, [applySettings, saveSettings]);

  // Exporter les paramètres
  const exportSettings = useCallback((): string => {
    return JSON.stringify(settings, null, 2);
  }, [settings]);

  // Importer les paramètres
  const importSettings = useCallback(async (json: string) => {
    try {
      const imported = JSON.parse(json) as Partial<AccessibilitySettings>;
      const newSettings = { ...defaultSettings, ...imported };
      setSettings(newSettings);
      applySettings(newSettings);
      await saveSettings(newSettings);
      return true;
    } catch {
      return false;
    }
  }, [applySettings, saveSettings]);

  // Détecter les préférences système
  const detectSystemPreferences = useCallback(() => {
    const detected: Partial<AccessibilitySettings> = {};

    // Préférence de mouvement réduit
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      detected.reduceMotion = true;
    }

    // Préférence de contraste
    if (window.matchMedia('(prefers-contrast: more)').matches) {
      detected.highContrast = true;
    }

    // Préférence de couleurs
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Pourrait influencer d'autres paramètres
    }

    return detected;
  }, []);

  // Appliquer les préférences système
  const applySystemPreferences = useCallback(async () => {
    const detected = detectSystemPreferences();
    if (Object.keys(detected).length > 0) {
      await updateSettings(detected);
    }
  }, [detectSystemPreferences, updateSettings]);

  // Obtenir un résumé des paramètres actifs
  const getActiveSummary = useCallback((): string[] => {
    const active: string[] = [];

    if (settings.highContrast) active.push('Contraste élevé');
    if (settings.largeText) active.push('Grand texte');
    if (settings.textSize !== 100) active.push(`Taille ${settings.textSize}%`);
    if (settings.reduceMotion) active.push('Mouvement réduit');
    if (settings.colorBlindMode !== 'none') active.push(`Mode ${settings.colorBlindMode}`);
    if (settings.captions) active.push('Sous-titres');
    if (settings.screenReaderOptimized) active.push('Lecteur d\'écran');
    if (settings.simplifiedUI) active.push('Interface simplifiée');
    if (settings.focusIndicator) active.push('Indicateur de focus');
    if (settings.keyboardNavigation) active.push('Navigation clavier');

    return active;
  }, [settings]);

  return {
    settings,
    isLoading,
    isSyncing,
    lastSyncAt,
    updateSetting,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings,
    detectSystemPreferences,
    applySystemPreferences,
    getActiveSummary,
  };
}

export default useAccessibilitySync;

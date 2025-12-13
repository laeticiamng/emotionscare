// @ts-nocheck
/**
 * useReducedMotion - Hook pour respecter la préférence utilisateur de mouvement réduit
 * Détecte automatiquement la préférence système et permet les override manuels
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

/** Niveau de réduction de mouvement */
export type MotionLevel = 'none' | 'reduced' | 'minimal' | 'disabled';

/** Configuration d'animation */
export interface AnimationConfig {
  duration: number;
  delay: number;
  ease: string | number[];
  stiffness?: number;
  damping?: number;
}

/** Variants d'animation pour Framer Motion */
export interface AnimationVariants {
  hidden: Record<string, unknown>;
  visible: Record<string, unknown>;
  exit?: Record<string, unknown>;
}

/** Préférences d'accessibilité complètes */
export interface AccessibilityPreferences {
  reducedMotion: boolean;
  reducedTransparency: boolean;
  highContrast: boolean;
  invertedColors: boolean;
  prefersColorScheme: 'light' | 'dark' | 'no-preference';
  forcedColors: boolean;
}

/** Configuration du hook */
export interface ReducedMotionConfig {
  respectSystem: boolean;
  defaultLevel: MotionLevel;
  storageKey: string;
  syncWithStorage: boolean;
}

const DEFAULT_CONFIG: ReducedMotionConfig = {
  respectSystem: true,
  defaultLevel: 'none',
  storageKey: 'motion-preference',
  syncWithStorage: true
};

/** Configurations d'animation par niveau */
const ANIMATION_CONFIGS: Record<MotionLevel, AnimationConfig> = {
  none: { duration: 0.6, delay: 0, ease: 'easeOut' },
  reduced: { duration: 0.3, delay: 0, ease: 'easeOut' },
  minimal: { duration: 0.15, delay: 0, ease: 'linear' },
  disabled: { duration: 0, delay: 0, ease: 'linear' }
};

/** Hook principal pour la réduction de mouvement */
export function useReducedMotion(config?: Partial<ReducedMotionConfig>): boolean {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Vérifier la préférence système
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Écouter les changements de préférence
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Support pour les anciens navigateurs
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
}

/** Hook avancé avec plus de contrôle */
export function useMotionPreference(config?: Partial<ReducedMotionConfig>) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  const systemPrefersReduced = useReducedMotion();
  const [userLevel, setUserLevel] = useState<MotionLevel>(() => {
    if (typeof window === 'undefined') return mergedConfig.defaultLevel;

    if (mergedConfig.syncWithStorage) {
      const stored = localStorage.getItem(mergedConfig.storageKey);
      if (stored && ['none', 'reduced', 'minimal', 'disabled'].includes(stored)) {
        return stored as MotionLevel;
      }
    }
    return mergedConfig.defaultLevel;
  });

  // Niveau effectif
  const effectiveLevel = useMemo((): MotionLevel => {
    if (mergedConfig.respectSystem && systemPrefersReduced) {
      return userLevel === 'none' ? 'reduced' : userLevel;
    }
    return userLevel;
  }, [systemPrefersReduced, userLevel, mergedConfig.respectSystem]);

  // Sauvegarder les préférences
  const setLevel = useCallback((level: MotionLevel) => {
    setUserLevel(level);
    if (mergedConfig.syncWithStorage && typeof window !== 'undefined') {
      localStorage.setItem(mergedConfig.storageKey, level);
    }
  }, [mergedConfig.storageKey, mergedConfig.syncWithStorage]);

  // Réinitialiser aux valeurs par défaut
  const reset = useCallback(() => {
    setLevel(mergedConfig.defaultLevel);
  }, [setLevel, mergedConfig.defaultLevel]);

  // Configuration d'animation actuelle
  const animationConfig = useMemo(() => {
    return ANIMATION_CONFIGS[effectiveLevel];
  }, [effectiveLevel]);

  // Vérifier si les animations sont activées
  const animationsEnabled = effectiveLevel !== 'disabled';

  return {
    // État
    systemPrefersReduced,
    userLevel,
    effectiveLevel,
    animationsEnabled,
    animationConfig,

    // Actions
    setLevel,
    reset,

    // Helpers
    isReduced: effectiveLevel !== 'none',
    isMinimal: effectiveLevel === 'minimal' || effectiveLevel === 'disabled',
    isDisabled: effectiveLevel === 'disabled'
  };
}

/** Hook pour toutes les préférences d'accessibilité */
export function useAccessibilityPreferences(): AccessibilityPreferences {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    reducedMotion: false,
    reducedTransparency: false,
    highContrast: false,
    invertedColors: false,
    prefersColorScheme: 'no-preference',
    forcedColors: false
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const queries = {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
      reducedTransparency: window.matchMedia('(prefers-reduced-transparency: reduce)'),
      highContrast: window.matchMedia('(prefers-contrast: high)'),
      invertedColors: window.matchMedia('(inverted-colors: inverted)'),
      lightScheme: window.matchMedia('(prefers-color-scheme: light)'),
      darkScheme: window.matchMedia('(prefers-color-scheme: dark)'),
      forcedColors: window.matchMedia('(forced-colors: active)')
    };

    const updatePreferences = () => {
      let colorScheme: 'light' | 'dark' | 'no-preference' = 'no-preference';
      if (queries.darkScheme.matches) colorScheme = 'dark';
      else if (queries.lightScheme.matches) colorScheme = 'light';

      setPreferences({
        reducedMotion: queries.reducedMotion.matches,
        reducedTransparency: queries.reducedTransparency.matches,
        highContrast: queries.highContrast.matches,
        invertedColors: queries.invertedColors.matches,
        prefersColorScheme: colorScheme,
        forcedColors: queries.forcedColors.matches
      });
    };

    updatePreferences();

    // Écouter tous les changements
    Object.values(queries).forEach(query => {
      if (query.addEventListener) {
        query.addEventListener('change', updatePreferences);
      }
    });

    return () => {
      Object.values(queries).forEach(query => {
        if (query.removeEventListener) {
          query.removeEventListener('change', updatePreferences);
        }
      });
    };
  }, []);

  return preferences;
}

/**
 * Helper pour obtenir des variants d'animation adaptés
 */
export function getAnimationVariants(prefersReducedMotion: boolean): Record<string, AnimationVariants> {
  const config = prefersReducedMotion ? ANIMATION_CONFIGS.reduced : ANIMATION_CONFIGS.none;

  if (prefersReducedMotion) {
    return {
      fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: config.duration } },
        exit: { opacity: 0, transition: { duration: config.duration / 2 } }
      },
      slideUp: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: config.duration } },
        exit: { opacity: 0, transition: { duration: config.duration / 2 } }
      },
      slideDown: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: config.duration } },
        exit: { opacity: 0, transition: { duration: config.duration / 2 } }
      },
      slideLeft: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: config.duration } },
        exit: { opacity: 0, transition: { duration: config.duration / 2 } }
      },
      slideRight: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: config.duration } },
        exit: { opacity: 0, transition: { duration: config.duration / 2 } }
      },
      scale: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: config.duration } },
        exit: { opacity: 0, transition: { duration: config.duration / 2 } }
      },
      pop: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: config.duration } },
        exit: { opacity: 0, transition: { duration: config.duration / 2 } }
      }
    };
  }

  return {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: config.duration } },
      exit: { opacity: 0, transition: { duration: config.duration / 2 } }
    },
    slideUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: config.duration } },
      exit: { opacity: 0, y: -10, transition: { duration: config.duration / 2 } }
    },
    slideDown: {
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0, transition: { duration: config.duration } },
      exit: { opacity: 0, y: 10, transition: { duration: config.duration / 2 } }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 20 },
      visible: { opacity: 1, x: 0, transition: { duration: config.duration } },
      exit: { opacity: 0, x: -10, transition: { duration: config.duration / 2 } }
    },
    slideRight: {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0, transition: { duration: config.duration } },
      exit: { opacity: 0, x: 10, transition: { duration: config.duration / 2 } }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1, transition: { duration: config.duration } },
      exit: { opacity: 0, scale: 0.98, transition: { duration: config.duration / 2 } }
    },
    pop: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      },
      exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15 } }
    }
  };
}

/** Créer une transition adaptée */
export function createTransition(
  prefersReducedMotion: boolean,
  options?: Partial<AnimationConfig>
): AnimationConfig {
  const baseConfig = prefersReducedMotion ? ANIMATION_CONFIGS.reduced : ANIMATION_CONFIGS.none;
  return { ...baseConfig, ...options };
}

/** Hook pour les animations de scroll */
export function useScrollAnimation(prefersReducedMotion?: boolean) {
  const systemReduced = useReducedMotion();
  const isReduced = prefersReducedMotion ?? systemReduced;

  const scrollTo = useCallback((element: HTMLElement | string, offset: number = 0) => {
    const target = typeof element === 'string'
      ? document.querySelector(element)
      : element;

    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top,
      behavior: isReduced ? 'auto' : 'smooth'
    });
  }, [isReduced]);

  return { scrollTo, isReduced };
}

export default useReducedMotion;

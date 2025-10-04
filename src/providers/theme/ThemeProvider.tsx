/**
 * ThemeProvider Unifié - EmotionsCare
 * 
 * Système de gestion de thème centralisé avec support:
 * - Dark/Light/System modes
 * - Persistence localStorage
 * - Classes CSS + data-attributes
 * - SSR-safe
 * - TypeScript strict
 * 
 * @module ThemeProvider
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Theme = 'dark' | 'light' | 'system';

export type ResolvedTheme = 'dark' | 'light';

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  attribute?: 'class' | 'data-theme';
}

export interface ThemeProviderState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  systemTheme: ResolvedTheme;
}

const initialState: ThemeProviderState = {
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => null,
  systemTheme: 'light',
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

/**
 * Détecte la préférence système de l'utilisateur
 */
function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * ThemeProvider - Composant principal de gestion de thème
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'emotionscare-theme',
  enableSystem = true,
  disableTransitionOnChange = false,
  attribute = 'class',
  ...props
}: ThemeProviderProps) {
  // État du thème sélectionné par l'utilisateur
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    try {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  // État du thème système
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => getSystemTheme());

  // Thème résolu (effectivement appliqué)
  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;

  /**
   * Applique le thème au DOM
   */
  const applyTheme = useCallback((newTheme: ResolvedTheme) => {
    const root = window.document.documentElement;

    // Désactive temporairement les transitions si demandé
    if (disableTransitionOnChange) {
      root.style.setProperty('transition', 'none');
    }

    // Applique selon l'attribut choisi
    if (attribute === 'class') {
      root.classList.remove('light', 'dark');
      root.classList.add(newTheme);
      // Garde aussi data-theme pour compatibilité
      root.setAttribute('data-theme', newTheme);
    } else {
      root.setAttribute('data-theme', newTheme);
      // Classes pour compatibilité
      root.classList.remove('light', 'dark');
      root.classList.add(newTheme);
    }

    // Réactive les transitions
    if (disableTransitionOnChange) {
      setTimeout(() => {
        root.style.removeProperty('transition');
      }, 0);
    }
  }, [attribute, disableTransitionOnChange]);

  /**
   * Change le thème
   */
  const setTheme = useCallback((newTheme: Theme) => {
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch {
      // Ignore les erreurs localStorage (mode privé, etc.)
    }
    setThemeState(newTheme);
  }, [storageKey]);

  // Écoute les changements de préférence système
  useEffect(() => {
    if (!enableSystem) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    // Moderne
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Fallback pour anciens navigateurs
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [enableSystem]);

  // Applique le thème résolu au DOM
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme, applyTheme]);

  // Valeur du contexte
  const value: ThemeProviderState = {
    theme,
    resolvedTheme,
    setTheme,
    systemTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

/**
 * Hook pour accéder au contexte de thème
 * @throws {Error} Si utilisé hors d'un ThemeProvider
 */
export function useTheme(): ThemeProviderState {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

/**
 * Hook pour basculer entre les thèmes
 */
export function useThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggle = useCallback(() => {
    const next: Theme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
  }, [theme, setTheme]);

  const toggleBinary = useCallback(() => {
    const next: Theme = theme === 'dark' || (theme === 'system' && getSystemTheme() === 'dark')
      ? 'light'
      : 'dark';
    setTheme(next);
  }, [theme, setTheme]);

  return { toggle, toggleBinary };
}

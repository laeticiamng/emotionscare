/**
 * Contexte React pour la gestion des thèmes
 * Phase 3 - Excellence
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { CustomTheme, UserThemePreferences } from '@/types/themes';
import * as themeService from '@/services/themes.service';
import { THEME_PRESETS } from '@/features/themes/presets';
import { useAuth } from './AuthContext';
import { logger } from '@/lib/logger';

interface ThemeContextValue {
  activeTheme: CustomTheme | null;
  allThemes: CustomTheme[];
  preferences: UserThemePreferences | null;
  loading: boolean;
  activateTheme: (themeId: string) => Promise<void>;
  createTheme: (theme: Omit<CustomTheme, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<CustomTheme | null>;
  updateTheme: (themeId: string, updates: Partial<CustomTheme>) => Promise<CustomTheme>;
  deleteTheme: (themeId: string) => Promise<void>;
  duplicateTheme: (themeId: string, newName: string) => Promise<CustomTheme | null>;
  exportTheme: (themeId: string) => void;
  importTheme: (file: File) => Promise<CustomTheme | null>;
  updatePreferences: (preferences: Partial<UserThemePreferences>) => Promise<void>;
  refreshThemes: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [activeTheme, setActiveTheme] = useState<CustomTheme | null>(null);
  const [allThemes, setAllThemes] = useState<CustomTheme[]>([]);
  const [preferences, setPreferences] = useState<UserThemePreferences | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger les thèmes au montage et quand l'utilisateur change
  useEffect(() => {
    if (user?.id) {
      loadThemes();
    } else {
      // Charger le thème par défaut pour les utilisateurs non connectés
      loadDefaultTheme();
    }
  }, [user?.id]);

  // Auto-switch entre mode clair et sombre
  useEffect(() => {
    if (!preferences?.autoSwitchEnabled || !preferences.switchTime) return;

    const checkAutoSwitch = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      if (!preferences.switchTime) return;
      const { lightModeStart, darkModeStart } = preferences.switchTime;

      if (currentTime >= darkModeStart && preferences.darkThemeId) {
        activateTheme(preferences.darkThemeId);
      } else if (currentTime >= lightModeStart && preferences.lightThemeId) {
        activateTheme(preferences.lightThemeId);
      }
    };

    // Vérifier toutes les minutes
    const interval = setInterval(checkAutoSwitch, 60000);
    checkAutoSwitch(); // Vérifier immédiatement

    return () => clearInterval(interval);
  }, [preferences]);

  const loadThemes = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Charger les thèmes prédéfinis
      const builtInThemes = THEME_PRESETS.map((preset) => ({
        ...preset.theme,
        id: preset.id,
        name: preset.name,
        description: preset.description,
        thumbnail: preset.thumbnail,
        tags: preset.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })) as CustomTheme[];

      // Charger les thèmes personnalisés de l'utilisateur
      const customThemes = await themeService.getUserCustomThemes(user.id);

      setAllThemes([...builtInThemes, ...customThemes]);

      // Charger les préférences
      const userPreferences = await themeService.getUserThemePreferences(user.id);
      setPreferences(userPreferences);

      // Activer le thème actif
      const activeThemeId = userPreferences?.activeThemeId || 'default-light';
      const theme = [...builtInThemes, ...customThemes].find((t) => t.id === activeThemeId);

      if (theme) {
        setActiveTheme(theme);
        themeService.applyThemeToDOM(theme);
      }
    } catch (error) {
      logger.error('Failed to load themes:', error, 'CONTEXT');
    } finally {
      setLoading(false);
    }
  };

  const loadDefaultTheme = () => {
    const defaultPreset = THEME_PRESETS.find((p) => p.id === 'default-light');
    if (defaultPreset) {
      const theme: CustomTheme = {
        ...defaultPreset.theme,
        id: defaultPreset.id,
        name: defaultPreset.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setActiveTheme(theme);
      setAllThemes([theme]);
      themeService.applyThemeToDOM(theme);
      setLoading(false);
    }
  };

  const activateTheme = useCallback(
    async (themeId: string) => {
      if (!user?.id) return;

      const theme = allThemes.find((t) => t.id === themeId);
      if (!theme) {
        logger.error('Theme not found', new Error(`Theme ${themeId} not found`), 'THEME');
        return; // Retourner au lieu de throw pour éviter le crash
      }

      setActiveTheme(theme);
      themeService.applyThemeToDOM(theme);

      try {
        await themeService.activateTheme(user.id, themeId);
        // Recharger les préférences
        const newPreferences = await themeService.getUserThemePreferences(user.id);
        setPreferences(newPreferences);
      } catch (error) {
        logger.error('Failed to activate theme', error as Error, 'THEME');
      }
    },
    [user?.id, allThemes]
  );

  const createTheme = useCallback(
    async (theme: Omit<CustomTheme, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      if (!user?.id) {
        logger.error('User not authenticated', new Error('User not authenticated'), 'THEME');
        return null; // Retourner null au lieu de throw
      }

      try {
        const newTheme = await themeService.createCustomTheme(user.id, theme);
        setAllThemes((prev) => [...prev, newTheme]);
        return newTheme;
      } catch (error) {
        logger.error('Failed to create theme', error as Error, 'THEME');
        return null;
      }
    },
    [user?.id]
  );

  const updateTheme = useCallback(
    async (themeId: string, updates: Partial<CustomTheme>) => {
      const updatedTheme = await themeService.updateCustomTheme(themeId, updates);
      setAllThemes((prev) => prev.map((t) => (t.id === themeId ? updatedTheme : t)));

      // Si c'est le thème actif, le réappliquer
      if (activeTheme?.id === themeId) {
        setActiveTheme(updatedTheme);
        themeService.applyThemeToDOM(updatedTheme);
      }

      return updatedTheme;
    },
    [activeTheme]
  );

  const deleteTheme = useCallback(async (themeId: string) => {
    await themeService.deleteCustomTheme(themeId);
    setAllThemes((prev) => prev.filter((t) => t.id !== themeId));
  }, []);

  const duplicateTheme = useCallback(
    async (themeId: string, newName: string) => {
      if (!user?.id) {
        logger.error('User not authenticated', new Error('User not authenticated'), 'THEME');
        return null; // Retourner null au lieu de throw
      }

      try {
        const duplicated = await themeService.duplicateTheme(user.id, themeId, newName);
        setAllThemes((prev) => [...prev, duplicated]);
        return duplicated;
      } catch (error) {
        logger.error('Failed to duplicate theme', error as Error, 'THEME');
        return null;
      }
    },
    [user?.id]
  );

  const exportTheme = useCallback((themeId: string) => {
    const theme = allThemes.find((t) => t.id === themeId);
    if (!theme) {
      logger.error('Theme not found for export', new Error(`Theme ${themeId} not found`), 'THEME');
      return; // Retourner au lieu de throw
    }

    // Vérification SSR
    if (typeof document === 'undefined' || typeof Blob === 'undefined') {
      logger.error('Export not available in SSR context', new Error('Document API unavailable'), 'THEME');
      return;
    }

    try {
      const exported = themeService.exportTheme(theme);
      const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${theme.name.toLowerCase().replace(/\s+/g, '-')}.theme.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      logger.error('Failed to export theme', error as Error, 'THEME');
    }
  }, [allThemes]);

  const importTheme = useCallback(
    async (file: File) => {
      if (!user?.id) {
        logger.error('User not authenticated', new Error('User not authenticated'), 'THEME');
        return null; // Retourner null au lieu de throw
      }

      try {
        const content = await file.text();
        const themeExport = JSON.parse(content);
        const imported = await themeService.importTheme(user.id, themeExport);
        setAllThemes((prev) => [...prev, imported]);
        return imported;
      } catch (error) {
        logger.error('Failed to import theme', error as Error, 'THEME');
        return null;
      }
    },
    [user?.id]
  );

  const updatePreferences = useCallback(
    async (updates: Partial<UserThemePreferences>) => {
      if (!user?.id) {
        logger.error('User not authenticated', new Error('User not authenticated'), 'THEME');
        return; // Retourner au lieu de throw
      }

      try {
        const updated = await themeService.updateUserThemePreferences(user.id, updates);
        setPreferences(updated);
      } catch (error) {
        logger.error('Failed to update preferences', error as Error, 'THEME');
      }
    },
    [user?.id]
  );

  const refreshThemes = useCallback(async () => {
    await loadThemes();
  }, [user?.id]);

  const value: ThemeContextValue = {
    activeTheme,
    allThemes,
    preferences,
    loading,
    activateTheme,
    createTheme,
    updateTheme,
    deleteTheme,
    duplicateTheme,
    exportTheme,
    importTheme,
    updatePreferences,
    refreshThemes,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

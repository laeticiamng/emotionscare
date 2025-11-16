/**
 * Service de gestion des thèmes personnalisables
 * Phase 3 - Excellence
 */

import { supabase } from '@/lib/supabase';
import type {
  CustomTheme,
  UserThemePreferences,
  ThemePreset,
  ThemeExport,
} from '@/types/themes';

/**
 * Récupérer les préférences de thème d'un utilisateur
 */
export async function getUserThemePreferences(
  userId: string
): Promise<UserThemePreferences | null> {
  const { data, error } = await supabase
    .from('user_theme_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch theme preferences: ${error.message}`);
  }

  return data;
}

/**
 * Mettre à jour les préférences de thème
 */
export async function updateUserThemePreferences(
  userId: string,
  preferences: Partial<UserThemePreferences>
): Promise<UserThemePreferences> {
  const { data, error } = await supabase
    .from('user_theme_preferences')
    .upsert({
      user_id: userId,
      ...preferences,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to update theme preferences: ${error.message}`);
  return data;
}

/**
 * Récupérer tous les thèmes personnalisés d'un utilisateur
 */
export async function getUserCustomThemes(userId: string): Promise<CustomTheme[]> {
  const { data, error } = await supabase
    .from('custom_themes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch custom themes: ${error.message}`);
  return data || [];
}

/**
 * Créer un nouveau thème personnalisé
 */
export async function createCustomTheme(
  userId: string,
  theme: Omit<CustomTheme, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<CustomTheme> {
  const { data, error } = await supabase
    .from('custom_themes')
    .insert({
      user_id: userId,
      ...theme,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create custom theme: ${error.message}`);
  return data;
}

/**
 * Mettre à jour un thème personnalisé
 */
export async function updateCustomTheme(
  themeId: string,
  updates: Partial<CustomTheme>
): Promise<CustomTheme> {
  const { data, error } = await supabase
    .from('custom_themes')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', themeId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update custom theme: ${error.message}`);
  return data;
}

/**
 * Supprimer un thème personnalisé
 */
export async function deleteCustomTheme(themeId: string): Promise<void> {
  const { error } = await supabase.from('custom_themes').delete().eq('id', themeId);

  if (error) throw new Error(`Failed to delete custom theme: ${error.message}`);
}

/**
 * Récupérer un thème spécifique
 */
export async function getThemeById(themeId: string): Promise<CustomTheme | null> {
  const { data, error } = await supabase
    .from('custom_themes')
    .select('*')
    .eq('id', themeId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch theme: ${error.message}`);
  }

  return data;
}

/**
 * Récupérer tous les thèmes prédéfinis
 */
export async function getBuiltInThemes(): Promise<CustomTheme[]> {
  const { data, error } = await supabase
    .from('custom_themes')
    .select('*')
    .eq('is_built_in', true)
    .order('name');

  if (error) throw new Error(`Failed to fetch built-in themes: ${error.message}`);
  return data || [];
}

/**
 * Dupliquer un thème (pour personnalisation)
 */
export async function duplicateTheme(
  userId: string,
  themeId: string,
  newName: string
): Promise<CustomTheme> {
  const original = await getThemeById(themeId);
  if (!original) {
    throw new Error('Theme not found');
  }

  const { data, error } = await supabase
    .from('custom_themes')
    .insert({
      user_id: userId,
      name: newName,
      description: original.description,
      mode: original.mode,
      colors: original.colors,
      fonts: original.fonts,
      spacing: original.spacing,
      effects: original.effects,
      accessibility: original.accessibility,
      is_built_in: false,
      is_premium: false,
      tags: original.tags,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to duplicate theme: ${error.message}`);
  return data;
}

/**
 * Exporter un thème
 */
export function exportTheme(theme: CustomTheme): ThemeExport {
  return {
    ...theme,
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
  };
}

/**
 * Importer un thème
 */
export async function importTheme(
  userId: string,
  themeExport: ThemeExport
): Promise<CustomTheme> {
  // Valider la version
  if (!themeExport.version || themeExport.version !== '1.0.0') {
    throw new Error('Unsupported theme version');
  }

  const { data, error } = await supabase
    .from('custom_themes')
    .insert({
      user_id: userId,
      name: `${themeExport.name} (imported)`,
      description: themeExport.description,
      mode: themeExport.mode,
      colors: themeExport.colors,
      fonts: themeExport.fonts,
      spacing: themeExport.spacing,
      effects: themeExport.effects,
      accessibility: themeExport.accessibility,
      is_built_in: false,
      is_premium: false,
      tags: themeExport.tags,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to import theme: ${error.message}`);
  return data;
}

/**
 * Activer un thème
 */
export async function activateTheme(userId: string, themeId: string): Promise<void> {
  await updateUserThemePreferences(userId, {
    activeThemeId: themeId,
  });
}

/**
 * Appliquer le thème au DOM
 */
export function applyThemeToDOM(theme: CustomTheme): void {
  const root = document.documentElement;

  // Appliquer les couleurs
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  // Appliquer les polices
  root.style.setProperty('--font-heading', theme.fonts.heading);
  root.style.setProperty('--font-body', theme.fonts.body);
  root.style.setProperty('--font-mono', theme.fonts.mono);

  // Appliquer l'espacement
  root.style.setProperty('--spacing-scale', theme.spacing.scale.toString());
  root.style.setProperty('--radius', getRadiusValue(theme.spacing.radius));

  // Appliquer les effets
  root.style.setProperty('--blur', getBlurValue(theme.effects.blur));
  root.style.setProperty('--shadow', getShadowValue(theme.effects.shadows));

  // Appliquer les préférences d'accessibilité
  root.style.setProperty('--font-size-base', getFontSizeValue(theme.accessibility.fontSize));
  root.style.setProperty('--line-height', getLineHeightValue(theme.accessibility.lineHeight));

  // Mode sombre/clair
  root.classList.remove('light', 'dark');
  if (theme.mode !== 'auto') {
    root.classList.add(theme.mode);
  } else {
    // Utiliser la préférence système
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.add(prefersDark ? 'dark' : 'light');
  }

  // Animations réduites
  if (theme.effects.reducedMotion || theme.accessibility.highContrast) {
    root.classList.add('reduce-motion');
  } else {
    root.classList.remove('reduce-motion');
  }

  // Haut contraste
  if (theme.accessibility.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }
}

// Helpers pour convertir les valeurs

function getRadiusValue(radius: string): string {
  const values = {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  };
  return values[radius as keyof typeof values] || values.md;
}

function getBlurValue(blur: string): string {
  const values = {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
  };
  return values[blur as keyof typeof values] || values.md;
}

function getShadowValue(shadow: string): string {
  const values = {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  };
  return values[shadow as keyof typeof values] || values.md;
}

function getFontSizeValue(fontSize: string): string {
  const values = {
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
  };
  return values[fontSize as keyof typeof values] || values.base;
}

function getLineHeightValue(lineHeight: string): string {
  const values = {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  };
  return values[lineHeight as keyof typeof values] || values.normal;
}

/**
 * Partager un thème (générer un code de partage)
 */
export async function shareTheme(themeId: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke('themes-share', {
    body: { themeId },
  });

  if (error) throw new Error(`Failed to share theme: ${error.message}`);
  return data.shareCode;
}

/**
 * Importer un thème partagé
 */
export async function importSharedTheme(userId: string, shareCode: string): Promise<CustomTheme> {
  const { data, error } = await supabase.functions.invoke('themes-import-shared', {
    body: { userId, shareCode },
  });

  if (error) throw new Error(`Failed to import shared theme: ${error.message}`);
  return data.theme;
}

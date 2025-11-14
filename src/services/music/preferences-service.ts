/**
 * User Music Preferences Service
 * Gestion des préférences musicales utilisateur
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface UserMusicPreferences {
  id?: string;
  user_id: string;
  favorite_genres: string[];
  preferred_tempos: {
    min: number;
    max: number;
  };
  favorite_moods: string[];
  listening_contexts: string[];
  preferred_energy_level?: number; // 0-100
  instrumental_preference?: 'instrumental' | 'vocal' | 'both';
  created_at?: string;
  updated_at?: string;
}

export interface PreferencesFormData {
  genres: string[];
  tempoRange: { min: number; max: number };
  moods: string[];
  contexts: string[];
  energyLevel?: number;
  instrumentalPreference?: 'instrumental' | 'vocal' | 'both';
}

/**
 * Récupérer les préférences de l'utilisateur
 */
export async function getUserPreferences(): Promise<UserMusicPreferences | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.warn('Cannot fetch preferences: user not authenticated', undefined, 'MUSIC');
      return null;
    }

    const { data, error } = await supabase
      .from('user_music_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      // Ignore not found error
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data as UserMusicPreferences | null;
  } catch (error) {
    logger.error('Failed to fetch user preferences', error as Error, 'MUSIC');
    return null;
  }
}

/**
 * Sauvegarder ou mettre à jour les préférences
 */
export async function saveUserPreferences(
  preferences: PreferencesFormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Vérifier si des préférences existent déjà
    const existing = await getUserPreferences();

    const preferencesData = {
      user_id: user.id,
      favorite_genres: preferences.genres,
      preferred_tempos: preferences.tempoRange,
      favorite_moods: preferences.moods,
      listening_contexts: preferences.contexts,
      preferred_energy_level: preferences.energyLevel,
      instrumental_preference: preferences.instrumentalPreference,
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('user_music_preferences')
        .update(preferencesData)
        .eq('user_id', user.id);

      if (error) throw error;
      logger.info('User preferences updated', { userId: user.id }, 'MUSIC');
    } else {
      // Insert new
      const { error } = await supabase
        .from('user_music_preferences')
        .insert({
          ...preferencesData,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;
      logger.info('User preferences created', { userId: user.id }, 'MUSIC');
    }

    return { success: true };
  } catch (error) {
    logger.error('Failed to save user preferences', error as Error, 'MUSIC');
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Vérifier si l'utilisateur a déjà configuré ses préférences
 */
export async function hasUserPreferences(): Promise<boolean> {
  const preferences = await getUserPreferences();
  return preferences !== null;
}

/**
 * Options disponibles pour le questionnaire
 */
export const MUSIC_PREFERENCES_OPTIONS = {
  genres: [
    { value: 'ambient', label: 'Ambient', icon: '🌊' },
    { value: 'classical', label: 'Classique', icon: '🎻' },
    { value: 'electronic', label: 'Électronique', icon: '🎹' },
    { value: 'jazz', label: 'Jazz', icon: '🎺' },
    { value: 'pop', label: 'Pop', icon: '🎤' },
    { value: 'rock', label: 'Rock', icon: '🎸' },
    { value: 'lofi', label: 'Lo-Fi', icon: '📻' },
    { value: 'world', label: 'World', icon: '🌍' },
    { value: 'indie', label: 'Indie', icon: '🎧' },
    { value: 'soundtrack', label: 'Cinématique', icon: '🎬' },
  ],
  
  moods: [
    { value: 'calm', label: 'Calme', icon: '😌' },
    { value: 'energetic', label: 'Énergique', icon: '⚡' },
    { value: 'happy', label: 'Joyeux', icon: '😊' },
    { value: 'melancholic', label: 'Mélancolique', icon: '🌙' },
    { value: 'focused', label: 'Concentré', icon: '🎯' },
    { value: 'relaxed', label: 'Détendu', icon: '☁️' },
    { value: 'motivated', label: 'Motivé', icon: '🚀' },
    { value: 'contemplative', label: 'Contemplatif', icon: '🤔' },
  ],
  
  contexts: [
    { value: 'work', label: 'Travail', icon: '💼' },
    { value: 'study', label: 'Étude', icon: '📚' },
    { value: 'exercise', label: 'Sport', icon: '🏃' },
    { value: 'relax', label: 'Relaxation', icon: '🧘' },
    { value: 'sleep', label: 'Sommeil', icon: '😴' },
    { value: 'meditation', label: 'Méditation', icon: '🕉️' },
    { value: 'creative', label: 'Créatif', icon: '🎨' },
    { value: 'commute', label: 'Trajet', icon: '🚗' },
  ],
  
  instrumentalPreference: [
    { value: 'instrumental', label: 'Instrumental uniquement', icon: '🎼' },
    { value: 'vocal', label: 'Avec voix', icon: '🎤' },
    { value: 'both', label: 'Les deux', icon: '🎵' },
  ],
};

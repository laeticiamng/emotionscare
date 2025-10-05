/**
 * Service pour Screen Silk (Fond d'écran adaptatif)
 */

import { supabase } from '@/integrations/supabase/client';

export interface ScreenSilkSession {
  id: string;
  user_id: string;
  wallpaper_url?: string;
  theme?: string;
  mood_context?: string;
  created_at: string;
}

export class ScreenSilkService {
  /**
   * Créer une session Screen Silk
   */
  static async createSession(
    userId: string,
    wallpaperUrl?: string,
    theme?: string,
    moodContext?: string
  ): Promise<ScreenSilkSession> {
    const { data, error } = await supabase
      .from('screen_silk_sessions')
      .insert({
        user_id: userId,
        wallpaper_url: wallpaperUrl,
        theme,
        mood_context: moodContext
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Mettre à jour le fond d'écran
   */
  static async updateWallpaper(
    sessionId: string,
    wallpaperUrl: string,
    theme?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('screen_silk_sessions')
      .update({
        wallpaper_url: wallpaperUrl,
        theme
      })
      .eq('id', sessionId);

    if (error) throw error;
  }

  /**
   * Récupérer l'historique
   */
  static async fetchHistory(userId: string, limit: number = 20): Promise<ScreenSilkSession[]> {
    const { data, error } = await supabase
      .from('screen_silk_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Obtenir le dernier fond d'écran
   */
  static async getLatestWallpaper(userId: string): Promise<ScreenSilkSession | null> {
    const { data, error } = await supabase
      .from('screen_silk_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Obtenir des statistiques
   */
  static async getStats(userId: string): Promise<{
    totalChanges: number;
    favoriteTheme: string;
    themesUsed: string[];
  }> {
    const sessions = await this.fetchHistory(userId, 100);

    const totalChanges = sessions.length;
    
    const themeCount = new Map<string, number>();
    sessions.forEach(s => {
      if (s.theme) {
        themeCount.set(s.theme, (themeCount.get(s.theme) || 0) + 1);
      }
    });

    const favoriteTheme = Array.from(themeCount.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'default';

    const themesUsed = Array.from(themeCount.keys());

    return {
      totalChanges,
      favoriteTheme,
      themesUsed
    };
  }
}

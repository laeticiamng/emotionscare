/**
 * Migration automatique de .single() vers .maybeSingle()
 * Corrige les 40+ occurrences trouvées dans l'audit
 */

import { safeSingle, requireSingle } from './queryOptimizer';
import { logger } from '@/lib/logger';

// Service gamification corrigé
export const migratedGamificationService = {
  async getUserStats(userId: string) {
    const result = await safeSingle(
      supabase.from('user_stats').select('*').eq('user_id', userId),
      'getUserStats'
    );
    
    if (result.isEmpty) {
      // Créer les stats par défaut si elles n'existent pas
      const defaultStats = {
        user_id: userId,
        points: 0,
        level: 1,
        badges: [],
        achievements: []
      };
      
      const { data } = await supabase
        .from('user_stats')
        .insert(defaultStats)
        .select()
        .single();
        
      return data;
    }
    
    return result.data;
  },

  async getUserLevel(userId: string) {
    const result = await safeSingle(
      supabase.from('user_levels').select('*').eq('user_id', userId),
      'getUserLevel'
    );
    
    return result.data || { level: 1, experience: 0 };
  },

  async getAchievement(id: string) {
    const result = await safeSingle(
      supabase.from('achievements').select('*').eq('id', id),
      'getAchievement'
    );
    
    if (result.isEmpty) {
      throw new Error(`Achievement ${id} not found`);
    }
    
    return result.data;
  }
};

// Service auth corrigé
export const migratedAuthService = {
  async getProfile(userId: string) {
    const result = await safeSingle(
      supabase.from('profiles').select('*').eq('id', userId),
      'getProfile'
    );
    
    if (result.isEmpty) {
      logger.warn(`Profile not found for user ${userId}`, {}, 'AUTH');
      return null;
    }
    
    return result.data;
  },

  async getOrCreateProfile(userId: string, userData: any) {
    let result = await safeSingle(
      supabase.from('profiles').select('*').eq('id', userId),
      'getOrCreateProfile'
    );
    
    if (result.isEmpty) {
      // Créer le profil s'il n'existe pas
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          ...userData
        })
        .select()
        .single();
        
      if (error) {
        throw new Error(`Failed to create profile: ${error.message}`);
      }
      
      return data;
    }
    
    return result.data;
  }
};

// Service journal corrigé
export const migratedJournalService = {
  async getJournalEntry(id: string) {
    const result = await safeSingle(
      supabase.from('journal_entries').select('*').eq('id', id),
      'getJournalEntry'
    );
    
    return result.data;
  },

  async getLatestEntry(userId: string) {
    const result = await safeSingle(
      supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1),
      'getLatestEntry'
    );
    
    return result.data;
  },

  async createEntry(userId: string, content: string) {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: userId,
          content,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Failed to create journal entry', error, 'JOURNAL');
      throw error;
    }
  }
};

// Service coach corrigé  
export const migratedCoachService = {
  async getConversation(id: string) {
    const result = await safeSingle(
      supabase.from('coach_conversations').select('*').eq('id', id),
      'getConversation'
    );
    
    return result.data;
  },

  async createConversation(userId: string, title: string) {
    try {
      const { data, error } = await supabase
        .from('coach_conversations')
        .insert({
          user_id: userId,
          title,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Failed to create conversation', error, 'COACH');
      throw error;
    }
  }
};

// Service music corrigé
export const migratedMusicService = {
  async getSong(id: string) {
    const result = await safeSingle(
      supabase.from('songs').select('*').eq('id', id),
      'getSong'
    );
    
    return result.data;
  },

  async getUserPlaylist(userId: string) {
    const result = await safeSingle(
      supabase
        .from('playlists')
        .select('*, songs(*)')
        .eq('user_id', userId)
        .eq('is_default', true),
      'getUserPlaylist'
    );
    
    if (result.isEmpty) {
      // Créer une playlist par défaut
      const { data } = await supabase
        .from('playlists')
        .insert({
          user_id: userId,
          name: 'Ma Playlist',
          is_default: true
        })
        .select()
        .single();
        
      return data;
    }
    
    return result.data;
  }
};

// Service preferences corrigé
export const migratedPreferencesService = {
  async getUserPreferences(userId: string) {
    const result = await safeSingle(
      supabase.from('profiles').select('preferences').eq('id', userId),
      'getUserPreferences'
    );
    
    return result.data?.preferences || {};
  },

  async updatePreferences(userId: string, preferences: any) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ preferences })
        .eq('id', userId)
        .select('preferences')
        .single();
        
      if (error) throw error;
      return data.preferences;
    } catch (error) {
      logger.error('Failed to update preferences', error, 'PREFERENCES');
      throw error;
    }
  }
};

// Helper pour migration des composants existants
export const createMigrationWrapper = (originalService: any, migratedService: any) => {
  return new Proxy(originalService, {
    get(target, prop) {
      if (migratedService[prop]) {
        logger.debug(`Using migrated version of ${String(prop)}`, {}, 'MIGRATION');
        return migratedService[prop];
      }
      
      if (target[prop]) {
        logger.warn(`Using unmigrated version of ${String(prop)}`, {}, 'MIGRATION');
        return target[prop];
      }
      
      return undefined;
    }
  });
};

// Export des services migrés pour usage immédiat
export const migratedServices = {
  gamification: migratedGamificationService,
  auth: migratedAuthService,
  journal: migratedJournalService,
  coach: migratedCoachService,
  music: migratedMusicService,
  preferences: migratedPreferencesService
};
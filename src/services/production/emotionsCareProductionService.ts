import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Service de production pour EmotionsCare - Toutes les fonctionnalités connectées à Supabase
 */
export class EmotionsCareProductionService {
  
  /**
   * Analyse complète d'émotion avec Supabase
   */
  async analyzeEmotion(payload: {
    text?: string;
    emojis?: string[];
    audio_url?: string;
  }) {
    try {
      const { data, error } = await supabase.functions.invoke('emotion-analysis', {
        body: payload,
      });
      
      if (error) throw error;
      
      // Log l'analyse pour analytics
      await this.logEmotionAnalysis(data);
      
      return data;
    } catch (error) {
      console.error('Erreur analyse émotion:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser l'émotion actuellement",
        variant: "destructive"
      });
      throw error;
    }
  }

  /**
   * Génération musicale basée sur l'émotion
   */
  async generateMusic(emotion: string, preferences?: any) {
    try {
      const { data, error } = await supabase.functions.invoke('emotion-music-generation', {
        body: { emotion, preferences },
      });
      
      if (error) throw error;
      
      // Sauvegarder la génération
      await this.saveMusicGeneration(data);
      
      return data;
    } catch (error) {
      console.error('Erreur génération musicale:', error);
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer la musique actuellement",
        variant: "destructive"
      });
      throw error;
    }
  }

  /**
   * Chat avec le coach IA
   */
  async chatWithCoach(message: string, conversationId?: string) {
    try {
      const { data, error } = await supabase.functions.invoke('coach-ai', {
        body: { 
          action: 'chat',
          message, 
          conversation_id: conversationId 
        },
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Erreur chat coach:', error);
      toast({
        title: "Erreur de chat",
        description: "Impossible de contacter le coach actuellement",
        variant: "destructive"
      });
      throw error;
    }
  }

  /**
   * Analyse de journal avec IA
   */
  async analyzeJournal(content: string, journalId?: string) {
    try {
      const { data, error } = await supabase.functions.invoke('journal-analysis', {
        body: { content, journal_id: journalId },
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Erreur analyse journal:', error);
      throw error;
    }
  }

  /**
   * Sauvegarder entrée de journal
   */
  async saveJournalEntry(entry: {
    title: string;
    content: string;
    mood?: string;
    emotions?: string[];
    is_private?: boolean;
  }) {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          ...entry,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Analyser le contenu automatiquement
      if (entry.content) {
        this.analyzeJournal(entry.content, data.id);
      }
      
      return data;
    } catch (error) {
      console.error('Erreur sauvegarde journal:', error);
      throw error;
    }
  }

  /**
   * Récupérer les entrées de journal
   */
  async getJournalEntries(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur récupération journal:', error);
      throw error;
    }
  }

  /**
   * Analytics émotionnelles
   */
  async getEmotionAnalytics(period = '7d') {
    try {
      const { data, error } = await supabase.functions.invoke('emotion-analytics', {
        body: { period },
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur analytics émotions:', error);
      throw error;
    }
  }

  /**
   * Préférences utilisateur
   */
  async getUserPreferences() {
    try {
      const { data, error } = await supabase
        .from('user_music_preferences')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data || {};
    } catch (error) {
      console.error('Erreur préférences:', error);
      return {};
    }
  }

  async updateUserPreferences(preferences: any) {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      const { data, error } = await supabase
        .from('user_music_preferences')
        .upsert({
          user_id: userId,
          ...preferences
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur update préférences:', error);
      throw error;
    }
  }

  /**
   * Logs privés pour analytics
   */
  private async logEmotionAnalysis(analysisData: any) {
    try {
      await supabase
        .from('emotion_analysis_logs')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          analysis_data: analysisData,
        });
    } catch (error) {
      console.error('Erreur log analyse:', error);
    }
  }

  private async saveMusicGeneration(musicData: any) {
    try {
      await supabase
        .from('music_generation_logs')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          generation_data: musicData,
        });
    } catch (error) {
      console.error('Erreur log musique:', error);
    }
  }

  /**
   * Gestion des favoris
   */
  async toggleFavoriteTrack(trackId: string) {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      // Vérifier si déjà en favori
      const { data: existing } = await supabase
        .from('user_favorite_tracks')
        .select('id')
        .eq('user_id', userId)
        .eq('track_id', trackId)
        .single();

      if (existing) {
        // Supprimer des favoris
        await supabase
          .from('user_favorite_tracks')
          .delete()
          .eq('id', existing.id);
        return false;
      } else {
        // Ajouter aux favoris
        await supabase
          .from('user_favorite_tracks')
          .insert({
            user_id: userId,
            track_id: trackId
          });
        return true;
      }
    } catch (error) {
      console.error('Erreur favori:', error);
      throw error;
    }
  }

  /**
   * Stats utilisateur
   */
  async getUserStats() {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      const [journalCount, emotionCount, musicCount] = await Promise.all([
        supabase.from('journal_entries').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('emotion_analysis_logs').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('music_generation_logs').select('id', { count: 'exact' }).eq('user_id', userId)
      ]);

      return {
        journal_entries: journalCount.count || 0,
        emotion_analyses: emotionCount.count || 0,
        music_generations: musicCount.count || 0,
      };
    } catch (error) {
      console.error('Erreur stats:', error);
      return {
        journal_entries: 0,
        emotion_analyses: 0,
        music_generations: 0,
      };
    }
  }
}

export const emotionsCareProductionService = new EmotionsCareProductionService();
export default emotionsCareProductionService;
/**
 * journalService - Service pour le journal vocal et textuel
 * Intégré avec la table journal_notes de Supabase
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { aiAnalysisService } from '@/services/aiAnalysisService';

export interface JournalEntry {
  id?: string;
  text: string;
  tags: string[];
  summary?: string;
  mode?: 'text' | 'voice';
  created_at?: string;
  // Legacy fields for compatibility
  type?: 'voice' | 'text';
  content?: string;
  tone?: 'positive' | 'neutral' | 'negative';
  ephemeral?: boolean;
  voice_url?: string;
  duration?: number;
  metadata?: Record<string, any>;
  user_id?: string;
}

export interface JournalVoiceEntry {
  audioBlob: Blob;
  tags?: string[];
  lang?: string;
}

export interface JournalTextEntry {
  text: string;
  tags?: string[];
}

/**
 * Service pour gérer les entrées de journal
 */
class JournalService {
  /**
   * Créer une nouvelle entrée texte
   */
  async createTextEntry(entry: JournalTextEntry): Promise<JournalEntry | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        logger.warn('journalService: User not authenticated', undefined, 'JOURNAL');
        return null;
      }

      const { data, error } = await supabase
        .from('journal_notes')
        .insert({
          user_id: user.id,
          text: entry.text,
          tags: entry.tags || [],
          mode: 'text',
        })
        .select()
        .single();

      if (error) {
        logger.error('journalService: Error creating text entry', error, 'JOURNAL');
        return null;
      }

      return {
        id: data.id,
        text: data.text,
        tags: data.tags || [],
        summary: data.summary || undefined,
        mode: data.mode || 'text',
        created_at: data.created_at,
      };
    } catch (error) {
      logger.error('journalService: Unexpected error creating text entry', error as Error, 'JOURNAL');
      return null;
    }
  }

  /**
   * Créer une nouvelle entrée vocale (après transcription)
   */
  async createVoiceEntry(transcription: string, tags?: string[]): Promise<JournalEntry | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        logger.warn('journalService: User not authenticated', undefined, 'JOURNAL');
        return null;
      }

      const { data, error } = await supabase
        .from('journal_notes')
        .insert({
          user_id: user.id,
          text: transcription,
          tags: tags || [],
          mode: 'voice',
        })
        .select()
        .single();

      if (error) {
        logger.error('journalService: Error creating voice entry', error, 'JOURNAL');
        return null;
      }

      return {
        id: data.id,
        text: data.text,
        tags: data.tags || [],
        summary: data.summary || undefined,
        mode: data.mode || 'voice',
        created_at: data.created_at,
      };
    } catch (error) {
      logger.error('journalService: Unexpected error creating voice entry', error as Error, 'JOURNAL');
      return null;
    }
  }

  /**
   * Récupérer toutes les notes de l'utilisateur
   */
  async getAllNotes(): Promise<JournalEntry[]> {
    try {
      const { data, error } = await supabase
        .from('journal_notes')
        .select('*')
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('journalService: Error fetching all notes', error, 'JOURNAL');
        return [];
      }

      return (data || []).map(note => ({
        id: note.id,
        text: note.text,
        tags: note.tags || [],
        summary: note.summary || undefined,
        mode: note.mode || undefined,
        created_at: note.created_at,
      }));
    } catch (error) {
      logger.error('journalService: Unexpected error fetching all notes', error as Error, 'JOURNAL');
      return [];
    }
  }

  /**
   * Récupérer les notes par tags
   */
  async getNotesByTags(tags: string[]): Promise<JournalEntry[]> {
    try {
      const { data, error } = await supabase
        .from('journal_notes')
        .select('*')
        .eq('is_archived', false)
        .contains('tags', tags)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('journalService: Error fetching notes by tags', error, 'JOURNAL');
        return [];
      }

      return (data || []).map(note => ({
        id: note.id,
        text: note.text,
        tags: note.tags || [],
        summary: note.summary || undefined,
        mode: note.mode || undefined,
        created_at: note.created_at,
      }));
    } catch (error) {
      logger.error('journalService: Unexpected error fetching notes by tags', error as Error, 'JOURNAL');
      return [];
    }
  }

  /**
   * Rechercher des notes par texte
   */
  async searchNotes(query: string): Promise<JournalEntry[]> {
    try {
      const { data, error } = await supabase
        .from('journal_notes')
        .select('*')
        .eq('is_archived', false)
        .ilike('text', `%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('journalService: Error searching notes', error, 'JOURNAL');
        return [];
      }

      return (data || []).map(note => ({
        id: note.id,
        text: note.text,
        tags: note.tags || [],
        summary: note.summary || undefined,
        mode: note.mode || undefined,
        created_at: note.created_at,
      }));
    } catch (error) {
      logger.error('journalService: Unexpected error searching notes', error as Error, 'JOURNAL');
      return [];
    }
  }

  /**
   * Mettre à jour une note
   */
  async updateNote(id: string, updates: Partial<JournalEntry>): Promise<JournalEntry | null> {
    try {
      const { data, error } = await supabase
        .from('journal_notes')
        .update({
          text: updates.text,
          tags: updates.tags,
          summary: updates.summary,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('journalService: Error updating note', error, 'JOURNAL');
        return null;
      }

      return {
        id: data.id,
        text: data.text,
        tags: data.tags || [],
        summary: data.summary || undefined,
        mode: data.mode || undefined,
        created_at: data.created_at,
      };
    } catch (error) {
      logger.error('journalService: Unexpected error updating note', error as Error, 'JOURNAL');
      return null;
    }
  }

  /**
   * Supprimer une note
   */
  async deleteNote(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('journal_notes')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('journalService: Error deleting note', error, 'JOURNAL');
        return false;
      }

      return true;
    } catch (error) {
      logger.error('journalService: Unexpected error deleting note', error as Error, 'JOURNAL');
      return false;
    }
  }

  /**
   * Archiver une note
   */
  async archiveNote(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('journal_notes')
        .update({ is_archived: true })
        .eq('id', id);

      if (error) {
        logger.error('journalService: Error archiving note', error, 'JOURNAL');
        return false;
      }

      return true;
    } catch (error) {
      logger.error('journalService: Unexpected error archiving note', error as Error, 'JOURNAL');
      return false;
    }
  }

  /**
   * Récupérer les notes archivées
   */
  async getArchivedNotes(): Promise<JournalEntry[]> {
    try {
      const { data, error } = await supabase
        .from('journal_notes')
        .select('*')
        .eq('is_archived', true)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('journalService: Error fetching archived notes', error, 'JOURNAL');
        return [];
      }

      return (data || []).map(note => ({
        id: note.id,
        text: note.text,
        tags: note.tags || [],
        summary: note.summary || undefined,
        mode: note.mode || undefined,
        created_at: note.created_at,
      }));
    } catch (error) {
      logger.error('journalService: Unexpected error fetching archived notes', error as Error, 'JOURNAL');
      return [];
    }
  }

  // ============================================
  // LEGACY COMPATIBILITY METHODS
  // For backward compatibility with other modules
  // ============================================

  /**
   * @deprecated Use createTextEntry or createVoiceEntry instead
   */
  async saveEntry(entry: Partial<JournalEntry>): Promise<JournalEntry | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        logger.warn('journalService: User not authenticated', undefined, 'JOURNAL');
        return null;
      }

      const { data, error } = await supabase
        .from('journal_notes')
        .insert({
          user_id: user.id,
          text: entry.text || entry.content || '',
          tags: entry.tags || [],
          summary: entry.summary,
          mode: entry.mode || entry.type,
        })
        .select()
        .single();

      if (error) {
        logger.error('journalService: Error saving entry', error, 'JOURNAL');
        return null;
      }

      return {
        id: data.id,
        text: data.text,
        content: data.text, // Legacy field
        tags: data.tags || [],
        summary: data.summary || undefined,
        mode: data.mode || undefined,
        type: data.mode, // Legacy field
        created_at: data.created_at,
        tone: 'neutral', // Legacy field - default value
        ephemeral: false, // Legacy field - not supported anymore
      };
    } catch (error) {
      logger.error('journalService: Unexpected error saving entry', error as Error, 'JOURNAL');
      return null;
    }
  }

  /**
   * @deprecated Use getAllNotes instead
   */
  async getEntries(): Promise<JournalEntry[]> {
    const notes = await this.getAllNotes();
    return notes.map(note => ({
      ...note,
      content: note.text, // Legacy field
      type: note.mode, // Legacy field
      tone: 'neutral', // Legacy field - default value
      ephemeral: false, // Legacy field - not supported anymore
    }));
  }

  /**
   * @deprecated Voice processing should be handled separately
   * Transcrit et analyse un audio avec AI
   */
  async processVoiceEntry(audioBlob: Blob): Promise<{ content: string; summary: string; tone: 'positive' | 'neutral' | 'negative' }> {
    try {
      // Transcription avec Whisper
      const transcription = await aiAnalysisService.transcribeAudio(audioBlob);

      if (!transcription.text || transcription.text.trim() === '') {
        logger.warn('Empty transcription result', undefined, 'JOURNAL');
        return {
          content: "[Enregistrement vocal - transcription vide]",
          summary: "Note vocale",
          tone: 'neutral'
        };
      }

      // Analyse du sentiment
      const sentiment = await aiAnalysisService.analyzeSentiment(transcription.text);

      // Génération d'un résumé
      const summary = await aiAnalysisService.generateSummary(transcription.text, 100);

      return {
        content: transcription.text,
        summary: summary || "Note vocale",
        tone: sentiment.tone
      };
    } catch (error) {
      logger.error('Error processing voice entry', error as Error, 'JOURNAL');
      return {
        content: "[Erreur lors du traitement de l'audio]",
        summary: "Note vocale",
        tone: 'neutral'
      };
    }
  }

  /**
   * @deprecated Text processing should be handled separately
   * Analyse un texte avec AI pour déterminer le sentiment
   */
  async processTextEntry(text: string): Promise<{ content: string; summary: string; tone: 'positive' | 'neutral' | 'negative' }> {
    try {
      if (!text || text.trim() === '') {
        logger.warn('Empty text entry', undefined, 'JOURNAL');
        return {
          content: text,
          summary: '',
          tone: 'neutral'
        };
      }

      // Analyse du sentiment avec AI
      const sentiment = await aiAnalysisService.analyzeSentiment(text);

      // Génération d'un résumé intelligent
      const summary = await aiAnalysisService.generateSummary(text, 100);

      return {
        content: text,
        summary: summary || (text.length > 50 ? text.substring(0, 47) + '...' : text),
        tone: sentiment.tone
      };
    } catch (error) {
      logger.error('Error processing text entry', error as Error, 'JOURNAL');
      // Fallback simple en cas d'erreur
      const summary = text.length > 50 ? text.substring(0, 47) + '...' : text;
      return {
        content: text,
        summary,
        tone: 'neutral'
      };
    }
  }

  /**
   * @deprecated Ephemeral notes are no longer supported, use archiveNote instead
   */
  async burnEntry(entryId: string): Promise<void> {
    // Map to archive functionality
    await this.archiveNote(entryId);
  }

  /**
   * @deprecated Ephemeral cleanup is no longer needed
   */
  async cleanupEphemeralEntries(): Promise<void> {
    // No-op - ephemeral notes are no longer supported
    // Silently skip - no logging needed for deprecated no-op
  }
}

export const journalService = new JournalService();

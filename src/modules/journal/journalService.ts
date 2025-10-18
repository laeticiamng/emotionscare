/**
 * journalService - Service pour le journal vocal et textuel
 * Intégré avec la table journal_notes de Supabase
 */

import { supabase } from '@/integrations/supabase/client';

export interface JournalEntry {
  id?: string;
  text: string;
  tags: string[];
  summary?: string;
  mode?: 'text' | 'voice';
  created_at?: string;
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
  async createTextEntry(entry: JournalTextEntry): Promise<JournalEntry> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

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

    if (error) throw error;

    return {
      id: data.id,
      text: data.text,
      tags: data.tags || [],
      summary: data.summary || undefined,
      mode: data.mode || 'text',
      created_at: data.created_at,
    };
  }

  /**
   * Créer une nouvelle entrée vocale (après transcription)
   */
  async createVoiceEntry(transcription: string, tags?: string[]): Promise<JournalEntry> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

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

    if (error) throw error;

    return {
      id: data.id,
      text: data.text,
      tags: data.tags || [],
      summary: data.summary || undefined,
      mode: data.mode || 'voice',
      created_at: data.created_at,
    };
  }

  /**
   * Récupérer toutes les notes de l'utilisateur
   */
  async getAllNotes(): Promise<JournalEntry[]> {
    const { data, error } = await supabase
      .from('journal_notes')
      .select('*')
      .eq('is_archived', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(note => ({
      id: note.id,
      text: note.text,
      tags: note.tags || [],
      summary: note.summary || undefined,
      mode: note.mode || undefined,
      created_at: note.created_at,
    }));
  }

  /**
   * Récupérer les notes par tags
   */
  async getNotesByTags(tags: string[]): Promise<JournalEntry[]> {
    const { data, error } = await supabase
      .from('journal_notes')
      .select('*')
      .eq('is_archived', false)
      .contains('tags', tags)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(note => ({
      id: note.id,
      text: note.text,
      tags: note.tags || [],
      summary: note.summary || undefined,
      mode: note.mode || undefined,
      created_at: note.created_at,
    }));
  }

  /**
   * Rechercher des notes par texte
   */
  async searchNotes(query: string): Promise<JournalEntry[]> {
    const { data, error } = await supabase
      .from('journal_notes')
      .select('*')
      .eq('is_archived', false)
      .ilike('text', `%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(note => ({
      id: note.id,
      text: note.text,
      tags: note.tags || [],
      summary: note.summary || undefined,
      mode: note.mode || undefined,
      created_at: note.created_at,
    }));
  }

  /**
   * Mettre à jour une note
   */
  async updateNote(id: string, updates: Partial<JournalEntry>): Promise<JournalEntry> {
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

    if (error) throw error;

    return {
      id: data.id,
      text: data.text,
      tags: data.tags || [],
      summary: data.summary || undefined,
      mode: data.mode || undefined,
      created_at: data.created_at,
    };
  }

  /**
   * Supprimer une note
   */
  async deleteNote(id: string): Promise<void> {
    const { error } = await supabase
      .from('journal_notes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Archiver une note
   */
  async archiveNote(id: string): Promise<void> {
    const { error } = await supabase
      .from('journal_notes')
      .update({ is_archived: true })
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Récupérer les notes archivées
   */
  async getArchivedNotes(): Promise<JournalEntry[]> {
    const { data, error } = await supabase
      .from('journal_notes')
      .select('*')
      .eq('is_archived', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(note => ({
      id: note.id,
      text: note.text,
      tags: note.tags || [],
      summary: note.summary || undefined,
      mode: note.mode || undefined,
      created_at: note.created_at,
    }));
  }
}

export const journalService = new JournalService();
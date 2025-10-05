/**
 * journalService - Service pour le journal vocal et textuel
 */

import { supabase } from '@/integrations/supabase/client';

export interface JournalEntry {
  id: string;
  type: 'voice' | 'text';
  content: string;
  summary?: string;
  tone?: 'positive' | 'neutral' | 'negative';
  ephemeral: boolean;
  created_at: Date;
  voice_url?: string;
  duration?: number;
  metadata?: Record<string, any>;
  tags?: string[];
  user_id?: string;
}

export interface JournalVoiceEntry {
  content: string;
  summary: string;
  tone: 'positive' | 'neutral' | 'negative';
}

export interface JournalTextEntry {
  content: string;
  summary: string;
  tone: 'positive' | 'neutral' | 'negative';
}

class JournalService {
  /**
   * Traiter une entrée vocale avec Whisper + GPT
   */
  async processVoiceEntry(audioBlob: Blob): Promise<JournalVoiceEntry> {
    try {
      // Convertir en base64 pour l'envoi
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      const response = await supabase.functions.invoke('journal-voice', {
        body: {
          audio_data: base64Audio,
          format: 'webm' // ou le format du blob
        }
      });

      if (response.error) {
        throw new Error(`Erreur traitement vocal: ${response.error.message}`);
      }

      return response.data as JournalVoiceEntry;
    } catch (error) {
      console.error('Erreur service journal vocal:', error);
      
      // Fallback local basique
      return {
        content: "Entrée vocale non transcrite (service indisponible)",
        summary: "Réflexion personnelle enregistrée",
        tone: 'neutral'
      };
    }
  }

  /**
   * Traiter une entrée textuelle
   */
  async processTextEntry(text: string): Promise<JournalTextEntry> {
    try {
      const response = await supabase.functions.invoke('journal-text', {
        body: {
          content: text
        }
      });

      if (response.error) {
        throw new Error(`Erreur traitement texte: ${response.error.message}`);
      }

      return response.data as JournalTextEntry;
    } catch (error) {
      console.error('Erreur service journal texte:', error);
      
      // Fallback local
      return {
        content: text,
        summary: this.generateLocalSummary(text),
        tone: this.analyzeLocalTone(text)
      };
    }
  }

  /**
   * Sauvegarder une entrée de journal
   */
  async saveEntry(entry: Omit<JournalEntry, 'id' | 'created_at'>): Promise<JournalEntry> {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;
    
    if (!userId) {
      throw new Error('Utilisateur non authentifié');
    }

    // Sauvegarder dans Supabase selon le type
    if (entry.type === 'voice') {
      const { data, error } = await supabase
        .from('journal_voice')
        .insert({
          user_id: userId,
          content: entry.content,
          summary: entry.summary,
          tone: entry.tone,
          ephemeral: entry.ephemeral || false,
          tags: entry.tags
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        created_at: new Date(data.created_at),
        type: 'voice',
        content: data.content,
        summary: data.summary,
        tone: data.tone as 'positive' | 'neutral' | 'negative',
        ephemeral: data.ephemeral,
        tags: data.tags
      };
    } else {
      const { data, error } = await supabase
        .from('journal_text')
        .insert({
          user_id: userId,
          content: entry.content,
          summary: entry.summary,
          tone: entry.tone,
          ephemeral: entry.ephemeral || false,
          tags: entry.tags
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        created_at: new Date(data.created_at),
        type: 'text',
        content: data.content,
        summary: data.summary,
        tone: data.tone as 'positive' | 'neutral' | 'negative',
        ephemeral: data.ephemeral,
        tags: data.tags
      };
    }
  }

  /**
   * Obtenir les entrées de journal
   */
  async getEntries(): Promise<JournalEntry[]> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return [];

    const userId = user.data.user.id;

    // Récupérer les entrées vocales
    const { data: voiceEntries } = await supabase
      .from('journal_voice')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Récupérer les entrées textuelles
    const { data: textEntries } = await supabase
      .from('journal_text')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    const allEntries: JournalEntry[] = [
      ...(voiceEntries || []).map(e => ({
        id: e.id,
        created_at: new Date(e.created_at),
        type: 'voice' as const,
        content: e.content,
        summary: e.summary,
        tone: e.tone as 'positive' | 'neutral' | 'negative',
        ephemeral: e.ephemeral,
        tags: e.tags
      })),
      ...(textEntries || []).map(e => ({
        id: e.id,
        created_at: new Date(e.created_at),
        type: 'text' as const,
        content: e.content,
        summary: e.summary,
        tone: e.tone as 'positive' | 'neutral' | 'negative',
        ephemeral: e.ephemeral,
        tags: e.tags
      }))
    ];

    // Trier par date
    return allEntries.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  /**
   * Marquer une entrée comme "à brûler" (24h)
   */
  async burnEntry(entryId: string): Promise<void> {
    // Essayer dans journal_voice
    const { error: voiceError } = await supabase
      .from('journal_voice')
      .update({ ephemeral: true })
      .eq('id', entryId);

    if (voiceError) {
      // Essayer dans journal_text
      const { error: textError } = await supabase
        .from('journal_text')
        .update({ ephemeral: true })
        .eq('id', entryId);

      if (textError) throw textError;
    }
  }

  /**
   * Supprimer les entrées éphémères expirées
   */
  async cleanupEphemeralEntries(): Promise<void> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Supprimer les entrées vocales éphémères expirées
    await supabase
      .from('journal_voice')
      .delete()
      .eq('ephemeral', true)
      .lt('created_at', oneDayAgo);

    // Supprimer les entrées textuelles éphémères expirées
    await supabase
      .from('journal_text')
      .delete()
      .eq('ephemeral', true)
      .lt('created_at', oneDayAgo);
  }

  private generateLocalSummary(text: string): string {
    if (text.length < 50) return text;
    
    // Prendre les premiers mots jusqu'à une limite raisonnable
    const words = text.split(' ');
    const summary = words.slice(0, 20).join(' ');
    return summary + (words.length > 20 ? '...' : '');
  }

  private analyzeLocalTone(text: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['bien', 'content', 'heureux', 'super', 'génial', 'merci', 'joie'];
    const negativeWords = ['mal', 'triste', 'difficile', 'problème', 'stress', 'fatigue'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }
}

export const journalService = new JournalService();
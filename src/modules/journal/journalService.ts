/**
 * journalService - Service pour le journal vocal et textuel
 */

import { supabase } from '@/integrations/supabase/client';

export interface JournalEntry {
  id: string;
  content: string;
  summary?: string;
  tone?: 'positive' | 'neutral' | 'negative';
  ephemeral: boolean;
  created_at: Date;
  voice_url?: string;
  duration?: number; // en secondes pour les entrées vocales
  metadata?: Record<string, any>;
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
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      created_at: new Date(),
      ...entry
    };

    // Stocker localement (simulation, à remplacer par Supabase)
    const existingEntries = this.getLocalEntries();
    existingEntries.unshift(newEntry);
    localStorage.setItem('journal_entries', JSON.stringify(existingEntries));

    // Analytics
    if (window.gtag) {
      window.gtag('event', 'journal_entry_saved', {
        event_category: 'journal',
        event_label: entry.ephemeral ? 'ephemeral' : 'permanent',
        value: entry.content.length
      });
    }

    return newEntry;
  }

  /**
   * Obtenir les entrées de journal
   */
  getEntries(): JournalEntry[] {
    return this.getLocalEntries();
  }

  /**
   * Marquer une entrée comme "à brûler" (24h)
   */
  async burnEntry(entryId: string): Promise<void> {
    const entries = this.getLocalEntries();
    const entryIndex = entries.findIndex(e => e.id === entryId);
    
    if (entryIndex >= 0) {
      entries[entryIndex].ephemeral = true;
      localStorage.setItem('journal_entries', JSON.stringify(entries));

      // Analytics
      if (window.gtag) {
        window.gtag('event', 'journal_entry_burned', {
          event_category: 'journal',
          event_label: 'burn_toggle'
        });
      }
    }
  }

  /**
   * Supprimer les entrées éphémères expirées
   */
  cleanupEphemeralEntries(): void {
    const entries = this.getLocalEntries();
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const filteredEntries = entries.filter(entry => {
      if (entry.ephemeral && entry.created_at < oneDayAgo) {
        return false; // Supprimer
      }
      return true; // Garder
    });

    if (filteredEntries.length !== entries.length) {
      localStorage.setItem('journal_entries', JSON.stringify(filteredEntries));
    }
  }

  /**
   * Méthodes privées
   */
  private getLocalEntries(): JournalEntry[] {
    try {
      const stored = localStorage.getItem('journal_entries');
      if (!stored) return [];
      
      const entries = JSON.parse(stored);
      return entries.map((entry: any) => ({
        ...entry,
        created_at: new Date(entry.created_at)
      }));
    } catch {
      return [];
    }
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
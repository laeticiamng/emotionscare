/**
 * journalService - Service pour le journal vocal et textuel
 */

import { supabase } from '@/integrations/supabase/client';
import {
  DataValidator,
  sanitizeInput as sanitizePlain,
  secureTextSchema,
} from '@/lib/validation/dataValidator';
import {
  createJournalTextEntry,
  createJournalVoiceEntry,
  fetchJournalFeed,
  type JournalFeedEntry,
} from '@/services/journalFeed.service';

export interface JournalEntry {
  id: string;
  content: string;
  summary?: string;
  tone?: 'positive' | 'neutral' | 'negative';
  ephemeral: boolean;
  created_at: Date;
  voice_url?: string;
  duration?: number;
  metadata?: Record<string, any>;
  tags?: string[];
  mood?: 'positive' | 'neutral' | 'negative';
  type?: 'text' | 'voice';
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

type SaveJournalEntryInput = Omit<JournalEntry, 'id' | 'created_at' | 'type' | 'tags' | 'mood'> & {
  tags?: string[];
  voice_blob?: Blob;
};

const buildFallbackVoiceResult = (): JournalVoiceEntry => ({
  content: 'Entrée vocale non transcrite (service indisponible)',
  summary: 'Réflexion personnelle enregistrée',
  tone: 'neutral',
});

const formatDate = (value: string | Date): Date => {
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const toPlainObject = (value: Record<string, unknown> | undefined) => {
  if (!value) return undefined;
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return undefined;
  }
};

class JournalService {
  private entries: JournalEntry[] = [];
  private hydrated = false;

  private sanitizeContent(raw: string): string {
    return sanitizePlain(DataValidator.validateAndSanitize(secureTextSchema, raw));
  }

  private sanitizeSummary(raw?: string): string | undefined {
    if (!raw) return undefined;
    return DataValidator.sanitizeHtml(raw);
  }

  private extractTags(content: string, extras: string[] = []): string[] {
    const matches = Array.from(content.match(/#([\p{L}\p{N}_-]{2,24})/gu) ?? []).map((tag) => tag.slice(1));
    const merged = [...matches, ...extras]
      .map((tag) => sanitizePlain(tag).toLowerCase().replace(/[^\p{L}\p{N}_-]+/gu, ''))
      .filter(Boolean);
    return Array.from(new Set(merged));
  }

  private async hydrateFromRemote() {
    if (this.hydrated) return;
    try {
      const feed = await fetchJournalFeed();
      this.entries = feed.map((entry) => this.mapFeedEntryToJournalEntry(entry));
      this.hydrated = true;
    } catch {
      // Pas critique : on hydrate à la volée lors du premier succès
    }
  }

  private mapFeedEntryToJournalEntry(entry: JournalFeedEntry): JournalEntry {
    return {
      id: entry.id,
      content: entry.text,
      summary: entry.summary,
      tone: entry.mood,
      mood: entry.mood,
      tags: entry.tags,
      ephemeral: false,
      created_at: formatDate(entry.timestamp),
      type: entry.type,
    };
  }

  async processVoiceEntry(audioBlob: Blob): Promise<JournalVoiceEntry> {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i += 1) {
        binary += String.fromCharCode(bytes[i]);
      }
      const bufferGlobal = (globalThis as Record<string, any>).Buffer;
      const base64Audio =
        typeof globalThis.btoa === 'function'
          ? globalThis.btoa(binary)
          : bufferGlobal && typeof bufferGlobal.from === 'function'
            ? bufferGlobal.from(bytes).toString('base64')
            : binary;

      const response = await supabase.functions.invoke('journal-voice', {
        body: {
          audio_data: base64Audio,
          format: audioBlob.type || 'webm',
        },
      });

      if (response.error || !response.data) {
        throw new Error(response.error?.message ?? 'Traitement vocal indisponible');
      }

      const sanitizedContent = this.sanitizeContent(response.data.content ?? '');
      const summary = this.sanitizeSummary(response.data.summary) ?? sanitizedContent.slice(0, 240);
      const tone = response.data.tone ?? 'neutral';

      return {
        content: sanitizedContent,
        summary,
        tone,
      };
    } catch (error) {
      console.error('Erreur service journal vocal:', error);
      return buildFallbackVoiceResult();
    }
  }

  async processTextEntry(text: string): Promise<JournalTextEntry> {
    try {
      const response = await supabase.functions.invoke('journal-text', {
        body: {
          content: text,
        },
      });

      if (response.error || !response.data) {
        throw new Error(response.error?.message ?? 'Traitement texte indisponible');
      }

      const sanitizedContent = this.sanitizeContent(response.data.content ?? text);
      const summary = this.sanitizeSummary(response.data.summary) ?? sanitizedContent.slice(0, 200);
      const tone = response.data.tone ?? 'neutral';

      return {
        content: sanitizedContent,
        summary,
        tone,
      };
    } catch (error) {
      console.error('Erreur service journal texte:', error);
      const fallbackContent = this.sanitizeContent(text);
      return {
        content: fallbackContent,
        summary: fallbackContent.slice(0, 200),
        tone: 'neutral',
      };
    }
  }

  async saveEntry(input: SaveJournalEntryInput): Promise<JournalEntry> {
    const sanitizedContent = this.sanitizeContent(input.content);
    const sanitizedSummary = this.sanitizeSummary(input.summary);
    const metadata = toPlainObject(input.metadata);
    const explicitTags = Array.isArray(input.tags) ? input.tags : Array.isArray((metadata as any)?.tags) ? (metadata as any).tags : [];
    const tags = this.extractTags(sanitizedContent, explicitTags);
    const tone = input.tone ?? 'neutral';
    const duration = typeof input.duration === 'number' && Number.isFinite(input.duration)
      ? Math.max(0, Math.round(input.duration))
      : undefined;

    const creation = input.voice_blob
      ? await createJournalVoiceEntry({
        audio: input.voice_blob,
        transcript: sanitizedContent,
        summary: sanitizedSummary,
        tags,
        tone,
        durationSec: duration,
        metadata,
      })
      : await createJournalTextEntry({ content: sanitizedContent, tags });

    const entry: JournalEntry = {
      id: creation.id,
      content: sanitizedContent,
      summary: sanitizedSummary,
      tone,
      mood: tone,
      tags,
      ephemeral: Boolean(input.ephemeral),
      created_at: formatDate(creation.ts),
      voice_url: input.voice_url,
      duration,
      metadata,
      type: input.voice_blob ? 'voice' : 'text',
    };

    this.entries = [entry, ...this.entries.filter((existing) => existing.id !== entry.id)];
    this.hydrated = true;
    return entry;
  }

  getEntries(): JournalEntry[] {
    void this.ensureHydrated();
    return [...this.entries];
  }

  async burnEntry(entryId: string): Promise<void> {
    this.entries = this.entries.map((entry) =>
      entry.id === entryId
        ? { ...entry, ephemeral: true }
        : entry
    );
  }

  cleanupEphemeralEntries(): void {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    this.entries = this.entries.filter((entry) => {
      if (!entry.ephemeral) return true;
      return entry.created_at.getTime() >= cutoff;
    });
  }

  async ensureHydrated() {
    await this.hydrateFromRemote();
  }
}

export const journalService = new JournalService();

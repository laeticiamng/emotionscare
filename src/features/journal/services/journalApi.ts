import { z } from 'zod';

/**
 * Journal Entry Schemas - Local definitions (mirrored from @emotionscare/contracts)
 */
const journalEntrySchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  text: z.string().optional(),
  mood: z.string().min(1),
  mood_score: z.number().min(1).max(10).optional(),
  emotion: z.string().optional(),
  date: z.union([z.date(), z.string()]),
  tags: z.array(z.string()).max(10).optional(),
  ai_feedback: z.string().max(5000).optional(),
  user_id: z.string().uuid().optional(),
});

const createJournalEntrySchema = journalEntrySchema
  .omit({ id: true, ai_feedback: true, user_id: true })
  .extend({
    title: z.string().min(1).max(200).default('Untitled'),
    content: z.string().min(1).max(10000),
    mood: z.string().min(1),
    mood_score: z.number().min(1).max(10).optional(),
    tags: z.array(z.string().min(1).max(50)).max(10).default([]),
  });

const listJournalEntriesSchema = z.object({
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
  mood: z.string().optional(),
  tags: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.enum(['date', 'mood_score', 'created_at']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

const journalStatsSchema = z.object({
  totalEntries: z.number().int().nonnegative(),
  averageMoodScore: z.number().min(1).max(10).optional(),
  mostCommonMood: z.string().optional(),
  mostUsedTags: z.array(z.string()).max(10),
  entriesThisWeek: z.number().int().nonnegative(),
  entriesThisMonth: z.number().int().nonnegative(),
});

type JournalEntry = z.infer<typeof journalEntrySchema>;
type CreateJournalEntryInput = z.infer<typeof createJournalEntrySchema>;
type UpdateJournalEntryInput = Partial<CreateJournalEntryInput>;
type ListJournalEntriesInput = z.infer<typeof listJournalEntriesSchema>;
type JournalStats = z.infer<typeof journalStatsSchema>;

/**
 * Journal API Client
 *
 * Handles all HTTP requests to the journal API endpoints.
 * Uses schemas from @emotionscare/contracts for validation.
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

class JournalApiClient {
  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async list(filters?: ListJournalEntriesInput): Promise<JournalEntry[]> {
    // Validate input with Zod
    const validated = filters ? listJournalEntriesSchema.parse(filters) : {};

    const params = new URLSearchParams(
      Object.entries(validated)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    );

    const response = await this.request<{ data: JournalEntry[] }>(
      `/v1/journal?${params}`
    );
    return response.data;
  }

  async get(id: string): Promise<JournalEntry> {
    const response = await this.request<{ data: JournalEntry }>(`/v1/journal/${id}`);
    return response.data;
  }

  async create(input: CreateJournalEntryInput): Promise<JournalEntry> {
    // Validate input with Zod
    const validated = createJournalEntrySchema.parse(input);

    const response = await this.request<{ data: JournalEntry }>(`/v1/journal`, {
      method: 'POST',
      body: JSON.stringify(validated),
    });
    return response.data;
  }

  async update(id: string, input: UpdateJournalEntryInput): Promise<JournalEntry> {
    const response = await this.request<{ data: JournalEntry }>(`/v1/journal/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await this.request<void>(`/v1/journal/${id}`, { method: 'DELETE' });
  }

  async stats(): Promise<JournalStats> {
    const response = await this.request<{ data: JournalStats }>(`/v1/journal/stats`);
    return response.data;
  }
}

export const journalApi = new JournalApiClient();

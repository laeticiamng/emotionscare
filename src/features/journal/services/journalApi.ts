import type {
  JournalEntry,
  CreateJournalEntryInput,
  UpdateJournalEntryInput,
  ListJournalEntriesInput,
  JournalStats,
} from '@emotionscare/contracts';
import { createJournalEntrySchema, listJournalEntriesSchema } from '@emotionscare/contracts';

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

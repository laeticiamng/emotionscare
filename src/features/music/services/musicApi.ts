import type {
  MusicGenerationSession,
  CreateMusicGenerationInput,
  ListMusicSessionsInput,
} from '@emotionscare/contracts';
import {
  createMusicGenerationSchema,
  listMusicSessionsSchema,
} from '@emotionscare/contracts';

/**
 * Music API Client
 *
 * Handles all HTTP requests to the music generation API endpoints.
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

class MusicApiClient {
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

  async listSessions(filters?: ListMusicSessionsInput): Promise<MusicGenerationSession[]> {
    const validated = filters ? listMusicSessionsSchema.parse(filters) : {};

    const params = new URLSearchParams(
      Object.entries(validated)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    );

    const response = await this.request<{ data: MusicGenerationSession[] }>(
      `/v1/music?${params}`
    );
    return response.data;
  }

  async getSession(id: string): Promise<MusicGenerationSession> {
    const response = await this.request<{ data: MusicGenerationSession }>(
      `/v1/music/${id}`
    );
    return response.data;
  }

  async createGeneration(input: CreateMusicGenerationInput): Promise<MusicGenerationSession> {
    // Validate input with Zod
    const validated = createMusicGenerationSchema.parse(input);

    const response = await this.request<{ data: MusicGenerationSession }>(
      `/v1/music`,
      {
        method: 'POST',
        body: JSON.stringify(validated),
      }
    );
    return response.data;
  }

  async cancelGeneration(id: string): Promise<void> {
    await this.request<void>(`/v1/music/${id}/cancel`, { method: 'POST' });
  }

  async deleteSession(id: string): Promise<void> {
    await this.request<void>(`/v1/music/${id}`, { method: 'DELETE' });
  }
}

export const musicApi = new MusicApiClient();

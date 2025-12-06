// @ts-nocheck
import { z, type ZodType } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { API_URL } from '@/lib/env';
import { fetchWithRetry, type FetchWithRetryOptions } from '@/lib/network/fetchWithRetry';
import { logger } from '@/lib/logger';

const resolveApiBaseUrl = () => {
  if (API_URL) {
    return API_URL.replace(/\/$/, '');
  }

  return '';
};

const API_BASE_URL = resolveApiBaseUrl();

const ensureApiConfigured = () => {
  if (!API_BASE_URL) {
    throw new Error('API_URL non configurée. Définissez VITE_API_URL dans votre environnement.');
  }
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ServiceCallConfig<TPayload> extends Omit<FetchWithRetryOptions, 'json' | 'payloadSchema' | 'method'> {
  data?: TPayload;
  schema?: ZodType<TPayload>;
  method?: HttpMethod;
}

const JournalTextPayload = z.object({
  userId: z.string().min(1),
  text: z.string().min(1).max(5_000),
});

const PrivacyPrefsPayload = z.record(z.string(), z.unknown());

const ExportUserPayload = z.object({
  userId: z.string().min(1),
});

export class ApiService {
  /**
   * Test de connectivité avec les services backend
   */
  static async testConnection(): Promise<boolean> {
    ensureApiConfigured();

    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/health`, {
        timeoutMs: 5_000,
        retries: 1,
      });
      return response.ok;
    } catch (error) {
      logger.error('Backend connection failed', error, 'api.service');
      return false;
    }
  }

  /**
   * Appel générique aux microservices
   */
  static async callService<TPayload, TResult = unknown>(
    service: string,
    endpoint: string,
    config: ServiceCallConfig<TPayload> = {},
  ): Promise<TResult> {
    ensureApiConfigured();

    const { data, schema, method, headers: headerOverrides, timeoutMs = 10_000, retries = 2, retryDelayMs = 750, ...options } = config;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const headers: Record<string, string> = {
      ...(headerOverrides instanceof Headers
        ? Object.fromEntries(headerOverrides.entries())
        : (headerOverrides as Record<string, string> | undefined)),
    };

    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }

    const response = await fetchWithRetry(`${API_BASE_URL}/${service}${endpoint}`, {
      ...options,
      method: method ?? (data ? 'POST' : 'GET'),
      headers,
      json: data,
      payloadSchema: schema,
      timeoutMs,
      retries,
      retryDelayMs,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      logger.error(
        'Service call failed',
        { service, endpoint, status: response.status, body: errorBody.slice(0, 256) },
        'api.service',
      );
      throw new Error(`Service ${service} error: ${response.status}`);
    }

    if (response.status === 204) {
      return undefined as TResult;
    }

    const text = await response.text().catch(() => '');
    if (!text) {
      return undefined as TResult;
    }

    try {
      return JSON.parse(text) as TResult;
    } catch (error) {
      logger.error(
        'Service call returned invalid JSON',
        { service, endpoint, body: text.slice(0, 256), error: error instanceof Error ? error.message : error },
        'api.service',
      );
      throw new Error('Invalid JSON payload returned by API');
    }
  }

  /**
   * Services spécifiques
   */
  static async getJournalFeed(userId: string) {
    return this.callService('journal', `/feed/${userId}`);
  }

  static async postJournalText(data: { userId: string; text: string }) {
    return this.callService('journal', '/text', {
      data,
      schema: JournalTextPayload,
      method: 'POST',
    });
  }

  static async getBreathWeekly(userId: string) {
    return this.callService('breath', `/weekly/${userId}`);
  }

  static async getPrivacyPrefs(userId: string) {
    return this.callService('privacy', `/prefs/${userId}`);
  }

  static async updatePrivacyPrefs(userId: string, prefs: Record<string, unknown>) {
    return this.callService('privacy', `/prefs/${userId}`, {
      data: prefs,
      schema: PrivacyPrefsPayload,
      method: 'PUT',
    });
  }

  static async exportUserData(userId: string) {
    return this.callService('account', `/user/export`, {
      data: { userId },
      schema: ExportUserPayload,
      method: 'POST',
      timeoutMs: 30_000,
      retries: 3,
    });
  }
}

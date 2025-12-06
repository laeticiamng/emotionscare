/* @vitest-environment node */
// @ts-nocheck

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

const handlerRef: { current: ((req: Request) => Promise<Response>) | null } = {
  current: null,
};

const logAccessMock = vi.fn();
vi.mock('../functions/_shared/logging.ts', () => ({
  logAccess: (...args: unknown[]) => logAccessMock(...args),
}));

vi.mock('../functions/_shared/hash_user.ts', () => ({
  hash: (value: string) => `hashed:${value}`,
}));

vi.mock('https://deno.land/std@0.168.0/http/server.ts', () => ({
  serve: (handler: (req: Request) => Promise<Response>) => {
    handlerRef.current = handler;
  },
}));

vi.mock('https://deno.land/x/xhr@0.1.0/mod.ts', () => ({}));

vi.mock('npm:sanitize-html@2.17.0', () => ({
  default: (input: unknown) => (typeof input === 'string' ? input : ''),
}));

const supabaseEdgeClientMock = vi.fn();
vi.mock('https://esm.sh/@supabase/supabase-js@2', () => ({
  createClient: (...args: unknown[]) => supabaseEdgeClientMock(...args),
}));

const supabaseServiceClientMock = vi.fn();
vi.mock('https://esm.sh/@supabase/supabase-js@2.43.4', () => ({
  createClient: (...args: unknown[]) => supabaseServiceClientMock(...args),
}));

const authenticateRequestMock = vi.fn();
vi.mock('../functions/_shared/auth-middleware.ts', () => ({
  authenticateRequest: (...args: unknown[]) => authenticateRequestMock(...args),
}));

const authorizeRoleMock = vi.fn();
vi.mock('../functions/_shared/auth.ts', () => ({
  authorizeRole: (...args: unknown[]) => authorizeRoleMock(...args),
}));

const envStore: Record<string, string | undefined> = {
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
  SUPABASE_ANON_KEY: 'anon-key',
  OPENAI_API_KEY: 'test-openai-key',
};

const journalTextResponseSchema = z.object({ entry_id: z.string().min(1) }).passthrough();
const stringErrorSchema = z.object({ error: z.string() }).passthrough();
const rateLimitErrorSchema = z.object({
  error: z.literal('rate_limited'),
  message: z.string(),
  retry_after: z.number().int().positive(),
}).passthrough();
const journalAnalysisSuccessSchema = z.object({
  success: z.literal(true),
  data: z.object({
    analysis_type: z.string(),
    emotional_analysis: z.record(z.unknown()).optional(),
  }).passthrough(),
}).passthrough();
const journalAnalysisErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
}).passthrough();
const coachResponseSchema = z.object({ response: z.string() }).passthrough();

let edgeClientFactory: () => unknown;
let serviceClientFactory: () => unknown;

beforeEach(() => {
  handlerRef.current = null;
  supabaseEdgeClientMock.mockReset();
  supabaseServiceClientMock.mockReset();
  authenticateRequestMock.mockReset();
  authorizeRoleMock.mockReset();
  logAccessMock.mockReset();
  vi.clearAllMocks();

  edgeClientFactory = () => ({ from: vi.fn() });
  serviceClientFactory = () => ({ from: vi.fn() });
  supabaseEdgeClientMock.mockImplementation(() => edgeClientFactory());
  supabaseServiceClientMock.mockImplementation(() => serviceClientFactory());

  envStore.SUPABASE_URL = 'https://example.supabase.co';
  envStore.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';
  envStore.SUPABASE_ANON_KEY = 'anon-key';
  envStore.OPENAI_API_KEY = 'test-openai-key';
  delete envStore.EDGE_RATE_LIMIT_JOURNAL_TEXT;
  delete envStore.EDGE_RATE_LIMIT_COACH_AI;
  delete envStore.EDGE_RATE_LIMIT_JOURNAL_ANALYSIS;

  (globalThis as Record<string, unknown>).Deno = {
    env: {
      get: (key: string) => envStore[key],
    },
  };
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete (globalThis as Record<string, unknown>).Deno;
});

const importWithFreshModule = async (modulePath: string) => {
  handlerRef.current = null;
  await vi.resetModules();
  const salt = Math.random().toString(16).slice(2);
  await import(`${modulePath}?t=${salt}`);
  if (!handlerRef.current) {
    throw new Error(`No handler captured for module ${modulePath}`);
  }
  return handlerRef.current;
};

describe('journal-text edge function', () => {
  it('returns entry id for valid authenticated submissions', async () => {
    authenticateRequestMock.mockResolvedValue({ status: 200, user: { id: 'user-1' } });

    const insertSingleMock = vi.fn().mockResolvedValue({ data: { id: 'entry-1' }, error: null });
    const updateEqMock = vi.fn().mockResolvedValue({ error: null });

    edgeClientFactory = () => ({
      from: vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: insertSingleMock,
          })),
        })),
        update: vi.fn(() => ({
          eq: updateEqMock,
        })),
      })),
    });

    const openAiResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              mood_bucket: 'clear',
              summary: 'Résumé empathique',
              suggestion: 'Prenez un moment pour respirer',
            }),
          },
        },
      ],
    };

    vi.stubGlobal('fetch', vi.fn(async () => new Response(
      JSON.stringify(openAiResponse),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )));

    const handler = await importWithFreshModule('../functions/journal-text/index.ts');

    const response = await handler(new Request('https://edge/journal-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
      body: JSON.stringify({ text: 'Je me sens bien aujourd’hui.' }),
    }));

    expect(response.status).toBe(200);
    const payload = journalTextResponseSchema.parse(await response.json());
    expect(payload.entry_id).toBe('entry-1');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(insertSingleMock).toHaveBeenCalled();
    expect(updateEqMock).toHaveBeenCalled();
  });

  it('rejects empty submissions with 400 status', async () => {
    authenticateRequestMock.mockResolvedValue({ status: 200, user: { id: 'user-1' } });

    const insertSingleMock = vi.fn();
    const updateEqMock = vi.fn();

    edgeClientFactory = () => ({
      from: vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: insertSingleMock,
          })),
        })),
        update: vi.fn(() => ({
          eq: updateEqMock,
        })),
      })),
    });

    vi.stubGlobal('fetch', vi.fn());

    const handler = await importWithFreshModule('../functions/journal-text/index.ts');

    const response = await handler(new Request('https://edge/journal-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
      body: JSON.stringify({ text: '   ' }),
    }));

    expect(response.status).toBe(400);
    const payload = stringErrorSchema.parse(await response.json());
    expect(payload.error).toBe('Text content required');
    expect(insertSingleMock).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });
 
  it('returns 429 when the rate limit is exceeded', async () => {
    authenticateRequestMock.mockResolvedValue({ status: 200, user: { id: 'user-1' } });
    envStore.EDGE_RATE_LIMIT_JOURNAL_TEXT = '1';

    const insertSingleMock = vi.fn().mockResolvedValue({ data: { id: 'entry-1' }, error: null });
    const updateEqMock = vi.fn().mockResolvedValue({ error: null });

    edgeClientFactory = () => ({
      from: vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: insertSingleMock,
          })),
        })),
        update: vi.fn(() => ({
          eq: updateEqMock,
        })),
      })),
    });

    const openAiResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              mood_bucket: 'clear',
              summary: 'Résumé empathique',
              suggestion: 'Prenez un moment pour respirer',
            }),
          },
        },
      ],
    };

    const fetchMock = vi.fn(async () => new Response(
      JSON.stringify(openAiResponse),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    ));
    vi.stubGlobal('fetch', fetchMock);

    const handler = await importWithFreshModule('../functions/journal-text/index.ts');

    const makeRequest = () => new Request('https://edge/journal-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
      body: JSON.stringify({ text: 'Encore une note.' }),
    });

    const first = await handler(makeRequest());
    expect(first.status).toBe(200);

    const second = await handler(makeRequest());
    expect(second.status).toBe(429);
    const error = rateLimitErrorSchema.parse(await second.json());
    expect(error.message).toContain('Veuillez patienter');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(logAccessMock).toHaveBeenCalledWith(expect.objectContaining({
      action: 'rate_limit',
      result: 'denied',
      route: 'journal-text',
    }));
  });
});

describe('journal-analysis edge function', () => {
  it('returns structured analysis when OpenAI succeeds', async () => {
    envStore.OPENAI_API_KEY = 'analysis-key';

    const openAiPayload = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              emotional_analysis: { emotional_balance: 6 },
              progress_tracking: { consistency_score: 8 },
            }),
          },
        },
      ],
    };

    vi.stubGlobal('fetch', vi.fn(async () => new Response(
      JSON.stringify(openAiPayload),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )));

    const handler = await importWithFreshModule('../functions/journal-analysis/index.ts');

    const response = await handler(new Request('https://edge/journal-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entry: 'Aujourd’hui était une bonne journée.' }),
    }));

    expect(response.status).toBe(200);
    const json = journalAnalysisSuccessSchema.parse(await response.json());
    expect(json.data.analysis_type).toBe('comprehensive');
    expect((json.data.emotional_analysis as Record<string, unknown>)?.emotional_balance).toBe(6);
  });

  it('validates payload and returns 400 for missing entry', async () => {
    envStore.OPENAI_API_KEY = 'analysis-key';
    vi.stubGlobal('fetch', vi.fn());

    const handler = await importWithFreshModule('../functions/journal-analysis/index.ts');

    const response = await handler(new Request('https://edge/journal-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entry: '   ' }),
    }));

    expect(response.status).toBe(400);
    const json = journalAnalysisErrorSchema.parse(await response.json());
    expect(json.error).toBe('Journal entry is required');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('surfaces rate limit exhaustion for anonymous callers', async () => {
    envStore.EDGE_RATE_LIMIT_JOURNAL_ANALYSIS = '1';

    const openAiPayload = {
      choices: [
        {
          message: {
            content: JSON.stringify({}),
          },
        },
      ],
    };

    vi.stubGlobal('fetch', vi.fn(async () => new Response(
      JSON.stringify(openAiPayload),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )));

    const handler = await importWithFreshModule('../functions/journal-analysis/index.ts');

    const makeRequest = () => new Request('https://edge/journal-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entry: 'Analyse cette entrée.' }),
    });

    const first = await handler(makeRequest());
    expect(first.status).toBe(200);

    const second = await handler(makeRequest());
    expect(second.status).toBe(429);
    const payload = rateLimitErrorSchema.parse(await second.json());
    expect(payload.retry_after).toBeGreaterThan(0);
  });
});

describe('coach-ai edge function', () => {
  beforeEach(() => {
    envStore.OPENAI_API_KEY = 'coach-key';
  });

  it('produces sanitized coaching responses when authorized', async () => {
    authorizeRoleMock.mockResolvedValue({ status: 200, user: { id: 'user-77', user_metadata: { role: 'b2c' } } });

    const openAiPayload = {
      choices: [
        {
          message: {
            content: 'Analyse: ...',
          },
        },
      ],
    };

    vi.stubGlobal('fetch', vi.fn(async () => new Response(
      JSON.stringify(openAiPayload),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )));

    const handler = await importWithFreshModule('../functions/coach-ai/index.ts');

    const response = await handler(new Request('https://edge/coach-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
      body: JSON.stringify({
        userMessage: 'Je suis stressé par ma présentation.',
        personality: { name: 'Ava', approach: 'mindful', tone: 'calme', specialties: ['stress'] },
        context: { userMood: 'stressé', stressLevel: 0.6 },
        conversationHistory: [],
      }),
    }));

    expect(response.status).toBe(200);
    const json = coachResponseSchema.parse(await response.json());
    expect(json.response).toContain('Analyse');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('returns 400 when message is missing', async () => {
    authorizeRoleMock.mockResolvedValue({ status: 200, user: { id: 'user-77', user_metadata: { role: 'b2c' } } });
    vi.stubGlobal('fetch', vi.fn());

    const handler = await importWithFreshModule('../functions/coach-ai/index.ts');

    const response = await handler(new Request('https://edge/coach-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
      body: JSON.stringify({ userMessage: '' }),
    }));

    expect(response.status).toBe(400);
    const payload = stringErrorSchema.parse(await response.json());
    expect(payload.error).toBe('Message utilisateur requis');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('enforces rate limits for repeated prompts', async () => {
    authorizeRoleMock.mockResolvedValue({ status: 200, user: { id: 'user-77', user_metadata: { role: 'b2c' } } });
    envStore.EDGE_RATE_LIMIT_COACH_AI = '1';

    const openAiPayload = {
      choices: [
        {
          message: {
            content: 'Analyse: ...',
          },
        },
      ],
    };

    const fetchMock = vi.fn(async () => new Response(
      JSON.stringify(openAiPayload),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    ));
    vi.stubGlobal('fetch', fetchMock);

    const handler = await importWithFreshModule('../functions/coach-ai/index.ts');

    const makeRequest = () => new Request('https://edge/coach-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
      body: JSON.stringify({
        userMessage: 'Je suis stressé par ma présentation.',
        personality: { name: 'Ava', approach: 'mindful', tone: 'calme', specialties: ['stress'] },
        context: { userMood: 'stressé', stressLevel: 0.6 },
        conversationHistory: [],
      }),
    });

    const first = await handler(makeRequest());
    expect(first.status).toBe(200);

    const second = await handler(makeRequest());
    expect(second.status).toBe(429);
    const payload = rateLimitErrorSchema.parse(await second.json());
    expect(payload.message).toContain('Veuillez patienter');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('metrics edge function', () => {
  beforeEach(() => {
    envStore.SUPABASE_URL = 'https://example.supabase.co';
    envStore.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';
  });

  it('accepts face filter metrics and stores anonymized events', async () => {
    const insertMock = vi.fn().mockResolvedValue({ error: null });
    serviceClientFactory = () => ({
      from: vi.fn(() => ({
        insert: insertMock,
      })),
    });

    const handler = await importWithFreshModule('../functions/metrics/index.ts');

    const response = await handler(new Request('https://edge/metrics/face_filter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emotion: 'joie', confidence: 0.8, source: 'camera', ts: 123 }),
    }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({ event_type: 'ar.face.emotion' }));
  });

  it('rejects unknown endpoints with 404', async () => {
    const insertMock = vi.fn();
    serviceClientFactory = () => ({
      from: vi.fn(() => ({ insert: insertMock })),
    });

    const handler = await importWithFreshModule('../functions/metrics/index.ts');

    const response = await handler(new Request('https://edge/metrics/unknown', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }));

    expect(response.status).toBe(404);
    const payload = await response.json();
    expect(payload.error).toBe('Invalid metrics endpoint');
    expect(insertMock).not.toHaveBeenCalled();
  });
});


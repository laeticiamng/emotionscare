// @ts-nocheck
import { type ZodType } from 'zod';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/lib/env';
import { fetchWithRetry, type FetchWithRetryOptions } from '@/lib/network/fetchWithRetry';
import { logger } from '@/lib/logger';

const EDGE_BASE_URL = `${SUPABASE_URL}/functions/v1`;

interface InvokeOptions<TPayload> extends Omit<FetchWithRetryOptions, 'json' | 'payloadSchema' | 'method'> {
  payload: TPayload;
  schema?: ZodType<TPayload>;
  accessToken?: string | null;
}

export async function invokeSupabaseEdge<TPayload, TResult = unknown>(
  functionName: string,
  { payload, schema, accessToken, headers: overrideHeaders, ...options }: InvokeOptions<TPayload>,
): Promise<TResult> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase credentials missing for edge invocation');
  }

  const headers = new Headers(overrideHeaders);
  headers.set('apikey', SUPABASE_ANON_KEY);
  headers.set('Authorization', `Bearer ${accessToken ?? SUPABASE_ANON_KEY}`);
  headers.set('Content-Type', 'application/json');

  const response = await fetchWithRetry(`${EDGE_BASE_URL}/${functionName}`, {
    ...options,
    method: 'POST',
    headers,
    json: payload,
    payloadSchema: schema,
  });

  const text = await response.text().catch(() => '');

  if (!response.ok) {
    logger.error(
      'Edge function call failed',
      { functionName, status: response.status, body: text ? text.slice(0, 256) : null },
      'network.supabaseEdge',
    );
    throw new Error(`Edge function ${functionName} failed with status ${response.status}`);
  }

  if (!text) {
    return undefined as TResult;
  }

  try {
    return JSON.parse(text) as TResult;
  } catch (error) {
    logger.error(
      'Unable to parse edge function payload',
      { functionName, error: error instanceof Error ? error.message : error, raw: text.slice(0, 256) },
      'network.supabaseEdge',
    );
    throw new Error('Invalid response payload from edge function');
  }
}

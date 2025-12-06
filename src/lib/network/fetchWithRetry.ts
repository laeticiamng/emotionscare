// @ts-nocheck
import { type ZodTypeAny } from 'zod';
import { logger } from '@/lib/logger';

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_RETRIES = 2;
const DEFAULT_RETRY_DELAY_MS = 500;
const DEFAULT_MAX_PAYLOAD_BYTES = 256 * 1024; // 256KB
const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);

const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

const mergeSignals = (timeoutMs: number, externalSignal?: AbortSignal) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort(new DOMException('Request timed out', 'AbortError'));
  }, timeoutMs);

  const cancel = () => clearTimeout(timeoutId);

  if (externalSignal) {
    if (externalSignal.aborted) {
      cancel();
      controller.abort(externalSignal.reason);
    } else {
      externalSignal.addEventListener(
        'abort',
        () => {
          cancel();
          controller.abort(externalSignal.reason ?? new DOMException('Aborted', 'AbortError'));
        },
        { once: true },
      );
    }
  }

  controller.signal.addEventListener('abort', cancel, { once: true });

  return { signal: controller.signal, cancel };
};

const asRecord = (headers?: HeadersInit): Record<string, string> => {
  if (!headers) {
    return {};
  }
  if (headers instanceof Headers) {
    const next: Record<string, string> = {};
    headers.forEach((value, key) => {
      next[key] = value;
    });
    return next;
  }
  if (Array.isArray(headers)) {
    return headers.reduce<Record<string, string>>((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  }
  return { ...headers };
};

const serializePayload = (
  jsonPayload: unknown,
  payloadSchema?: ZodTypeAny,
): string => {
  if (payloadSchema) {
    const validation = payloadSchema.safeParse(jsonPayload);
    if (!validation.success) {
      logger.error('Payload schema validation failed', validation.error.flatten(), 'network.fetch');
      throw new Error('Payload validation failed');
    }
    return JSON.stringify(validation.data);
  }

  return JSON.stringify(jsonPayload);
};

const ensurePayloadLimit = (body: BodyInit | null | undefined, maxBytes: number) => {
  if (!body || typeof body !== 'string') {
    return;
  }

  const size = new TextEncoder().encode(body).length;
  if (size > maxBytes) {
    throw new Error('Payload exceeds allowed client-side limit');
  }
};

export interface FetchWithRetryOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
  maxPayloadBytes?: number;
  payloadSchema?: ZodTypeAny;
  json?: unknown;
}

export async function fetchWithRetry(url: string, options: FetchWithRetryOptions = {}): Promise<Response> {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    retries = DEFAULT_RETRIES,
    retryDelayMs = DEFAULT_RETRY_DELAY_MS,
    maxPayloadBytes = DEFAULT_MAX_PAYLOAD_BYTES,
    payloadSchema,
    json,
    ...init
  } = options;

  const headers = asRecord(init.headers);
  let body: BodyInit | null | undefined = init.body ?? null;

  if (json !== undefined) {
    body = serializePayload(json, payloadSchema);
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
  } else if (payloadSchema && typeof body === 'string') {
    try {
      const parsed = JSON.parse(body);
      body = serializePayload(parsed, payloadSchema);
    } catch (error) {
      logger.warn(
        'Unable to parse payload for validation',
        { url, error: error instanceof Error ? error.message : error },
        'network.fetch',
      );
      // keep original body if parsing fails
    }
  }

  ensurePayloadLimit(body, maxPayloadBytes);

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const { signal, cancel } = mergeSignals(timeoutMs, init.signal);

    try {
      const response = await fetch(url, {
        ...init,
        headers,
        body: body ?? undefined,
        signal,
      });
      cancel();

      if (response.ok) {
        if (attempt > 0) {
          logger.info('fetchWithRetry succeeded after retry', { url, attempt }, 'network.fetch');
        }
        return response;
      }

      lastError = new Error(`HTTP ${response.status}`);
      logger.warn('fetchWithRetry received non-ok response', { url, status: response.status, attempt }, 'network.fetch');

      if (!RETRYABLE_STATUS.has(response.status) || attempt === retries) {
        return response;
      }
    } catch (error) {
      cancel();
      lastError = error;

      if ((error as DOMException)?.name === 'AbortError') {
        logger.warn('fetchWithRetry aborted', { url, attempt }, 'network.fetch');
      } else {
        logger.warn(
          'fetchWithRetry failed',
          { url, attempt, error: error instanceof Error ? error.message : error },
          'network.fetch',
        );
      }

      if (attempt === retries) {
        throw error;
      }
    }

    const backoff = Math.min(retryDelayMs * 2 ** attempt, 4_000);
    await sleep(backoff);
  }

  throw lastError ?? new Error('fetchWithRetry failed without explicit error');
}

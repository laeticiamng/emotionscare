export interface SendCoachMessageOptions {
  threadId?: string;
  message: string;
  mode?: 'b2c' | 'b2b';
  locale?: 'fr' | 'en';
  userHash?: string;
  flexHint?: 'souple' | 'transition' | 'rigide';
  signal?: AbortSignal;
  onChunk?: (chunk: string) => void;
  onThread?: (threadId: string) => void;
  onDisclaimers?: (items: string[]) => void;
}

export interface CoachApiResponse {
  threadId: string;
  text: string;
  disclaimers: string[];
}

const END_TOKEN = '[END]';
const FUNCTION_URL = '/functions/v1/ai-coach';

function buildPayload(options: SendCoachMessageOptions) {
  return {
    thread_id: options.threadId,
    message: options.message,
    mode: options.mode ?? 'b2c',
    locale: options.locale ?? 'fr',
    user_hash: options.userHash,
    flex_hint: options.flexHint,
  };
}

export async function sendMessage(options: SendCoachMessageOptions): Promise<CoachApiResponse> {
  const payload = buildPayload(options);
  const body = JSON.stringify(payload);

  if (typeof window !== 'undefined' && typeof window.EventSource === 'function') {
    try {
      return await new Promise<CoachApiResponse>((resolve, reject) => {
        let accumulated = '';
        let resolved = false;
        let threadId = options.threadId ?? '';
        let disclaimers: string[] = [];

        const source = new EventSource(`${FUNCTION_URL}?body=${encodeURIComponent(body)}`);

        const cleanup = () => {
          resolved = true;
          source.close();
        };

        const abortHandler = () => {
          if (resolved) return;
          cleanup();
          reject(new DOMException('coach_aborted', 'AbortError'));
        };

        options.signal?.addEventListener('abort', abortHandler, { once: true });

        source.onmessage = event => {
          if (!event.data) {
            return;
          }

          if (event.data === END_TOKEN) {
            cleanup();
            resolve({
              threadId: threadId || options.threadId || 'new',
              text: accumulated,
              disclaimers,
            });
            return;
          }

          try {
            const parsed = JSON.parse(event.data);
            if (parsed?.type === 'meta') {
              if (typeof parsed.threadId === 'string') {
                threadId = parsed.threadId;
                options.onThread?.(threadId);
              }
              if (Array.isArray(parsed.disclaimers)) {
                disclaimers = parsed.disclaimers.filter(item => typeof item === 'string');
                if (disclaimers.length) {
                  options.onDisclaimers?.(disclaimers);
                }
              }
              return;
            }
            if (parsed?.type === 'delta' && typeof parsed.content === 'string') {
              accumulated += parsed.content;
              options.onChunk?.(parsed.content);
              return;
            }
          } catch {
            accumulated += event.data;
            options.onChunk?.(event.data);
          }
        };

        source.onerror = error => {
          if (resolved) {
            return;
          }
          cleanup();
          reject(error instanceof Error ? error : new Error('coach_stream_error'));
        };
      });
    } catch (error) {
      console.warn('[coachApi] SSE failed, falling back to fetch', error);
    }
  }

  const response = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(`coach_failed_${response.status}`);
  }

  const json = await response.json();
  const threadId = typeof json?.thread_id === 'string' ? json.thread_id : options.threadId ?? 'new';
  const text = String(json?.messages?.[0]?.content ?? '');
  const disclaimers = Array.isArray(json?.disclaimers)
    ? json.disclaimers.filter((item: unknown): item is string => typeof item === 'string')
    : [];

  if (text && options.onChunk) {
    options.onChunk(text);
  }
  if (threadId && options.onThread) {
    options.onThread(threadId);
  }
  if (disclaimers.length && options.onDisclaimers) {
    options.onDisclaimers(disclaimers);
  }

  return { threadId, text, disclaimers };
}

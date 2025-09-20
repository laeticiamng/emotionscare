const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE_REGEX = /\b(?:\+?\d[\d\s().-]{7,}\d)\b/g;
const UUID_REGEX = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;
const JWT_REGEX = /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g;
const BEARER_TOKEN_REGEX = /\bBearer\s+[A-Za-z0-9\-._~+/=]{10,}\b/gi;
const BASIC_TOKEN_REGEX = /\bBasic\s+[A-Za-z0-9\-._~+/=]{6,}\b/gi;
const TOKEN_QUERY_PARAM_REGEX = /([?&](?:token|access_token|refresh_token|api[_-]?key|auth|authorization)=)[^&#]+/gi;
const SUPABASE_SERVICE_ROLE_REGEX = /(supabase[_-]?service[_-]?role[_-]?key\s*[:=]\s*)([^&\s]+)/gi;

const SENSITIVE_KEYS = new Set([
  'password',
  'authorization',
  'cookie',
  'cookies',
  'token',
  'access_token',
  'refresh_token',
  'id_token',
  'api_key',
  'apikey',
  'client_secret',
  'supabase_service_role_key',
  'prompt',
  'transcript',
  'message',
  'messages',
  'content',
  'body',
  'payload',
  'answer',
  'journal',
  'note',
]);

const IDENTIFIER_SUFFIXES = ['_id', '_uid'];
const MAX_STRING_LENGTH = 200;
const MAX_DEPTH = 5;
const MAX_ARRAY_LENGTH = 25;

const normalizeKey = (key: string): string => key.replace(/[^a-z0-9_]/gi, '_').toLowerCase();

const isSensitiveKey = (key: string): boolean => {
  const normalized = normalizeKey(key);
  if (SENSITIVE_KEYS.has(normalized)) {
    return true;
  }
  if (IDENTIFIER_SUFFIXES.some((suffix) => normalized.endsWith(suffix))) {
    return true;
  }
  if (normalized.includes('supabase') && normalized.includes('key')) {
    return true;
  }
  return false;
};

const scrubString = (value: string): string => {
  if (!value) {
    return value;
  }

  let sanitized = value;
  EMAIL_REGEX.lastIndex = 0;
  PHONE_REGEX.lastIndex = 0;
  UUID_REGEX.lastIndex = 0;
  JWT_REGEX.lastIndex = 0;
  BEARER_TOKEN_REGEX.lastIndex = 0;
  BASIC_TOKEN_REGEX.lastIndex = 0;
  TOKEN_QUERY_PARAM_REGEX.lastIndex = 0;
  SUPABASE_SERVICE_ROLE_REGEX.lastIndex = 0;

  sanitized = sanitized.replace(EMAIL_REGEX, '[email]');
  sanitized = sanitized.replace(PHONE_REGEX, '[phone]');
  sanitized = sanitized.replace(UUID_REGEX, '[id]');
  sanitized = sanitized.replace(JWT_REGEX, '[token]');
  sanitized = sanitized.replace(BEARER_TOKEN_REGEX, 'Bearer [redacted]');
  sanitized = sanitized.replace(BASIC_TOKEN_REGEX, 'Basic [redacted]');
  sanitized = sanitized.replace(TOKEN_QUERY_PARAM_REGEX, '$1[redacted]');
  sanitized = sanitized.replace(SUPABASE_SERVICE_ROLE_REGEX, '$1[redacted]');

  if (sanitized.length > MAX_STRING_LENGTH) {
    const head = sanitized.slice(0, 120);
    const tail = sanitized.slice(-24);
    sanitized = `${head}\u2026${tail}`;
  }

  return sanitized;
};

const sanitizeUrlValue = (value: string): string => {
  try {
    const url = new URL(value);
    url.search = '';
    url.hash = '';
    return scrubString(url.toString());
  } catch {
    return scrubString(value.split('?')[0] ?? value);
  }
};

type SeenRegistry = WeakSet<Record<string, unknown>>;

type RedactedValue<T> = T extends string
  ? string
  : T extends number | boolean | null | undefined
    ? T
    : T extends Array<infer U>
      ? Array<RedactedValue<U>>
      : T extends URLSearchParams
        ? Record<string, string>
        : T extends Date
          ? string
          : T extends object
            ? { [K in keyof T]: RedactedValue<T[K]> }
            : T;

function redactInternal<T>(value: T, depth: number, seen: SeenRegistry): RedactedValue<T> {
  if (value === null || value === undefined) {
    return value as RedactedValue<T>;
  }

  if (typeof value === 'string') {
    return scrubString(value) as RedactedValue<T>;
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return null as RedactedValue<T>;
    }
    return value as RedactedValue<T>;
  }

  if (typeof value === 'boolean') {
    return value as RedactedValue<T>;
  }

  if (value instanceof Date) {
    return value.toISOString() as RedactedValue<T>;
  }

  if (typeof URLSearchParams !== 'undefined' && value instanceof URLSearchParams) {
    const entries: Record<string, string> = {};
    value.forEach((entryValue, entryKey) => {
      entries[entryKey] = isSensitiveKey(entryKey) ? '[redacted]' : scrubString(entryValue);
    });
    return entries as RedactedValue<T>;
  }

  if (typeof value === 'object') {
    if (seen.has(value as Record<string, unknown>)) {
      return '[circular]' as RedactedValue<T>;
    }

    if (depth >= MAX_DEPTH) {
      return '[truncated]' as RedactedValue<T>;
    }

    seen.add(value as Record<string, unknown>);

    if (Array.isArray(value)) {
      const slice = value.slice(0, MAX_ARRAY_LENGTH).map((entry) => redactInternal(entry, depth + 1, seen));
      return slice as RedactedValue<T>;
    }

    const result: Record<string, unknown> = {};
    for (const [rawKey, rawEntry] of Object.entries(value as Record<string, unknown>)) {
      if (isSensitiveKey(rawKey)) {
        result[rawKey] = '[redacted]';
        continue;
      }

      if (typeof rawEntry === 'string' && rawKey.toLowerCase().includes('url')) {
        result[rawKey] = sanitizeUrlValue(rawEntry);
        continue;
      }

      result[rawKey] = redactInternal(rawEntry as never, depth + 1, seen);
    }

    return result as RedactedValue<T>;
  }

  return value as RedactedValue<T>;
}

export function redact<T>(value: T): RedactedValue<T> {
  return redactInternal(value, 0, new WeakSet());
}

export type Redact = typeof redact;

const SENSITIVE = /^(authorization|token|email|user_id|score_json|password|cookie|apikey|key)$/i;

export function redact<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((entry) => redact(entry)) as unknown as T;
  }

  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      out[key] = SENSITIVE.test(key) ? '[REDACTED]' : redact(entry);
    }
    return out as unknown as T;
  }

  if (typeof value === 'string') {
    return value.replace(/(Bearer\s+)[A-Za-z0-9.\-_]+/g, '$1[REDACTED]') as unknown as T;
  }

  return value;
}

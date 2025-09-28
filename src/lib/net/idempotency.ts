type Key = string;
type CacheEntry = { ts: number; status: number; body: unknown };

const mem = new Map<Key, CacheEntry>();
const TTL_MS = 5 * 60 * 1000; // 5 min

function now() { return Date.now(); }
function cleanup() {
  for (const [k, v] of mem) if (now() - v.ts > TTL_MS) mem.delete(k);
}

export function makeIdempotencyKey(input: unknown) {
  try { return btoa(unescape(encodeURIComponent(JSON.stringify(input)))); }
  catch { return Math.random().toString(36).slice(2); }
}

export async function withIdempotency<T>(
  key: Key,
  fetcher: () => Promise<{ status: number; json: () => Promise<T> }>
): Promise<{ status: number; data: T }> {
  cleanup();
  const hit = mem.get(key);
  if (hit && now() - hit.ts < TTL_MS) {
    return { status: hit.status, data: hit.body as T };
  }
  const res = await fetcher();
  const data = await res.json();
  mem.set(key, { ts: now(), status: res.status, body: data });
  return { status: res.status, data };
}

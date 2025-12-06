// @ts-nocheck
export async function safeFetch(url: string, opts: RequestInit & { timeoutMs?: number; retries?: number } = {}) {
  const { timeoutMs, retries = 0, ...rest } = opts;
  const controller = new AbortController();
  const timer = timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
  try {
    const res = await fetch(url, { ...rest, signal: controller.signal });
    return res;
  } catch (err) {
    if (retries > 0) return safeFetch(url, { ...opts, retries: retries - 1 });
    throw err;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

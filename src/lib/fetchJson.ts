if (!globalThis.fetch) {
  Object.assign(globalThis, require('undici'));
}

export async function fetchJson(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  return globalThis.fetch(input, init);
}


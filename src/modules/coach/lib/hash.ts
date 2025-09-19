export async function sha256(text: string): Promise<string> {
  if (typeof text !== 'string') {
    throw new TypeError('sha256 expects a string');
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  if (!globalThis.crypto?.subtle) {
    throw new Error('web-crypto-unavailable');
  }

  const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

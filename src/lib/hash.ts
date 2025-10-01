// @ts-nocheck
const WEB_CRYPTO_UNAVAILABLE_MESSAGE = 'Web Crypto SubtleCrypto not available';

/**
 * sha256Hex — Web Crypto (SubtleCrypto) only.
 * Compatible navigateur, Deno (Edge), Node >= 18 (globalThis.crypto).
 */
export async function sha256Hex(input: string): Promise<string> {
  if (typeof input !== 'string' || input.length === 0) {
    return '';
  }

  const cryptoObj: Crypto | undefined = (globalThis as unknown as { crypto?: Crypto }).crypto;

  if (!cryptoObj?.subtle) {
    throw new Error(WEB_CRYPTO_UNAVAILABLE_MESSAGE);
  }

  const data = new TextEncoder().encode(input);
  const digest = await cryptoObj.subtle.digest('SHA-256', data);

  return Array.from(new Uint8Array(digest))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

export const webCryptoUnavailableMessage = WEB_CRYPTO_UNAVAILABLE_MESSAGE;

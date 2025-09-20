const ERROR_MESSAGE = 'web-crypto-unavailable';

function resolveSubtleCrypto(): SubtleCrypto | null {
  const globalCrypto = typeof globalThis !== 'undefined' ? (globalThis as Crypto | undefined) : undefined;

  if (globalCrypto?.subtle) {
    return globalCrypto.subtle;
  }

  // Some runtimes (older Node, legacy browsers) expose the Web Crypto API under `crypto.webcrypto`.
  const webcrypto = (globalCrypto as { webcrypto?: Crypto } | undefined)?.webcrypto;
  if (webcrypto?.subtle) {
    return webcrypto.subtle;
  }

  if (typeof window !== 'undefined') {
    const maybeWindowCrypto = window.crypto ?? (window as typeof window & { msCrypto?: Crypto }).msCrypto;
    if (maybeWindowCrypto?.subtle) {
      return maybeWindowCrypto.subtle;
    }
  }

  return null;
}

/**
 * Hash a textual value using the SHA-256 algorithm.
 *
 * The implementation relies purely on Web Crypto so it can be bundled in the browser
 * without accidentally importing Node built-ins (e.g. `node:crypto`).
 */
export async function sha256(text: string): Promise<string> {
  if (typeof text !== 'string') {
    throw new TypeError('sha256 expects a string');
  }

  const subtle = resolveSubtleCrypto();
  if (!subtle) {
    throw new Error(ERROR_MESSAGE);
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const digest = await subtle.digest('SHA-256', data);

  return Array.from(new Uint8Array(digest))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

export const webCryptoUnavailableMessage = ERROR_MESSAGE;

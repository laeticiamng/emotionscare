import { afterEach, describe, expect, it, vi } from 'vitest';

import { sha256, webCryptoUnavailableMessage } from './hash';

describe('sha256 helper', () => {
  const originalCrypto = globalThis.crypto;

  afterEach(() => {
    if (originalCrypto) {
      Object.defineProperty(globalThis, 'crypto', {
        value: originalCrypto,
        writable: true,
        configurable: true,
      });
    } else {
      delete (globalThis as Record<string, unknown>).crypto;
    }
    vi.restoreAllMocks();
  });

  it('hashes a string using the default subtle crypto implementation', async () => {
    const digest = await sha256('emotionscare');
    expect(digest).toBe('3f7a42131d7d148550c102d7879d51e6b0ea04314c01f79605c612b224569b8b');
  });

  it('falls back to crypto.webcrypto.subtle when available', async () => {
    const subtleDigest = vi.fn((algorithm: AlgorithmIdentifier, data: BufferSource) =>
      originalCrypto.subtle.digest(algorithm, data),
    );

    Object.defineProperty(globalThis, 'crypto', {
      value: { webcrypto: { subtle: { digest: subtleDigest } } },
      writable: true,
      configurable: true,
    });

    const digest = await sha256('fallback');
    expect(digest).toBe('1c10451d2f92b512202f86485f1213db15d13383ed669f428e22950a9cbe0172');
    expect(subtleDigest).toHaveBeenCalledOnce();
  });

  it('throws a descriptive error when no web crypto implementation exists', async () => {
    Object.defineProperty(globalThis, 'crypto', {
      value: {},
      writable: true,
      configurable: true,
    });

    await expect(sha256('test')).rejects.toThrowError(webCryptoUnavailableMessage);
  });
});

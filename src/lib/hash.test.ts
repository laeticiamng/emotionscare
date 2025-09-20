import { afterEach, describe, expect, it, vi } from 'vitest';

import { sha256, webCryptoUnavailableMessage } from './hash';

describe('sha256 helper', () => {
  const originalCrypto = globalThis.crypto;
  const originalWindowCrypto = typeof window !== 'undefined' ? window.crypto : undefined;

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
    if (typeof window !== 'undefined') {
      if (originalWindowCrypto) {
        Object.defineProperty(window, 'crypto', {
          value: originalWindowCrypto,
          configurable: true,
          writable: true,
        });
      } else {
        delete (window as { crypto?: Crypto }).crypto;
      }
      delete (window as { msCrypto?: Crypto }).msCrypto;
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

  it('supports legacy window.msCrypto implementations', async () => {
    const subtleDigest = vi.fn((algorithm: AlgorithmIdentifier, data: BufferSource) =>
      originalCrypto.subtle.digest(algorithm, data),
    );

    Object.defineProperty(globalThis, 'crypto', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    if (typeof window !== 'undefined') {
      Object.defineProperty(window, 'crypto', {
        value: undefined,
        configurable: true,
        writable: true,
      });
      Object.defineProperty(window as typeof window & { msCrypto?: Crypto }, 'msCrypto', {
        value: { subtle: { digest: subtleDigest } },
        configurable: true,
        writable: true,
      });
    }

    const digest = await sha256('legacy');
    expect(digest).toBe('2fc01b4a8590f9d33fed461187f1bcdb2dbeffa0de1daa64f3ebd242c84f5f80');
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

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  checkRateLimit,
  assertRateLimit,
  resetRateLimit,
  resetAllRateLimits,
  RateLimitError,
  RATE_LIMITS,
} from '../rateLimiter';

describe('rateLimiter', () => {
  beforeEach(() => {
    resetAllRateLimits();
    vi.restoreAllMocks();
  });

  describe('checkRateLimit', () => {
    it('allows requests under the limit', () => {
      const result = checkRateLimit('test-endpoint', { maxRequests: 3 });
      expect(result.allowed).toBe(true);
    });

    it('blocks when limit is exceeded', () => {
      const config = { maxRequests: 2, windowMs: 60_000, cooldownMs: 10_000 };

      expect(checkRateLimit('test', config).allowed).toBe(true);
      expect(checkRateLimit('test', config).allowed).toBe(true);

      const result = checkRateLimit('test', config);
      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.retryAfterMs).toBeGreaterThan(0);
      }
    });

    it('uses separate buckets for different keys', () => {
      const config = { maxRequests: 1 };

      expect(checkRateLimit('key-a', config).allowed).toBe(true);
      expect(checkRateLimit('key-b', config).allowed).toBe(true);

      expect(checkRateLimit('key-a', config).allowed).toBe(false);
      expect(checkRateLimit('key-b', config).allowed).toBe(false);
    });

    it('resets after cooldown period', () => {
      const now = Date.now();
      vi.spyOn(Date, 'now')
        .mockReturnValueOnce(now)       // first request
        .mockReturnValueOnce(now)       // second request (blocked)
        .mockReturnValueOnce(now + 35_000) // after cooldown
        .mockReturnValueOnce(now + 35_000); // record new timestamp

      const config = { maxRequests: 1, windowMs: 60_000, cooldownMs: 30_000 };

      expect(checkRateLimit('cooldown-test', config).allowed).toBe(true);
      expect(checkRateLimit('cooldown-test', config).allowed).toBe(false);
      expect(checkRateLimit('cooldown-test', config).allowed).toBe(true);
    });
  });

  describe('assertRateLimit', () => {
    it('does not throw when under limit', () => {
      expect(() => assertRateLimit('assert-test', { maxRequests: 5 })).not.toThrow();
    });

    it('throws RateLimitError when over limit', () => {
      const config = { maxRequests: 1 };
      assertRateLimit('assert-throw', config);

      try {
        assertRateLimit('assert-throw', config);
        expect.fail('Should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(RateLimitError);
        expect((e as RateLimitError).retryAfterMs).toBeGreaterThan(0);
        expect((e as RateLimitError).message).toContain('Trop de requetes');
      }
    });
  });

  describe('resetRateLimit', () => {
    it('resets a specific key', () => {
      const config = { maxRequests: 1 };
      checkRateLimit('reset-key', config);
      expect(checkRateLimit('reset-key', config).allowed).toBe(false);

      resetRateLimit('reset-key');
      expect(checkRateLimit('reset-key', config).allowed).toBe(true);
    });
  });

  describe('RATE_LIMITS presets', () => {
    it('has valid configuration for all presets', () => {
      for (const [key, config] of Object.entries(RATE_LIMITS)) {
        expect(config.maxRequests).toBeGreaterThan(0);
        expect(config.windowMs).toBeGreaterThan(0);
        expect(config.cooldownMs).toBeGreaterThan(0);
      }
    });
  });
});

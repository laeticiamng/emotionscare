import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Fastify from 'fastify';
import { envValidationPlugin } from './env';

describe('envValidationPlugin', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original env
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Restore original env
    process.env = originalEnv;
  });

  it('should pass with all required environment variables', async () => {
    process.env = {
      ...originalEnv,
      JWT_SECRETS: 'a'.repeat(32),
      ALLOWED_ORIGINS: 'http://localhost:3000',
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'test-key',
    };

    const app = Fastify({ logger: false });
    await expect(app.register(envValidationPlugin)).resolves.not.toThrow();
    await app.close();
  });

  it('should fail if JWT_SECRETS is missing', async () => {
    process.env = {
      ...originalEnv,
      ALLOWED_ORIGINS: 'http://localhost:3000',
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'test-key',
    };
    delete process.env.JWT_SECRETS;

    const app = Fastify({ logger: false });
    await expect(app.register(envValidationPlugin)).rejects.toThrow('JWT_SECRETS is required');
    await app.close();
  });

  it('should fail if JWT_SECRETS is too short', async () => {
    process.env = {
      ...originalEnv,
      JWT_SECRETS: 'short',
      ALLOWED_ORIGINS: 'http://localhost:3000',
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'test-key',
    };

    const app = Fastify({ logger: false });
    await expect(app.register(envValidationPlugin)).rejects.toThrow(
      'Each JWT secret must be at least 32 characters'
    );
    await app.close();
  });

  it('should fail if ALLOWED_ORIGINS is missing', async () => {
    process.env = {
      ...originalEnv,
      JWT_SECRETS: 'a'.repeat(32),
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'test-key',
    };
    delete process.env.ALLOWED_ORIGINS;

    const app = Fastify({ logger: false });
    await expect(app.register(envValidationPlugin)).rejects.toThrow(
      'ALLOWED_ORIGINS is required'
    );
    await app.close();
  });

  it('should fail if VITE_SUPABASE_URL is not a valid URL', async () => {
    process.env = {
      ...originalEnv,
      JWT_SECRETS: 'a'.repeat(32),
      ALLOWED_ORIGINS: 'http://localhost:3000',
      VITE_SUPABASE_URL: 'not-a-url',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'test-key',
    };

    const app = Fastify({ logger: false });
    await expect(app.register(envValidationPlugin)).rejects.toThrow();
    await app.close();
  });

  it('should accept multiple JWT secrets separated by commas', async () => {
    process.env = {
      ...originalEnv,
      JWT_SECRETS: `${'a'.repeat(32)},${'b'.repeat(32)},${'c'.repeat(32)}`,
      ALLOWED_ORIGINS: 'http://localhost:3000',
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'test-key',
    };

    const app = Fastify({ logger: false });
    await expect(app.register(envValidationPlugin)).resolves.not.toThrow();
    await app.close();
  });

  it('should accept optional environment variables', async () => {
    process.env = {
      ...originalEnv,
      JWT_SECRETS: 'a'.repeat(32),
      ALLOWED_ORIGINS: 'http://localhost:3000',
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'test-key',
      VITE_SENTRY_DSN: 'https://test@sentry.io/123',
      RATE_LIMIT_MAX: '100',
      RATE_LIMIT_WINDOW: '900000',
    };

    const app = Fastify({ logger: false });
    await expect(app.register(envValidationPlugin)).resolves.not.toThrow();
    await app.close();
  });
});

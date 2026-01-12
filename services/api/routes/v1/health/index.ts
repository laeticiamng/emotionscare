import { FastifyPluginAsync } from 'fastify';
import { performance } from 'node:perf_hooks';

/**
 * Health Check Routes
 *
 * Endpoints:
 * - GET /v1/health  - Basic health check
 * - GET /v1/healthz - Detailed health check with dependencies
 */

export const healthRoutes: FastifyPluginAsync = async app => {
  // Basic health check
  app.get('/', async (req, reply) => {
    return {
      ok: true,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
    };
  });

  // Detailed health check
  app.get('/healthz', async (req, reply) => {
    const checks = {
      database: { ok: true, latency: 0, error: undefined as string | undefined },
      supabase: { ok: true, latency: 0, error: undefined as string | undefined },
    };

    const buildHeaders = () => {
      const supabaseAnonKey =
        process.env.HEALTH_SUPABASE_KEY ??
        process.env.SUPABASE_ANON_KEY ??
        process.env.VITE_SUPABASE_ANON_KEY ??
        '';
      if (!supabaseAnonKey) {
        return { Accept: 'application/json' } as Record<string, string>;
      }
      return {
        Accept: 'application/json',
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      } as Record<string, string>;
    };

    const getSupabaseUrl = () =>
      process.env.HEALTH_SUPABASE_URL ??
      process.env.SUPABASE_URL ??
      process.env.VITE_SUPABASE_URL ??
      '';

    const timedFetch = async (url: string, init: RequestInit = {}) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1500);
      try {
        return await fetch(url, { ...init, cache: 'no-store', signal: controller.signal });
      } finally {
        clearTimeout(timeout);
      }
    };

    const checkSupabase = async () => {
      const supabaseUrl = getSupabaseUrl();
      if (!supabaseUrl) {
        return { ok: false, latency: 0, error: 'not_configured' };
      }
      const headers = buildHeaders();
      const started = performance.now();
      try {
        const authUrl = new URL('/auth/v1/settings', supabaseUrl).toString();
        const response = await timedFetch(authUrl, { headers });
        const latency = Math.round(performance.now() - started);
        return { ok: response.ok, latency, error: response.ok ? undefined : `http_${response.status}` };
      } catch (error) {
        return {
          ok: false,
          latency: Math.round(performance.now() - started),
          error: error instanceof Error ? error.name : 'unknown_error',
        };
      }
    };

    const checkDatabase = async () => {
      const supabaseUrl = getSupabaseUrl();
      if (!supabaseUrl) {
        return { ok: false, latency: 0, error: 'not_configured' };
      }
      const headers = buildHeaders();
      const started = performance.now();
      try {
        const restUrl = new URL('/rest/v1/?select=1', supabaseUrl).toString();
        const response = await timedFetch(restUrl, { headers: { ...headers, Range: '0-0' } });
        const latency = Math.round(performance.now() - started);
        const ok = response.status < 500;
        return { ok, latency, error: ok ? undefined : `http_${response.status}` };
      } catch (error) {
        return {
          ok: false,
          latency: Math.round(performance.now() - started),
          error: error instanceof Error ? error.name : 'unknown_error',
        };
      }
    };

    checks.database = await checkDatabase();
    checks.supabase = await checkSupabase();

    const allHealthy = Object.values(checks).every(c => c.ok);

    if (!allHealthy) {
      reply.code(503);
    }

    return {
      ok: allHealthy,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      services: checks,
    };
  });
};

export default healthRoutes;

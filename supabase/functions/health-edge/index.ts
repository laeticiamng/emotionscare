import { serve } from 'https://deno.land/std@0.213.0/http/server.ts';
import { initSentry } from '../_shared/sentry.ts';

const sentry = initSentry();

const headers = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store, max-age=0',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST,OPTIONS',
};

serve((req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), {
      status: 405,
      headers,
    });
  }

  try {
    return new Response(
      JSON.stringify({ ok: true, ts: new Date().toISOString() }),
      { status: 200, headers },
    );
  } catch (error) {
    try {
      sentry.captureException?.(error);
    } catch {
      // ignore capture failure
    }
    return new Response(JSON.stringify({ ok: false }), { status: 500, headers });
  }
});

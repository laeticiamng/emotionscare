import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const baseHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'authorization, x-client-info, apikey, content-type',
  'access-control-allow-methods': 'POST,OPTIONS',
};

serve((req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: baseHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
      status: 405,
      headers: baseHeaders,
    });
  }

  return new Response(
    JSON.stringify({ ok: true, ts: new Date().toISOString() }),
    {
      status: 200,
      headers: baseHeaders,
    },
  );
});

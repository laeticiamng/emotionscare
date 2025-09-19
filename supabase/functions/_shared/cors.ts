const allowedOrigins = (Deno.env.get('CORS_ORIGINS') ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

export interface CorsResult {
  allowed: boolean;
  headers: Record<string, string>;
}

export function resolveCors(req: Request): CorsResult {
  const origin = req.headers.get('origin') ?? '';
  const allowed = origin.length > 0 && allowedOrigins.includes(origin);
  const headers: Record<string, string> = {
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Allow-Origin': allowed ? origin : 'null',
  };
  return { allowed, headers };
}

export function appendCorsHeaders(response: Response, cors: CorsResult): Response {
  const result = response;
  for (const [key, value] of Object.entries(cors.headers)) {
    result.headers.set(key, value);
  }
  return result;
}

export function preflightResponse(cors: CorsResult): Response {
  return new Response(null, { status: 204, headers: cors.headers });
}

export function rejectCors(cors: CorsResult): Response {
  return appendCorsHeaders(new Response(JSON.stringify({ error: 'origin_not_allowed' }), {
    status: 403,
    headers: { 'Content-Type': 'application/json' },
  }), cors);
}

export function mergeHeaders(base: Record<string, string>, extras: Record<string, string>): Record<string, string> {
  return { ...base, ...extras };
}

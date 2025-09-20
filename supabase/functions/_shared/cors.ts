const normalizeOrigins = (value: string | undefined): string[] =>
  (value ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

const allowedOrigins = new Set<string>(normalizeOrigins(Deno.env.get('ALLOWED_ORIGINS')));

export interface CorsResult {
  allowed: boolean;
  headers: Record<string, string>;
}

export function cors(req: Request): CorsResult {
  const origin = req.headers.get('origin') ?? '';
  const allowed = origin.length > 0 && allowedOrigins.has(origin);
  const headers: Record<string, string> = {
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, content-type',
  };
  if (allowed) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return { allowed, headers };
}

export function resolveCors(req: Request): CorsResult {
  return cors(req);
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
  const headers = { ...cors.headers };
  if (!cors.allowed) {
    delete headers['Access-Control-Allow-Origin'];
  }
  return new Response(JSON.stringify({ error: 'origin_not_allowed' }), {
    status: 403,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

export function mergeHeaders(base: Record<string, string>, extras: Record<string, string>): Record<string, string> {
  return { ...base, ...extras };
}

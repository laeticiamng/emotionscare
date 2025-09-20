import { authorizeRole } from './auth.ts';
import { hash } from './hash_user.ts';

const DEFAULT_CACHE_CONTROL = 'private, max-age=60, must-revalidate';
const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex',
};

export function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function applySecurityHeaders(
  response: Response,
  options?: { cacheControl?: string; extra?: Record<string, string> },
): Response {
  const cacheControl = options?.cacheControl ?? DEFAULT_CACHE_CONTROL;
  if (cacheControl) {
    response.headers.set('Cache-Control', cacheControl);
  }

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    if (!response.headers.has(key)) {
      response.headers.set(key, value);
    }
  }

  if (options?.extra) {
    for (const [key, value] of Object.entries(options.extra)) {
      response.headers.set(key, value);
    }
  }

  return response;
}

export function getUserHash(token?: string): string {
  return hash(token ?? '');
}

export async function requireRole(req: Request, role: string) {
  const { user, status } = await authorizeRole(req, [role]);
  if (!user) {
    throw json(status, { error: 'forbidden' });
  }
}

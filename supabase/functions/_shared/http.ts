import { authorizeRole } from './auth.ts';
import { hash } from './hash_user.ts';

export function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
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

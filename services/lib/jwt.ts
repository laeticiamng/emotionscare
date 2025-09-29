import { SignJWT, jwtVerify, JWTPayload } from 'jose';

export type Role = 'b2c' | 'b2b_user' | 'b2b_admin';

export interface TokenPayload extends JWTPayload {
  sub: string;
  role: Role;
  aud: string;
}

function getSecrets(): Uint8Array[] {
  const secrets = process.env.JWT_SECRETS || '';
  return secrets.split(',').filter(Boolean).map(s => new TextEncoder().encode(s));
}

export async function signJwt(
  { sub, role, aud }: { sub: string; role: Role; aud: string },
  { expiresIn = '1h' }: { expiresIn?: string | number } = {}
) {
  const secret = getSecrets()[0];
  if (!secret) throw new Error('JWT_SECRETS not configured');
  return new SignJWT({ role, aud })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(sub)
    .setAudience(aud)
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyJwt(token: string): Promise<TokenPayload> {
  const secrets = getSecrets();
  if (secrets.length === 0) throw new Error('JWT_SECRETS not configured');
  let lastErr: unknown;
  for (const secret of secrets) {
    try {
      const { payload } = await jwtVerify(token, secret);
      const { sub, role, aud } = payload as TokenPayload;
      if (!sub || !role || !aud) throw new Error('invalid claims');
      return { sub, role, aud, exp: payload.exp } as TokenPayload;
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr ?? new Error('invalid token');
}

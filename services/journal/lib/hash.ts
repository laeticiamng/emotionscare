import { createHash } from 'crypto';

const PEPPER = process.env.HASH_PEPPER;

export function hash(input: string): string {
  if (!PEPPER) throw new Error('HASH_PEPPER not set');
  return createHash('sha256').update(input + PEPPER).digest('hex');
}

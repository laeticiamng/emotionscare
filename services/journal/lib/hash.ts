import { createHash } from 'crypto';

const PEPPER = 'static-pepper';

export function hash(input: string): string {
  return createHash('sha256').update(input + PEPPER).digest('hex');
}

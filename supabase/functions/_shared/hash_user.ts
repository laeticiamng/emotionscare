
import { createHash } from 'https://deno.land/std@0.168.0/crypto/mod.ts';

export function hash(value: string): string {
  const h = createHash('sha256');
  h.update(value);
  return h.toString();
}

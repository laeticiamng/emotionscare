
import { createHash } from 'https://deno.land/std@0.190.0/hash/mod.ts';

export function hash(value: string): string {
  const h = createHash('sha256');
  h.update(value);
  return h.toString();
}

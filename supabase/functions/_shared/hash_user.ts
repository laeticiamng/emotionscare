const IS_NODE_RUNTIME = typeof process !== 'undefined' && Boolean(process.versions?.node);
const REMOTE_SPECIFIER = 'https://deno.land/std@0.168.0/crypto/mod.ts';

let createHashFn: (algorithm: string) => { update: (data: string | ArrayBufferLike) => void; toString: () => string };

if (IS_NODE_RUNTIME) {
  const nodeCrypto = await import('node:crypto');
  createHashFn = (algorithm: string) => {
    const hash = nodeCrypto.createHash(algorithm);
    return {
      update: (data: string | ArrayBufferLike) => {
        hash.update(data);
      },
      toString: () => hash.digest('hex'),
    };
  };
} else {
  const { createHash } = await import(/* @vite-ignore */ REMOTE_SPECIFIER);
  createHashFn = (algorithm: string) => {
    const hash = createHash(algorithm);
    return {
      update: (data: string | ArrayBufferLike) => {
        hash.update(data);
      },
      toString: () => hash.toString(),
    };
  };
}

export function hash(value: string): string {
  const h = createHashFn('sha256');
  h.update(value);
  return h.toString();
}

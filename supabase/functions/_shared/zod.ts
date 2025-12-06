const IS_NODE_RUNTIME = typeof process !== 'undefined' && Boolean(process.versions?.node);
const REMOTE_SPECIFIER = 'https://deno.land/x/zod@v3.22.4/mod.ts';

const modulePromise = IS_NODE_RUNTIME
  ? import('zod')
  : import(/* @vite-ignore */ REMOTE_SPECIFIER);

const mod = await modulePromise;
export const z = (mod as typeof import('zod')).z;

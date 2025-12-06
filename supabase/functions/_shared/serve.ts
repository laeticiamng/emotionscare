const IS_NODE_RUNTIME = typeof process !== 'undefined' && Boolean(process.versions?.node);
const REMOTE_SPECIFIER = 'https://deno.land/std@0.168.0/http/server.ts';

if (IS_NODE_RUNTIME) {
  throw new Error('serve is not available in Node runtime; mock ../_shared/serve.ts in tests.');
}

const mod = await import(/* @vite-ignore */ REMOTE_SPECIFIER);
type ServeFn = (handler: (req: Request) => Promise<Response>) => void | Promise<void>;
export const serve = (mod as { serve: ServeFn }).serve;

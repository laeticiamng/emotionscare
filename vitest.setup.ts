import { fetch, Headers, Request, Response } from 'undici';
import { loadEnv } from 'vite';

if (!globalThis.fetch) {
  // Polyfill fetch and related classes for headless environments
  // @ts-ignore
  globalThis.fetch = fetch as any;
  // @ts-ignore
  globalThis.Headers = Headers as any;
  // @ts-ignore
  globalThis.Request = Request as any;
  // @ts-ignore
  globalThis.Response = Response as any;
}

// Charge les variables d'environnement de `.env.test`
const env = loadEnv('test', process.cwd(), '');
(globalThis as any).importMetaEnv = env;
(globalThis as any).process = {
  ...process,
  env: { ...process.env, ...env },
};


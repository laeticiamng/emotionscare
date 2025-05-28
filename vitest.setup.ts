import { fetch, Headers, Request, Response } from 'undici';

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


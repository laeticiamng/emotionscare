import { vi } from 'vitest';

export type FetchOptions = {
  status?: number;
  json?: Record<string, unknown>;
  text?: string;
  headers?: Record<string, string>;
};

export function mockFetchResponse(
  data: FetchOptions | ((url: string) => FetchOptions)
) {
  global.fetch = vi.fn((input: RequestInfo) => {
    const opt = typeof data === 'function' ? data(String(input)) : data;
    const {
      status = 200,
      json = {},
      text,
      headers = { 'Content-Type': 'application/json' },
    } = opt ?? {};
    return Promise.resolve(
      new Response(text ?? JSON.stringify(json), { status, headers })
    );
  }) as unknown as typeof fetch;
}

if (!global.fetch || !global.Response) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Object.assign(global, require('undici'));
}
if (!global.fetch) {
  mockFetchResponse({});
}

// Patch JSDOM globals
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

window.matchMedia = () => ({
  matches: false,
  addListener() {},
  removeListener() {},
}) as any;

// Provide JSDOM constructor for libs expecting it
import { JSDOM } from 'jsdom';
(globalThis as any).JSDOM = JSDOM;

// Global network mocks
vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => ({}) })));
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({ from: () => ({ select: () => ({}) }) })
}));
vi.mock('@vercel/analytics', () => ({ track: vi.fn() }));

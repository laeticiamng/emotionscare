import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const envStore = new Map<string, string | undefined>();
const getEnv = vi.fn((key: string) => envStore.get(key));

vi.mock('../../supabase/functions/_shared/serve.ts', () => ({
  serve: vi.fn(),
}));

let testExports: typeof import('../../supabase/functions/assess-start/index.ts').__test__;

beforeAll(async () => {
  vi.stubGlobal('Deno', { env: { get: getEnv } });
  envStore.set('SUPABASE_URL', 'https://edge.supabase.local');
  envStore.set('SUPABASE_SERVICE_ROLE_KEY', 'service-role');
  envStore.set('SUPABASE_ANON_KEY', 'anon-key');
  const module = await import('../../supabase/functions/assess-start/index.ts');
  testExports = module.__test__;
});

afterAll(() => {
  vi.unstubAllGlobals();
});

beforeEach(() => {
  envStore.clear();
  envStore.set('SUPABASE_URL', 'https://edge.supabase.local');
  envStore.set('SUPABASE_SERVICE_ROLE_KEY', 'service-role');
  envStore.set('SUPABASE_ANON_KEY', 'anon-key');
  getEnv.mockClear();
});

describe('assessment feature flags', () => {
  it('enables instruments by default when flag is missing', () => {
    const enabled = testExports.isInstrumentEnabled('WHO5');
    expect(enabled).toBe(true);
  });

  it('disables instrument when environment flag is set to false-ish values', () => {
    envStore.set('FF_ASSESS_WHO5', 'false');
    expect(testExports.isInstrumentEnabled('WHO5')).toBe(false);

    envStore.set('FF_ASSESS_STAI6', '0');
    expect(testExports.isInstrumentEnabled('STAI6')).toBe(false);

    envStore.set('FF_ASSESS_SAM', 'OFF');
    expect(testExports.isInstrumentEnabled('SAM')).toBe(false);
  });

  it('treats any other value as enabled', () => {
    envStore.set('FF_ASSESS_SUDS', 'true');
    expect(testExports.isInstrumentEnabled('SUDS')).toBe(true);

    envStore.set('FF_ASSESS_WHO5', '1');
    expect(testExports.isInstrumentEnabled('WHO5')).toBe(true);
  });
});

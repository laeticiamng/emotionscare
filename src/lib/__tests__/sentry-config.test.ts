import type { Event as SentryEvent } from '@sentry/types';
import { describe, expect, it, vi } from 'vitest';

const setNavigatorDnt = (value?: string) => {
  Object.defineProperty(window.navigator, 'doNotTrack', {
    configurable: true,
    get: () => value,
  });
};

const mockSentry = (overrides: Partial<Record<string, unknown>> = {}) => {
  const scope = {
    setTag: vi.fn(),
    setContext: vi.fn(),
    setExtra: vi.fn(),
    getTransaction: vi.fn(),
  };

  const hubScope = {
    getTransaction: vi.fn(),
    setExtra: vi.fn(),
    setTag: vi.fn(),
  };

  const init = vi.fn();
  const configureScope = vi.fn((callback: (scope: typeof scope) => void) => {
    callback(scope);
  });
  const addGlobalEventProcessor = vi.fn();
  const withScope = vi.fn((callback: (scope: typeof scope) => void) => {
    callback(scope);
  });

  vi.doMock('@sentry/react', () => ({
    init,
    configureScope,
    addGlobalEventProcessor,
    withScope,
    getCurrentHub: () => ({
      getClient: () => ({}),
      getScope: () => hubScope,
    }),
    BrowserTracing: class {},
    Replay: class {},
  }));

  vi.doMock('@/lib/env', () => ({
    BUILD_INFO: { version: '1.0.0', commitSha: 'commit', release: 'rel' },
    SENTRY_CONFIG: {
      dsn: 'https://example.ingest.sentry.io/123',
      environment: 'production',
      tracesSampleRate: 0.5,
      replaysSessionSampleRate: 0.25,
      replaysOnErrorSampleRate: 0.5,
      ...overrides,
    },
  }));

  return { init, configureScope, addGlobalEventProcessor, withScope, scope, hubScope };
};

describe('sentry-config privacy guardrails', () => {
  it('scrubs personally identifiable data before sending events', async () => {
    vi.resetModules();
    const mocks = mockSentry();
    const { SENTRY_PRIVACY_GUARDS } = await import('@/lib/sentry-config');

    const event = {
      event_id: 'abc123',
      type: 'error',
      request: {
        url: 'https://app.emotionscare.com/app/profile?token=secret-token&email=user@example.com',
        headers: {
          authorization: 'Bearer super-secret-token',
          referer: 'https://app.emotionscare.com/app/dashboard?tab=focus',
          'user-agent': 'Mozilla/5.0 (Macintosh)',
          'accept-language': 'fr-FR,fr;q=0.9',
        },
        data: {
          email: 'user@example.com',
          supabase_service_role_key: 'should-never-leak',
        },
      },
      user: {
        id: 'user-123',
        email: 'user@example.com',
      },
      breadcrumbs: [
        {
          category: 'http',
          data: {
            url: 'https://api.emotionscare.com/private?token=12345',
            request_body: new URLSearchParams('token=12345&session=abcd'),
          },
          message: 'fetch private data with token=12345',
        },
        {
          category: 'console',
          message: 'interface ready',
        },
      ],
      extra: {
        raw: 'user@example.com sent a message',
        nested: {
          supabase_service_role_key: 'super-secret',
          comments: ['First entry with token abc123', 'Another with email admin@example.com'],
        },
        params: new URLSearchParams('token=secret&safe=value'),
      },
      contexts: {
        session: {
          token: 'jwt-token',
          phone: '+33123456789',
        },
      },
      tags: {
        release: 'test-build',
      },
    } as unknown as SentryEvent;

    const sanitized = SENTRY_PRIVACY_GUARDS.sanitizeEvent(structuredClone(event));
    expect(sanitized).not.toBeNull();
    const sanitizedEvent = sanitized as SentryEvent;

    expect(sanitizedEvent.user).toBeUndefined();
    expect(sanitizedEvent.request?.url).toBe('https://app.emotionscare.com/app/profile');
    expect(sanitizedEvent.request?.headers).toEqual({
      referer: 'https://app.emotionscare.com/app/dashboard?tab=focus',
      'user-agent': 'Mozilla/5.0 (Macintosh)',
      'accept-language': 'fr-FR,fr;q=0.9',
    });
    expect(sanitizedEvent.request?.data).toBe('[scrubbed]');

    expect(sanitizedEvent.breadcrumbs).toHaveLength(1);
    expect(sanitizedEvent.breadcrumbs?.[0]?.category).toBe('console');

    const extra = sanitizedEvent.extra as Record<string, unknown> | undefined;
    expect(extra).toBeDefined();
    expect(extra?.raw).toBe('[scrubbed]');
    expect(extra?.nested).toEqual({
      supabase_service_role_key: '[redacted]',
      comments: '[scrubbed]',
    });
    expect(extra?.params).toEqual({});

    const contexts = sanitizedEvent.contexts as Record<string, unknown> | undefined;
    expect(contexts?.session).toEqual({
      token: '[redacted]',
      phone: '[redacted]',
    });

    expect(sanitizedEvent.tags).toMatchObject({
      release: 'test-build',
      pii_scrubbed: 'true',
      dnt: 'false',
      telemetry_disabled: 'false',
    });

    // ensure original event was not mutated
    expect(event.request?.headers?.authorization).toBe('Bearer super-secret-token');
    expect(event.extra?.params instanceof URLSearchParams).toBe(true);

    // ensure mocks not triggered by sanitize-only test
    expect(mocks.init).not.toHaveBeenCalled();
  });

  it('disables telemetry and tags scope when doNotTrack is enabled', async () => {
    vi.resetModules();
    window.localStorage.clear();
    const mocks = mockSentry();
    const { setConsentPreferences, resetStoredConsent } = await import('@/lib/consent');
    setConsentPreferences({ analytics: true });
    const { initializeSentry } = await import('@/lib/sentry-config');

    setNavigatorDnt('1');
    initializeSentry();

    expect(mocks.init).toHaveBeenCalledTimes(1);
    const config = mocks.init.mock.calls[0][0];
    expect(config.tracesSampleRate).toBe(0);
    expect(config.replaysSessionSampleRate).toBe(0);
    expect(config.replaysOnErrorSampleRate).toBe(0);
    expect(config.autoSessionTracking).toBe(false);
    expect(config.sendDefaultPii).toBe(false);
    expect(config.enableTracing).toBe(false);

    expect(mocks.scope.setTag).toHaveBeenCalledWith('dnt', 'true');
    expect(mocks.scope.setTag).toHaveBeenCalledWith('telemetry_disabled', 'true');

    expect(document.documentElement.getAttribute('data-dnt')).toBe('true');
    expect((window as Record<string, unknown>).__EMOTIONSCARE_DNT__).toBe(true);

    // reset DNT flag for other tests
    setNavigatorDnt(undefined);
    delete (window as Record<string, unknown>).__EMOTIONSCARE_DNT__;
    resetStoredConsent();
  });
});

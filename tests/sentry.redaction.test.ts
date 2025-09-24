import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const currentClientRef: { value: unknown } = { value: null };

vi.mock('@sentry/react', () => {
  const init = vi.fn((options: unknown) => {
    currentClientRef.value = { options };
  });

  const getCurrentHub = vi.fn(() => ({
    getClient: vi.fn(() => currentClientRef.value),
  }));

  return {
    init,
    getCurrentHub,
  };
});

const loadSentryModule = async () => import('@/lib/obs/sentry.web');

const stubBaseEnv = () => {
  vi.stubEnv('VITE_SENTRY_DSN', 'https://example.ingest.sentry.io/123');
  vi.stubEnv('VITE_SENTRY_ENVIRONMENT', 'test');
  vi.stubEnv('VITE_SENTRY_RELEASE', 'release@1.0.0');
  vi.stubEnv('VITE_SENTRY_TRACES_SAMPLE_RATE', '0.5');
  vi.stubEnv('VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE', '0.1');
  vi.stubEnv('VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE', '0.2');
};

describe('ensureSentryClient', () => {
  beforeEach(() => {
    currentClientRef.value = null;
    vi.resetModules();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('redacts sensitive data via beforeSend and beforeBreadcrumb', async () => {
    stubBaseEnv();
    const { Sentry } = await loadSentryModule();

    const initMock = Sentry.init as Mock;
    expect(initMock).toHaveBeenCalled();

    const initOptions = initMock.mock.calls.at(-1)?.[0] as {
      beforeSend: (event: unknown) => unknown;
      beforeBreadcrumb: (breadcrumb: unknown) => unknown;
    };

    expect(initOptions).toBeDefined();

    const redactedEvent = initOptions.beforeSend({
      message: 'User bearer Bearer super-secret-token',
      request: {
        headers: {
          authorization: 'Bearer super-secret-token',
          'x-forwarded-for': '192.168.0.1',
        },
        data: {
          token: 'abcdef',
          nested: {
            password: 'secret-password',
            safe: 'value',
          },
        },
      },
    });

    expect(redactedEvent).toMatchInlineSnapshot(`
      {
        "message": "User bearer Bearer [REDACTED]",
        "request": {
          "data": {
            "nested": {
              "password": "[REDACTED]",
              "safe": "value",
            },
            "token": "[REDACTED]",
          },
          "headers": {
            "authorization": "[REDACTED]",
            "x-forwarded-for": "192.168.0.1",
          },
        },
      }
    `);

    const redactedBreadcrumb = initOptions.beforeBreadcrumb({
      category: 'ui.click',
      message: 'Clicked with Bearer top-secret',
      data: {
        authorization: 'Bearer top-secret',
        nested: {
          email: 'user@example.com',
          other: 'value',
        },
      },
    });

    expect(redactedBreadcrumb).toMatchInlineSnapshot(`
      {
        "category": "ui.click",
        "data": {
          "authorization": "[REDACTED]",
          "nested": {
            "email": "[REDACTED]",
            "other": "value",
          },
        },
        "message": "Clicked with Bearer [REDACTED]",
      }
    `);
  });

  it('is idempotent', async () => {
    stubBaseEnv();
    const { ensureSentryClient, Sentry } = await loadSentryModule();

    const initMock = Sentry.init as Mock;
    initMock.mockClear();

    ensureSentryClient();
    ensureSentryClient();

    expect(initMock).not.toHaveBeenCalled();
  });
});

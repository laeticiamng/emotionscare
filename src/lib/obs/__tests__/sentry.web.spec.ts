import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const initMock = vi.fn();
const setTagMock = vi.fn();
const configureScopeMock = vi.fn((callback: (scope: { setTag: typeof setTagMock }) => void) => {
  callback({ setTag: setTagMock });
});
const getClientMock = vi.fn();

vi.mock('@sentry/react', () => ({
  init: initMock,
  configureScope: configureScopeMock,
  getCurrentHub: vi.fn(() => ({
    getClient: getClientMock,
  })),
}));

describe('sentry.web', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.stubEnv('VITE_SENTRY_DSN', 'https://example.com/1');
    vi.stubEnv('VITE_SENTRY_ENVIRONMENT', 'staging');
    vi.stubEnv('VITE_SENTRY_RELEASE', '1.0.0');
    getClientMock.mockReturnValue(undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('initializes Sentry with release and environment tags', async () => {
    await import('../sentry.web');

    expect(initMock).toHaveBeenCalledTimes(1);
    expect(initMock).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: 'staging',
        release: '1.0.0',
      }),
    );
    expect(setTagMock).toHaveBeenCalledWith('release', '1.0.0');
    expect(setTagMock).toHaveBeenCalledWith('environment', 'staging');
  });

  it('redacts sensitive information before sending events and breadcrumbs', async () => {
    await import('../sentry.web');

    const options = initMock.mock.calls[0][0] as {
      beforeSend?: (event: Record<string, unknown>) => Record<string, unknown>;
      beforeBreadcrumb?: (breadcrumb: Record<string, unknown>) => Record<string, unknown>;
    };

    const event = {
      user: { email: 'user@example.com' },
      request: { headers: { authorization: 'Bearer secret-token' } },
      tags: { custom: 'value' },
    };
    const sanitizedEvent = options.beforeSend?.(event) as typeof event;

    expect(sanitizedEvent.user?.email).toBe('[REDACTED]');
    expect(sanitizedEvent.request?.headers?.authorization).toBe('[REDACTED]');
    expect(sanitizedEvent.tags).toEqual(
      expect.objectContaining({
        custom: 'value',
        release: '1.0.0',
        environment: 'staging',
      }),
    );

    const breadcrumb = { message: 'Bearer abc.def-ghi' };
    const sanitizedBreadcrumb = options.beforeBreadcrumb?.(breadcrumb) as typeof breadcrumb;

    expect(sanitizedBreadcrumb.message).toBe('Bearer [REDACTED]');
  });
});

import { describe, expect, it, beforeEach, vi } from 'vitest';

const addBreadcrumbMock = vi.fn();
const initMock = vi.fn();
const getClientMock = vi.fn();

vi.mock('@sentry/react', () => ({
  __esModule: true,
  addBreadcrumb: addBreadcrumbMock,
  init: initMock,
  getCurrentHub: () => ({ getClient: getClientMock }),
}));

describe('addBreadcrumb helper', () => {
  beforeEach(() => {
    vi.resetModules();
    addBreadcrumbMock.mockReset();
    initMock.mockReset();
    getClientMock.mockReset();
    process.env.VITE_SENTRY_DSN = '';
  });

  it('redacts sensitive breadcrumb data before forwarding to Sentry', async () => {
    getClientMock.mockReturnValue({});
    const { addBreadcrumb } = await import('../breadcrumb');

    addBreadcrumb('ui.click', {
      message: 'nyvee:start',
      data: {
        email: 'user@example.com',
        safe: 'ok',
        nested: { token: 'Bearer abc123' },
      },
    });

    expect(addBreadcrumbMock).toHaveBeenCalledTimes(1);
    const payload = addBreadcrumbMock.mock.calls[0]?.[0];
    expect(payload).toMatchObject({
      category: 'ui.click',
      level: 'info',
      message: 'nyvee:start',
      data: {
        email: '[REDACTED]',
        safe: 'ok',
        nested: { token: '[REDACTED]' },
      },
    });
    expect(typeof payload?.timestamp).toBe('number');
  });

  it('skips breadcrumb when no Sentry client is available', async () => {
    getClientMock.mockReturnValue(null);
    const { addBreadcrumb } = await import('../breadcrumb');

    addBreadcrumb('ui.click', { message: 'noop' });
    expect(addBreadcrumbMock).not.toHaveBeenCalled();
  });
});

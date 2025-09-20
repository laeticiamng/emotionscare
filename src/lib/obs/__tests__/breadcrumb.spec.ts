import { beforeEach, describe, expect, it, vi } from 'vitest';

const sentryMocks = vi.hoisted(() => ({
  addBreadcrumb: vi.fn(),
  getClient: vi.fn(),
}));

vi.mock('@sentry/nextjs', () => ({
  addBreadcrumb: sentryMocks.addBreadcrumb,
  getCurrentHub: () => ({ getClient: sentryMocks.getClient }),
}));

import { addBreadcrumb } from '../breadcrumb';

describe('addBreadcrumb', () => {
  beforeEach(() => {
    sentryMocks.addBreadcrumb.mockReset();
    sentryMocks.getClient.mockReset();
    sentryMocks.getClient.mockReturnValue({});
  });

  it('adds a sanitized breadcrumb when a client is available', () => {
    addBreadcrumb('ui.click', { email: 'user@example.com', url: 'https://app.example.com/path?token=abc123' }, 'cta');

    expect(sentryMocks.addBreadcrumb).toHaveBeenCalledTimes(1);
    const crumb = sentryMocks.addBreadcrumb.mock.calls[0][0];
    expect(crumb.category).toBe('ui.click');
    expect(crumb.message).toBe('cta');
    expect(crumb.level).toBe('info');
    expect(crumb.data).toEqual({ email: '[email]', url: 'https://app.example.com/path' });
  });

  it('skips breadcrumb creation when no client is registered', () => {
    sentryMocks.getClient.mockReturnValueOnce(null);

    addBreadcrumb('ui.click');

    expect(sentryMocks.addBreadcrumb).not.toHaveBeenCalled();
  });
});

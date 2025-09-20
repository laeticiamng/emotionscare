import { beforeEach, describe, expect, it } from 'vitest';

import {
  __resetSentryMocks,
  addBreadcrumb as sentryAddBreadcrumb,
  getClient as sentryGetClient,
} from '@sentry/nextjs';

import { addBreadcrumb } from '../breadcrumb';

describe('addBreadcrumb', () => {
  beforeEach(() => {
    __resetSentryMocks();
  });

  it('adds a sanitized breadcrumb when a client is available', () => {
    addBreadcrumb('ui.click', { email: 'user@example.com', url: 'https://app.example.com/path?token=abc123' }, 'cta');

    expect(sentryAddBreadcrumb).toHaveBeenCalledTimes(1);
    const crumb = sentryAddBreadcrumb.mock.calls[0][0];
    expect(crumb.category).toBe('ui.click');
    expect(crumb.message).toBe('cta');
    expect(crumb.level).toBe('info');
    expect(crumb.data).toEqual({ email: '[email]', url: 'https://app.example.com/path' });
  });

  it('skips breadcrumb creation when no client is registered', () => {
    sentryGetClient.mockReturnValueOnce(null);

    addBreadcrumb('ui.click');

    expect(sentryAddBreadcrumb).not.toHaveBeenCalled();
  });
});

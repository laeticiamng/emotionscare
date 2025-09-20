import { vi } from 'vitest';

export const addBreadcrumb = vi.fn();
export const getClient = vi.fn(() => ({}));
export const getCurrentHub = () => ({ getClient });

export const __resetSentryMocks = (): void => {
  addBreadcrumb.mockReset();
  getClient.mockReset();
  getClient.mockReturnValue({});
};

__resetSentryMocks();

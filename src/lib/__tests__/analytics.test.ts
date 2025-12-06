// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { trackEvent, trackPageView, trackModuleUsage, trackError } from '../analytics';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
    })),
  },
}));

describe('Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as any).va;
  });

  it('trackEvent should call Vercel Analytics when available', () => {
    const mockVa = { track: vi.fn() };
    (window as any).va = mockVa;

    trackEvent('test_event', { prop: 'value' });

    expect(mockVa.track).toHaveBeenCalledWith('test_event', { prop: 'value' });
  });

  it('trackPageView should track page view', () => {
    const mockVa = { track: vi.fn() };
    (window as any).va = mockVa;

    trackPageView('/app/modules');

    expect(mockVa.track).toHaveBeenCalledWith('page_view', { path: '/app/modules' });
  });

  it('trackModuleUsage should track module usage', () => {
    const mockVa = { track: vi.fn() };
    (window as any).va = mockVa;

    trackModuleUsage('music', 120);

    expect(mockVa.track).toHaveBeenCalledWith('module_usage', {
      module: 'music',
      duration: 120,
    });
  });

  it('trackError should track errors', () => {
    const mockVa = { track: vi.fn() };
    (window as any).va = mockVa;

    const error = new Error('Test error');
    trackError(error, { context: 'test' });

    expect(mockVa.track).toHaveBeenCalledWith('error', expect.objectContaining({
      message: 'Test error',
      context: 'test',
    }));
  });
});

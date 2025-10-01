// @ts-nocheck

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SecureAnalytics } from '@/utils/secureAnalytics';
import { GlobalInterceptor } from '@/utils/globalInterceptor';
import { mockResponse } from './utils';

vi.mock('@/utils/globalInterceptor', async () => {
  const original = await vi.importActual<any>('@/utils/globalInterceptor');
  return {
    ...original,
    default: {
      ...original.default,
      secureFetch: vi.fn().mockResolvedValue(mockResponse())
    }
  };
});
vi.setConfig({ testTimeout: 5000 });

describe('SecureAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('trackEvent', () => {
    it('should track event successfully', async () => {
      const response = mockResponse({ ok: true, status: 200 });
      vi.mocked(GlobalInterceptor.secureFetch).mockResolvedValue(response as any);

      await SecureAnalytics.trackEvent({
        event: 'test_event',
        data: { key: 'value' },
        userId: 'user123'
      });

      expect(GlobalInterceptor.secureFetch).toHaveBeenCalledWith(
        expect.stringContaining('/analytics/event'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('test_event')
        })
      );
    });

    it('should handle timeout gracefully', async () => {
      vi.mocked(GlobalInterceptor.secureFetch).mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 10000))
      );

      const trackPromise = SecureAnalytics.trackEvent({
        event: 'slow_event'
      });

      // Avancer le temps pour déclencher le timeout
      vi.advanceTimersByTime(6000);

      await expect(trackPromise).resolves.toBeUndefined();
    });

    it('should mark service as offline after error', async () => {
      vi.mocked(GlobalInterceptor.secureFetch).mockResolvedValue(null);

      await SecureAnalytics.trackEvent({ event: 'test' });

      const status = SecureAnalytics.getStatus();
      expect(status.isOffline).toBe(true);
    });

    it('should skip tracking when offline', async () => {
      // Marquer comme offline d'abord
      vi.mocked(GlobalInterceptor.secureFetch).mockResolvedValue(null);
      await SecureAnalytics.trackEvent({ event: 'test1' });

      // Tenter un autre événement
      await SecureAnalytics.trackEvent({ event: 'test2' });

      // Seul le premier appel devrait avoir été fait
      expect(GlobalInterceptor.secureFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('trackPageView', () => {
    it('should track page view with correct format', async () => {
      vi.mocked(GlobalInterceptor.secureFetch).mockResolvedValue(
        mockResponse({ status: 200 }) as any
      );

      await SecureAnalytics.trackPageView('dashboard', 'user123');

      expect(GlobalInterceptor.secureFetch).toHaveBeenCalledWith(
        expect.stringContaining('/track'),
        expect.any(Object)
      );
    });
  });
});

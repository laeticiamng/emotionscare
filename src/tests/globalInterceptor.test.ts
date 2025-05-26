
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GlobalInterceptor } from '@/utils/globalInterceptor';

// Mock du localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock de fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;
vi.setConfig({ testTimeout: 15000 });

describe('GlobalInterceptor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('secureFetch', () => {
    it('should make request with authorization header when token exists', async () => {
      const mockToken = 'mock-jwt-token';
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        access_token: mockToken
      }));

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ data: 'test' }), { status: 200 })
      );

      await GlobalInterceptor.secureFetch('/test', {});

      expect(mockFetch).toHaveBeenCalledWith('/test', {
        headers: {
          'Authorization': `Bearer ${mockToken}`,
          'Content-Type': 'application/json',
        }
      });
    });

    it('should handle 401 errors and clear session', async () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        access_token: 'expired-token'
      }));

      mockFetch
        .mockResolvedValueOnce(new Response(null, { status: 401 }))
        .mockResolvedValueOnce(new Response(null, { status: 401 }))
        .mockResolvedValueOnce(new Response(null, { status: 401 }));

      const resultPromise = GlobalInterceptor.secureFetch('/test', {});
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(result).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('sb-yaincoxihiqdksxgrsrk-auth-token');
    });

    it('should retry request on token refresh', async () => {
      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify({ access_token: 'old-token' }))
        .mockReturnValueOnce(JSON.stringify({ access_token: 'new-token' }));

      mockFetch
        .mockResolvedValueOnce({ ok: false, status: 401 })
        .mockResolvedValueOnce({ ok: true, status: 200 });

      const resultPromise = GlobalInterceptor.secureFetch('/test', {});
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toBeTruthy();
    });
  });

  describe('checkSessionStatus', () => {
    it('should return true when valid session exists', async () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        access_token: 'valid-token',
        expires_at: Date.now() + 3600000 // 1 hour from now
      }));

      const isValid = await GlobalInterceptor.checkSessionStatus();
      expect(isValid).toBe(true);
    });

    it('should return false when session is expired', async () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        access_token: 'expired-token',
        expires_at: Date.now() - 3600000 // 1 hour ago
      }));

      const isValid = await GlobalInterceptor.checkSessionStatus();
      expect(isValid).toBe(false);
    });
  });
});

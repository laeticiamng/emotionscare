
import { fastForwardTimers } from "@/tests/__mocks__/timers";
import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { GlobalInterceptor } from '@/utils/globalInterceptor';
import { mockResponse } from '@/tests/utils';

// Mock du localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// fetch sera mocké dans chaque test
vi.setConfig({ testTimeout: 15000 });

describe('GlobalInterceptor', () => {
  beforeAll(() => fastForwardTimers());
  afterAll(() => vi.useRealTimers());

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('secureFetch', () => {
    it('should make request with authorization header when token exists', async () => {
      const mockToken = 'mock-jwt-token';
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        access_token: mockToken
      }));

      global.fetch = vi.fn().mockResolvedValueOnce(
        mockResponse({ status: 200, json: { data: 'test' } })
      );

      await GlobalInterceptor.secureFetch('/test', {});

      expect(global.fetch).toHaveBeenCalledWith(
        '/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should handle 401 errors and clear session', async () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        access_token: 'expired-token'
      }));

      global.fetch = vi.fn().mockResolvedValue(
        mockResponse({ ok: false, status: 401, json: { message: 'unauthorized' } })
      );

      const result = await GlobalInterceptor.secureFetch('/test', {});

      expect(result).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('sb-yaincoxihiqdksxgrsrk-auth-token');
    });

    it('should retry request on token refresh', async () => {
      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify({ access_token: 'old-token' }))
        .mockReturnValueOnce(JSON.stringify({ access_token: 'new-token' }));

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce(
          mockResponse({ ok: false, status: 401, json: {} })
        )
        .mockResolvedValueOnce(mockResponse({ status: 200, json: {} }));

      const result = await GlobalInterceptor.secureFetch('/test', {});

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result).toBeTruthy();
    });
  });

  describe('checkSessionStatus', () => {
    it('should return true when valid session exists', async () => {
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({
          access_token: 'valid-token',
          expires_at: Math.floor((Date.now() + 3600000) / 1000),
        })
      );

      const isValid = await GlobalInterceptor.checkSessionStatus();
      expect(isValid).toBe(true);
    });

    it('should return false when session is expired', async () => {
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({
          access_token: 'expired-token',
          expires_at: Math.floor((Date.now() - 3600000) / 1000),
        })
      );

      const isValid = await GlobalInterceptor.checkSessionStatus();
      expect(isValid).toBe(false);
    });
  });
});

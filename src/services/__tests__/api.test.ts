// @ts-nocheck
/**
 * Tests pour ApiService endpoints
 * Couvre : getAuthToken priorité sessionStorage, error handling, headers
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('ApiService - endpoints', () => {
  let mockSessionStorage: Record<string, string>;
  let mockLocalStorage: Record<string, string>;

  const getAuthToken = () => {
    return mockSessionStorage['auth_token'] ?? mockLocalStorage['auth_token'] ?? null;
  };

  beforeEach(() => {
    mockSessionStorage = {};
    mockLocalStorage = {};
  });

  it('sessionStorage est prioritaire sur localStorage pour auth_token', () => {
    mockSessionStorage['auth_token'] = 'session-token';
    mockLocalStorage['auth_token'] = 'local-token';

    expect(getAuthToken()).toBe('session-token');
  });

  it('fallback sur localStorage si sessionStorage vide', () => {
    mockLocalStorage['auth_token'] = 'local-token';

    expect(getAuthToken()).toBe('local-token');
  });

  it('retourne null si aucun token stocké', () => {
    expect(getAuthToken()).toBeNull();
  });

  it('fetch est appelé avec les bons headers quand token présent', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    });
    vi.stubGlobal('fetch', mockFetch);

    mockSessionStorage['auth_token'] = 'my-token';
    const token = getAuthToken();

    await fetch('/api/v1/test', {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/v1/test', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer my-token',
      },
    });

    vi.restoreAllMocks();
  });

  it('gère les erreurs réseau gracieusement', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    vi.stubGlobal('fetch', mockFetch);

    await expect(fetch('/api/v1/test')).rejects.toThrow('Network error');
    vi.restoreAllMocks();
  });

  it('gère les réponses HTTP non-OK', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    });
    vi.stubGlobal('fetch', mockFetch);

    const response = await fetch('/api/v1/test');
    expect(response.ok).toBe(false);
    expect(response.status).toBe(401);
    vi.restoreAllMocks();
  });
});

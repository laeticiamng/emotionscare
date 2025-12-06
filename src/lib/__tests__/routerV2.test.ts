// @ts-nocheck
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { route } from '../routes';
import { ROUTES_BY_NAME } from '../routerV2/routes.config';
import { useRouteAllowed } from '../routerV2/guards';
import type { Guard } from '../routerV2/types';

const authState = {
  user: null as any,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  register: async () => {},
};

const userModeState = {
  userMode: null as any,
  setUserMode: () => {},
  isLoading: false,
};

const consentState = {
  status: 'accepted' as const,
  scope: 'clinical',
  wasRevoked: false,
  loading: false,
  accept: vi.fn(),
  revoke: vi.fn(),
  refresh: vi.fn(),
};

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => authState,
}));

vi.mock('@/contexts/UserModeContext', () => ({
  useUserMode: () => userModeState,
}));

vi.mock('@/features/clinical-optin/ConsentProvider', () => ({
  useConsent: () => consentState,
}));

describe('route helper', () => {
  it('resolves scan path from RouterV2 config', () => {
    expect(route('scan')).toBe(ROUTES_BY_NAME.get('scan')?.path);
  });

  it('resolves b2b selection path from RouterV2 config', () => {
    expect(route('b2b-selection')).toBe(ROUTES_BY_NAME.get('b2b-selection')?.path);
  });
});

describe('useRouteAllowed', () => {
  beforeEach(() => {
    authState.user = null;
    userModeState.userMode = null;
    consentState.status = 'accepted';
    consentState.wasRevoked = false;
  });

  const renderGuards = (guards: Guard[]) => renderHook(() => useRouteAllowed(guards));

  it('blocks unauthenticated users when auth guard is required', () => {
    const { result } = renderGuards([{ type: 'auth', required: true }]);
    expect(result.current.allowed).toBe(false);
    expect(result.current.reason).toBe('auth');
  });

  it('allows authenticated users with required role', () => {
    authState.user = {
      user_metadata: { role: 'manager' },
      app_metadata: {},
    };

    const { result } = renderGuards([
      { type: 'auth', required: true },
      { type: 'role', roles: ['manager'] },
    ]);

    expect(result.current.allowed).toBe(true);
    expect(result.current.reason).toBeNull();
  });

  it('blocks authenticated users without required role', () => {
    authState.user = {
      user_metadata: { role: 'user' },
      app_metadata: {},
    };

    const { result } = renderGuards([
      { type: 'auth', required: true },
      { type: 'role', roles: ['manager'] },
    ]);

    expect(result.current.allowed).toBe(false);
    expect(result.current.reason).toBe('role');
  });

  it('blocks access when clinical consent is missing', () => {
    consentState.status = 'none';

    const { result } = renderGuards([
      { type: 'consent', scope: 'clinical' },
    ]);

    expect(result.current.allowed).toBe(false);
    expect(result.current.reason).toBe('consent');
  });
});

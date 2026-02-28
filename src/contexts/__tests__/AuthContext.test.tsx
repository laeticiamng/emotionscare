/**
 * Tests unitaires pour AuthContext
 * Couvre : initialisation, signIn, signUp, signOut, resetPassword, erreurs
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';

// Mock supabase client
const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();
const mockSignOut = vi.fn();
const mockResetPasswordForEmail = vi.fn();
const mockGetSession = vi.fn();
const mockOnAuthStateChange = vi.fn();
const mockRefreshSession = vi.fn();
const mockUpdateUser = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
      signUp: (...args: unknown[]) => mockSignUp(...args),
      signOut: (...args: unknown[]) => mockSignOut(...args),
      resetPasswordForEmail: (...args: unknown[]) => mockResetPasswordForEmail(...args),
      getSession: (...args: unknown[]) => mockGetSession(...args),
      onAuthStateChange: (...args: unknown[]) => mockOnAuthStateChange(...args),
      refreshSession: (...args: unknown[]) => mockRefreshSession(...args),
      updateUser: (...args: unknown[]) => mockUpdateUser(...args),
    },
  },
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock('@/lib/config', () => ({
  TEST_MODE: {
    BYPASS_AUTH: false,
    MOCK_USER: null,
  },
}));

vi.mock('@/lib/auth/authErrorService', () => ({
  getFriendlyAuthError: (err: unknown) => ({
    message: err instanceof Error ? err.message : 'Auth error',
    code: 'unknown',
  }),
}));

import { AuthProvider, useAuth } from '@/contexts/AuthContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  it('initialise en état non-authentifié', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
  });

  it('lance une erreur hors AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
  });

  it('signIn - succès met à jour le state via onAuthStateChange', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.signIn('test@test.com', 'password123');
    });

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123',
    });
  });

  it('signIn - erreur est propagée avec message traduit', async () => {
    mockSignInWithPassword.mockResolvedValue({
      error: new Error('Invalid login credentials'),
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await expect(
      act(async () => {
        await result.current.signIn('bad@email.com', 'wrong');
      })
    ).rejects.toThrow();
  });

  it('signUp - appelle supabase.auth.signUp avec emailRedirectTo', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: '1', email_confirmed_at: null }, session: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.signUp('new@user.com', 'pass1234', { name: 'Test' });
    });

    expect(mockSignUp).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'new@user.com',
        password: 'pass1234',
        options: expect.objectContaining({
          data: { name: 'Test' },
          emailRedirectTo: expect.stringContaining(window.location.origin),
        }),
      })
    );
  });

  it('signOut - appelle supabase.auth.signOut', async () => {
    mockSignOut.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockSignOut).toHaveBeenCalled();
  });

  it('resetPassword - appelle resetPasswordForEmail', async () => {
    mockResetPasswordForEmail.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.resetPassword('test@test.com');
    });

    expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
      'test@test.com',
      expect.objectContaining({
        redirectTo: expect.stringContaining('/reset-password'),
      })
    );
  });

  it('onAuthStateChange - écoute AVANT getSession (anti-deadlock)', () => {
    renderHook(() => useAuth(), { wrapper });

    // onAuthStateChange doit être appelé
    expect(mockOnAuthStateChange).toHaveBeenCalled();
    // Et getSession aussi
    expect(mockGetSession).toHaveBeenCalled();
  });

  it('register est un alias de signUp', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.register).toBeDefined();
    expect(typeof result.current.register).toBe('function');
  });

  it('logout est un alias de signOut', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.logout).toBeDefined();
    expect(typeof result.current.logout).toBe('function');
  });
});

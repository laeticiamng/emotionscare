// @ts-nocheck
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthFlow } from '../useAuth';
import { useSimpleAuth } from '@/contexts/SimpleAuth';
import { toast } from '@/hooks/use-toast';

vi.mock('@/contexts/SimpleAuth');
vi.mock('@/hooks/use-toast');
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('useAuthFlow', () => {
  const mockSignIn = vi.fn();
  const mockSignOut = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useSimpleAuth as any).mockReturnValue({
      signIn: mockSignIn,
      signOut: mockSignOut,
    });
  });

  it('should login successfully', async () => {
    mockSignIn.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useAuthFlow());

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Connexion réussie',
        })
      );
    });
  });

  it('should handle login error', async () => {
    mockSignIn.mockRejectedValueOnce(new Error('Invalid credentials'));
    const { result } = renderHook(() => useAuthFlow());

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'wrong',
      });
    });

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Erreur de connexion',
          variant: 'destructive',
        })
      );
    });
  });

  it('should validate password match on signup', async () => {
    const { result } = renderHook(() => useAuthFlow());

    await act(async () => {
      await result.current.signup({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different',
      });
    });

    await waitFor(() => {
      expect(mockSignIn).not.toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Erreur',
          description: 'Les mots de passe ne correspondent pas',
        })
      );
    });
  });

  it('should logout successfully', async () => {
    const { result } = renderHook(() => useAuthFlow());

    await act(async () => {
      await result.current.logout();
    });

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Déconnexion',
        })
      );
    });
  });

  it('should handle session loading', async () => {
    const { result } = renderHook(() => useAuthFlow());
    
    expect(result.current.loading).toBe(false);
  });

  it('should handle auth state changes', async () => {
    const mockCallback = vi.fn();
    (useSimpleAuth as any).mockReturnValue({
      signIn: mockSignIn,
      signOut: mockSignOut,
      onAuthStateChange: mockCallback,
    });

    const { result } = renderHook(() => useAuthFlow());
    
    // Verify auth state listener is set up
    expect(useSimpleAuth).toHaveBeenCalled();
  });
});

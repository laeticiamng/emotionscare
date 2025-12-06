import React from 'react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { routes } from '@/lib/routes';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return actual;
});

import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthGuard, ModeGuard, RoleGuard } from '../guards';

vi.mock('@/components/ui/loading-animation', () => ({
  default: ({ text }: { text?: string }) => <div>{text ?? 'Chargement...'}</div>,
}));

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
};

type UserModeState = {
  userMode: 'b2c' | 'b2b_user' | 'b2b_admin' | null;
  isLoading: boolean;
};

const authState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
};

const userModeState: UserModeState = {
  userMode: 'b2c',
  isLoading: false,
};

const setUserMode = vi.fn();

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => authState,
}));

vi.mock('@/contexts/UserModeContext', () => ({
  useUserMode: () => ({
    userMode: userModeState.userMode,
    setUserMode,
    isLoading: userModeState.isLoading,
  }),
}));

describe('Router guards', () => {
  beforeEach(() => {
    authState.isAuthenticated = false;
    authState.isLoading = false;
    authState.user = null;
    userModeState.userMode = 'b2c';
    userModeState.isLoading = false;
    setUserMode.mockClear();
  });

  it('redirects unauthenticated users to the login page', async () => {
    render(
      <MemoryRouter initialEntries={['/secure-area']}>
        <Routes>
          <Route
            path="/secure-area"
            element={(
              <AuthGuard>
                <div>Zone sécurisée</div>
              </AuthGuard>
            )}
          />
          <Route path={routes.auth.login()} element={<div>Page de connexion</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Page de connexion')).toBeInTheDocument();
  });

  it('allows authenticated users to access protected content', async () => {
    authState.isAuthenticated = true;
    render(
      <MemoryRouter initialEntries={['/secure-area']}>
        <Routes>
          <Route
            path="/secure-area"
            element={(
              <AuthGuard>
                <div>Zone sécurisée</div>
              </AuthGuard>
            )}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Zone sécurisée')).toBeInTheDocument();
  });

  it('prevents users without the required role from accessing a route', async () => {
    authState.isAuthenticated = true;
    authState.user = { role: 'consumer' };

    render(
      <MemoryRouter initialEntries={['/manager-only']}>
        <Routes>
          <Route
            path="/manager-only"
            element={(
              <RoleGuard requiredRole="manager">
                <div>Zone manager</div>
              </RoleGuard>
            )}
          />
          <Route path={routes.special.forbidden()} element={<div>Accès refusé</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Accès refusé')).toBeInTheDocument();
  });

  it('synchronises the user mode with the requested segment', async () => {
    authState.isAuthenticated = true;
    userModeState.userMode = 'b2c';

    render(
      <MemoryRouter initialEntries={['/app/collab?segment=b2b']}>
        <Routes>
          <Route
            path="/app/collab"
            element={(
              <ModeGuard segment="employee">
                <div>Contenu B2B sécurisé</div>
              </ModeGuard>
            )}
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(setUserMode).toHaveBeenCalledWith('b2b_user');
    });

    expect(await screen.findByText('Contenu B2B sécurisé')).toBeInTheDocument();
  });
});

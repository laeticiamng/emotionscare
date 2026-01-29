// @ts-nocheck
/**
 * Utilitaires de test consolidés avec tous les providers
 * Résout les erreurs de context manquants (Tooltip, Auth, Theme, etc.)
 */
import React, { ReactElement, createContext } from 'react';
import { render, RenderOptions, renderHook, RenderHookOptions } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { MusicProvider } from '@/contexts/MusicContext';
import { ThemeProvider } from '@/providers/theme';
import { vi } from 'vitest';

// QueryClient pour les tests
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
  },
});

// Mock user pour les tests
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: { display_name: 'Test User' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

// Mock AuthContext pour les tests
const MockAuthContext = createContext({
  user: mockUser,
  session: { access_token: 'test-token', refresh_token: 'test-refresh' },
  isLoading: false,
  isAuthenticated: true,
  isTestMode: true,
  signUp: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  logout: vi.fn(),
  resetPassword: vi.fn(),
  register: vi.fn(),
  updateUser: vi.fn(),
  refreshSession: vi.fn(),
});

/**
 * Provider wrapper complet pour les tests
 */
function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <MockAuthContext.Provider value={{
            user: mockUser as any,
            session: { access_token: 'test-token', refresh_token: 'test-refresh' } as any,
            isLoading: false,
            isAuthenticated: true,
            isTestMode: true,
            signUp: vi.fn(),
            signIn: vi.fn(),
            signOut: vi.fn(),
            logout: vi.fn(),
            resetPassword: vi.fn(),
            register: vi.fn(),
            updateUser: vi.fn(),
            refreshSession: vi.fn(),
          }}>
            <MusicProvider>
              <TooltipProvider>
                {children}
              </TooltipProvider>
            </MusicProvider>
          </MockAuthContext.Provider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

/**
 * Render personnalisé avec tous les providers
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

/**
 * RenderHook avec MusicProvider
 */
export function renderHookWithMusicProvider<T>(
  callback: () => T,
  options?: Omit<RenderHookOptions<T>, 'wrapper'>
) {
  return renderHook(callback, {
    wrapper: ({ children }) => <MusicProvider>{children}</MusicProvider>,
    ...options,
  });
}

/**
 * RenderHook avec tous les providers
 */
export const renderHookWithAuthProvider = <T,>(
  callback: () => T,
  options?: Omit<RenderHookOptions<T>, 'wrapper'>
) => {
  return renderHook(callback, { wrapper: AllTheProviders, ...options });
};

/**
 * Mock de réponse HTTP pour les tests
 */
export function mockResponse({ ok = true, status = 200, json }: { ok?: boolean; status?: number; json?: any }) {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(json),
  } as any;
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };

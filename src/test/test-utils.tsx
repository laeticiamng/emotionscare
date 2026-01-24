/**
 * Utilitaires de test avec providers Radix UI et Auth
 * Résout l'erreur "Tooltip must be used within TooltipProvider"
 * et "useAuth must be used within an AuthProvider"
 */
import React, { ReactElement, createContext } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';

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
 * Provider wrapper pour les tests
 */
function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
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
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </MockAuthContext.Provider>
    </QueryClientProvider>
  );
}

/**
 * Render personnalisé avec providers
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };

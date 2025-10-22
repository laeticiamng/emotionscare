// @ts-nocheck

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { MusicProvider } from '@/contexts/MusicContext';
import { ThemeProvider } from '@/providers/theme';
import { renderHook, RenderHookOptions } from '@testing-library/react';
import { vi } from 'vitest';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AuthProvider>
            <UserModeProvider>
              <MusicProvider>
                {children}
              </MusicProvider>
            </UserModeProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Create hook render utilities
export function renderHookWithMusicProvider<T>(
  callback: () => T,
  options?: Omit<RenderHookOptions<T>, 'wrapper'>
) {
  return renderHook(callback, {
    wrapper: ({ children }) => <MusicProvider>{children}</MusicProvider>,
    ...options,
  });
}

export const renderHookWithAuthProvider = <T,>(
  callback: () => T,
  options?: Omit<RenderHookOptions<T>, 'wrapper'>
) => {
  return renderHook(callback, { wrapper: AllTheProviders, ...options });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

export function mockResponse({ ok = true, status = 200, json }: { ok?: boolean; status?: number; json?: any }) {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(json),
  } as any;
}

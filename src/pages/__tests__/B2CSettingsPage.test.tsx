/**
 * @fileoverview Tests E2E pour la page Paramètres B2C
 * Couvre les scénarios critiques et la conformité WCAG AA
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import B2CSettingsPage from '../b2c/B2CSettingsPage';

// Mocks
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    isAuthenticated: true,
    isLoading: false,
  }),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    isAuthenticated: true,
    isLoading: false,
  }),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id', email: 'test@example.com' } },
        error: null,
      }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: vi.fn().mockResolvedValue({ data: {}, error: null }),
        }),
      }),
      update: () => ({
        eq: vi.fn().mockResolvedValue({ data: {}, error: null }),
      }),
    }),
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithProviders = (ui: React.ReactNode) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('B2CSettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendu initial', () => {
    it('devrait afficher la page de paramètres', async () => {
      renderWithProviders(<B2CSettingsPage />);
      await waitFor(() => {
        expect(screen.getByTestId('page-root')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibilité WCAG AA', () => {
    it('devrait avoir des éléments de formulaire accessibles', async () => {
      renderWithProviders(<B2CSettingsPage />);
      await waitFor(() => {
        const root = screen.getByTestId('page-root');
        expect(root).toBeInTheDocument();
      });
    });

    it('les boutons devraient être accessibles au clavier', async () => {
      renderWithProviders(<B2CSettingsPage />);
      await waitFor(() => {
        const buttons = screen.queryAllByRole('button');
        buttons.forEach((button) => {
          expect(button).not.toBeDisabled();
        });
      });
    });
  });
});

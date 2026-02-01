/**
 * Tests E2E pour B2CDashboardPage
 * Vérifie le rendu correct et les interactions principales
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock des modules externes
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', user_metadata: { first_name: 'Test' } },
    isLoading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@/core/flags', () => ({
  useFlags: () => ({
    has: (flag: string) => flag === 'FF_MUSIC',
  }),
}));

vi.mock('@/hooks/useUserStatsQuery', () => ({
  useUserStatsQuery: () => ({
    stats: { totalSessions: 5, journalEntries: 10, wellbeingScore: 75 },
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
  useUserStatsRealtime: vi.fn(),
}));

vi.mock('@/hooks/useWellbeingScore', () => ({
  useWellbeingScore: () => ({
    score: 75,
    trend: 'up',
    loading: false,
  }),
}));

vi.mock('@/hooks/useDynamicRecommendations', () => ({
  useDynamicRecommendations: () => ({
    recommendations: [],
    loading: false,
    refetch: vi.fn(),
  }),
}));

vi.mock('@/hooks/useFirstTimeGuide', () => ({
  useFirstTimeGuide: () => ({
    shouldShowGuide: false,
    markAsCompleted: vi.fn(),
    markAsDismissed: vi.fn(),
  }),
}));

// Import après les mocks
import B2CDashboardPage from '../b2c/B2CDashboardPage';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('B2CDashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page root element', async () => {
    renderWithProviders(<B2CDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('page-root')).toBeInTheDocument();
    });
  });

  it('displays welcome message with user name', async () => {
    renderWithProviders(<B2CDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Bienvenue/i)).toBeInTheDocument();
    });
  });

  it('renders navigation links', async () => {
    renderWithProviders(<B2CDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/paramètres/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/aide/i)).toBeInTheDocument();
    });
  });

  it('shows quick actions section', async () => {
    renderWithProviders(<B2CDashboardPage />);
    
    await waitFor(() => {
      // Check for quick action items
      expect(screen.getByText(/Respiration douce/i)).toBeInTheDocument();
    });
  });

  it('has accessible skip links', async () => {
    renderWithProviders(<B2CDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Aller au contenu principal/i)).toBeInTheDocument();
    });
  });
});

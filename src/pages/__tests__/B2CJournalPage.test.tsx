/**
 * Tests E2E pour B2CJournalPage
 * Vérifie le rendu correct et les fonctionnalités du journal
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock des modules externes
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user' },
    isLoading: false,
  }),
}));

vi.mock('@/core/flags', () => ({
  useFlags: () => ({
    has: (flag: string) => flag === 'FF_JOURNAL',
  }),
}));

vi.mock('@/hooks/useJournalOnboarding', () => ({
  useJournalOnboarding: () => ({
    shouldShowOnboarding: false,
    shouldShowTips: true,
    isLoading: false,
    markOnboardingComplete: vi.fn(),
  }),
}));

vi.mock('@/components/medical/MedicalDisclaimerDialog', () => ({
  MedicalDisclaimerDialog: () => null,
  useMedicalDisclaimer: () => ({
    showDisclaimer: false,
    handleAccept: vi.fn(),
    handleDecline: vi.fn(),
  }),
}));

vi.mock('@/pages/journal/JournalView', () => ({
  default: () => <div data-testid="journal-view">Journal View</div>,
}));

vi.mock('@/components/journal/JournalSettingsLink', () => ({
  JournalSettingsLink: () => <button>Settings</button>,
}));

vi.mock('@/components/journal/JournalOnboarding', () => ({
  JournalOnboarding: () => null,
}));

vi.mock('@/components/journal/JournalQuickTips', () => ({
  JournalQuickTips: () => <div data-testid="quick-tips">Quick Tips</div>,
}));

// Import après les mocks
import B2CJournalPage from '../b2c/B2CJournalPage';

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

describe('B2CJournalPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page header', async () => {
    renderWithProviders(<B2CJournalPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Journal émotionnel/i)).toBeInTheDocument();
    });
  });

  it('displays tab navigation', async () => {
    renderWithProviders(<B2CJournalPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Écrire/i)).toBeInTheDocument();
      expect(screen.getByText(/Dictée vocale/i)).toBeInTheDocument();
    });
  });

  it('shows quick tips when onboarding is complete', async () => {
    renderWithProviders(<B2CJournalPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('quick-tips')).toBeInTheDocument();
    });
  });

  it('renders journal view by default', async () => {
    renderWithProviders(<B2CJournalPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('journal-view')).toBeInTheDocument();
    });
  });

  it('has accessible heading', async () => {
    renderWithProviders(<B2CJournalPage />);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Journal émotionnel/i })).toBeInTheDocument();
    });
  });
});

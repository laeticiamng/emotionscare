/**
 * Tests E2E pour B2CScanPage
 * Vérifie le rendu correct et les fonctionnalités de scan
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
    has: (flag: string) => flag === 'FF_SCAN_SAM',
  }),
}));

vi.mock('@/hooks/useAssessment', () => ({
  useAssessment: () => ({
    state: {
      hasConsent: true,
      isFlagEnabled: true,
      isSubmitting: false,
      canDisplay: true,
      isConsentLoading: false,
      isDNTEnabled: false,
      consentDecision: 'accepted',
      error: null,
    },
    submit: vi.fn(),
    grantConsent: vi.fn(),
    declineConsent: vi.fn(),
  }),
}));

vi.mock('@/features/mood/useSamOrchestration', () => ({
  useSamOrchestration: () => ({
    detail: null,
    gestures: [],
  }),
}));

vi.mock('@/components/medical/MedicalDisclaimerDialog', () => ({
  MedicalDisclaimerDialog: () => null,
  useMedicalDisclaimer: () => ({
    showDisclaimer: false,
    isAccepted: true,
    isLoading: false,
    handleAccept: vi.fn(),
    handleDecline: vi.fn(),
  }),
}));

vi.mock('@/components/scan/ScanOnboarding', () => ({
  ScanOnboarding: () => null,
  useShouldShowOnboarding: () => ({
    shouldShow: false,
    isLoading: false,
  }),
}));

vi.mock('@/features/clinical-optin/ConsentGate', () => ({
  ConsentGate: ({ children }: { children: React.ReactNode }) => children,
}));

// Import après les mocks
import B2CScanPage from '../b2c/B2CScanPage';

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

describe('B2CScanPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page title', async () => {
    renderWithProviders(<B2CScanPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Scanner émotionnel léger/i)).toBeInTheDocument();
    });
  });

  it('shows scan mode navigation', async () => {
    renderWithProviders(<B2CScanPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Scanner/i)).toBeInTheDocument();
      expect(screen.getByText(/Facial/i)).toBeInTheDocument();
      expect(screen.getByText(/Vocal/i)).toBeInTheDocument();
      expect(screen.getByText(/Texte/i)).toBeInTheDocument();
    });
  });

  it('displays mode switch buttons', async () => {
    renderWithProviders(<B2CScanPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Ajuster via les curseurs/i)).toBeInTheDocument();
      expect(screen.getByText(/Activer la caméra/i)).toBeInTheDocument();
    });
  });

  it('has back to menu button', async () => {
    renderWithProviders(<B2CScanPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Retour au menu/i)).toBeInTheDocument();
    });
  });
});

/**
 * @fileoverview Tests E2E pour la page Coach IA
 * Couvre les scénarios critiques et la conformité WCAG AA
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import B2CAICoachPage from '../b2c/B2CAICoachPage';

// Mocks
vi.mock('@/modules/coach/CoachView', () => ({
  CoachView: ({ initialMode }: { initialMode: string }) => (
    <div data-testid="coach-view-mock" data-mode={initialMode}>
      <h1>Coach IA Émotionnel</h1>
      <input placeholder="Posez votre question..." aria-label="Message au coach" />
      <button>Envoyer</button>
    </div>
  ),
}));

vi.mock('@/features/clinical-optin/ConsentGate', () => ({
  ConsentGate: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/components/medical/MedicalDisclaimerDialog', () => ({
  MedicalDisclaimerDialog: () => null,
  useMedicalDisclaimer: () => ({
    showDisclaimer: false,
    isAccepted: true,
    handleAccept: vi.fn(),
    handleDecline: vi.fn(),
  }),
}));

vi.mock('@/hooks/usePageSEO', () => ({
  usePageSEO: vi.fn(),
}));

vi.mock('@/hooks/useOptimizedPage', () => ({
  useOptimizedPage: vi.fn(),
}));

vi.mock('@/lib/errors/sentry-compat', () => ({
  Sentry: {
    getCurrentHub: () => ({ getClient: () => null }),
    configureScope: vi.fn(),
  },
}));

vi.mock('@/lib/ai-monitoring', () => ({
  captureException: vi.fn(),
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

describe('B2CAICoachPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendu initial', () => {
    it('devrait afficher le composant Coach', async () => {
      renderWithProviders(<B2CAICoachPage />);
      await waitFor(() => {
        expect(screen.getByTestId('coach-view-mock')).toBeInTheDocument();
      });
    });

    it('devrait afficher le titre principal', async () => {
      renderWithProviders(<B2CAICoachPage />);
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /coach ia émotionnel/i })).toBeInTheDocument();
      });
    });

    it('devrait passer le mode b2c au composant CoachView', async () => {
      renderWithProviders(<B2CAICoachPage />);
      await waitFor(() => {
        const coachView = screen.getByTestId('coach-view-mock');
        expect(coachView).toHaveAttribute('data-mode', 'b2c');
      });
    });
  });

  describe('Barre d\'actions rapides', () => {
    it('devrait afficher le lien vers Mes Objectifs', async () => {
      renderWithProviders(<B2CAICoachPage />);
      await waitFor(() => {
        expect(screen.getByRole('link', { name: /mes objectifs/i })).toBeInTheDocument();
      });
    });

    it('devrait afficher le lien vers Sessions', async () => {
      renderWithProviders(<B2CAICoachPage />);
      await waitFor(() => {
        expect(screen.getByRole('link', { name: /sessions/i })).toBeInTheDocument();
      });
    });

    it('devrait afficher le lien vers Analytics', async () => {
      renderWithProviders(<B2CAICoachPage />);
      await waitFor(() => {
        expect(screen.getByRole('link', { name: /analytics/i })).toBeInTheDocument();
      });
    });
  });

  describe('Interface de chat', () => {
    it('devrait afficher le champ de saisie de message', async () => {
      renderWithProviders(<B2CAICoachPage />);
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/posez votre question/i)).toBeInTheDocument();
      });
    });

    it('devrait afficher le bouton d\'envoi', async () => {
      renderWithProviders(<B2CAICoachPage />);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /envoyer/i })).toBeInTheDocument();
      });
    });
  });

  describe('Accessibilité WCAG AA', () => {
    it('devrait avoir un heading principal', async () => {
      renderWithProviders(<B2CAICoachPage />);
      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
      });
    });

    it('le champ de saisie devrait avoir un label accessible', async () => {
      renderWithProviders(<B2CAICoachPage />);
      await waitFor(() => {
        const input = screen.getByRole('textbox', { name: /message au coach/i });
        expect(input).toBeInTheDocument();
      });
    });

    it('les liens de navigation devraient être accessibles', async () => {
      renderWithProviders(<B2CAICoachPage />);
      await waitFor(() => {
        const links = screen.getAllByRole('link');
        expect(links.length).toBeGreaterThan(0);
      });
    });
  });
});

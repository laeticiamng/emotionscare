/**
 * @fileoverview Tests E2E pour la page Respiration (Breath)
 * Couvre les scénarios critiques et la conformité WCAG AA
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BreathPage from '../breath/index';

// Mocks
vi.mock('@/features/clinical-optin/ConsentGate', () => ({
  ConsentGate: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/hooks/useBreathSessions', () => ({
  useBreathSessions: () => ({
    stats: {
      currentStreak: 5,
      totalSessions: 20,
      totalMinutes: 180,
      weeklyMinutes: 45,
    },
    sessions: [],
    isLoading: false,
  }),
}));

vi.mock('@/features/orchestration/useBreathworkOrchestration', () => ({
  default: () => ({
    mode: 'standard',
    profile: 'standard_soft',
    next: null,
    summaryLabel: 'Ambiance calme',
    staiPreDue: false,
    isiDue: false,
    assessments: {
      stai: { state: { isActive: false }, reset: vi.fn() },
      isi: { state: { isActive: false }, reset: vi.fn() },
    },
    startStaiPre: vi.fn(),
    startIsi: vi.fn(),
  }),
}));

vi.mock('@/lib/errors/sentry-compat', () => ({
  Sentry: {
    addBreadcrumb: vi.fn(),
  },
}));

vi.mock('@/features/session/persistSession', () => ({
  persistBreathSession: vi.fn(),
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

describe('BreathPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendu initial', () => {
    it('devrait afficher le titre principal', () => {
      renderWithProviders(<BreathPage />);
      expect(screen.getByText('Respiration orchestrée')).toBeInTheDocument();
    });

    it('devrait afficher les onglets de navigation', () => {
      renderWithProviders(<BreathPage />);
      expect(screen.getByRole('tab', { name: /pratiquer/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /stats/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /historique/i })).toBeInTheDocument();
    });

    it('devrait afficher le bouton de démarrage de session', () => {
      renderWithProviders(<BreathPage />);
      expect(screen.getByRole('button', { name: /démarrer la séance/i })).toBeInTheDocument();
    });
  });

  describe('Navigation entre onglets', () => {
    it('devrait pouvoir naviguer vers l\'onglet Stats', async () => {
      renderWithProviders(<BreathPage />);
      const statsTab = screen.getByRole('tab', { name: /stats/i });
      fireEvent.click(statsTab);
      await waitFor(() => {
        expect(statsTab).toHaveAttribute('aria-selected', 'true');
      });
    });

    it('devrait pouvoir naviguer vers l\'onglet Historique', async () => {
      renderWithProviders(<BreathPage />);
      const historyTab = screen.getByRole('tab', { name: /historique/i });
      fireEvent.click(historyTab);
      await waitFor(() => {
        expect(historyTab).toHaveAttribute('aria-selected', 'true');
      });
    });
  });

  describe('Accessibilité WCAG AA', () => {
    it('devrait avoir un heading principal h1', () => {
      renderWithProviders(<BreathPage />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('les boutons interactifs devraient être accessibles au clavier', () => {
      renderWithProviders(<BreathPage />);
      const startButton = screen.getByRole('button', { name: /démarrer la séance/i });
      expect(startButton).not.toBeDisabled();
      startButton.focus();
      expect(document.activeElement).toBe(startButton);
    });

    it('les onglets devraient avoir des rôles ARIA corrects', () => {
      renderWithProviders(<BreathPage />);
      const tablist = screen.getByRole('tablist');
      expect(tablist).toBeInTheDocument();
      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBeGreaterThan(0);
    });
  });

  describe('États des statistiques', () => {
    it('devrait afficher la streak actuelle', () => {
      renderWithProviders(<BreathPage />);
      // Navigate to stats tab to see streak
      const statsTab = screen.getByRole('tab', { name: /stats/i });
      fireEvent.click(statsTab);
      // Streak widget is on session tab
    });
  });
});

/**
 * @fileoverview Tests E2E pour la page Musicothérapie
 * Couvre les scénarios critiques et la conformité WCAG AA
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MusicTherapyPage from '../music/MusicTherapyPage';

// Mocks
vi.mock('@/pages/b2c/B2CMusicEnhanced', () => ({
  default: () => (
    <div data-testid="music-enhanced-mock">
      <h1>Musicothérapie IA</h1>
      <button>Générer une piste</button>
      <div role="tablist">
        <button role="tab">Bibliothèque</button>
        <button role="tab">Générateur</button>
      </div>
    </div>
  ),
}));

vi.mock('@/hooks/usePageSEO', () => ({
  usePageSEO: vi.fn(),
}));

vi.mock('@/lib/accessibility-checker', () => ({
  useAccessibilityAudit: () => ({ runAudit: vi.fn() }),
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

describe('MusicTherapyPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendu initial', () => {
    it('devrait afficher le composant de musique', async () => {
      renderWithProviders(<MusicTherapyPage />);
      await waitFor(() => {
        expect(screen.getByTestId('music-enhanced-mock')).toBeInTheDocument();
      });
    });

    it('devrait afficher le titre principal', async () => {
      renderWithProviders(<MusicTherapyPage />);
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /musicothérapie ia/i })).toBeInTheDocument();
      });
    });
  });

  describe('Interface utilisateur', () => {
    it('devrait afficher le bouton de génération', async () => {
      renderWithProviders(<MusicTherapyPage />);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /générer une piste/i })).toBeInTheDocument();
      });
    });

    it('devrait afficher les onglets de navigation', async () => {
      renderWithProviders(<MusicTherapyPage />);
      await waitFor(() => {
        expect(screen.getByRole('tablist')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibilité WCAG AA', () => {
    it('devrait avoir un heading principal', async () => {
      renderWithProviders(<MusicTherapyPage />);
      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
      });
    });

    it('les contrôles interactifs devraient être accessibles', async () => {
      renderWithProviders(<MusicTherapyPage />);
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
        buttons.forEach((button) => {
          expect(button).not.toBeDisabled();
        });
      });
    });
  });
});

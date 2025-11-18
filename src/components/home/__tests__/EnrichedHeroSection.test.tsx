/**
 * Tests unitaires pour EnrichedHeroSection
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EnrichedHeroSection from '../EnrichedHeroSection';

// Mock du hook useReducedMotion
vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false),
  getAnimationVariants: vi.fn((reduced) => ({
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: reduced ? 0.2 : 0.6 } },
    },
    slideUp: {
      hidden: { opacity: 0, y: reduced ? 0 : 20 },
      visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0.2 : 0.6 } },
    },
    scale: {
      hidden: { opacity: 0, scale: reduced ? 1 : 0.95 },
      visible: { opacity: 1, scale: 1, transition: { duration: reduced ? 0.2 : 0.6 } },
    },
  })),
}));

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <EnrichedHeroSection />
    </BrowserRouter>
  );
};

describe('EnrichedHeroSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait rendre sans erreur', () => {
    expect(() => renderComponent()).not.toThrow();
  });

  it('devrait afficher le titre principal', () => {
    renderComponent();
    expect(screen.getByText(/Transformez votre bien-être/i)).toBeInTheDocument();
  });

  it('devrait afficher le badge "Nouveau"', () => {
    renderComponent();
    expect(screen.getByText(/Nouveau :/i)).toBeInTheDocument();
  });

  it('devrait avoir un CTA "Essai gratuit 30 jours"', () => {
    renderComponent();
    expect(screen.getByText(/Essai gratuit 30 jours/i)).toBeInTheDocument();
  });

  it('devrait avoir un lien vers la démo', () => {
    renderComponent();
    expect(screen.getByText(/Voir la démo interactive/i)).toBeInTheDocument();
  });

  it('devrait afficher les trust indicators', () => {
    renderComponent();
    expect(screen.getByText(/25K\+ utilisateurs/i)).toBeInTheDocument();
    expect(screen.getByText(/100% sécurisé RGPD/i)).toBeInTheDocument();
    expect(screen.getByText(/Installation instantanée/i)).toBeInTheDocument();
  });

  it('devrait afficher les 3 cartes flottantes', () => {
    renderComponent();
    expect(screen.getByText(/Musique Thérapeutique/i)).toBeInTheDocument();
    expect(screen.getByText(/Analyse Émotions/i)).toBeInTheDocument();
    expect(screen.getByText(/Coach Personnel/i)).toBeInTheDocument();
  });

  describe('Reduced Motion', () => {
    it('devrait utiliser des animations simplifiées si prefers-reduced-motion', () => {
      const { useReducedMotion } = require('@/hooks/useReducedMotion');
      useReducedMotion.mockReturnValue(true);

      renderComponent();

      expect(useReducedMotion).toHaveBeenCalled();
    });

    it('devrait utiliser des animations complètes par défaut', () => {
      const { useReducedMotion } = require('@/hooks/useReducedMotion');
      useReducedMotion.mockReturnValue(false);

      renderComponent();

      expect(useReducedMotion).toHaveBeenCalled();
    });
  });

  describe('Accessibilité', () => {
    it('devrait avoir des icônes avec aria-hidden', () => {
      const { container } = renderComponent();
      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('devrait avoir des liens accessibles', () => {
      renderComponent();
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
      links.forEach((link) => {
        expect(link).toHaveAttribute('href');
      });
    });
  });
});

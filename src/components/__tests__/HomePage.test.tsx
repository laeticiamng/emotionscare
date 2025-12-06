/**
 * Tests unitaires pour HomePage
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../HomePage';

// Mock des hooks externes
vi.mock('@/hooks/usePageSEO', () => ({
  usePageSEO: vi.fn(),
}));

vi.mock('../modern-features/ModernHomePage', () => ({
  default: () => <div data-testid="modern-homepage">ModernHomePage</div>,
}));

const renderHomePage = () => {
  return render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait rendre sans erreur', () => {
    expect(() => renderHomePage()).not.toThrow();
  });

  it('devrait afficher ModernHomePage', async () => {
    renderHomePage();

    await waitFor(() => {
      expect(screen.getByTestId('modern-homepage')).toBeInTheDocument();
    });
  });

  it('devrait configurer les meta tags SEO', () => {
    const { usePageSEO } = require('@/hooks/usePageSEO');
    renderHomePage();

    expect(usePageSEO).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining('Accueil'),
        description: expect.stringContaining('EmotionsCare'),
        keywords: expect.stringContaining('émotions'),
      })
    );
  });

  it('devrait avoir des structured data Schema.org', () => {
    const { usePageSEO } = require('@/hooks/usePageSEO');
    renderHomePage();

    const seoConfig = usePageSEO.mock.calls[0][0];
    expect(seoConfig.structuredData).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'EmotionsCare',
      applicationCategory: 'HealthApplication',
    });
  });

  it('devrait inclure les ratings dans structured data', () => {
    const { usePageSEO } = require('@/hooks/usePageSEO');
    renderHomePage();

    const seoConfig = usePageSEO.mock.calls[0][0];
    expect(seoConfig.structuredData.aggregateRating).toMatchObject({
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '2847',
      bestRating: '5',
    });
  });

  it('devrait lister les features dans structured data', () => {
    const { usePageSEO } = require('@/hooks/usePageSEO');
    renderHomePage();

    const seoConfig = usePageSEO.mock.calls[0][0];
    expect(seoConfig.structuredData.featureList).toContain('Analyse émotionnelle par IA');
    expect(seoConfig.structuredData.featureList).toContain('Musicothérapie personnalisée');
    expect(seoConfig.structuredData.featureList).toContain('Coach virtuel 24/7');
  });
});

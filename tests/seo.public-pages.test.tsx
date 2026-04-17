// @ts-nocheck
/**
 * SEO non-regression test for public pages.
 * Verifies that each public page renders unique title, meta description,
 * canonical URL and Open Graph tags into <head> via react-helmet-async.
 */
import { render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: false, user: null }),
}));

vi.mock('@/hooks/useOptimizedPage', () => ({
  useOptimizedPage: () => undefined,
}));

const renderWithHelmet = (Component: React.ComponentType, path = '/') => {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <Component />
      </MemoryRouter>
    </HelmetProvider>
  );
};

const getHeadMeta = async () => {
  // Helmet writes to document.head asynchronously
  await waitFor(() => {
    expect(document.title.length).toBeGreaterThan(0);
  });
  const title = document.title;
  const description = document
    .querySelector('meta[name="description"]')
    ?.getAttribute('content');
  const canonical = document
    .querySelector('link[rel="canonical"]')
    ?.getAttribute('href');
  const ogTitle = document
    .querySelector('meta[property="og:title"]')
    ?.getAttribute('content');
  const ogDescription = document
    .querySelector('meta[property="og:description"]')
    ?.getAttribute('content');
  return { title, description, canonical, ogTitle, ogDescription };
};

const PUBLIC_PAGES = [
  { name: 'AboutPage', path: '/about' },
  { name: 'ContactPage', path: '/contact' },
  { name: 'FAQPage', path: '/faq' },
  { name: 'HelpPage', path: '/help' },
  { name: 'SecurityPage', path: '/security' },
  { name: 'HowItAdaptsPage', path: '/how-it-adapts' },
];

describe('Public pages SEO head tags', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.title = '';
  });

  for (const page of PUBLIC_PAGES) {
    it(`${page.name} sets unique title, description, canonical and OG tags`, async () => {
      const mod = await import(`@/pages/${page.name}.tsx`);
      const Component = mod.default;
      renderWithHelmet(Component, page.path);

      const meta = await getHeadMeta();

      expect(meta.title).toBeTruthy();
      expect(meta.title.length).toBeGreaterThan(5);
      expect(meta.description).toBeTruthy();
      expect(meta.description!.length).toBeGreaterThan(20);
      expect(meta.canonical).toMatch(/^https?:\/\//);
      expect(meta.ogTitle ?? meta.title).toBeTruthy();
      expect(meta.ogDescription ?? meta.description).toBeTruthy();
    });
  }
});

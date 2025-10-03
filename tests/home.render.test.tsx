import { render, screen, act } from '@testing-library/react';
import { describe, beforeAll, beforeEach, it, expect, vi } from 'vitest';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
    useNavigate: vi.fn(() => vi.fn()),
    useLocation: vi.fn(() => ({ pathname: '/' })),
    Link: ({ children, to, ...rest }: any) => (
      <a href={typeof to === 'string' ? to : '#'} {...rest}>
        {children}
      </a>
    ),
    BrowserRouter: ({ children }: any) => <div>{children}</div>,
  };
});

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
  }),
}));

vi.mock('@/components/layout/Header', () => ({
  __esModule: true,
  default: () => <header data-testid="mock-header" />,
}));

vi.mock('@/components/layout/Footer', () => ({
  __esModule: true,
  default: () => <footer data-testid="mock-footer" />,
}));

import HomePage from '@/components/HomePage';

describe('HomePage', () => {
  beforeAll(() => {
    class IntersectionObserverMock {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      takeRecords = vi.fn(() => []);
    }

    (globalThis as typeof globalThis & { IntersectionObserver: typeof IntersectionObserverMock }).IntersectionObserver = IntersectionObserverMock;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the marketing hero with CTA link', async () => {
    await act(async () => {
      render(<HomePage />);
    });

    const heading = await screen.findByRole('heading', {
      level: 1,
      name: /emotionscare/i,
    });
    expect(heading).toBeInTheDocument();

    const ctaLink = await screen.findByRole('link', { name: /essai gratuit 30 jours/i });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('href', '/b2c');
  });
});

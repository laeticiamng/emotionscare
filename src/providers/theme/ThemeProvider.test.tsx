/**
 * Tests pour ThemeProvider
 * @jest-environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, waitFor, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { ThemeProvider, useTheme, useThemeToggle } from './ThemeProvider';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock matchMedia
const createMatchMediaMock = (matches: boolean) => {
  return (query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorageMock.clear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialisation', () => {
    it('utilise le thème par défaut "system"', () => {
      window.matchMedia = createMatchMediaMock(false) as any;

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>
      });

      expect(result.current.theme).toBe('system');
      expect(result.current.resolvedTheme).toBe('light');
    });

    it('applique le thème depuis localStorage', () => {
      localStorageMock.setItem('emotionscare-theme', 'dark');
      window.matchMedia = createMatchMediaMock(false) as any;

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>
      });

      expect(result.current.theme).toBe('dark');
      expect(result.current.resolvedTheme).toBe('dark');
    });

    it('utilise un defaultTheme personnalisé', () => {
      window.matchMedia = createMatchMediaMock(false) as any;

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => (
          <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
        )
      });

      expect(result.current.theme).toBe('dark');
    });

    it('utilise un storageKey personnalisé', () => {
      const customKey = 'custom-theme-key';
      localStorageMock.setItem(customKey, 'light');
      window.matchMedia = createMatchMediaMock(false) as any;

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => (
          <ThemeProvider storageKey={customKey}>{children}</ThemeProvider>
        )
      });

      expect(result.current.theme).toBe('light');
    });
  });

  describe('Gestion du thème système', () => {
    it('détecte le mode sombre du système', () => {
      window.matchMedia = createMatchMediaMock(true) as any;

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>
      });

      expect(result.current.systemTheme).toBe('dark');
      expect(result.current.resolvedTheme).toBe('dark');
    });

    it('détecte le mode clair du système', () => {
      window.matchMedia = createMatchMediaMock(false) as any;

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>
      });

      expect(result.current.systemTheme).toBe('light');
      expect(result.current.resolvedTheme).toBe('light');
    });

    it('réagit aux changements de préférence système', async () => {
      let matchesValue = false;
      const listeners: Array<(e: any) => void> = [];

      window.matchMedia = ((query: string) => ({
        matches: matchesValue,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: (event: string, listener: any) => {
          if (event === 'change') listeners.push(listener);
        },
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })) as any;

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>
      });

      expect(result.current.systemTheme).toBe('light');

      // Simule un changement vers dark
      act(() => {
        matchesValue = true;
        listeners.forEach(listener => listener({ matches: true }));
      });

      await waitFor(() => {
        expect(result.current.systemTheme).toBe('dark');
      });
    });
  });

  describe('Changement de thème', () => {
    it('change le thème et le persiste', () => {
      window.matchMedia = createMatchMediaMock(false) as any;

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>
      });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
      expect(localStorageMock.getItem('emotionscare-theme')).toBe('dark');
    });

    it('applique les classes CSS correctement', async () => {
      window.matchMedia = createMatchMediaMock(false) as any;

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>
      });

      act(() => {
        result.current.setTheme('dark');
      });

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(document.documentElement.classList.contains('light')).toBe(false);
      });
    });

    it('applique data-theme correctement', async () => {
      window.matchMedia = createMatchMediaMock(false) as any;

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => (
          <ThemeProvider attribute="data-theme">{children}</ThemeProvider>
        )
      });

      act(() => {
        result.current.setTheme('dark');
      });

      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      });
    });
  });

  describe('useTheme hook', () => {
    it('lance une erreur hors du provider', () => {
      // Capture l'erreur pour éviter qu'elle ne pollue la console
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');

      consoleSpy.mockRestore();
    });

    it('retourne le contexte correct', () => {
      window.matchMedia = createMatchMediaMock(false) as any;

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>
      });

      expect(result.current).toHaveProperty('theme');
      expect(result.current).toHaveProperty('resolvedTheme');
      expect(result.current).toHaveProperty('setTheme');
      expect(result.current).toHaveProperty('systemTheme');
    });
  });

  describe('useThemeToggle hook', () => {
    it('bascule entre les thèmes (light -> dark -> system -> light)', () => {
      window.matchMedia = createMatchMediaMock(false) as any;

      const { result } = renderHook(() => ({
        theme: useTheme(),
        toggle: useThemeToggle()
      }), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>
      });

      // Commence en system (light)
      expect(result.current.theme.theme).toBe('system');

      // Bascule vers dark
      act(() => {
        result.current.toggle.toggle();
      });
      expect(result.current.theme.theme).toBe('dark');

      // Bascule vers system
      act(() => {
        result.current.toggle.toggle();
      });
      expect(result.current.theme.theme).toBe('system');

      // Bascule vers light
      act(() => {
        result.current.toggle.toggle();
      });
      expect(result.current.theme.theme).toBe('light');
    });

    it('bascule binaire (light <-> dark)', () => {
      window.matchMedia = createMatchMediaMock(false) as any;

      const { result } = renderHook(() => ({
        theme: useTheme(),
        toggle: useThemeToggle()
      }), {
        wrapper: ({ children }) => (
          <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
        )
      });

      // Commence en light
      expect(result.current.theme.theme).toBe('light');

      // Bascule vers dark
      act(() => {
        result.current.toggle.toggleBinary();
      });
      expect(result.current.theme.theme).toBe('dark');

      // Rebascule vers light
      act(() => {
        result.current.toggle.toggleBinary();
      });
      expect(result.current.theme.theme).toBe('light');
    });
  });

  describe('Edge cases', () => {
    it('gère localStorage indisponible gracieusement', () => {
      const originalSetItem = localStorageMock.setItem;
      localStorageMock.setItem = () => {
        throw new Error('localStorage not available');
      };

      window.matchMedia = createMatchMediaMock(false) as any;

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>
      });

      // Ne devrait pas lancer d'erreur
      expect(() => {
        act(() => {
          result.current.setTheme('dark');
        });
      }).not.toThrow();

      expect(result.current.theme).toBe('dark');

      localStorageMock.setItem = originalSetItem;
    });

    it('fonctionne en SSR (window undefined)', () => {
      // Note: Ce test est limité car JSDOM fournit toujours window
      // Dans un vrai environnement SSR, le comportement par défaut serait utilisé
      expect(() => {
        render(
          <ThemeProvider>
            <div>Test</div>
          </ThemeProvider>
        );
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('ne rerend pas inutilement', () => {
      window.matchMedia = createMatchMediaMock(false) as any;
      let renderCount = 0;

      function TestComponent() {
        renderCount++;
        useTheme();
        return <div>Test</div>;
      }

      const { rerender } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const initialRenderCount = renderCount;

      // Rerender le provider (pas de changement de thème)
      rerender(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Le composant ne devrait pas avoir rerendu
      expect(renderCount).toBe(initialRenderCount);
    });
  });
});

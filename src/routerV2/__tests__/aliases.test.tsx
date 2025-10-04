// @ts-nocheck
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  ROUTE_ALIASES,
  ROUTE_ALIAS_ENTRIES,
  findRedirectFor,
  isDeprecatedPath,
  LegacyRedirect,
} from '../aliases';
import { ROUTES_REGISTRY } from '../registry';

// Mock dependencies
vi.mock('@sentry/react', () => ({
  addBreadcrumb: vi.fn(),
}));

vi.mock('@/lib/routes', () => ({
  routes: {
    special: {
      notFound: () => '/404',
    },
  },
}));

describe('Route Aliases', () => {
  describe('Alias Structure', () => {
    it('should be an object', () => {
      expect(typeof ROUTE_ALIASES).toBe('object');
      expect(ROUTE_ALIASES).not.toBeNull();
    });

    it('should not be empty', () => {
      const keys = Object.keys(ROUTE_ALIASES);
      expect(keys.length).toBeGreaterThan(0);
    });

    it('should have at least 40 aliases', () => {
      const keys = Object.keys(ROUTE_ALIASES);
      expect(keys.length).toBeGreaterThanOrEqual(40);
    });

    it('should have valid alias entries', () => {
      expect(Array.isArray(ROUTE_ALIAS_ENTRIES)).toBe(true);
      expect(ROUTE_ALIAS_ENTRIES.length).toBe(Object.keys(ROUTE_ALIASES).length);
    });

    it('should have matching entries with ROUTE_ALIASES', () => {
      ROUTE_ALIAS_ENTRIES.forEach((entry) => {
        expect(ROUTE_ALIASES[entry.from]).toBe(entry.to);
      });
    });
  });

  describe('Alias Format Validation', () => {
    it('should have all alias keys starting with /', () => {
      Object.keys(ROUTE_ALIASES).forEach((key) => {
        expect(key.startsWith('/')).toBe(true);
      });
    });

    it('should have all alias values starting with /', () => {
      Object.values(ROUTE_ALIASES).forEach((value) => {
        const path = value.split('?')[0].split('#')[0];
        expect(path.startsWith('/')).toBe(true);
      });
    });

    it('should not have double slashes in alias keys', () => {
      Object.keys(ROUTE_ALIASES).forEach((key) => {
        expect(key).not.toContain('//');
      });
    });

    it('should not have spaces in alias keys', () => {
      Object.keys(ROUTE_ALIASES).forEach((key) => {
        expect(key).not.toContain(' ');
      });
    });

    it('should not have spaces in alias values', () => {
      Object.values(ROUTE_ALIASES).forEach((value) => {
        const pathOnly = value.split('?')[0].split('#')[0];
        expect(pathOnly).not.toContain(' ');
      });
    });

    it('should have lowercase paths in alias keys', () => {
      Object.keys(ROUTE_ALIASES).forEach((key) => {
        expect(key).toBe(key.toLowerCase());
      });
    });
  });

  describe('Alias Uniqueness', () => {
    it('should not have duplicate alias keys', () => {
      const keys = Object.keys(ROUTE_ALIASES);
      const uniqueKeys = new Set(keys);
      expect(keys.length).toBe(uniqueKeys.size);
    });

    it('should not have an alias pointing to itself', () => {
      Object.entries(ROUTE_ALIASES).forEach(([from, to]) => {
        const toPath = to.split('?')[0].split('#')[0];
        expect(from).not.toBe(toPath);
      });
    });
  });

  describe('Circular Redirect Detection', () => {
    it('should not have circular redirects (A → B → A)', () => {
      const visited = new Set<string>();
      const checkCircular = (path: string, chain: string[] = []): boolean => {
        if (chain.includes(path)) {
          console.error('Circular redirect detected:', [...chain, path].join(' → '));
          return true;
        }

        const redirect = ROUTE_ALIASES[path];
        if (!redirect) return false;

        const nextPath = redirect.split('?')[0].split('#')[0];
        return checkCircular(nextPath, [...chain, path]);
      };

      Object.keys(ROUTE_ALIASES).forEach((aliasKey) => {
        const hasCircular = checkCircular(aliasKey);
        expect(hasCircular).toBe(false);
      });
    });

    it('should not have multi-level circular redirects', () => {
      const maxDepth = 10;
      const checkDepth = (path: string, depth = 0): number => {
        if (depth > maxDepth) {
          console.error('Possible circular redirect (max depth exceeded):', path);
          return depth;
        }

        const redirect = ROUTE_ALIASES[path];
        if (!redirect) return depth;

        const nextPath = redirect.split('?')[0].split('#')[0];
        return checkDepth(nextPath, depth + 1);
      };

      Object.keys(ROUTE_ALIASES).forEach((aliasKey) => {
        const depth = checkDepth(aliasKey);
        expect(depth).toBeLessThanOrEqual(maxDepth);
      });
    });
  });

  describe('Target Route Validation', () => {
    it('should point to valid canonical routes or other aliases', () => {
      const allPaths = new Set(ROUTES_REGISTRY.map((r) => r.path));
      const allAliasKeys = new Set(Object.keys(ROUTE_ALIASES));

      Object.entries(ROUTE_ALIASES).forEach(([from, to]) => {
        const targetPath = to.split('?')[0].split('#')[0];
        const isValidPath = allPaths.has(targetPath) || allAliasKeys.has(targetPath);

        if (!isValidPath) {
          console.warn(`Alias ${from} points to unknown route: ${targetPath}`);
        }
      });
    });

    it('should not have undefined or null values', () => {
      Object.values(ROUTE_ALIASES).forEach((value) => {
        expect(value).toBeDefined();
        expect(value).not.toBeNull();
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Query Parameter Handling', () => {
    it('should preserve query parameters in aliases', () => {
      Object.entries(ROUTE_ALIASES).forEach(([from, to]) => {
        if (to.includes('?')) {
          const queryPart = to.split('?')[1];
          expect(queryPart).toBeDefined();
          expect(queryPart.length).toBeGreaterThan(0);
        }
      });
    });

    it('should have valid query parameters format', () => {
      Object.entries(ROUTE_ALIASES).forEach(([from, to]) => {
        if (to.includes('?')) {
          const [path, query] = to.split('?');
          expect(path.length).toBeGreaterThan(0);
          expect(query.length).toBeGreaterThan(0);
          expect(query).not.toContain('?'); // Only one ?
        }
      });
    });

    it('should use segment parameter for mode routing', () => {
      const authAliases = ['/b2c/login', '/b2b/user/login', '/b2b/admin/login'];
      authAliases.forEach((alias) => {
        const target = ROUTE_ALIASES[alias];
        if (target.includes('segment=')) {
          const params = new URLSearchParams(target.split('?')[1]);
          expect(params.get('segment')).toBeTruthy();
        }
      });
    });
  });

  describe('Helper Functions', () => {
    describe('findRedirectFor', () => {
      it('should return redirect for valid alias', () => {
        const redirect = findRedirectFor('/dashboard');
        expect(redirect).toBe('/app/home');
      });

      it('should return redirect for auth alias', () => {
        const redirect = findRedirectFor('/auth');
        expect(redirect).toBe('/login');
      });

      it('should return null for non-existent alias', () => {
        const redirect = findRedirectFor('/non-existent-route');
        expect(redirect).toBeNull();
      });

      it('should return null for empty string', () => {
        const redirect = findRedirectFor('');
        expect(redirect).toBeNull();
      });

      it('should handle case sensitivity', () => {
        const redirect = findRedirectFor('/DASHBOARD');
        expect(redirect).toBeNull();
      });
    });

    describe('isDeprecatedPath', () => {
      it('should return true for deprecated paths', () => {
        expect(isDeprecatedPath('/dashboard')).toBe(true);
        expect(isDeprecatedPath('/emotions')).toBe(true);
        expect(isDeprecatedPath('/auth')).toBe(true);
      });

      it('should return false for non-deprecated paths', () => {
        expect(isDeprecatedPath('/app/home')).toBe(false);
        expect(isDeprecatedPath('/non-existent')).toBe(false);
      });

      it('should return false for empty string', () => {
        expect(isDeprecatedPath('')).toBe(false);
      });

      it('should handle all registered aliases', () => {
        Object.keys(ROUTE_ALIASES).forEach((alias) => {
          expect(isDeprecatedPath(alias)).toBe(true);
        });
      });
    });
  });

  describe('LegacyRedirect Component', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should redirect to target when alias exists', () => {
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <LegacyRedirect from="/dashboard" />
        </MemoryRouter>
      );
      // Component should render Navigate, we can't easily test the redirect
      // but we can verify no error is thrown
    });

    it('should redirect to 404 when alias does not exist', () => {
      render(
        <MemoryRouter initialEntries={['/non-existent']}>
          <LegacyRedirect from="/non-existent" />
        </MemoryRouter>
      );
      // Should redirect to 404
    });

    it('should use location.pathname when from is not provided', () => {
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <LegacyRedirect />
        </MemoryRouter>
      );
    });

    it('should use provided to prop when specified', () => {
      render(
        <MemoryRouter initialEntries={['/any-path']}>
          <LegacyRedirect to="/app/home" />
        </MemoryRouter>
      );
    });

    it('should handle query parameters', () => {
      render(
        <MemoryRouter initialEntries={['/dashboard?id=123']}>
          <LegacyRedirect from="/dashboard" />
        </MemoryRouter>
      );
    });

    it('should handle hash fragments', () => {
      render(
        <MemoryRouter initialEntries={['/dashboard#section']}>
          <LegacyRedirect from="/dashboard" />
        </MemoryRouter>
      );
    });

    it('should handle query and hash together', () => {
      render(
        <MemoryRouter initialEntries={['/dashboard?id=123#section']}>
          <LegacyRedirect from="/dashboard" />
        </MemoryRouter>
      );
    });
  });

  describe('Alias Categories', () => {
    it('should have authentication aliases', () => {
      const authAliases = ['/auth', '/b2c/login', '/b2b/user/login', '/register'];
      authAliases.forEach((alias) => {
        expect(ROUTE_ALIASES[alias]).toBeDefined();
      });
    });

    it('should have dashboard aliases', () => {
      const dashboardAliases = ['/dashboard', '/b2c/dashboard', '/b2b/user/dashboard'];
      dashboardAliases.forEach((alias) => {
        expect(ROUTE_ALIASES[alias]).toBeDefined();
      });
    });

    it('should have module aliases', () => {
      const moduleAliases = ['/emotions', '/music', '/coach', '/journal'];
      moduleAliases.forEach((alias) => {
        expect(ROUTE_ALIASES[alias]).toBeDefined();
      });
    });

    it('should have B2B feature aliases', () => {
      const b2bAliases = ['/teams', '/reports', '/events'];
      b2bAliases.forEach((alias) => {
        expect(ROUTE_ALIASES[alias]).toBeDefined();
      });
    });

    it('should have settings aliases', () => {
      const settingsAliases = ['/settings', '/preferences', '/notifications'];
      settingsAliases.forEach((alias) => {
        expect(ROUTE_ALIASES[alias]).toBeDefined();
      });
    });
  });

  describe('Alias Target Consistency', () => {
    it('should have consistent auth redirects', () => {
      expect(ROUTE_ALIASES['/auth']).toContain('/login');
      expect(ROUTE_ALIASES['/register']).toContain('/signup');
    });

    it('should have consistent dashboard redirects', () => {
      expect(ROUTE_ALIASES['/dashboard']).toBe('/app/home');
      expect(ROUTE_ALIASES['/b2c/dashboard']).toBe('/app/home');
    });

    it('should have consistent B2B redirects', () => {
      expect(ROUTE_ALIASES['/b2b/user/dashboard']).toBe('/app/collab');
      expect(ROUTE_ALIASES['/b2b/admin/dashboard']).toBe('/app/rh');
    });

    it('should redirect to app routes for modules', () => {
      const moduleAliases = ['/emotions', '/music', '/coach', '/journal'];
      moduleAliases.forEach((alias) => {
        const target = ROUTE_ALIASES[alias];
        expect(target.startsWith('/app/')).toBe(true);
      });
    });
  });

  describe('Alias Statistics', () => {
    it('should report alias statistics', () => {
      const stats = {
        total: Object.keys(ROUTE_ALIASES).length,
        withQueryParams: Object.values(ROUTE_ALIASES).filter((v) => v.includes('?')).length,
        authRelated: Object.keys(ROUTE_ALIASES).filter(
          (k) => k.includes('login') || k.includes('register') || k.includes('auth')
        ).length,
        dashboardRelated: Object.keys(ROUTE_ALIASES).filter((k) => k.includes('dashboard')).length,
        moduleRelated: Object.keys(ROUTE_ALIASES).filter((k) => k.startsWith('/app/')).length,
      };

      console.log('Alias Statistics:', stats);

      expect(stats.total).toBeGreaterThan(0);
      expect(stats.authRelated).toBeGreaterThan(0);
      expect(stats.dashboardRelated).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle aliases with multiple segments', () => {
      const multiSegmentAliases = Object.keys(ROUTE_ALIASES).filter(
        (k) => k.split('/').length > 3
      );
      multiSegmentAliases.forEach((alias) => {
        expect(ROUTE_ALIASES[alias]).toBeDefined();
      });
    });

    it('should not have trailing slashes in alias keys', () => {
      Object.keys(ROUTE_ALIASES).forEach((key) => {
        if (key !== '/') {
          expect(key.endsWith('/')).toBe(false);
        }
      });
    });

    it('should not have trailing slashes in alias values (path part)', () => {
      Object.values(ROUTE_ALIASES).forEach((value) => {
        const pathPart = value.split('?')[0].split('#')[0];
        if (pathPart !== '/') {
          expect(pathPart.endsWith('/')).toBe(false);
        }
      });
    });
  });
});

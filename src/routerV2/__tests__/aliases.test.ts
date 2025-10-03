import { describe, expect, it } from 'vitest';
import { ROUTE_ALIASES, findRedirectFor } from '../aliases';
import { ROUTES_REGISTRY } from '../registry';
import { ROUTER_V2_MANIFEST } from '../manifest';
import { routes } from '../routes';

describe('RouterV2 aliases', () => {
  it('redirects critical legacy paths to their canonical destinations', () => {
    expect(findRedirectFor('/scan')).toBe('/app/scan');
    expect(findRedirectFor('/journal')).toBe('/app/journal');
    expect(findRedirectFor('/music')).toBe('/app/music');
    expect(findRedirectFor('/dashboard')).toBe('/app/home');
  });

  it('maps alias targets to existing canonical routes', () => {
    const canonicalPaths = new Set(
      ROUTES_REGISTRY
        .filter(route => !route.deprecated)
        .map(route => route.path),
    );

    Object.values(ROUTE_ALIASES).forEach(aliasTarget => {
      const baseTarget = aliasTarget.split('?')[0];
      expect(canonicalPaths.has(baseTarget)).toBe(true);
    });
  });
});

describe('RouterV2 route helpers', () => {
  const manifestPaths = new Set(ROUTER_V2_MANIFEST.map(path => path.split('?')[0]));

  const collectHelperPaths = (value: unknown): string[] => {
    if (typeof value === 'function') {
      return [value().split('?')[0]];
    }

    if (value && typeof value === 'object') {
      return Object.values(value).flatMap(collectHelperPaths);
    }

    return [];
  };

  it('only exposes helpers that resolve to known manifest entries', () => {
    const helperPaths = collectHelperPaths(routes);

    helperPaths.forEach(path => {
      expect(manifestPaths.has(path)).toBe(true);
    });
  });
});

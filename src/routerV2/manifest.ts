// @ts-nocheck
/**
 * RouterV2 Manifest helpers
 * Construit une liste plate de toutes les routes connues
 * (chemins canoniques + alias de compatibilité).
 */

import { ROUTES_REGISTRY } from './registry';
import { ROUTE_ALIASES } from './aliases';

export function getRouterManifest(): string[] {
  const canonicalRoutes = ROUTES_REGISTRY.map(route => route.path);
  const registryAliases = ROUTES_REGISTRY.flatMap(route => route.aliases ?? []);
  const compatibilityAliases = Object.keys(ROUTE_ALIASES);

  return Array.from(
    new Set([...canonicalRoutes, ...registryAliases, ...compatibilityAliases]),
  );
}

export const ROUTER_V2_MANIFEST = getRouterManifest();

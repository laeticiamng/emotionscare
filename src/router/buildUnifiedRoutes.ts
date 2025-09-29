/**
 * Unified Routes Builder - Legacy compatibility layer
 * Provides compatibility for scripts that depend on the old router structure
 */

import { ROUTER_V2_MANIFEST } from '@/routerV2/manifest';

export interface RouteManifestEntry {
  path: string;
  component: string;
  segment?: string;
  requireAuth?: boolean;
  auth?: boolean;
  role?: string;
  module?: string;
}

// Legacy manifest format for backward compatibility
export const ROUTES_MANIFEST: RouteManifestEntry[] = ROUTER_V2_MANIFEST.map(path => ({
  path,
  component: path.split('/').pop() || 'Unknown',
  segment: path.startsWith('/app') ? 'app' : 'public',
  requireAuth: path.startsWith('/app')
}));

export const ROUTE_MANIFEST = ROUTER_V2_MANIFEST;

export function validateRoutesManifest() {
  const errors: string[] = [];
  const pathCounts = new Map<string, number>();
  
  ROUTES_MANIFEST.forEach(route => {
    const count = pathCounts.get(route.path) || 0;
    pathCounts.set(route.path, count + 1);
  });
  
  pathCounts.forEach((count, path) => {
    if (count > 1) {
      errors.push(`Duplicate path: ${path}`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}
/**
 * Routes API - RouterV2 Compatible
 * TICKET: FE/BE-Router-Cleanup-01
 */

import { ROUTES_REGISTRY } from '@/routerV2/registry';

export interface RouteHealthResponse {
  status: 'healthy' | 'error';
  totalRoutes: number;
  duplicates: string[];
  timestamp: string;
}

export interface RoutesApiResponse {
  routes: string[];
  meta: {
    totalRoutes: number;
    lastGenerated: string;
  };
}

// Extraire les paths du registry RouterV2
const ROUTE_PATHS = ROUTES_REGISTRY.map(route => route.path);

export async function getRoutesManifest(): Promise<RoutesApiResponse> {
  return {
    routes: ROUTE_PATHS,
    meta: {
      totalRoutes: ROUTE_PATHS.length,
      lastGenerated: new Date().toISOString(),
    },
  };
}

export async function getRoutesHealth(): Promise<RouteHealthResponse> {
  // Vérifier les doublons dans RouterV2
  const pathCounts = new Map<string, number>();
  const duplicates: string[] = [];

  ROUTE_PATHS.forEach(route => {
    const count = pathCounts.get(route) || 0;
    pathCounts.set(route, count + 1);
  });

  pathCounts.forEach((count, route) => {
    if (count > 1) {
      duplicates.push(route);
    }
  });

  return {
    status: duplicates.length === 0 ? 'healthy' : 'error',
    totalRoutes: ROUTE_PATHS.length,
    duplicates,
    timestamp: new Date().toISOString(),
  };
}

export class RoutesApi {
  static async getManifest(): Promise<RoutesApiResponse> {
    return getRoutesManifest();
  }

  static async getHealth(): Promise<RouteHealthResponse> {
    return getRoutesHealth();
  }
}
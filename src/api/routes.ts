
import { ROUTES_MANIFEST, validateRoutesManifest, type RouteManifestEntry } from '../router/buildUnifiedRoutes';

export interface RouteHealthResponse {
  status: 'healthy' | 'error';
  totalRoutes: number;
  duplicates: string[];
  missingPages: string[];
  validation: {
    valid: boolean;
    errors: string[];
  };
  timestamp: string;
}

export interface RoutesApiResponse {
  routes: RouteManifestEntry[];
  meta: {
    totalRoutes: number;
    lastGenerated: string;
    version: string;
  };
}

export async function getRoutesManifest(): Promise<RoutesApiResponse> {
  return {
    routes: ROUTES_MANIFEST,
    meta: {
      totalRoutes: ROUTES_MANIFEST.length,
      lastGenerated: new Date().toISOString(),
      version: '1.0.0'
    }
  };
}

export async function getRoutesHealth(): Promise<RouteHealthResponse> {
  const validation = validateRoutesManifest();
  const duplicates: string[] = [];
  const missingPages: string[] = [];
  
  // Détecter les doublons de chemins
  const pathCounts = new Map<string, number>();
  ROUTES_MANIFEST.forEach(route => {
    const count = pathCounts.get(route.path) || 0;
    pathCounts.set(route.path, count + 1);
  });
  
  pathCounts.forEach((count, path) => {
    if (count > 1) {
      duplicates.push(path);
    }
  });
  
  // Note: La vérification des pages manquantes serait normalement faite côté serveur
  // avec accès au système de fichiers
  
  return {
    status: validation.valid && duplicates.length === 0 ? 'healthy' : 'error',
    totalRoutes: ROUTES_MANIFEST.length,
    duplicates,
    missingPages,
    validation,
    timestamp: new Date().toISOString()
  };
}

// Simulation d'un endpoint API côté client
export class RoutesApi {
  static async getManifest(): Promise<RoutesApiResponse> {
    // En production, ceci ferait un appel HTTP vers /api/routes
    return getRoutesManifest();
  }
  
  static async getHealth(): Promise<RouteHealthResponse> {
    // En production, ceci ferait un appel HTTP vers /api/routes/health
    return getRoutesHealth();
  }
}

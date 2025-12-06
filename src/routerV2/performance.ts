/**
 * Optimisations de performance pour RouterV2
 * TICKET: FE/BE-Router-Cleanup-01 - Performance 100%
 */

import { useMemo, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type RoutePreloader = () => Promise<unknown>;

const ROUTE_PRELOADERS = new Map<string, RoutePreloader>([
  ['/', () => import('@/components/HomePage')],
  ['/about', () => import('@/pages/AboutPage')],
  ['/contact', () => import('@/pages/ContactPage')],
  ['/help', () => import('@/pages/HelpPage')],
  ['/login', () => import('@/pages/unified/UnifiedLoginPage')],
  ['/signup', () => import('@/pages/SignupPage')],
  ['/app', () => import('@/pages/AppGatePage')],
  ['/app/home', () => import('@/pages/B2CDashboardPage')],
  ['/app/scan', () => import('@/pages/B2CScanPage')],
  ['/app/music', () => import('@/modules/adaptive-music/AdaptiveMusicPage')],
  ['/app/coach', () => import('@/pages/B2CAICoachPage')],
  ['/app/journal', () => import('@/pages/B2CJournalPage')],
  ['/b2c', () => import('@/components/SimpleB2CPage')],
  ['/entreprise', () => import('@/pages/B2BEntreprisePage')],
]);

const pendingPreloads = new Map<string, Promise<void>>();

const normalizePath = (path: string): string => {
  if (!path || path === '/') {
    return '/';
  }

  return path.endsWith('/') ? path.slice(0, -1) : path;
};

// Cache des routes pour éviter les recalculs
const routeCache = new Map<string, any>();

// Métriques de performance
interface RouteMetrics {
  loadTime: number;
  renderTime: number;
  lastAccessed: number;
  accessCount: number;
}

class RouterPerformanceManager {
  private static instance: RouterPerformanceManager;
  private metrics = new Map<string, RouteMetrics>();
  private preloadedRoutes = new Set<string>();

  static getInstance(): RouterPerformanceManager {
    if (!RouterPerformanceManager.instance) {
      RouterPerformanceManager.instance = new RouterPerformanceManager();
    }
    return RouterPerformanceManager.instance;
  }

  // Précharger une route
  preloadRoute(path: string): void {
    const normalizedPath = normalizePath(path);
    if (this.preloadedRoutes.has(normalizedPath) || pendingPreloads.has(normalizedPath)) {
      return;
    }

    const loader = ROUTE_PRELOADERS.get(normalizedPath);
    if (!loader) {
      return;
    }

    const startTime = performance.now();
    const pending = loader()
      .then(() => {
        const loadTime = performance.now() - startTime;
        this.updateMetrics(normalizedPath, { loadTime });
        this.preloadedRoutes.add(normalizedPath);
      })
      .catch(error => {
        if (import.meta.env.DEV) {
          console.warn(`[routerV2] Échec du préchargement de ${normalizedPath}`, error);
        }
      })
      .finally(() => {
        pendingPreloads.delete(normalizedPath);
      });

    pendingPreloads.set(normalizedPath, pending.then(() => undefined));
  }

  // Mettre à jour les métriques
  updateMetrics(path: string, partial: Partial<RouteMetrics>): void {
    const existing = this.metrics.get(path) || {
      loadTime: 0,
      renderTime: 0,
      lastAccessed: 0,
      accessCount: 0
    };

    this.metrics.set(path, {
      ...existing,
      ...partial,
      lastAccessed: Date.now(),
      accessCount: existing.accessCount + 1
    });
  }

  // Obtenir les métriques d'une route
  getMetrics(path: string): RouteMetrics | undefined {
    return this.metrics.get(path);
  }

  // Nettoyer le cache des routes anciennes
  cleanupCache(): void {
    const now = Date.now();
    const maxAge = 10 * 60 * 1000; // 10 minutes

    for (const [path, metrics] of this.metrics.entries()) {
      if (now - metrics.lastAccessed > maxAge) {
        this.metrics.delete(path);
        this.preloadedRoutes.delete(path);
        routeCache.delete(path);
      }
    }
  }
}

// Hook pour l'optimisation des routes
export function useRouteOptimization() {
  const location = useLocation();
  const manager = RouterPerformanceManager.getInstance();

  // Préchargement intelligent des routes probables
  const preloadProbableRoutes = useCallback(() => {
    const currentPath = location.pathname;
    
    // Routes probables basées sur la navigation courante
    const probableRoutes = getProbableNextRoutes(currentPath);
    
    probableRoutes.forEach(route => {
      manager.preloadRoute(route);
    });
  }, [location.pathname, manager]);

  // Mémorisation des données de route
  const memoizedRouteData = useMemo(() => {
    const path = location.pathname;
    
    if (!routeCache.has(path)) {
      const routeData = computeRouteData(path);
      routeCache.set(path, routeData);
    }
    
    return routeCache.get(path);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const interval = window.setInterval(() => manager.cleanupCache(), 60_000);
    return () => window.clearInterval(interval);
  }, [manager]);

  return {
    preloadProbableRoutes,
    memoizedRouteData,
    getMetrics: manager.getMetrics.bind(manager)
  };
}

// Déterminer les routes probables selon le contexte
function getProbableNextRoutes(currentPath: string): string[] {
  const routeMap: Record<string, string[]> = {
    '/': ['/login', '/signup', '/about'],
    '/login': ['/app/home', '/signup', '/forgot-password'],
    '/signup': ['/login', '/app/home'],
    '/app/home': ['/app/scan', '/app/music', '/app/coach', '/app/journal'],
    '/app/scan': ['/app/music', '/app/journal', '/app/coach'],
    '/app/music': ['/app/coach', '/app/journal', '/app/scan'],
    '/app/coach': ['/app/journal', '/app/music', '/app/scan'],
    '/app/journal': ['/app/music', '/app/coach', '/app/scan']
  };

  return routeMap[currentPath] || [];
}

// Calculer les données d'une route
function computeRouteData(path: string) {
  return {
    path,
    title: getRouteTitle(path),
    meta: getRouteMeta(path),
    breadcrumbs: getBreadcrumbs(path),
    timestamp: Date.now()
  };
}

// Obtenir le titre d'une route
function getRouteTitle(path: string): string {
  const titleMap: Record<string, string> = {
    '/': 'Accueil - EmotionsCare',
    '/app/home': 'Tableau de bord - EmotionsCare',
    '/app/scan': 'Scan Émotionnel - EmotionsCare',
    '/app/music': 'Thérapie Musicale - EmotionsCare',
    '/app/coach': 'Coach IA - EmotionsCare',
    '/app/journal': 'Journal Émotionnel - EmotionsCare',
    '/login': 'Connexion - EmotionsCare',
    '/signup': 'Inscription - EmotionsCare'
  };

  return titleMap[path] || 'EmotionsCare';
}

// Obtenir les métadonnées d'une route
function getRouteMeta(path: string) {
  const metaMap: Record<string, any> = {
    '/': { 
      description: 'Plateforme de bien-être émotionnel alimentée par l\'IA',
      keywords: 'bien-être, émotions, thérapie, IA'
    },
    '/app/scan': {
      description: 'Scanner émotionnel avancé avec analyse IA',
      keywords: 'scan, émotions, analyse, IA'
    },
    '/app/music': {
      description: 'Thérapie musicale personnalisée',
      keywords: 'musique, thérapie, personnalisé'
    }
  };

  return metaMap[path] || {};
}

// Générer les breadcrumbs
function getBreadcrumbs(path: string): Array<{label: string, path: string}> {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Accueil', path: '/' }];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    breadcrumbs.push({
      label: formatSegmentLabel(segment),
      path: currentPath
    });
  }

  return breadcrumbs;
}

// Formater le label d'un segment
function formatSegmentLabel(segment: string): string {
  const labelMap: Record<string, string> = {
    'app': 'Application',
    'home': 'Accueil',
    'scan': 'Scanner',
    'music': 'Musique',
    'coach': 'Coach',
    'journal': 'Journal',
    'b2c': 'Particuliers',
    'b2b': 'Entreprises'
  };

  return labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
}

// Nettoyage automatique du cache
setInterval(() => {
  RouterPerformanceManager.getInstance().cleanupCache();
}, 5 * 60 * 1000); // Toutes les 5 minutes
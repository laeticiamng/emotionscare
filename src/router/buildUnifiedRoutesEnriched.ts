/**
 * buildUnifiedRoutesEnriched - Générateur de manifest de routes avec validation et analytics
 */

import { ComponentType, lazy } from 'react';

export interface RouteManifestEntry {
  path: string;
  component: string;
  componentLoader?: () => Promise<{ default: ComponentType<any> }>;
  module?: string;
  auth?: boolean | 'optional';
  role?: string | string[];
  title?: string;
  description?: string;
  keywords?: string[];
  priority?: number; // Pour le sitemap
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  noindex?: boolean;
  redirect?: string;
  layout?: string;
  children?: RouteManifestEntry[];
  meta?: Record<string, any>;
}

export interface RouteValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalRoutes: number;
    publicRoutes: number;
    protectedRoutes: number;
    adminRoutes: number;
    redirects: number;
  };
}

export interface RouteAnalytics {
  routePath: string;
  visits: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
  lastAccessed: string;
}

// Définition complète des routes de l'application
export const ROUTES_MANIFEST: RouteManifestEntry[] = [
  // Public routes
  {
    path: '/',
    component: 'Index',
    module: 'public',
    auth: false,
    title: 'EmotionsCare - Votre bien-être émotionnel',
    description: 'Plateforme de bien-être émotionnel avec IA',
    priority: 1.0,
    changefreq: 'daily'
  },
  {
    path: '/login',
    component: 'Login',
    module: 'auth',
    auth: false,
    title: 'Connexion',
    noindex: true
  },
  {
    path: '/signup',
    component: 'Signup',
    module: 'auth',
    auth: false,
    title: 'Inscription'
  },
  {
    path: '/pricing',
    component: 'Pricing',
    module: 'public',
    auth: false,
    title: 'Tarifs',
    priority: 0.8
  },
  {
    path: '/demo',
    component: 'Demo',
    module: 'public',
    auth: false,
    title: 'Démo'
  },
  {
    path: '/help',
    component: 'Help',
    module: 'public',
    auth: false,
    title: 'Aide & Support'
  },
  {
    path: '/contact',
    component: 'Contact',
    module: 'public',
    auth: false,
    title: 'Contact'
  },
  {
    path: '/about',
    component: 'About',
    module: 'public',
    auth: false,
    title: 'À propos'
  },

  // App routes (protected)
  {
    path: '/app',
    component: 'Dashboard',
    module: 'app',
    auth: true,
    title: 'Tableau de bord',
    layout: 'app'
  },
  {
    path: '/app/journal',
    component: 'Journal',
    module: 'journal',
    auth: true,
    title: 'Journal émotionnel'
  },
  {
    path: '/app/scan',
    component: 'Scan',
    module: 'scan',
    auth: true,
    title: 'Scan émotionnel'
  },
  {
    path: '/app/music',
    component: 'Music',
    module: 'music',
    auth: true,
    title: 'Musique thérapeutique'
  },
  {
    path: '/app/coach',
    component: 'Coach',
    module: 'coach',
    auth: true,
    title: 'Coach IA'
  },
  {
    path: '/app/breath',
    component: 'Breath',
    module: 'breath',
    auth: true,
    title: 'Exercices de respiration'
  },
  {
    path: '/app/exchange',
    component: 'ExchangeHub',
    module: 'exchange',
    auth: true,
    title: 'Exchange Hub'
  },
  {
    path: '/app/emotional-park',
    component: 'EmotionalPark',
    module: 'park',
    auth: true,
    title: 'Parc Émotionnel'
  },
  {
    path: '/app/vr-galaxy',
    component: 'VRGalaxy',
    module: 'vr',
    auth: true,
    title: 'VR Galaxy'
  },

  // Settings routes
  {
    path: '/settings',
    component: 'Settings',
    module: 'settings',
    auth: true,
    title: 'Paramètres',
    layout: 'settings'
  },
  {
    path: '/settings/profile',
    component: 'ProfileSettings',
    module: 'settings',
    auth: true,
    title: 'Profil'
  },
  {
    path: '/settings/notifications',
    component: 'NotificationSettings',
    module: 'settings',
    auth: true,
    title: 'Notifications'
  },
  {
    path: '/settings/accessibility',
    component: 'AccessibilitySettings',
    module: 'settings',
    auth: true,
    title: 'Accessibilité'
  },
  {
    path: '/settings/privacy',
    component: 'PrivacySettings',
    module: 'settings',
    auth: true,
    title: 'Confidentialité'
  },

  // Admin routes
  {
    path: '/admin',
    component: 'AdminDashboard',
    module: 'admin',
    auth: true,
    role: ['admin', 'b2b_admin'],
    title: 'Administration',
    noindex: true
  },
  {
    path: '/admin/users',
    component: 'AdminUsers',
    module: 'admin',
    auth: true,
    role: 'admin',
    title: 'Gestion utilisateurs',
    noindex: true
  },
  {
    path: '/admin/gdpr',
    component: 'AdminGDPR',
    module: 'admin',
    auth: true,
    role: 'admin',
    title: 'GDPR Compliance',
    noindex: true
  },
  {
    path: '/admin/challenges',
    component: 'AdminChallenges',
    module: 'admin',
    auth: true,
    role: ['admin', 'b2b_admin'],
    title: 'Gestion défis',
    noindex: true
  },

  // Legal routes
  {
    path: '/legal/privacy',
    component: 'PrivacyPolicy',
    module: 'legal',
    auth: false,
    title: 'Politique de confidentialité',
    priority: 0.3
  },
  {
    path: '/legal/terms',
    component: 'TermsOfService',
    module: 'legal',
    auth: false,
    title: 'Conditions d\'utilisation',
    priority: 0.3
  },
  {
    path: '/legal/cookies',
    component: 'CookiePolicy',
    module: 'legal',
    auth: false,
    title: 'Politique des cookies',
    priority: 0.3
  },

  // Gamification
  {
    path: '/gamification',
    component: 'Gamification',
    module: 'gamification',
    auth: true,
    title: 'Gamification'
  },
  {
    path: '/gamification/leaderboard',
    component: 'Leaderboard',
    module: 'gamification',
    auth: true,
    title: 'Classement'
  },
  {
    path: '/gamification/achievements',
    component: 'Achievements',
    module: 'gamification',
    auth: true,
    title: 'Succès'
  }
];

// Aliases pour rétrocompatibilité
export const ROUTE_ALIASES: Record<string, string> = {
  '/dashboard': '/app',
  '/home': '/',
  '/journal': '/app/journal',
  '/scan': '/app/scan',
  '/music': '/app/music',
  '/coach': '/app/coach',
  '/breath': '/app/breath',
  '/respiration': '/app/breath',
  '/exchange-hub': '/app/exchange',
  '/parc-emotionnel': '/app/emotional-park',
  '/vr': '/app/vr-galaxy',
  '/profile': '/settings/profile',
  '/confidentialite': '/legal/privacy',
  '/cgu': '/legal/terms'
};

/**
 * Construire les routes pour React Router
 */
export function buildUnifiedRoutes(): RouteManifestEntry[] {
  return ROUTES_MANIFEST;
}

/**
 * Obtenir une route par son path
 */
export function getRouteByPath(path: string): RouteManifestEntry | undefined {
  // Vérifier les aliases
  const canonicalPath = ROUTE_ALIASES[path] || path;

  const findRoute = (routes: RouteManifestEntry[]): RouteManifestEntry | undefined => {
    for (const route of routes) {
      if (route.path === canonicalPath) return route;
      if (route.children) {
        const child = findRoute(route.children);
        if (child) return child;
      }
    }
    return undefined;
  };

  return findRoute(ROUTES_MANIFEST);
}

/**
 * Valider le manifest de routes
 */
export function validateRoutesManifest(): RouteValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const paths = new Set<string>();

  let publicRoutes = 0;
  let protectedRoutes = 0;
  let adminRoutes = 0;
  let redirects = 0;

  const validateRoute = (route: RouteManifestEntry, parentPath = ''): void => {
    const fullPath = route.path.startsWith('/') ? route.path : `${parentPath}/${route.path}`;

    // Vérifier les doublons
    if (paths.has(fullPath)) {
      errors.push(`Route dupliquée: ${fullPath}`);
    }
    paths.add(fullPath);

    // Vérifier les composants manquants
    if (!route.component && !route.redirect) {
      errors.push(`Route sans composant: ${fullPath}`);
    }

    // Vérifier les titres manquants
    if (!route.title) {
      warnings.push(`Route sans titre: ${fullPath}`);
    }

    // Compter les types
    if (route.redirect) {
      redirects++;
    } else if (route.role) {
      adminRoutes++;
    } else if (route.auth) {
      protectedRoutes++;
    } else {
      publicRoutes++;
    }

    // Valider les enfants
    if (route.children) {
      route.children.forEach(child => validateRoute(child, fullPath));
    }
  };

  ROUTES_MANIFEST.forEach(route => validateRoute(route));

  // Valider les aliases
  Object.entries(ROUTE_ALIASES).forEach(([alias, target]) => {
    if (!paths.has(target)) {
      warnings.push(`Alias pointe vers une route inexistante: ${alias} -> ${target}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalRoutes: paths.size,
      publicRoutes,
      protectedRoutes,
      adminRoutes,
      redirects
    }
  };
}

/**
 * Générer le sitemap XML
 */
export function generateSitemap(baseUrl: string): string {
  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ];

  const addRoute = (route: RouteManifestEntry): void => {
    if (route.noindex || route.auth || route.redirect) return;

    lines.push('  <url>');
    lines.push(`    <loc>${baseUrl}${route.path}</loc>`);
    if (route.priority !== undefined) {
      lines.push(`    <priority>${route.priority}</priority>`);
    }
    if (route.changefreq) {
      lines.push(`    <changefreq>${route.changefreq}</changefreq>`);
    }
    lines.push('  </url>');

    if (route.children) {
      route.children.forEach(addRoute);
    }
  };

  ROUTES_MANIFEST.forEach(addRoute);
  lines.push('</urlset>');

  return lines.join('\n');
}

/**
 * Obtenir les métadonnées SEO pour une route
 */
export function getRouteSEO(path: string): {
  title: string;
  description: string;
  keywords: string[];
  noindex: boolean;
} {
  const route = getRouteByPath(path);

  return {
    title: route?.title || 'EmotionsCare',
    description: route?.description || 'Votre plateforme de bien-être émotionnel',
    keywords: route?.keywords || ['bien-être', 'émotions', 'santé mentale'],
    noindex: route?.noindex || false
  };
}

/**
 * Vérifier si un utilisateur a accès à une route
 */
export function canAccessRoute(
  path: string,
  user?: { id: string; role?: string } | null
): { allowed: boolean; reason?: string } {
  const route = getRouteByPath(path);

  if (!route) {
    return { allowed: false, reason: 'Route not found' };
  }

  // Route publique
  if (!route.auth) {
    return { allowed: true };
  }

  // Route protégée sans utilisateur
  if (!user) {
    return { allowed: false, reason: 'Authentication required' };
  }

  // Route avec rôle spécifique
  if (route.role) {
    const requiredRoles = Array.isArray(route.role) ? route.role : [route.role];
    if (!user.role || !requiredRoles.includes(user.role)) {
      return { allowed: false, reason: 'Insufficient permissions' };
    }
  }

  return { allowed: true };
}

/**
 * Obtenir les breadcrumbs pour une route
 */
export function getBreadcrumbs(path: string): { path: string; title: string }[] {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: { path: string; title: string }[] = [];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const route = getRouteByPath(currentPath);
    if (route) {
      breadcrumbs.push({
        path: currentPath,
        title: route.title || segment
      });
    }
  }

  return breadcrumbs;
}

export default buildUnifiedRoutes;

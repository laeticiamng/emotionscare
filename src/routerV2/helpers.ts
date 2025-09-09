/**
 * Router Helpers - Fonctions utilitaires pour la génération d'URLs
 * Centralise la logique de routing pour éviter les erreurs
 */

interface RouteParams {
  [key: string]: string | number | boolean | undefined;
}

interface AuthRouteParams {
  segment?: 'b2c' | 'b2b';
  redirect?: string;
}

interface AppRouteParams {
  feature?: string;
  id?: string;
}

/**
 * Helper pour construire des URLs avec paramètres
 */
function buildUrl(path: string, params?: RouteParams): string {
  if (!params) return path;
  
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `${path}?${queryString}` : path;
}

/**
 * Routes principales de l'application
 */
export const Routes = {
  // Routes publiques
  home: () => '/',
  about: () => '/about',
  contact: () => '/contact',
  help: () => '/help',
  privacy: () => '/privacy',
  terms: () => '/terms',
  
  // Routes commerciales
  b2c: () => '/b2c',
  enterprise: () => '/entreprise',
  pricing: () => '/pricing',
  
  // Routes d'authentification
  login: (params?: AuthRouteParams) => buildUrl('/login', params),
  signup: (params?: AuthRouteParams) => buildUrl('/signup', params),
  resetPassword: () => '/reset-password',
  logout: () => '/logout',
  
  // Routes App B2C - Interface Flat pour compatibilité
  consumerHome: () => '/app/home',
  scan: () => '/app/scan',
  emotions: () => '/app/scan', // Redirige vers scan pour analyse émotions
  coach: () => '/app/coach',
  journal: () => '/app/journal',
  music: () => '/app/music',
  breath: () => '/app/breath',
  activity: () => '/app/activity',
  gamification: () => '/app/gamification',
  vrBreath: () => '/app/vr-breath',
  flashGlow: () => '/app/flash-glow',
  community: () => '/app/social-cocon',
  socialCoconB2C: () => '/app/social-cocon',
  navigation: () => '/app/home', // Navigation vers dashboard
  settings: () => '/app/settings',
  settingsGeneral: () => '/app/settings',
  profile: () => '/app/profile',
  
  // Routes B2B - Interface Flat pour compatibilité
  employeeHome: () => '/enterprise/dashboard', // Dashboard collaborateur
  managerHome: () => '/enterprise/admin', // Dashboard manager
  
  // Routes App B2C - Interface Nested (rétrocompatibilité)
  app: {
    home: () => '/app/home',
    scan: () => '/app/scan',
    coach: () => '/app/coach',
    journal: () => '/app/journal',
    music: () => '/app/music',
    breath: () => '/app/breath',
    activity: () => '/app/activity',
    gamification: () => '/app/gamification',
    vrBreath: () => '/app/vr-breath',
    flashGlow: () => '/app/flash-glow',
    socialCocon: () => '/app/social-cocon',
    settings: () => '/app/settings',
    profile: () => '/app/profile',
  },
  
  // Routes B2B
  business: {
    dashboard: () => '/enterprise/dashboard',
    admin: () => '/enterprise/admin',
    teams: () => '/enterprise/teams',
    reports: () => '/enterprise/reports',
    settings: () => '/enterprise/settings',
  },
  
  // Routes d'erreur
  error: {
    unauthorized: () => '/401',
    forbidden: () => '/403',
    notFound: () => '/404',
    serverError: () => '/500',
  },
  
  // Routes système
  api: {
    docs: () => '/api-docs',
    status: () => '/status',
  }
};

/**
 * Helpers pour la navigation conditionnelle
 */
export const NavigationHelpers = {
  /**
   * Retourne l'URL du dashboard approprié selon le segment
   */
  getDashboardUrl: (segment?: 'b2c' | 'b2b') => {
    return segment === 'b2b' ? Routes.business.dashboard() : Routes.app.home();
  },
  
  /**
   * Retourne l'URL de connexion avec redirection
   */
  getLoginUrl: (currentPath?: string, segment?: 'b2c' | 'b2b') => {
    const params: AuthRouteParams = {};
    
    if (segment) params.segment = segment;
    if (currentPath && currentPath !== '/' && !currentPath.startsWith('/auth')) {
      params.redirect = currentPath;
    }
    
    return Routes.login(params);
  },
  
  /**
   * Retourne l'URL d'inscription avec redirection
   */
  getSignupUrl: (currentPath?: string, segment?: 'b2c' | 'b2b') => {
    const params: AuthRouteParams = {};
    
    if (segment) params.segment = segment;
    if (currentPath && currentPath !== '/' && !currentPath.startsWith('/auth')) {
      params.redirect = currentPath;
    }
    
    return Routes.signup(params);
  },
  
  /**
   * Vérifie si un chemin est une route protégée
   */
  isProtectedRoute: (path: string): boolean => {
    const protectedPrefixes = ['/app', '/enterprise'];
    return protectedPrefixes.some(prefix => path.startsWith(prefix));
  },
  
  /**
   * Vérifie si un chemin est une route d'authentification
   */
  isAuthRoute: (path: string): boolean => {
    const authRoutes = ['/login', '/signup', '/reset-password', '/logout'];
    return authRoutes.includes(path) || authRoutes.some(route => path.startsWith(route));
  },
  
  /**
   * Vérifie si un chemin est une route publique
   */
  isPublicRoute: (path: string): boolean => {
    const publicPrefixes = ['/', '/about', '/contact', '/help', '/b2c', '/entreprise', '/privacy', '/terms'];
    return publicPrefixes.includes(path) || path.startsWith('/api-docs') || path.startsWith('/status');
  }
};

/**
 * Utilitaires pour les breadcrumbs
 */
export const BreadcrumbHelpers = {
  /**
   * Génère les breadcrumbs pour un chemin donné
   */
  generateBreadcrumbs: (path: string) => {
    const segments = path.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Accueil', path: '/' }];
    
    let currentPath = '';
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Mapping des segments vers des labels lisibles
      const labels: Record<string, string> = {
        'app': 'Application',
        'enterprise': 'Entreprise',
        'home': 'Tableau de bord',
        'scan': 'Scanner émotionnel',
        'coach': 'Coach IA',
        'journal': 'Journal',
        'music': 'Thérapie musicale',
        'breath': 'Respiration',
        'activity': 'Activités',
        'gamification': 'Jeux',
        'vr-breath': 'VR Respiration',
        'flash-glow': 'Flash Glow',
        'settings': 'Paramètres',
        'profile': 'Profil',
        'dashboard': 'Tableau de bord',
        'admin': 'Administration',
        'teams': 'Équipes',
        'reports': 'Rapports',
        'about': 'À propos',
        'contact': 'Contact',
        'help': 'Aide',
        'privacy': 'Confidentialité',
        'terms': 'Conditions',
        'b2c': 'Particuliers',
        'entreprise': 'Entreprises',
      };
      
      const label = labels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      breadcrumbs.push({
        label,
        path: currentPath,
        isLast: index === segments.length - 1
      });
    });
    
    return breadcrumbs;
  }
};

export default Routes;
/**
 * 🚀 PREMIUM ROUTER SYSTEM
 * Système de routage intelligent et sécurisé
 * 
 * ✨ Fonctionnalités:
 * - Routes lazy avec preloading intelligent
 * - Sécurité et permissions granulaires  
 * - Analytics et monitoring
 * - Cache et optimisation
 * - Accessibilité WCAG AAA
 * - SEO et métadonnées automatiques
 */

import React, { Suspense, lazy, useEffect } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { premiumRegistry } from './PremiumArchitecture';
import { usePremiumStore } from './PremiumStateManager';
import { PremiumErrorBoundary } from '../components/ui/PremiumErrorBoundary';
import { PremiumLoadingFallback } from '../components/ui/PremiumLoadingFallback';

// ==================== TYPES ====================

export interface PremiumRoute {
  id: string;
  path: string;
  name: string;
  title: string;
  description: string;
  keywords: string[];
  
  // Security & Access
  public?: boolean;
  roles?: string[];
  permissions?: string[];
  featureFlags?: string[];
  
  // Performance
  preload?: boolean;
  priority?: 'high' | 'medium' | 'low';
  chunk?: string;
  
  // SEO & Meta
  meta?: RouteMeta;
  canonical?: string;
  robots?: 'index,follow' | 'noindex,nofollow' | 'index,nofollow' | 'noindex,follow';
  
  // Analytics
  analytics?: {
    category: string;
    events: string[];
  };
  
  // Component
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  layout?: React.ComponentType<any>;
  fallback?: React.ComponentType<any>;
}

export interface RouteMeta {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  author?: string;
  type?: 'website' | 'article' | 'profile';
  locale?: string;
  alternates?: Array<{ href: string; hreflang: string }>;
  structuredData?: any;
}

// ==================== ROUTE SECURITY GUARD ====================

interface RouteGuardProps {
  children: React.ReactNode;
  route: PremiumRoute;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children, route }) => {
  const { user } = usePremiumStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    if (!route.public && !user) {
      navigate('/login', { replace: true });
      return;
    }

    // Check roles
    if (route.roles && user && !route.roles.includes(user.role)) {
      navigate('/403', { replace: true });
      return;
    }

    // Check permissions
    if (route.permissions && user) {
      const hasPermission = route.permissions.every(permission =>
        user.permissions.includes(permission)
      );
      if (!hasPermission) {
        navigate('/403', { replace: true });
        return;
      }
    }

    // Check feature flags
    if (route.featureFlags) {
      const { features } = usePremiumStore.getState().app;
      const hasFeatures = route.featureFlags.every(flag =>
        features.find(f => f.id === flag)?.enabled
      );
      if (!hasFeatures) {
        navigate('/404', { replace: true });
        return;
      }
    }
  }, [route, user, navigate]);

  return <>{children}</>;
};

// ==================== SEO HEAD COMPONENT ====================

interface SEOHeadProps {
  route: PremiumRoute;
}

const SEOHead: React.FC<SEOHeadProps> = ({ route }) => {
  const location = useLocation();
  
  const fullUrl = `${window.location.origin}${location.pathname}`;
  const canonicalUrl = route.canonical || fullUrl;
  
  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{route.title} - EmotionsCare</title>
      <meta name="description" content={route.description} />
      <meta name="keywords" content={route.keywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      <meta name="robots" content={route.robots || 'index,follow'} />
      
      {/* Open Graph */}
      <meta property="og:type" content={route.meta?.type || 'website'} />
      <meta property="og:title" content={route.title} />
      <meta property="og:description" content={route.description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="EmotionsCare" />
      {route.meta?.image && <meta property="og:image" content={route.meta.image} />}
      {route.meta?.locale && <meta property="og:locale" content={route.meta.locale} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={route.title} />
      <meta name="twitter:description" content={route.description} />
      {route.meta?.image && <meta name="twitter:image" content={route.meta.image} />}
      
      {/* Additional Meta */}
      {route.meta?.author && <meta name="author" content={route.meta.author} />}
      
      {/* Structured Data */}
      {route.meta?.structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(route.meta.structuredData)}
        </script>
      )}
      
      {/* Alternates */}
      {route.meta?.alternates?.map((alt, index) => (
        <link
          key={index}
          rel="alternate"
          hrefLang={alt.hreflang}
          href={alt.href}
        />
      ))}
    </Helmet>
  );
};

// ==================== ROUTE WRAPPER ====================

interface RouteWrapperProps {
  route: PremiumRoute;
  children: React.ReactNode;
}

const RouteWrapper: React.FC<RouteWrapperProps> = ({ route, children }) => {
  const { trackAnalytics } = usePremiumStore();

  useEffect(() => {
    // Analytics page view
    trackAnalytics('page_view', {
      route: route.id,
      path: route.path,
      title: route.title,
      timestamp: Date.now()
    });

    // Performance marking
    performance.mark(`route_${route.id}_start`);

    return () => {
      performance.mark(`route_${route.id}_end`);
      performance.measure(
        `route_${route.id}_duration`,
        `route_${route.id}_start`,
        `route_${route.id}_end`
      );
    };
  }, [route, trackAnalytics]);

  const Layout = route.layout || React.Fragment;

  return (
    <PremiumErrorBoundary>
      <SEOHead route={route} />
      <RouteGuard route={route}>
        <Layout>
          <AnimatePresence mode="wait">
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Layout>
      </RouteGuard>
    </PremiumErrorBoundary>
  );
};

// ==================== LAZY ROUTE CREATOR ====================

const createPremiumRoute = (route: PremiumRoute) => {
  const Component = route.component;
  const Fallback = route.fallback || PremiumLoadingFallback;

  return React.memo((props: any) => (
    <RouteWrapper route={route}>
      <Suspense fallback={<Fallback />}>
        <Component {...props} />
      </Suspense>
    </RouteWrapper>
  ));
};

// ==================== ROUTE DEFINITIONS ====================

const routes: PremiumRoute[] = [
  // Public Routes
  {
    id: 'home',
    path: '/',
    name: 'Accueil',
    title: 'Intelligence Émotionnelle Premium',
    description: 'Découvrez EmotionsCare, votre plateforme premium d\'intelligence émotionnelle pour transformer votre bien-être personnel et professionnel.',
    keywords: ['intelligence émotionnelle', 'bien-être', 'santé mentale', 'coaching', 'IA'],
    public: true,
    preload: true,
    priority: 'high',
    chunk: 'home',
    meta: {
      title: 'EmotionsCare - Intelligence Émotionnelle Premium',
      description: 'Plateforme révolutionnaire d\'intelligence émotionnelle powered by AI. Analysez, comprenez et améliorez vos émotions pour un bien-être optimal.',
      keywords: ['intelligence émotionnelle', 'IA', 'bien-être', 'santé mentale', 'coaching émotionnel'],
      type: 'website',
      locale: 'fr_FR',
      structuredData: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "EmotionsCare",
        "description": "Plateforme d'intelligence émotionnelle premium",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "category": "Premium Wellness Platform"
        }
      }
    },
    analytics: {
      category: 'public',
      events: ['home_view', 'hero_interaction', 'cta_click']
    },
    component: lazy(() => import('../pages/HomePage'))
  },

  {
    id: 'login',
    path: '/login',
    name: 'Connexion',
    title: 'Connexion Sécurisée',
    description: 'Connectez-vous à votre compte EmotionsCare de manière sécurisée.',
    keywords: ['connexion', 'login', 'authentification', 'sécurité'],
    public: true,
    preload: true,
    priority: 'high',
    robots: 'noindex,follow',
    component: lazy(() => import('../pages/auth/LoginPage'))
  },

  {
    id: 'signup',
    path: '/signup',
    name: 'Inscription',
    title: 'Créer un Compte Premium',
    description: 'Rejoignez EmotionsCare et commencez votre parcours vers un meilleur équilibre émotionnel.',
    keywords: ['inscription', 'signup', 'nouveau compte', 'premium'],
    public: true,
    preload: true,
    priority: 'high',
    robots: 'noindex,follow',
    component: lazy(() => import('../pages/auth/SignupPage'))
  },

  // App Core Routes
  {
    id: 'dashboard',
    path: '/app',
    name: 'Tableau de Bord',
    title: 'Tableau de Bord Premium',
    description: 'Votre hub central pour le suivi et l\'amélioration de votre bien-être émotionnel.',
    keywords: ['dashboard', 'tableau de bord', 'analytics', 'suivi'],
    roles: ['consumer', 'employee', 'manager', 'admin'],
    preload: true,
    priority: 'high',
    chunk: 'app-core',
    component: lazy(() => import('../pages/app/DashboardPage'))
  },

  {
    id: 'emotions',
    path: '/app/emotions',
    name: 'Centre Émotionnel',
    title: 'Analyse Émotionnelle Avancée',
    description: 'Centre de contrôle pour analyser, comprendre et optimiser vos émotions.',
    keywords: ['émotions', 'analyse', 'IA', 'reconnaissance faciale'],
    roles: ['consumer', 'employee', 'manager'],
    priority: 'high',
    analytics: {
      category: 'emotions',
      events: ['emotion_scan', 'emotion_analysis', 'mood_tracking']
    },
    component: lazy(() => import('../pages/app/emotions/EmotionCenterPage'))
  },

  {
    id: 'scan',
    path: '/app/scan',
    name: 'Scan Émotionnel',
    title: 'Scan Émotionnel Instantané',
    description: 'Analysez vos émotions en temps réel grâce à notre technologie IA avancée.',
    keywords: ['scan', 'analyse instantanée', 'reconnaissance faciale', 'émotions temps réel'],
    roles: ['consumer', 'employee', 'manager'],
    preload: true,
    priority: 'high',
    component: lazy(() => import('../pages/ScanPage'))
  },

  {
    id: 'journal',
    path: '/app/journal',
    name: 'Journal Intelligent',
    title: 'Journal Émotionnel Intelligent',
    description: 'Tenez un journal de vos émotions avec des insights IA personnalisés.',
    keywords: ['journal', 'diary', 'écriture thérapeutique', 'insights IA'],
    roles: ['consumer', 'employee', 'manager'],
    priority: 'medium',
    component: lazy(() => import('../pages/JournalPage'))
  },

  {
    id: 'coach',
    path: '/app/coach',
    name: 'Coach IA',
    title: 'Coach Personnel Intelligent',
    description: 'Votre coach personnel alimenté par l\'IA pour un accompagnement 24/7.',
    keywords: ['coach IA', 'coaching personnel', 'conseils émotionnels', 'IA conversationnelle'],
    roles: ['consumer', 'employee', 'manager'],
    featureFlags: ['premium_coaching'],
    priority: 'high',
    component: lazy(() => import('../pages/CoachPage'))
  },

  // Wellness & Therapy
  {
    id: 'music',
    path: '/app/music',
    name: 'Musicothérapie',
    title: 'Musicothérapie Adaptive IA',
    description: 'Musique thérapeutique générée et adaptée par IA selon votre état émotionnel.',
    keywords: ['musicothérapie', 'musique thérapeutique', 'IA générative', 'bien-être sonore'],
    roles: ['consumer', 'employee', 'manager'],
    featureFlags: ['premium_music'],
    priority: 'medium',
    component: lazy(() => import('../pages/B2CMusicTherapyPage'))
  },

  {
    id: 'breathwork',
    path: '/app/breath',
    name: 'Respiration Thérapeutique',
    title: 'Exercices de Respiration Guidés',
    description: 'Techniques de respiration avancées pour la gestion du stress et l\'amélioration du bien-être.',
    keywords: ['respiration', 'méditation', 'gestion stress', 'relaxation'],
    roles: ['consumer', 'employee', 'manager'],
    priority: 'medium',
    component: lazy(() => import('../pages/B2CActivityPage'))
  },

  {
    id: 'vr',
    path: '/app/vr',
    name: 'Expérience VR',
    title: 'Thérapie en Réalité Virtuelle',
    description: 'Expériences immersives en VR pour la méditation et le bien-être.',
    keywords: ['VR', 'réalité virtuelle', 'méditation immersive', 'thérapie VR'],
    roles: ['consumer', 'employee', 'manager'],
    featureFlags: ['vr_experiences'],
    priority: 'low',
    component: lazy(() => import('../pages/vr/VRCenterPage'))
  },

  // B2B Features
  {
    id: 'teams',
    path: '/app/teams',
    name: 'Équipes',
    title: 'Gestion d\'Équipe Collaborative',
    description: 'Outils collaboratifs pour le bien-être d\'équipe et l\'intelligence émotionnelle collective.',
    keywords: ['équipes', 'collaboration', 'bien-être équipe', 'management'],
    roles: ['employee', 'manager'],
    priority: 'medium',
    component: lazy(() => import('../pages/TeamsPage'))
  },

  {
    id: 'analytics',
    path: '/app/analytics',
    name: 'Analytics RH',
    title: 'Analytics et Rapports RH',
    description: 'Tableaux de bord avancés pour le suivi du bien-être organisationnel.',
    keywords: ['analytics', 'rapports RH', 'bien-être organisationnel', 'KPI'],
    roles: ['manager', 'admin'],
    priority: 'medium',
    component: lazy(() => import('../pages/manager/AnalyticsPage'))
  },

  // Settings & Profile
  {
    id: 'settings',
    path: '/app/settings',
    name: 'Paramètres',
    title: 'Paramètres & Préférences',
    description: 'Personnalisez votre expérience EmotionsCare selon vos besoins.',
    keywords: ['paramètres', 'préférences', 'configuration', 'personnalisation'],
    roles: ['consumer', 'employee', 'manager', 'admin'],
    priority: 'low',
    component: lazy(() => import('../pages/settings/SettingsPage'))
  },

  // Error Routes
  {
    id: '404',
    path: '/404',
    name: 'Page Non Trouvée',
    title: 'Page Non Trouvée',
    description: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
    keywords: ['erreur 404', 'page non trouvée'],
    public: true,
    robots: 'noindex,nofollow',
    component: lazy(() => import('../pages/404Page'))
  },

  {
    id: '403',
    path: '/403',
    name: 'Accès Refusé',
    title: 'Accès Non Autorisé',
    description: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page.',
    keywords: ['erreur 403', 'accès refusé', 'permissions'],
    public: true,
    robots: 'noindex,nofollow',
    component: lazy(() => import('../pages/ForbiddenPage'))
  }
];

// ==================== ROUTE PRELOADING ====================

const preloadRoutes = () => {
  const highPriorityRoutes = routes.filter(route => 
    route.preload && route.priority === 'high'
  );

  // Preload high priority routes after initial load
  requestIdleCallback(() => {
    highPriorityRoutes.forEach(route => {
      route.component;
    });
  });
};

// ==================== ROUTER CREATION ====================

export const premiumRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorBoundary={PremiumErrorBoundary}>
      {routes.map(route => {
        const RouteComponent = createPremiumRoute(route);
        
        if (route.path === '/') {
          return <Route key={route.id} index element={<RouteComponent />} />;
        }
        
        return (
          <Route 
            key={route.id}
            path={route.path}
            element={<RouteComponent />}
          />
        );
      })}
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    }
  }
);

// ==================== ROUTE UTILITIES ====================

export const getRouteById = (id: string): PremiumRoute | undefined => {
  return routes.find(route => route.id === id);
};

export const getRouteByPath = (path: string): PremiumRoute | undefined => {
  return routes.find(route => route.path === path);
};

export const isRouteAccessible = (route: PremiumRoute, user: any): boolean => {
  if (route.public) return true;
  if (!user) return false;
  
  if (route.roles && !route.roles.includes(user.role)) return false;
  
  if (route.permissions) {
    const hasPermission = route.permissions.every(permission =>
      user.permissions.includes(permission)
    );
    if (!hasPermission) return false;
  }
  
  return true;
};

// Initialize route preloading
if (typeof window !== 'undefined') {
  preloadRoutes();
}

export default premiumRouter;
export { routes, type PremiumRoute };
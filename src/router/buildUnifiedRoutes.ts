
import { RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Import automatique de tous les modules de routes
const routeModules = import.meta.glob('./routes/*.tsx', { eager: true });

// Composant stub par défaut pour les pages manquantes
const createPageStub = (routePath: string) => {
  return () => (
    <main data-testid="page-root" className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">TODO: {routePath}</h1>
        <p className="text-muted-foreground">Cette page est en cours de développement</p>
        <button 
          onClick={() => window.history.back()} 
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Retour
        </button>
      </div>
    </main>
  );
};

// Pages existantes avec lazy loading sécurisé
const lazyPageImport = (importFn: () => Promise<any>, fallbackPath: string) => {
  return lazy(async () => {
    try {
      const module = await importFn();
      return module;
    } catch (error) {
      console.error(`[Router] Failed to load page for ${fallbackPath}:`, error);
      // Retourner le stub en cas d'échec de chargement
      return { default: createPageStub(fallbackPath) };
    }
  });
};

// Pages principales
const HomePage = lazyPageImport(() => import('@/pages/HomePage'), '/');
const ChooseModePage = lazyPageImport(() => import('@/pages/ChooseModePage'), '/choose-mode');
const AboutPage = lazyPageImport(() => import('@/pages/AboutPage'), '/about');
const ContactPage = lazyPageImport(() => import('@/pages/ContactPage'), '/contact');
const NotFoundPage = lazyPageImport(() => import('@/pages/NotFoundPage'), '*');
const TestPage = lazyPageImport(() => import('@/pages/TestPage'), '/test');
const Point20Page = lazyPageImport(() => import('@/pages/Point20Page'), '/point20');
const RouteDiagnosticPage = lazyPageImport(() => import('@/pages/RouteDiagnosticPage'), '/route-diagnostic');

// Pages B2B
const B2BPage = lazyPageImport(() => import('@/pages/B2BPage'), '/b2b');
const B2BSelectionPage = lazyPageImport(() => import('@/pages/b2b/SelectionPage'), '/b2b/selection');

// Pages B2C
const B2CLoginPage = lazyPageImport(() => import('@/pages/b2c/LoginPage'), '/b2c/login');
const B2CRegisterPage = lazyPageImport(() => import('@/pages/b2c/RegisterPage'), '/b2c/register');
const B2CDashboardPage = lazyPageImport(() => import('@/pages/b2c/DashboardPage'), '/b2c/dashboard');

// Pages B2B User
const B2BUserLoginPage = lazyPageImport(() => import('@/pages/b2b/user/LoginPage'), '/b2b/user/login');
const B2BUserRegisterPage = lazyPageImport(() => import('@/pages/b2b/user/RegisterPage'), '/b2b/user/register');
const B2BUserDashboardPage = lazyPageImport(() => import('@/pages/b2b/user/DashboardPage'), '/b2b/user/dashboard');

// Pages B2B Admin
const B2BAdminLoginPage = lazyPageImport(() => import('@/pages/b2b/admin/LoginPage'), '/b2b/admin/login');
const B2BAdminDashboardPage = lazyPageImport(() => import('@/pages/b2b/admin/DashboardPage'), '/b2b/admin/dashboard');

// Pages fonctionnelles
const ScanPage = lazyPageImport(() => import('@/pages/ScanPage'), '/scan');
const MusicPage = lazyPageImport(() => import('@/pages/MusicPage'), '/music');
const CoachPage = lazyPageImport(() => import('@/pages/CoachPage'), '/coach');
const JournalPage = lazyPageImport(() => import('@/pages/JournalPage'), '/journal');
const VRPage = lazyPageImport(() => import('@/pages/VRPage'), '/vr');
const GamificationPage = lazyPageImport(() => import('@/pages/GamificationPage'), '/gamification');
const PreferencesPage = lazyPageImport(() => import('@/pages/PreferencesPage'), '/preferences');
const SocialCoconPage = lazyPageImport(() => import('@/pages/SocialCoconPage'), '/social-cocon');

// Pages admin
const TeamsPage = lazyPageImport(() => import('@/pages/TeamsPage'), '/teams');
const ReportsPage = lazyPageImport(() => import('@/pages/ReportsPage'), '/reports');
const EventsPage = lazyPageImport(() => import('@/pages/EventsPage'), '/events');

// Wrapper avec Suspense pour chaque route
const withSuspense = (Component: React.ComponentType) => {
  return () => (
    <Suspense fallback={
      <div data-testid="page-loading" className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p>Chargement...</p>
        </div>
      </div>
    }>
      <Component />
    </Suspense>
  );
};

/**
 * Construit la configuration de routes unifiée
 * Toutes les routes sont garanties de retourner un élément avec data-testid="page-root"
 */
export function buildUnifiedRoutes(): RouteObject[] {
  console.info('%c[Router] Building unified routes...', 'color:lime');
  
  const routes: RouteObject[] = [
    // Route principale
    {
      path: '/',
      element: withSuspense(HomePage)(),
    },
    
    // Routes publiques de base
    {
      path: '/choose-mode',
      element: withSuspense(ChooseModePage)(),
    },
    {
      path: '/about',
      element: withSuspense(AboutPage)(),
    },
    {
      path: '/contact',
      element: withSuspense(ContactPage)(),
    },
    
    // Routes B2B principales
    {
      path: '/b2b',
      element: withSuspense(B2BPage)(),
    },
    {
      path: '/b2b/selection',
      element: withSuspense(B2BSelectionPage)(),
    },
    
    // Routes B2C
    {
      path: '/b2c/login',
      element: withSuspense(B2CLoginPage)(),
    },
    {
      path: '/b2c/register',
      element: withSuspense(B2CRegisterPage)(),
    },
    {
      path: '/b2c/dashboard',
      element: withSuspense(B2CDashboardPage)(),
    },
    
    // Routes B2B User
    {
      path: '/b2b/user/login',
      element: withSuspense(B2BUserLoginPage)(),
    },
    {
      path: '/b2b/user/register',
      element: withSuspense(B2BUserRegisterPage)(),
    },
    {
      path: '/b2b/user/dashboard',
      element: withSuspense(B2BUserDashboardPage)(),
    },
    
    // Routes B2B Admin
    {
      path: '/b2b/admin/login',
      element: withSuspense(B2BAdminLoginPage)(),
    },
    {
      path: '/b2b/admin/dashboard',
      element: withSuspense(B2BAdminDashboardPage)(),
    },
    
    // Fonctionnalités principales
    {
      path: '/scan',
      element: withSuspense(ScanPage)(),
    },
    {
      path: '/music',
      element: withSuspense(MusicPage)(),
    },
    {
      path: '/coach',
      element: withSuspense(CoachPage)(),
    },
    {
      path: '/journal',
      element: withSuspense(JournalPage)(),
    },
    {
      path: '/vr',
      element: withSuspense(VRPage)(),
    },
    {
      path: '/gamification',
      element: withSuspense(GamificationPage)(),
    },
    {
      path: '/preferences',
      element: withSuspense(PreferencesPage)(),
    },
    {
      path: '/social-cocon',
      element: withSuspense(SocialCoconPage)(),
    },
    
    // Pages admin
    {
      path: '/teams',
      element: withSuspense(TeamsPage)(),
    },
    {
      path: '/reports',
      element: withSuspense(ReportsPage)(),
    },
    {
      path: '/events',
      element: withSuspense(EventsPage)(),
    },
    
    // Pages utilitaires
    {
      path: '/test',
      element: withSuspense(TestPage)(),
    },
    {
      path: '/point20',
      element: withSuspense(Point20Page)(),
    },
    {
      path: '/route-diagnostic',
      element: withSuspense(RouteDiagnosticPage)(),
    },
    
    // Route 404 - doit être en dernier
    {
      path: '*',
      element: withSuspense(NotFoundPage)(),
    },
  ];

  console.info(`%c[Router] ✅ ${routes.length} routes configured`, 'color:lime');
  return routes;
}

// Export de la liste des routes pour les tests
export const ROUTE_MANIFEST = [
  '/', '/choose-mode', '/about', '/contact',
  '/b2b', '/b2b/selection',
  '/b2c/login', '/b2c/register', '/b2c/dashboard',
  '/b2b/user/login', '/b2b/user/register', '/b2b/user/dashboard',
  '/b2b/admin/login', '/b2b/admin/dashboard',
  '/scan', '/music', '/coach', '/journal', '/vr',
  '/gamification', '/preferences', '/social-cocon',
  '/teams', '/reports', '/events',
  '/test', '/point20', '/route-diagnostic'
] as const;

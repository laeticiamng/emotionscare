
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

// Import direct des routes pour éviter les échecs silencieux
import { publicRoutes } from './routes/publicRoutes';
import { userRoutes } from './routes/userRoutes';
import { adminRoutes } from './routes/adminRoutes';
import { b2bRoutes } from './routes/b2bRoutes';
import { vrRoutes } from './routes/vrRoutes';
import { scanRoutes } from './routes/scanRoutes';
import { musicRoutes } from './routes/musicRoutes';
import { onboardingRoutes } from './routes/onboardingRoutes';
import { securityRoutes } from './routes/securityRoutes';
import { gamificationRoutes } from './routes/gamificationRoutes';
import { accessRoutes } from './routes/accessRoutes';
import { reportsRoutes } from './routes/reportsRoutes';
import { feedbackRoutes } from './routes/feedbackRoutes';
import { innovationRoutes } from './routes/innovationRoutes';
import { privacyRoutes } from './routes/privacyRoutes';
import { notificationRoutes } from './routes/notificationRoutes';
import { auditRoutes } from './routes/auditRoutes';
import { accessibilityRoutes } from './routes/accessibilityRoutes';

// Fallback universel pour les lazy imports
const LazyPageWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div data-testid="page-loading" className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  }>
    {children}
  </Suspense>
);

// Page 404 universelle
const NotFoundPage = lazy(() => 
  import('@/pages/NotFoundPage').catch(() => ({
    default: () => (
      <div data-testid="page-root" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Page introuvable</h1>
          <p className="text-muted-foreground">La page que vous cherchez n'existe pas.</p>
        </div>
      </div>
    )
  }))
);

console.log('%c[Router] Building unified routes...', 'color:orange; font-weight:bold');

export function buildUnifiedRoutes(): RouteObject[] {
  const routes: RouteObject[] = [];

  try {
    // Routes publiques (toujours en premier)
    routes.push(...publicRoutes);
    console.log('%c[Router] ✅ Public routes loaded:', 'color:green', publicRoutes.length);

    // Routes utilisateur
    routes.push(...userRoutes);
    console.log('%c[Router] ✅ User routes loaded:', 'color:green', userRoutes.length);

    // Routes admin
    routes.push(...adminRoutes);
    console.log('%c[Router] ✅ Admin routes loaded:', 'color:green', adminRoutes.length);

    // Routes B2B
    routes.push(...b2bRoutes);
    console.log('%c[Router] ✅ B2B routes loaded:', 'color:green', b2bRoutes.length);

    // Routes des fonctionnalités
    routes.push(...vrRoutes);
    routes.push(...scanRoutes);
    routes.push(...musicRoutes);
    routes.push(...onboardingRoutes);
    routes.push(...securityRoutes);
    routes.push(...gamificationRoutes);
    routes.push(...accessRoutes);
    routes.push(...reportsRoutes);
    routes.push(...feedbackRoutes);
    routes.push(...innovationRoutes);
    routes.push(...privacyRoutes);
    routes.push(...notificationRoutes);
    routes.push(...auditRoutes);
    routes.push(...accessibilityRoutes);

    console.log('%c[Router] ✅ Feature routes loaded', 'color:green');

  } catch (error) {
    console.error('%c[Router] ❌ Error loading routes:', 'color:red', error);
  }

  // Route 404 (toujours en dernier)
  routes.push({
    path: '*',
    element: (
      <LazyPageWrapper>
        <NotFoundPage />
      </LazyPageWrapper>
    ),
  });

  console.log('%c[Router] ✅ Total routes configured:', 'color:blue; font-weight:bold', routes.length);
  
  return routes;
}

// Manifest des routes pour les tests
export const ROUTE_MANIFEST = [
  '/',
  '/about',
  '/contact',
  '/browsing',
  '/privacy',
  '/login',
  '/b2c/login',
  '/b2c/register',
  '/reset-password',
  '/auth/callback',
  '/b2c/dashboard',
  '/b2b/selection',
  '/b2b/user/login',
  '/b2b/user/register',
  '/b2b/user/dashboard',
  '/b2b/admin/login',
  '/b2b/admin/dashboard',
  '/b2b',
  '/vr',
  '/meditation',
  '/scan',
  '/music',
  '/onboarding',
  '/security',
  '/gamification',
  '/access-diagnostic',
  '/reports',
  '/feedback',
  '/innovation',
  '/privacy',
  '/notifications',
  '/audit',
  '/accessibility',
  '/teams',
  '/events',
  '/optimisation'
];

console.log('%c[Router] ✅ Route manifest ready:', 'color:purple', ROUTE_MANIFEST.length, 'routes');

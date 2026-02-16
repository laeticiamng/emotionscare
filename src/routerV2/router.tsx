/**
 * RouterV2 - Router unifié principal
 * TICKET: FE/BE-Router-Cleanup-01
 * VERSION: 3.0.0 - Modularisé par segment (public, b2c, b2b, admin)
 *
 * Les lazy imports et le componentMap sont répartis dans src/routerV2/routes/
 */

import { logger } from '@/lib/logger';

logger.debug('Router loaded', { timestamp: new Date().toISOString() }, 'SYSTEM');

declare global {
  interface Window {
    __routerV2Logged?: boolean;
  }
}

import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES_REGISTRY } from './registry';
import { LegacyRedirect, ROUTE_ALIAS_ENTRIES } from './aliases';
import { AuthGuard, ModeGuard, RoleGuard } from './guards';
import type { RouteMeta } from './schema';
import { PageErrorBoundary } from '@/components/error/PageErrorBoundary';
import { LoadingState } from '@/components/loading/LoadingState';
import EnhancedShell from '@/components/layout/EnhancedShell';
import FloatingActionMenu from '@/components/layout/FloatingActionMenu';

// ═══════════════════════════════════════════════════════════
// COMPONENT MAP — importé depuis les modules par segment
// ═══════════════════════════════════════════════════════════
import { componentMap } from './routes/index';

// Pages DEV-only (Nyvée test)
const NyveeTestPage = lazy(() => import('@/pages/NyveeTestPage'));

// ═══════════════════════════════════════════════════════════
// WRAPPER COMPONENTS
// ═══════════════════════════════════════════════════════════

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense
    fallback={
      <div className="bg-background">
        <LoadingState
          variant="page"
          text="Chargement de la page..."
          className="min-h-screen"
        />
      </div>
    }
  >
    {children}
  </Suspense>
);

const MarketingLayout = lazy(() => import('@/components/layout/MarketingLayout'));

const LayoutWrapper: React.FC<{
  children: React.ReactNode;
  layout?: 'marketing' | 'app' | 'simple' | 'app-sidebar'
}> = ({ children, layout = 'app' }) => {
  if (layout === 'simple') {
    return <>{children}</>;
  }

  if (layout === 'marketing') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <MarketingLayout>{children}</MarketingLayout>
      </Suspense>
    );
  }

  return (
    <EnhancedShell>
      {children}
      <FloatingActionMenu />
    </EnhancedShell>
  );
};

// ═══════════════════════════════════════════════════════════
// GÉNÉRATION DES ROUTES
// ═══════════════════════════════════════════════════════════

function applyRouteGuards(element: React.ReactNode, routeMeta: RouteMeta) {
  let guardedElement = element;

  if (routeMeta.segment && routeMeta.segment !== 'public') {
    guardedElement = (
      <ModeGuard segment={routeMeta.segment}>
        {guardedElement}
      </ModeGuard>
    );
  }

  if (routeMeta.role || (routeMeta.allowedRoles && routeMeta.allowedRoles.length > 0)) {
    guardedElement = (
      <RoleGuard requiredRole={routeMeta.role} allowedRoles={routeMeta.allowedRoles}>
        {guardedElement}
      </RoleGuard>
    );
  }

  if (routeMeta.guard || routeMeta.requireAuth || routeMeta.role || (routeMeta.allowedRoles && routeMeta.allowedRoles.length > 0)) {
    guardedElement = <AuthGuard>{guardedElement}</AuthGuard>;
  }

  return guardedElement;
}

function createRouteElement(routeMeta: RouteMeta) {
  const Component = componentMap[routeMeta.component];

  if (!Component) {
    return <Navigate to="/404" replace />;
  }

  const element = (
    <SuspenseWrapper>
      <LayoutWrapper layout={routeMeta.layout}>
        <PageErrorBoundary route={routeMeta.path} feature={routeMeta.name} resetKeys={[routeMeta.path]}>
          <Component />
        </PageErrorBoundary>
      </LayoutWrapper>
    </SuspenseWrapper>
  );

  return applyRouteGuards(element, routeMeta);
}

// ═══════════════════════════════════════════════════════════
// CRÉATION DU ROUTER
// ═══════════════════════════════════════════════════════════

const canonicalRoutes = ROUTES_REGISTRY.filter(route =>
  !route.deprecated &&
  route.path !== '*' &&
  !(route.hidden && !import.meta.env.DEV)
);

const deprecatedRoutes = ROUTES_REGISTRY.filter(route => route.deprecated && route.redirectTo);

logger.debug('Creating router', {
  canonicalRoutes: canonicalRoutes.length,
  hasTestNyveeRoute: !!ROUTES_REGISTRY.find(r => r.path === '/test-nyvee'),
}, 'SYSTEM');

export const router = createBrowserRouter([
  // Route de test Nyvée - DEV uniquement
  ...(import.meta.env.DEV ? [{
    path: '/test-nyvee',
    element: (
      <SuspenseWrapper>
        <NyveeTestPage />
      </SuspenseWrapper>
    ),
  }] : []),

  // Routes principales du registry
  ...canonicalRoutes.map(route => ({
    path: route.path,
    element: createRouteElement(route),
  })),

  // Aliases du registry
  ...canonicalRoutes.flatMap(route =>
    (route.aliases || []).map(alias => ({
      path: alias,
      element: createRouteElement(route),
    }))
  ),

  // Redirections des routes deprecated
  ...deprecatedRoutes.map(route => ({
    path: route.path,
    element: <Navigate to={route.redirectTo!} replace />,
  })),

  // Aliases des routes deprecated
  ...deprecatedRoutes.flatMap(route =>
    (route.aliases || []).map(alias => ({
      path: alias,
      element: <Navigate to={route.redirectTo!} replace />,
    }))
  ),

  // Aliases de compatibilité
  ...ROUTE_ALIAS_ENTRIES.map(alias => ({
    path: alias.from,
    element: <LegacyRedirect from={alias.from} to={alias.to} />,
  })),

  // Fallback 404
  {
    path: '*',
    element: (
      <SuspenseWrapper>
        {(() => {
          const NotFoundPage = componentMap['NotFoundPage'];
          return NotFoundPage ? <NotFoundPage /> : <div>Page non trouvée</div>;
        })()}
      </SuspenseWrapper>
    ),
  },
], {
  basename: import.meta.env.BASE_URL,
  future: {
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_relativeSplatPath: true,
    v7_skipActionErrorRevalidation: true,
  },
});

logger.info('Router created', { totalRoutes: router.routes.length }, 'SYSTEM');

export const routerV2 = router;
export default router;
export type AppRouter = typeof router;

// ═══════════════════════════════════════════════════════════
// VALIDATION AU DÉMARRAGE (DEV ONLY)
// ═══════════════════════════════════════════════════════════

if (import.meta.env.DEV) {
  const missingComponents = ROUTES_REGISTRY
    .filter(route => !componentMap[route.component])
    .map(route => `${route.name}: ${route.component}`);

  if (missingComponents.length > 0 && !window.__routerV2Logged) {
    logger.debug('RouterV2: composants manquants', { missingComponents }, 'SYSTEM');
  }

  if (!window.__routerV2Logged) {
    logger.info(`RouterV2 initialisé: ${canonicalRoutes.length} routes canoniques`, undefined, 'SYSTEM');
    window.__routerV2Logged = true;
  }
}

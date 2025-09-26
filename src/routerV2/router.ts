/**
 * RouterV2 - Configuration du routeur principal
 * Point d'entrée unifié pour toute la navigation de l'application
 */

import { createBrowserRouter } from 'react-router-dom';
import { ROUTES_REGISTRY } from './registry';
import { componentMap } from './index';
import * as Sentry from '@sentry/react';

// Export du componentMap pour utilisation externe
export { componentMap };

/**
 * Crée une route React Router à partir d'une configuration de registre
 */
function createRouteFromRegistry(route: any) {
  const Component = componentMap[route.component];
  
  if (!Component) {
    console.warn(`[RouterV2] Component "${route.component}" not found for route "${route.path}"`);
    return null;
  }

  return {
    path: route.path,
    element: Sentry.withErrorBoundary(Component, {
      tags: { route: route.path, component: route.component },
    }),
    loader: route.loader,
    errorElement: route.errorElement,
  };
}

/**
 * Configuration principale du routeur
 */
export const router = createBrowserRouter(
  ROUTES_REGISTRY.map(createRouteFromRegistry).filter(Boolean),
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

export type AppRouter = typeof router;

// Alias pour compatibilité
export const routerV2 = router;
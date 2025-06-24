
import React from 'react';
import { RouteObject } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ComponentLoadingFallback } from '@/components/ui/loading-fallback';

// Import de la nouvelle page d'accueil
import LandingPage from '@/pages/LandingPage';
import ChooseModePage from '@/pages/ChooseModePage';
import B2BSelectionPage from '@/pages/B2BSelectionPage';

// Lazy imports pour les autres pages
const Point20Page = React.lazy(() => import('@/pages/Point20Page'));

export function buildUnifiedRoutes(): RouteObject[] {
  console.log('🔥 Building unified routes with NEW LandingPage...');
  
  return [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <LandingPage />,
        },
        {
          path: 'choose-mode',
          element: <ChooseModePage />,
        },
        {
          path: 'b2b/selection',
          element: <B2BSelectionPage />,
        },
        {
          path: 'point20',
          element: (
            <React.Suspense fallback={<ComponentLoadingFallback />}>
              <Point20Page />
            </React.Suspense>
          ),
        },
        // Pages browsing / demo
        {
          path: 'browsing',
          element: <LandingPage />, // Temporairement, redirect vers la home
        },
      ],
    },
  ];
}

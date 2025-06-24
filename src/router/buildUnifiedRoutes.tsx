
import React from 'react';
import { RouteObject } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ComponentLoadingFallback } from '@/components/ui/loading-fallback';

// Import des pages principales
import HomePage from '@/pages/HomePage';
import ChooseModePage from '@/pages/ChooseModePage';
import B2BSelectionPage from '@/pages/B2BSelectionPage';

// Lazy imports pour les autres pages
const Point20Page = React.lazy(() => import('@/pages/Point20Page'));

export function buildUnifiedRoutes(): RouteObject[] {
  console.log('🔥 Building unified routes...');
  
  return [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <HomePage />,
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
          element: <HomePage />, // Temporairement, redirect vers la home
        },
      ],
    },
  ];
}


import React from 'react';
import { RouteObject } from 'react-router-dom';
import ImmersiveHome from '@/pages/ImmersiveHome';
import B2BSelectionPage from '@/pages/auth/B2BSelectionPage';
import OptimizationPage from '@/pages/OptimizationPage';
import TeamsPage from '@/pages/TeamsPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Define routes
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <ImmersiveHome />,
  },
  {
    path: '/b2b/selection',
    element: <B2BSelectionPage />,
  },
  {
    path: '/teams',
    element: <TeamsPage />,
  },
  {
    path: '/optimization',
    element: <OptimizationPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

// Export default and named export for flexibility
export default routes;

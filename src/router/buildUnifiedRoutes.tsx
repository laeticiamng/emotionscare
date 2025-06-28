
import React, { Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import LoadingAnimation from '@/components/ui/LoadingAnimation';
import { homeRoutes } from './routes/homeRoutes';
import { publicRoutes } from './routes/publicRoutes';
import { innovationRoutes } from './routes/innovationRoutes';
import { rhRoutes } from './routes/rhRoutes';

// Page components avec lazy loading
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const ChooseModePage = React.lazy(() => import('@/pages/ChooseModePage'));
const AuthPage = React.lazy(() => import('@/pages/AuthPage'));
const B2BSelectionPage = React.lazy(() => import('@/pages/B2BSelectionPage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));
const TestPage = React.lazy(() => import('@/pages/TestPage'));
const Point20Page = React.lazy(() => import('@/pages/Point20Page'));

// Wrapper pour Suspense
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingAnimation size="lg" />
    </div>
  }>
    {children}
  </Suspense>
);

export const buildUnifiedRoutes = (): RouteObject[] => {
  return [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <SuspenseWrapper>
              <HomePage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'choose-mode',
          element: (
            <SuspenseWrapper>
              <ChooseModePage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'auth',
          element: (
            <SuspenseWrapper>
              <AuthPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'b2b',
          element: (
            <SuspenseWrapper>
              <B2BSelectionPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'test',
          element: (
            <SuspenseWrapper>
              <TestPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'point20',
          element: (
            <SuspenseWrapper>
              <Point20Page />
            </SuspenseWrapper>
          ),
        },
        // Intégration des routes des modules
        ...innovationRoutes,
        ...rhRoutes,
      ],
    },
    // Route 404 - doit être la dernière
    {
      path: '*',
      element: (
        <SuspenseWrapper>
          <NotFoundPage />
        </SuspenseWrapper>
      ),
    },
  ];
};

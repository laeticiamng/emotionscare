
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Shell from '@/Shell';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Import direct pour la page d'accueil
import Home from '@/Home';
import TestPage from '@/pages/TestPage';

// Lazy imports pour les autres pages
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Wrapper pour les composants lazy
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

console.log('Router configuration is loading'); // Debug log

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'test',
        element: <TestPage />,
      },
      {
        path: 'choose-mode',
        element: (
          <LazyWrapper>
            <ChooseModePage />
          </LazyWrapper>
        ),
      },
      {
        path: '*',
        element: (
          <LazyWrapper>
            <NotFoundPage />
          </LazyWrapper>
        ),
      },
    ],
  },
]);

console.log('Router configuration loaded successfully'); // Debug log

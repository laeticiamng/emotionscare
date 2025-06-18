
import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import Shell from '@/Shell';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const AuditPage = lazy(() => import('@/pages/AuditPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'audit',
        element: <AuditPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
    ],
  },
]);


import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const Point20Page = lazy(() => import('@/pages/Point20Page'));

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/choose-mode',
    element: <ChooseModePage />,
  },
  {
    path: '/point20',
    element: <Point20Page />,
  },
  {
    path: '/about',
    element: <div data-testid="page-root"><h1>À propos - Page en construction</h1></div>,
  },
  {
    path: '/contact',
    element: <div data-testid="page-root"><h1>Contact - Page en construction</h1></div>,
  },
  {
    path: '/browsing',
    element: <div data-testid="page-root"><h1>Navigation - Page en construction</h1></div>,
  },
  {
    path: '/privacy',
    element: <div data-testid="page-root"><h1>Confidentialité - Page en construction</h1></div>,
  },
];

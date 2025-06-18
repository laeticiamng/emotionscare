
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const BrowsingPage = lazy(() => import('@/pages/BrowsingPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const B2CLoginPage = lazy(() => import('@/pages/B2CLoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/B2CRegisterPage'));

export const publicRoutes: RouteObject[] = [
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  {
    path: '/browsing',
    element: <BrowsingPage />,
  },
  {
    path: '/privacy',
    element: <PrivacyPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/b2c/login',
    element: <B2CLoginPage />,
  },
  {
    path: '/b2c/register',
    element: <B2CRegisterPage />,
  },
];

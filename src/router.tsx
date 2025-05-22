
import React from 'react';
import { Navigate } from 'react-router-dom';

// Import pages
const Home = React.lazy(() => import('./Home'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const NotFoundPage = React.lazy(() => import('./pages/error/NotFoundPage'));
const ForbiddenPage = React.lazy(() => import('./pages/error/ForbiddenPage'));
const ServerErrorPage = React.lazy(() => import('./pages/error/ServerErrorPage'));
const Legal = React.lazy(() => import('./pages/Legal'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));

// Define routes
const routes = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/legal',
    element: <Legal />
  },
  {
    path: '/privacy',
    element: <PrivacyPolicy />
  },
  {
    path: '/terms',
    element: <TermsOfService />
  },
  {
    path: '/contact',
    element: <ContactPage />
  },
  {
    path: '/forbidden',
    element: <ForbiddenPage />
  },
  {
    path: '/404',
    element: <NotFoundPage />
  },
  {
    path: '/500',
    element: <ServerErrorPage />
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />
  }
];

export default routes;

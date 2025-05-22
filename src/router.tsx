
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
const CookiesPage = React.lazy(() => import('./pages/CookiesPage'));
const SocialCocoonPage = React.lazy(() => import('./pages/SocialCocoonPage'));
const TeamPage = React.lazy(() => import('./pages/TeamPage'));
const Support = React.lazy(() => import('./pages/Support'));
const NotImplementedPage = React.lazy(() => import('./pages/NotImplementedPage'));
const B2CDashboardPage = React.lazy(() => import('./pages/b2c/DashboardPage'));
const SessionsPage = React.lazy(() => import('./pages/SessionsPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const VRAnalyticsPage = React.lazy(() => import('./pages/VRAnalyticsPage'));
const VRSessionPage = React.lazy(() => import('./pages/VRSessionPage'));
const CommunityAdminPage = React.lazy(() => import('./pages/CommunityAdminPage'));

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
    path: '/b2c/dashboard',
    element: <B2CDashboardPage />
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
    path: '/cookies',
    element: <CookiesPage />
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
    path: '/social',
    element: <SocialCocoonPage />
  },
  {
    path: '/team',
    element: <TeamPage />
  },
  {
    path: '/support',
    element: <Support />
  },
  {
    path: '/sessions',
    element: <SessionsPage />
  },
  {
    path: '/settings',
    element: <SettingsPage />
  },
  {
    path: '/vr-analytics',
    element: <VRAnalyticsPage />
  },
  {
    path: '/vr-session/:id',
    element: <VRSessionPage />
  },
  {
    path: '/community-admin',
    element: <CommunityAdminPage />
  },
  {
    path: '/coming-soon',
    element: <NotImplementedPage />
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />
  }
];

export default routes;

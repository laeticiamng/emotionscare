
import React from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import pages
const Home = React.lazy(() => import('./Home'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const NotFoundPage = React.lazy(() => import('./pages/errors/NotFoundPage'));
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
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));

// Journal pages
const NewJournalEntryPage = React.lazy(() => import('./pages/journal/NewJournalEntryPage'));
const JournalEntryPage = React.lazy(() => import('./pages/journal/JournalEntryPage'));

// Define routes
const routes = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
  },
  {
    path: '/profile',
    element: <ProtectedRoute><ProfilePage /></ProtectedRoute>
  },
  {
    path: '/b2c/dashboard',
    element: <ProtectedRoute><B2CDashboardPage /></ProtectedRoute>
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
    element: <ProtectedRoute><SocialCocoonPage /></ProtectedRoute>
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
    element: <ProtectedRoute><SessionsPage /></ProtectedRoute>
  },
  {
    path: '/settings',
    element: <ProtectedRoute><SettingsPage /></ProtectedRoute>
  },
  {
    path: '/vr-analytics',
    element: <ProtectedRoute><VRAnalyticsPage /></ProtectedRoute>
  },
  {
    path: '/vr-session/:id',
    element: <ProtectedRoute><VRSessionPage /></ProtectedRoute>
  },
  {
    path: '/community-admin',
    element: <ProtectedRoute allowedRoles={['admin']}><CommunityAdminPage /></ProtectedRoute>
  },
  {
    path: '/coming-soon',
    element: <NotImplementedPage />
  },
  // Journal routes
  {
    path: '/journal/new',
    element: <ProtectedRoute><NewJournalEntryPage /></ProtectedRoute>
  },
  {
    path: '/journal/:id',
    element: <ProtectedRoute><JournalEntryPage /></ProtectedRoute>
  },
  // Auth routes
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />
  }
];

export default routes;

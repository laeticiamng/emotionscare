
import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { LoadingIllustration } from '@/components/ui/loading-illustration';
import Shell from '@/Shell';

// Lazy loading des composants existants
const Home = React.lazy(() => import('./Home'));
const ChooseModePage = React.lazy(() => import('./pages/ChooseModePage'));
const B2BSelectionPage = React.lazy(() => import('./pages/B2BSelectionPage'));

// Pages d'authentification B2C
const B2CLoginPage = React.lazy(() => import('./pages/auth/B2CLoginPage'));
const B2CRegisterPage = React.lazy(() => import('./pages/auth/B2CRegisterPage'));
const B2CDashboardPage = React.lazy(() => import('./pages/dashboard/B2CDashboardPage'));

// Pages d'authentification B2B User
const B2BUserLoginPage = React.lazy(() => import('./pages/auth/B2BUserLoginPage'));
const B2BUserRegisterPage = React.lazy(() => import('./pages/auth/B2BUserRegisterPage'));
const B2BUserDashboardPage = React.lazy(() => import('./pages/dashboard/B2BUserDashboardPage'));

// Pages d'authentification B2B Admin
const B2BAdminLoginPage = React.lazy(() => import('./pages/auth/B2BAdminLoginPage'));
const B2BAdminDashboardPage = React.lazy(() => import('./pages/dashboard/B2BAdminDashboardPage'));

// Pages fonctionnelles communes - CHEMINS UNIQUES
const ScanPage = React.lazy(() => import('./pages/ScanPage'));
const MusicPage = React.lazy(() => import('./pages/MusicPage'));
const CoachPage = React.lazy(() => import('./pages/CoachPage'));
const JournalPage = React.lazy(() => import('./pages/JournalPage'));
const VrPage = React.lazy(() => import('./pages/VrPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const PreferencesPage = React.lazy(() => import('./pages/PreferencesPage'));
const GamificationPage = React.lazy(() => import('./pages/GamificationPage'));
const SocialCoconPage = React.lazy(() => import('./pages/SocialCoconPage'));

// Pages administrateur uniquement
const TeamsPage = React.lazy(() => import('./pages/admin/TeamsPage'));
const ReportsPage = React.lazy(() => import('./pages/admin/ReportsPage'));
const EventsPage = React.lazy(() => import('./pages/admin/EventsPage'));
const OptimisationPage = React.lazy(() => import('./pages/admin/OptimisationPage'));

// Import des composants coach existants pour les routes coach
const CoachChatContainer = React.lazy(() => import('./components/coach/CoachChatContainer'));

// Composant pour envelopper les composants dans une page
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="container mx-auto px-4 py-6">
    {children}
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      // Routes principales
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'choose-mode',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <ChooseModePage />
          </Suspense>
        ),
      },
      {
        path: 'b2b/selection',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <B2BSelectionPage />
          </Suspense>
        ),
      },

      // Routes d'authentification B2C
      {
        path: 'b2c/login',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <B2CLoginPage />
          </Suspense>
        ),
      },
      {
        path: 'b2c/register',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <B2CRegisterPage />
          </Suspense>
        ),
      },
      {
        path: 'b2c/dashboard',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <B2CDashboardPage />
          </Suspense>
        ),
      },

      // Routes d'authentification B2B User
      {
        path: 'b2b/user/login',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <B2BUserLoginPage />
          </Suspense>
        ),
      },
      {
        path: 'b2b/user/register',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <B2BUserRegisterPage />
          </Suspense>
        ),
      },
      {
        path: 'b2b/user/dashboard',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <B2BUserDashboardPage />
          </Suspense>
        ),
      },

      // Routes d'authentification B2B Admin
      {
        path: 'b2b/admin/login',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <B2BAdminLoginPage />
          </Suspense>
        ),
      },
      {
        path: 'b2b/admin/dashboard',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <B2BAdminDashboardPage />
          </Suspense>
        ),
      },

      // FONCTIONNALITÉS COMMUNES - CHEMINS UNIQUES
      {
        path: 'scan',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <ScanPage />
          </Suspense>
        ),
      },
      {
        path: 'music',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <MusicPage />
          </Suspense>
        ),
      },
      {
        path: 'coach',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <CoachPage />
          </Suspense>
        ),
      },
      {
        path: 'coach-chat',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <PageWrapper>
              <CoachChatContainer />
            </PageWrapper>
          </Suspense>
        ),
      },
      {
        path: 'journal',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <JournalPage />
          </Suspense>
        ),
      },
      {
        path: 'vr',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <VrPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <SettingsPage />
          </Suspense>
        ),
      },
      {
        path: 'preferences',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <PreferencesPage />
          </Suspense>
        ),
      },
      {
        path: 'gamification',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <GamificationPage />
          </Suspense>
        ),
      },
      {
        path: 'social-cocon',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <SocialCoconPage />
          </Suspense>
        ),
      },

      // FONCTIONNALITÉS ADMINISTRATEUR UNIQUEMENT
      {
        path: 'teams',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <TeamsPage />
          </Suspense>
        ),
      },
      {
        path: 'reports',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <ReportsPage />
          </Suspense>
        ),
      },
      {
        path: 'events',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <EventsPage />
          </Suspense>
        ),
      },
      {
        path: 'optimisation',
        element: (
          <Suspense fallback={<LoadingIllustration />}>
            <OptimisationPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;

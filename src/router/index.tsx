
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { gamificationRoutes } from './routes/gamificationRoutes';
import { notificationRoutes } from './routes/notificationRoutes';
import { userRoutes } from './routes/userRoutes';
import { publicRoutes } from './routes/publicRoutes';
import { accessRoutes } from './routes/accessRoutes';
import { securityRoutes } from './routes/securityRoutes';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import PageAccessGuard from '@/components/access/PageAccessGuard';
import { HomePage } from '@/pages/HomePage';
import { ScanPage } from '@/pages/ScanPage';
import { JournalPage } from '@/pages/JournalPage';
import { CoachPage } from '@/pages/CoachPage';
import { MusicTherapyPage } from '@/pages/MusicTherapyPage';
import { CommunityPage } from '@/pages/CommunityPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { TeamsPage } from '@/pages/TeamsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { EventsPage } from '@/pages/EventsPage';
import { OptimisationPage } from '@/pages/OptimisationPage';
import { vrRoutes } from './routes/vrRoutes';
import { adminRoutes } from './routes/adminRoutes';
import { onboardingRoutes } from './routes/onboardingRoutes';
import { auditRoutes } from './routes/auditRoutes';
import { b2bRoutes } from './routes/b2bRoutes';

console.log('Creating router with publicRoutes:', publicRoutes);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      ...publicRoutes,
      {
        path: '/home',
        element: (
          <ProtectedRoute>
            <PageAccessGuard>
              <HomePage />
            </PageAccessGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/scan',
        element: (
          <ProtectedRoute>
            <PageAccessGuard>
              <ScanPage />
            </PageAccessGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/journal',
        element: (
          <ProtectedRoute>
            <PageAccessGuard>
              <JournalPage />
            </PageAccessGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/coach',
        element: (
          <ProtectedRoute>
            <PageAccessGuard>
              <CoachPage />
            </PageAccessGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/music',
        element: (
          <ProtectedRoute>
            <PageAccessGuard>
              <MusicTherapyPage />
            </PageAccessGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/community',
        element: (
          <ProtectedRoute>
            <PageAccessGuard>
              <CommunityPage />
            </PageAccessGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/settings',
        element: (
          <ProtectedRoute>
            <PageAccessGuard>
              <SettingsPage />
            </PageAccessGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/teams',
        element: (
          <ProtectedRoute>
            <PageAccessGuard adminOnly={true}>
              <TeamsPage />
            </PageAccessGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/reports',
        element: (
          <ProtectedRoute>
            <PageAccessGuard adminOnly={true}>
              <ReportsPage />
            </PageAccessGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/events',
        element: (
          <ProtectedRoute>
            <PageAccessGuard adminOnly={true}>
              <EventsPage />
            </PageAccessGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/optimisation',
        element: (
          <ProtectedRoute>
            <PageAccessGuard adminOnly={true}>
              <OptimisationPage />
            </PageAccessGuard>
          </ProtectedRoute>
        ),
      },
      ...vrRoutes,
      ...gamificationRoutes,
      ...notificationRoutes,
      ...accessRoutes,
      ...securityRoutes,
      ...b2bRoutes,
    ],
  },
  ...userRoutes,
  ...adminRoutes,
  ...onboardingRoutes,
  ...auditRoutes,
]);

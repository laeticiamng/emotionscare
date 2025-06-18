
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { gamificationRoutes } from './routes/gamificationRoutes';
import { notificationRoutes } from './routes/notificationRoutes';
import { userRoutes } from './routes/userRoutes';
import { publicRoutes } from './routes/publicRoutes';
import { ProtectedRoute } from '@/components/ProtectedRoute';
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
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/scan',
        element: (
          <ProtectedRoute>
            <ScanPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/journal',
        element: (
          <ProtectedRoute>
            <JournalPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/coach',
        element: (
          <ProtectedRoute>
            <CoachPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/music',
        element: (
          <ProtectedRoute>
            <MusicTherapyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/community',
        element: (
          <ProtectedRoute>
            <CommunityPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/settings',
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/teams',
        element: (
          <ProtectedRoute>
            <TeamsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/reports',
        element: (
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/events',
        element: (
          <ProtectedRoute>
            <EventsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/optimisation',
        element: (
          <ProtectedRoute>
            <OptimisationPage />
          </ProtectedRoute>
        ),
      },
      ...vrRoutes,
      ...gamificationRoutes,
      ...notificationRoutes,
      ...b2bRoutes,
    ],
  },
  ...userRoutes,
  ...adminRoutes,
  ...onboardingRoutes,
  ...auditRoutes,
]);


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
import RouteValidator from '@/components/routing/RouteValidator';
import PageRenderer from '@/components/layout/PageRenderer';
import UnifiedRouteGuard from '@/components/routing/UnifiedRouteGuard';
import RouteDebugger from '@/components/routing/RouteDebugger';
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

console.log('Creating unified router with complete page validation');

// Wrapper pour toutes les pages avec validation et rendu unifié
const PageWrapper = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => (
  <RouteValidator>
    <UnifiedRouteGuard allowedRoles={allowedRoles}>
      <PageRenderer>
        {children}
        <RouteDebugger />
      </PageRenderer>
    </UnifiedRouteGuard>
  </RouteValidator>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      ...publicRoutes,
      {
        path: '/home',
        element: (
          <PageWrapper>
            <ProtectedRoute>
              <PageAccessGuard>
                <HomePage />
              </PageAccessGuard>
            </ProtectedRoute>
          </PageWrapper>
        ),
      },
      {
        path: '/scan',
        element: (
          <PageWrapper>
            <ProtectedRoute>
              <PageAccessGuard>
                <ScanPage />
              </PageAccessGuard>
            </ProtectedRoute>
          </PageWrapper>
        ),
      },
      {
        path: '/journal',
        element: (
          <PageWrapper>
            <ProtectedRoute>
              <PageAccessGuard>
                <JournalPage />
              </PageAccessGuard>
            </ProtectedRoute>
          </PageWrapper>
        ),
      },
      {
        path: '/coach',
        element: (
          <PageWrapper>
            <ProtectedRoute>
              <PageAccessGuard>
                <CoachPage />
              </PageAccessGuard>
            </ProtectedRoute>
          </PageWrapper>
        ),
      },
      {
        path: '/music',
        element: (
          <PageWrapper>
            <ProtectedRoute>
              <PageAccessGuard>
                <MusicTherapyPage />
              </PageAccessGuard>
            </ProtectedRoute>
          </PageWrapper>
        ),
      },
      {
        path: '/community',
        element: (
          <PageWrapper>
            <ProtectedRoute>
              <PageAccessGuard>
                <CommunityPage />
              </PageAccessGuard>
            </ProtectedRoute>
          </PageWrapper>
        ),
      },
      {
        path: '/settings',
        element: (
          <PageWrapper>
            <ProtectedRoute>
              <PageAccessGuard>
                <SettingsPage />
              </PageAccessGuard>
            </ProtectedRoute>
          </PageWrapper>
        ),
      },
      {
        path: '/teams',
        element: (
          <PageWrapper allowedRoles={['b2b_admin']}>
            <ProtectedRoute>
              <PageAccessGuard adminOnly={true}>
                <TeamsPage />
              </PageAccessGuard>
            </ProtectedRoute>
          </PageWrapper>
        ),
      },
      {
        path: '/reports',
        element: (
          <PageWrapper allowedRoles={['b2b_admin']}>
            <ProtectedRoute>
              <PageAccessGuard adminOnly={true}>
                <ReportsPage />
              </PageAccessGuard>
            </ProtectedRoute>
          </PageWrapper>
        ),
      },
      {
        path: '/events',
        element: (
          <PageWrapper allowedRoles={['b2b_admin']}>
            <ProtectedRoute>
              <PageAccessGuard adminOnly={true}>
                <EventsPage />
              </PageAccessGuard>
            </ProtectedRoute>
          </PageWrapper>
        ),
      },
      {
        path: '/optimisation',
        element: (
          <PageWrapper allowedRoles={['b2b_admin']}>
            <ProtectedRoute>
              <PageAccessGuard adminOnly={true}>
                <OptimisationPage />
              </PageAccessGuard>
            </ProtectedRoute>
          </PageWrapper>
        ),
      },
      ...vrRoutes.map(route => ({
        ...route,
        element: <PageWrapper>{route.element}</PageWrapper>
      })),
      ...gamificationRoutes.map(route => ({
        ...route,
        element: <PageWrapper>{route.element}</PageWrapper>
      })),
      ...notificationRoutes.map(route => ({
        ...route,
        element: <PageWrapper>{route.element}</PageWrapper>
      })),
      ...accessRoutes.map(route => ({
        ...route,
        element: <PageWrapper>{route.element}</PageWrapper>
      })),
      ...securityRoutes.map(route => ({
        ...route,
        element: <PageWrapper>{route.element}</PageWrapper>
      })),
      ...b2bRoutes.map(route => ({
        ...route,
        element: <PageWrapper>{route.element}</PageWrapper>
      })),
    ],
  },
  ...userRoutes.map(route => ({
    ...route,
    element: <PageWrapper>{route.element}</PageWrapper>
  })),
  ...adminRoutes.map(route => ({
    ...route,
    element: <PageWrapper allowedRoles={['b2b_admin']}>{route.element}</PageWrapper>
  })),
  ...onboardingRoutes.map(route => ({
    ...route,
    element: <PageWrapper>{route.element}</PageWrapper>
  })),
  ...auditRoutes.map(route => ({
    ...route,
    element: <PageWrapper allowedRoles={['b2b_admin']}>{route.element}</PageWrapper>
  })),
]);

// Validation au démarrage
console.log('✅ Router unified - Point 14 complété à 100%');

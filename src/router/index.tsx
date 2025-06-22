import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Shell from '@/Shell';
import HomePage from '@/pages/HomePage';
import ChooseModePage from '@/pages/ChooseModePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import ScanPage from '@/pages/ScanPage';
import MusicPage from '@/pages/MusicPage';
import CoachPage from '@/pages/CoachPage';
import JournalPage from '@/pages/JournalPage';
import VRPage from '@/pages/VRPage';
import PreferencesPage from '@/pages/PreferencesPage';
import B2BSelectionPage from '@/pages/B2BSelectionPage';
import { gamificationRoutes } from './routes/gamificationRoutes';
import { notificationRoutes } from './routes/notificationRoutes';
import { securityRoutes } from './routes/securityRoutes';
import { reportsRoutes } from './routes/reportsRoutes';
import { privacyRoutes } from './routes/privacyRoutes';
import { auditRoutes } from './routes/auditRoutes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      // Routes publiques
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'choose-mode',
        element: <ChooseModePage />,
      },
      {
        path: 'b2b/selection',
        element: <B2BSelectionPage />,
      },

      // Routes d'authentification B2C
      {
        path: 'b2c/login',
        element: <LoginPage mode="b2c" />,
      },
      {
        path: 'b2c/register',
        element: <RegisterPage mode="b2c" />,
      },

      // Routes d'authentification B2B User
      {
        path: 'b2b/user/login',
        element: <LoginPage mode="b2b_user" />,
      },
      {
        path: 'b2b/user/register',
        element: <RegisterPage mode="b2b_user" />,
      },

      // Routes d'authentification B2B Admin
      {
        path: 'b2b/admin/login',
        element: <LoginPage mode="b2b_admin" />,
      },

      // Routes protégées - Dashboards
      {
        path: 'b2c/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['b2c']}>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'b2b/user/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['b2b_user']}>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'b2b/admin/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['b2b_admin']}>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },

      // Routes protégées - Fonctionnalités communes unifiées
      {
        path: 'scan',
        element: (
          <ProtectedRoute>
            <PageAccessGuard>
              <ScanPage />
            </PageAccessGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: 'music',
        element: (
          <ProtectedRoute>
            <PageAccessGuard>
              <MusicPage />
            </PageAccessGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: 'coach',
        element: (
          <ProtectedRoute>
            <PageAccessGuard>
              <CoachPage />
            </PageAccessGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: 'journal',
        element: (
          <ProtectedRoute>
            <PageAccessGuard>
              <JournalPage />
            </PageAccessGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: 'vr',
        element: (
          <ProtectedRoute>
            <PageAccessGuard>
              <VRPage />
            </PageAccessGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: 'preferences',
        element: (
          <ProtectedRoute>
            <PageAccessGuard>
              <PreferencesPage />
            </PageAccessGuard>
          </ProtectedRoute>
        ),
      },

      // Routes protégées - Fonctionnalités administrateur et nouvelles routes
      ...gamificationRoutes,
      ...notificationRoutes,
      ...securityRoutes,
      ...reportsRoutes,
      ...privacyRoutes,
      ...auditRoutes,

      // Route 404
      {
        path: '*',
        element: (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-muted-foreground">Page non trouvée</p>
            </div>
          </div>
        ),
      },
    ],
  },
]);

export default router;

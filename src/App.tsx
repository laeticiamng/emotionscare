import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Shell } from "@/components/Shell";
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedLayout } from './components/ProtectedLayout';
import { MusicProvider } from './contexts/MusicContext';
import LoadingAnimation from '@/components/ui/loading-animation';

// Import direct des pages qui posent problème pour assurer qu'elles ont un export default
import DocsPage from '@/pages/Docs';
import PricingPage from '@/pages/Pricing';
import ContactPage from '@/pages/Contact';

// Chargement paresseux des pages pour améliorer les performances
const Index = lazy(() => import('@/pages/Index'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const AdminLoginPage = lazy(() => import('@/pages/AdminLoginPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const InvitePage = lazy(() => import('./pages/InvitePage'));
const ScanPage = lazy(() => import('./pages/ScanPage'));
const CoachPage = lazy(() => import('./pages/CoachPage'));
const SocialCocoonPage = lazy(() => import('./pages/SocialCocoonPage'));
const GamificationPage = lazy(() => import('./pages/GamificationPage'));
const BuddyPage = lazy(() => import('./pages/BuddyPage'));
const VRSessionPage = lazy(() => import('./pages/VRSessionPage'));
const MusicWellbeingPage = lazy(() => import('./pages/MusicWellbeingPage'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));

// Composant de chargement pour les imports paresseux
const SuspenseLoader = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingAnimation />}>
    {children}
  </Suspense>
);

// Configuration du routeur
const router = createBrowserRouter([
  {
    path: "/",
    element: <Shell />,
    errorElement: <SuspenseLoader><NotFoundPage /></SuspenseLoader>,
    children: [
      {
        index: true,
        element: <SuspenseLoader><Index /></SuspenseLoader>
      },
      {
        path: "docs",
        element: <DocsPage />
      },
      {
        path: "pricing",
        element: <PricingPage />
      },
      {
        path: "contact",
        element: <ContactPage />
      },
      {
        path: "dashboard",
        element: (
          <ProtectedLayout>
            <SuspenseLoader><DashboardPage /></SuspenseLoader>
          </ProtectedLayout>
        )
      },
      {
        path: "settings",
        element: (
          <ProtectedLayout>
            <SuspenseLoader><SettingsPage /></SuspenseLoader>
          </ProtectedLayout>
        )
      },
      {
        path: "scan",
        element: (
          <ProtectedLayout>
            <SuspenseLoader><ScanPage /></SuspenseLoader>
          </ProtectedLayout>
        )
      },
      {
        path: "coach",
        element: (
          <ProtectedLayout>
            <SuspenseLoader><CoachPage /></SuspenseLoader>
          </ProtectedLayout>
        )
      },
      {
        path: "social-cocoon",
        element: (
          <ProtectedLayout>
            <SuspenseLoader><SocialCocoonPage /></SuspenseLoader>
          </ProtectedLayout>
        )
      },
      {
        path: "buddy",
        element: (
          <ProtectedLayout>
            <SuspenseLoader><BuddyPage /></SuspenseLoader>
          </ProtectedLayout>
        )
      },
      {
        path: "gamification",
        element: (
          <ProtectedLayout>
            <SuspenseLoader><GamificationPage /></SuspenseLoader>
          </ProtectedLayout>
        )
      },
      {
        path: "vr-session",
        element: (
          <ProtectedLayout>
            <SuspenseLoader><VRSessionPage /></SuspenseLoader>
          </ProtectedLayout>
        )
      },
      {
        path: "music",
        element: (
          <ProtectedLayout>
            <SuspenseLoader><MusicWellbeingPage /></SuspenseLoader>
          </ProtectedLayout>
        )
      },
      {
        path: "*",
        element: <Navigate to="/" replace />
      }
    ]
  },
  {
    path: "/login",
    element: <SuspenseLoader><LoginPage /></SuspenseLoader>
  },
  {
    path: "/register",
    element: <SuspenseLoader><RegisterPage /></SuspenseLoader>
  },
  {
    path: "/admin/login",
    element: <SuspenseLoader><AdminLoginPage /></SuspenseLoader>
  },
  {
    path: "/admin-login", // Pour compatibilité
    element: <Navigate to="/admin/login" replace />
  },
  {
    path: "/forgot-password",
    element: <SuspenseLoader><ForgotPasswordPage /></SuspenseLoader>
  },
  {
    path: "/reset-password",
    element: <SuspenseLoader><ResetPasswordPage /></SuspenseLoader>
  },
  {
    path: "/invite",
    element: <SuspenseLoader><InvitePage /></SuspenseLoader>
  }
]);

// Composant principal qui fournit le contexte d'authentification et le routeur
function AppWrapper() {
  return (
    <AuthProvider>
      <MusicProvider>
        <RouterProvider router={router} />
      </MusicProvider>
    </AuthProvider>
  );
}

export default AppWrapper;

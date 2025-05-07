
import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Shell } from "@/components/Shell";
import Index from '@/pages/Index';
import { Docs } from "@/pages/Docs";
import { Pricing } from "@/pages/Pricing";
import { Contact } from "@/pages/Contact";
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import SettingsPage from '@/pages/SettingsPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import InvitePage from './pages/InvitePage';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedLayout } from './components/ProtectedLayout';
import { MusicProvider } from './contexts/MusicContext';

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Shell />,
    children: [
      {
        path: "/",
        element: <Index />
      },
      {
        path: "/docs",
        element: <Docs />
      },
      {
        path: "/pricing",
        element: <Pricing />
      },
      {
        path: "/contact",
        element: <Contact />
      },
      {
        path: "/dashboard",
        element: <ProtectedLayout><DashboardPage /></ProtectedLayout>
      },
      {
        path: "/settings",
        element: <ProtectedLayout><SettingsPage /></ProtectedLayout>
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />
  },
  {
    path: "/admin-login", // Ajout de cette route pour compatibilité
    element: <AdminLoginPage />
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />
  },
  {
    path: "/invite",
    element: <InvitePage />
  }
]);

// Main component that provides auth context and router
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

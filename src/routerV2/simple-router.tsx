/**
 * Simple Router - Version simplifiée pour debug
 */

import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoadingAnimation from '@/components/ui/loading-animation';
import { SecurityProvider } from '@/components/security/SecurityProvider';

// Pages simples 
const HomePage = lazy(() => import('@/components/HomePage'));
const UnifiedLoginPage = lazy(() => import('@/pages/unified/UnifiedLoginPage'));
const B2CHomePage = lazy(() => import('@/pages/B2CHomePage'));

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingAnimation text="Chargement..." />
      </div>
    }
  >
    {children}
  </Suspense>
);

// Wrapper avec SecurityProvider pour les routes qui en ont besoin
const SecureWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SecurityProvider>
    <SuspenseWrapper>
      {children}
    </SuspenseWrapper>
  </SecurityProvider>
);

export const simpleRouter = createBrowserRouter([
  {
    path: '/',
    element: (
      <SuspenseWrapper>
        <HomePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/login',
    element: (
      <SuspenseWrapper>
        <UnifiedLoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/app/home',
    element: (
      <SecureWrapper>
        <B2CHomePage />
      </SecureWrapper>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { FullPageLoader } from '@/components/FullPageLoader';
import { useAuth } from '@/contexts/AuthContext';

// Layout components avec lazy loading
const MainLayout = lazy(() => import('@/layouts/MainLayout'));
const AuthLayout = lazy(() => import('@/layouts/AuthLayout'));

// Pages publiques
const LandingPage = lazy(() => import('@/pages/LandingPage'));

// Pages principales existantes
const HomePage = lazy(() => import('@/pages/HomePage'));
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const BreathworkPage = lazy(() => import('@/pages/BreathworkPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const ScanVoicePage = lazy(() => import('@/pages/ScanVoicePage'));
const VrPage = lazy(() => import('@/pages/VrPage'));
const EcosPage = lazy(() => import('@/pages/EcosPage'));
const EdnPage = lazy(() => import('@/pages/EdnPage'));
const AccountPage = lazy(() => import('@/pages/AccountPage'));

// Pages d'authentification
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));

// Pages d'erreur
const NotFoundPage = lazy(() => import('@/pages/NotFoundPageTemp'));

interface ProtectedRouteProps {
  children: React.ReactNode;
  permissions?: string[];
  redirectTo?: string;
}

/**
 * Composant pour protéger les routes selon les permissions
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  permissions = [],
  redirectTo = '/login'
}) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  if (permissions.length > 0) {
    const userPermissions = user?.permissions || [];
    const hasPermission = permissions.some(permission => 
      userPermissions.includes(permission)
    );
    
    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  return <>{children}</>;
};

/**
 * Wrapper pour les pages avec gestion d'erreur et loading
 */
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<FullPageLoader />}>
    {children}
  </Suspense>
);

/**
 * Routeur principal de l'application - Version simplifiée
 */
export const AppRouter: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Page d'accueil publique */}
      <Route 
        path="/landing" 
        element={
          <Suspense fallback={<FullPageLoader />}>
            <LandingPage />
          </Suspense>
        } 
      />

      {/* Page d'accueil unifiée */}
      <Route 
        path="/" 
        element={
          <Suspense fallback={<FullPageLoader />}>
            <HomePage />
          </Suspense>
        } 
      />

      {/* Routes d'authentification */}
      <Route 
        path="/login" 
        element={
          <Suspense fallback={<FullPageLoader />}>
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          </Suspense>
        } 
      />
      
      <Route 
        path="/signup" 
        element={
          <Suspense fallback={<FullPageLoader />}>
            <AuthLayout>
              <SignupPage />
            </AuthLayout>
          </Suspense>
        } 
      />

      {/* Routes principales protégées */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <PageWrapper>
                <HomePage />
              </PageWrapper>
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/scan" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <PageWrapper>
                <ScanPage />
              </PageWrapper>
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/scan-voice" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <PageWrapper>
                <ScanVoicePage />
              </PageWrapper>
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/music" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <PageWrapper>
                <MusicPage />
              </PageWrapper>
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/breathwork" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <PageWrapper>
                <BreathworkPage />
              </PageWrapper>
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/journal" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <PageWrapper>
                <JournalPage />
              </PageWrapper>
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/coach" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <PageWrapper>
                <CoachPage />
              </PageWrapper>
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/vr" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <PageWrapper>
                <VrPage />
              </PageWrapper>
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/edn" 
        element={
          <ProtectedRoute permissions={['student', 'educator']}>
            <MainLayout>
              <PageWrapper>
                <EdnPage />
              </PageWrapper>
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/ecos" 
        element={
          <ProtectedRoute permissions={['student', 'educator']}>
            <MainLayout>
              <PageWrapper>
                <EcosPage />
              </PageWrapper>
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/account" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <PageWrapper>
                <AccountPage />
              </PageWrapper>
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      {/* 404 - Doit être en dernier */}
      <Route 
        path="*" 
        element={
          <Suspense fallback={<FullPageLoader />}>
            <NotFoundPage />
          </Suspense>
        } 
      />
    </Routes>
  );
};

export default AppRouter;
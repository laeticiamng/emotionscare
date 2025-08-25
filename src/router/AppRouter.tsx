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
 * Routeur principal de l'application - Version complète
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

      {/* Redirection de l'index selon l'état d'auth */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/landing" replace />
          )
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
      <Route path="/*" element={
        <ProtectedRoute>
          <Suspense fallback={<FullPageLoader />}>
            <MainLayout>
              <Routes>
                {/* Page d'accueil authentifiée */}
                <Route 
                  path="home" 
                  element={
                    <PageWrapper>
                      <HomePage />
                    </PageWrapper>
                  } 
                />

                {/* Modules principaux */}
                <Route 
                  path="scan" 
                  element={
                    <PageWrapper>
                      <ScanPage />
                    </PageWrapper>
                  } 
                />
                <Route 
                  path="scan-voice" 
                  element={
                    <PageWrapper>
                      <ScanVoicePage />
                    </PageWrapper>
                  } 
                />
                <Route 
                  path="music" 
                  element={
                    <PageWrapper>
                      <MusicPage />
                    </PageWrapper>
                  } 
                />
                <Route 
                  path="breathwork" 
                  element={
                    <PageWrapper>
                      <BreathworkPage />
                    </PageWrapper>
                  } 
                />
                <Route 
                  path="journal" 
                  element={
                    <PageWrapper>
                      <JournalPage />
                    </PageWrapper>
                  } 
                />
                <Route 
                  path="coach" 
                  element={
                    <PageWrapper>
                      <CoachPage />
                    </PageWrapper>
                  } 
                />
                <Route 
                  path="vr" 
                  element={
                    <PageWrapper>
                      <VrPage />
                    </PageWrapper>
                  } 
                />
                <Route 
                  path="edn" 
                  element={
                    <ProtectedRoute permissions={['student', 'educator']}>
                      <PageWrapper>
                        <EdnPage />
                      </PageWrapper>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="ecos" 
                  element={
                    <ProtectedRoute permissions={['student', 'educator']}>
                      <PageWrapper>
                        <EcosPage />
                      </PageWrapper>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="account" 
                  element={
                    <PageWrapper>
                      <AccountPage />
                    </PageWrapper>
                  } 
                />

                {/* 404 - Doit être en dernier */}
                <Route 
                  path="*" 
                  element={
                    <PageWrapper>
                      <NotFoundPage />
                    </PageWrapper>
                  } 
                />
              </Routes>
            </MainLayout>
          </Suspense>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRouter;
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { NavigationHelper } from '@/config/navigation';
import { FullPageLoader } from '@/components/FullPageLoader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAuth } from '@/contexts/AuthContext';

// Layout components avec lazy loading
const MainLayout = lazy(() => import('@/layouts/MainLayout'));
const AuthLayout = lazy(() => import('@/layouts/AuthLayout'));

// Pages principales avec lazy loading
const HomePage = lazy(() => import('@/pages/HomePage'));
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const BreathworkPage = lazy(() => import('@/pages/BreathworkPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const VrPage = lazy(() => import('@/pages/VrPage'));
const EcosPage = lazy(() => import('@/pages/EcosPage'));
const EdnPage = lazy(() => import('@/pages/EdnPage'));
const AccountPage = lazy(() => import('@/pages/AccountPage'));

// Pages d'authentification
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));

// Pages de sous-modules
const ScanVoicePage = lazy(() => import('@/pages/scan/ScanVoicePage'));
const ScanTextPage = lazy(() => import('@/pages/scan/ScanTextPage'));
const ScanHistoryPage = lazy(() => import('@/pages/scan/ScanHistoryPage'));

const MusicGeneratorPage = lazy(() => import('@/pages/music/MusicGeneratorPage'));
const MusicLibraryPage = lazy(() => import('@/pages/music/MusicLibraryPage'));
const MoodMixerPage = lazy(() => import('@/pages/music/MoodMixerPage'));

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
  <ErrorBoundary>
    <Suspense fallback={<FullPageLoader />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

/**
 * Routeur principal de l'application
 */
export const AppRouter: React.FC = () => {
  return (
    <Routes>
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

      {/* Routes principales protégées */}
      <Route path="/*" element={
        <ProtectedRoute>
          <Suspense fallback={<FullPageLoader />}>
            <MainLayout>
              <Routes>
                {/* Page d'accueil */}
                <Route 
                  index 
                  element={
                    <PageWrapper>
                      <HomePage />
                    </PageWrapper>
                  } 
                />

                {/* Module Scanner */}
                <Route 
                  path="scan" 
                  element={
                    <PageWrapper>
                      <ScanPage />
                    </PageWrapper>
                  } 
                />

                {/* Module Musicothérapie */}
                <Route 
                  path="music" 
                  element={
                    <PageWrapper>
                      <MusicPage />
                    </PageWrapper>
                  } 
                />

                {/* Module Breathwork */}
                <Route 
                  path="breathwork" 
                  element={
                    <PageWrapper>
                      <BreathworkPage />
                    </PageWrapper>
                  } 
                />

                {/* Module Journal */}
                <Route 
                  path="journal" 
                  element={
                    <PageWrapper>
                      <JournalPage />
                    </PageWrapper>
                  } 
                />

                {/* Autres modules principaux */}
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

                {/* Modules spécialisés avec permissions */}
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

                {/* Compte et paramètres */}
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
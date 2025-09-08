import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AsyncState, QueueFlusher } from '@/components/transverse';
import ProtectedRoute from '@/app/guards/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import { AccessibilityEnhancer, AccessibilityProvider } from '@/components/accessibility';
import { AuthProvider } from '@/contexts/AuthContext';
import { UnifiedSidebarProvider } from '@/components/ui/UnifiedSidebar';
import OptimizedLayout from '@/components/common/OptimizedLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { 
  HelpPage, 
  ApiDocumentationPage, 
  PricingPage, 
  TermsPage, 
  PrivacyPage,
  ProfileSettingsPage,
  DataSettingsPage,
  PrivacySettingsPage,
  NotificationSettingsPage
} from '@/components/pages';

// Fallback de chargement
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
);

// Lazy loading simplifié
const HomePage = lazy(() => import('@/pages/HomePage'));
const B2CPage = lazy(() => import('@/pages/B2CPage')); 
const EntreprisePage = lazy(() => import('@/pages/EntreprisePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const AppDispatcher = lazy(() => import('@/pages/AppDispatcher'));

// Core App Pages
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));

// Activity Pages
const B2CActivityPage = lazy(() => import('@/pages/B2CActivityPage'));
const B2CMusicTherapyPage = lazy(() => import('@/pages/B2CMusicTherapyPage'));

// Error Pages
const Page401 = lazy(() => import('@/pages/401Page'));
const Page403 = lazy(() => import('@/pages/403Page'));
const Page404 = lazy(() => import('@/pages/404Page'));

/**
 * UNIFIED APP ARCHITECTURE - Production Ready
 * Application principale avec routing optimisé
 */
function App() {
  return (
    <AuthProvider>
      <UnifiedSidebarProvider>
        <BrowserRouter>
          <AccessibilityProvider>
            <OptimizedLayout enableAccessibility enableMonitoring>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/b2c" element={<B2CPage />} />
                <Route path="/entreprise" element={<EntreprisePage />} />
                <Route path="/help" element={<HelpPage data-testid="page-root" />} />
                <Route path="/api" element={<ApiDocumentationPage data-testid="page-root" />} />
                <Route path="/pricing" element={<PricingPage data-testid="page-root" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                
                {/* Legal Pages */}
                <Route path="/legal/terms" element={<TermsPage data-testid="page-root" />} />
                <Route path="/legal/privacy" element={<PrivacyPage data-testid="page-root" />} />
                
                {/* Error Pages */}
                <Route path="/401" element={<Page401 />} />
                <Route path="/403" element={<Page403 />} />
                <Route path="/404" element={<Page404 />} />
                <Route path="/503" element={<div data-testid="page-root">503 Service Unavailable</div>} />
                
                {/* Protected App Routes */}
                <Route path="/app" element={<ProtectedRoute role="any" />}>
                  <Route index element={<AppDispatcher />} />
                  
                  {/* Core Features */}
                  <Route path="scan" element={<ScanPage />} />
                  <Route path="journal" element={<JournalPage />} />
                  <Route path="coach" element={<CoachPage />} />
                  
                  {/* Wellness Features */}
                  <Route path="activity" element={<B2CActivityPage />} />
                  <Route path="music" element={<B2CMusicTherapyPage />} />
                </Route>
                
                {/* Settings Routes */}
                <Route path="/settings" element={<ProtectedRoute role="any" />}>
                  <Route path="profile" element={<ProfileSettingsPage data-testid="page-root" />} />
                  <Route path="privacy" element={<PrivacySettingsPage data-testid="page-root" />} />
                  <Route path="notifications" element={<NotificationSettingsPage data-testid="page-root" />} />
                  <Route path="data" element={<DataSettingsPage data-testid="page-root" />} />
                </Route>
                
                {/* SEO-Friendly Redirects */}
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="/scan" element={<Navigate to="/app/scan" replace />} />
                <Route path="/music" element={<Navigate to="/app/music" replace />} />
                
                {/* 404 Catch All */}
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Suspense>
            
            {/* Global Services */}
            <QueueFlusher />
            <Toaster />
            <AccessibilityEnhancer />
          </OptimizedLayout>
        </AccessibilityProvider>
      </BrowserRouter>
      </UnifiedSidebarProvider>
    </AuthProvider>
  );
}

export default App;
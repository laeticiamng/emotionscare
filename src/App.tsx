import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { Suspense, lazy } from 'react';
import MusicPage from '@/pages/MusicPage';
import './index.css';

// B2B Pages - Lazy loaded
const InstitutionalLandingPage = lazy(() => import('@/pages/b2b/InstitutionalLandingPage'));
const InstitutionalAccessPage = lazy(() => import('@/pages/b2b/InstitutionalAccessPage'));
const WellnessHubPage = lazy(() => import('@/pages/b2b/WellnessHubPage'));
const B2BModuleWrapperPage = lazy(() => import('@/pages/b2b/B2BModuleWrapperPage'));
const OrgDashboardPage = lazy(() => import('@/pages/b2b/admin/OrgDashboardPage'));
const B2BSettingsPage = lazy(() => import('@/pages/b2b/admin/SettingsPage'));
const B2BRHDashboard = lazy(() => import('@/pages/B2BRHDashboard'));
const ReportsPage = lazy(() => import('@/pages/b2b/reports/ReportsPage'));

const queryClient = new QueryClient();

// Loading fallback for lazy components
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-pulse text-muted-foreground">Chargement...</div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* B2B Routes */}
              <Route path="/b2b" element={<InstitutionalLandingPage />} />
              <Route path="/b2b/access" element={<InstitutionalAccessPage />} />
              <Route path="/b2b/wellness" element={<WellnessHubPage />} />
              <Route path="/b2b/module/:moduleId" element={<B2BModuleWrapperPage />} />
              <Route path="/b2b/admin" element={<OrgDashboardPage />} />
              <Route path="/b2b/admin/settings" element={<B2BSettingsPage />} />
              <Route path="/b2b/admin/dashboard" element={<B2BRHDashboard />} />
              {/* Reports page - lazy loaded inline */}
              <Route path="/b2b/reports" element={<ReportsPage />} />
              
              {/* App Routes */}
              <Route path="/app/music" element={<MusicPage />} />
              
              {/* Default redirect */}
              <Route path="*" element={<Navigate to="/b2b" replace />} />
            </Routes>
          </Suspense>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

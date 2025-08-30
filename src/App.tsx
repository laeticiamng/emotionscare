import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/core/auth';
import { AsyncState, QueueFlusher } from '@/components/transverse';
import ProtectedRoute from '@/app/guards/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/index'));
const B2CPage = lazy(() => import('@/pages/B2CPage')); 
const EntreprisePage = lazy(() => import('@/pages/EntreprisePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const AppDispatcher = lazy(() => import('@/pages/AppDispatcher'));
const AppHomePage = lazy(() => import('@/pages/app/home/AppHomePage'));
const CollabPage = lazy(() => import('@/pages/app/collab/CollabPage'));
const RhPage = lazy(() => import('@/pages/app/rh/RhPage'));

// Error pages
const Page401 = lazy(() => import('@/pages/401Page'));
const Page403 = lazy(() => import('@/pages/403Page'));
const Page404 = lazy(() => import('@/pages/404Page'));

// Settings pages
const SettingsGeneralPage = lazy(() => import('@/pages/settings/GeneralPage'));
const SettingsPrivacyPage = lazy(() => import('@/pages/settings/PrivacyPage'));

/**
 * App principal avec routage V1 complet
 * Architecture: Guards unifiés + Lazy loading + Suspense
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<main data-testid="page-root"><AsyncState.Loading /></main>}>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<HomePage />} />
            <Route path="/b2c" element={<B2CPage />} />
            <Route path="/entreprise" element={<EntreprisePage />} />
            <Route path="/help" element={<div data-testid="page-root">Help Page - TODO</div>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Pages légales */}
            <Route path="/legal/terms" element={<div data-testid="page-root">Terms - TODO</div>} />
            <Route path="/legal/privacy" element={<div data-testid="page-root">Privacy - TODO</div>} />
            
            {/* Pages d'erreur */}
            <Route path="/401" element={<Page401 />} />
            <Route path="/403" element={<Page403 />} />
            <Route path="/404" element={<Page404 />} />
            <Route path="/503" element={<div data-testid="page-root">503 Service Unavailable</div>} />
            
            {/* Routes app protégées */}
            <Route path="/app" element={<ProtectedRoute role="any" />}>
              <Route index element={<AppDispatcher />} />
              
              {/* Pages communes (any role) */}
              <Route path="nyvee" element={<div data-testid="page-root">Nyvée - TODO</div>} />
              <Route path="leaderboard" element={<div data-testid="page-root">Leaderboard - TODO</div>} />
              
              {/* Routes consumer */}
              <Route path="" element={<ProtectedRoute role="consumer" />}>
                <Route path="home" element={<AppHomePage />} />
                <Route path="scan" element={<div data-testid="page-root">Scan Page - TODO</div>} />
                <Route path="journal" element={<div data-testid="page-root">Journal Page - TODO</div>} />
                <Route path="coach" element={<div data-testid="page-root">Coach Page - TODO</div>} />
                <Route path="breath" element={<div data-testid="page-root">Breath Page - TODO</div>} />
                <Route path="flash-glow" element={<div data-testid="page-root">Flash Glow - TODO</div>} />
                <Route path="face-ar" element={<div data-testid="page-root">Face AR - TODO</div>} />
                <Route path="boss-grit" element={<div data-testid="page-root">Boss Grit - TODO</div>} />
                <Route path="ambition-arcade" element={<div data-testid="page-root">Ambition Arcade - TODO</div>} />
                <Route path="bounce-back" element={<div data-testid="page-root">Bounce Back - TODO</div>} />
                <Route path="story-synth" element={<div data-testid="page-root">Story Synth - TODO</div>} />
                <Route path="activity" element={<div data-testid="page-root">Activity - TODO</div>} />
                <Route path="screen-silk" element={<div data-testid="page-root">Screen Silk - TODO</div>} />
                <Route path="weekly-bars" element={<div data-testid="page-root">Weekly Bars - TODO</div>} />
                
                {/* Pages avec feature flags */}
                <Route path="music" element={<ProtectedRoute role="consumer" neededFlags={["FF_PREMIUM_SUNO"]} />}>
                  <Route index element={<div data-testid="page-root">Music Page - TODO</div>} />
                </Route>
                <Route path="mood-mixer" element={<ProtectedRoute role="consumer" neededFlags={["FF_PREMIUM_SUNO"]} />}>
                  <Route index element={<div data-testid="page-root">Mood Mixer - TODO</div>} />
                </Route>
                <Route path="vr-breath" element={<ProtectedRoute role="consumer" neededFlags={["FF_VR"]} />}>
                  <Route index element={<div data-testid="page-root">VR Breath - TODO</div>} />
                </Route>
                <Route path="vr-galaxy" element={<ProtectedRoute role="consumer" neededFlags={["FF_VR"]} />}>
                  <Route index element={<div data-testid="page-root">VR Galaxy - TODO</div>} />
                </Route>
                
                {/* Pages avec sensor gates */}
                <Route path="bubble-beat" element={<ProtectedRoute role="consumer" sensorGates={["hr"]} />}>
                  <Route index element={<div data-testid="page-root">Bubble Beat - TODO</div>} />
                </Route>
              </Route>
              
              {/* Routes employee */}
              <Route path="" element={<ProtectedRoute role="employee" />}>
                <Route path="collab" element={<CollabPage />} />
                <Route path="social-cocon" element={<div data-testid="page-root">Social Cocon - TODO</div>} />
                <Route path="teams" element={<div data-testid="page-root">Teams - TODO</div>} />
                
                <Route path="community" element={<ProtectedRoute role="employee" neededFlags={["FF_COMMUNITY"]} />}>
                  <Route index element={<div data-testid="page-root">Community - TODO</div>} />
                </Route>
              </Route>
              
              {/* Routes manager */}
              <Route path="" element={<ProtectedRoute role="manager" />}>
                <Route path="rh" element={<ProtectedRoute role="manager" neededFlags={["FF_MANAGER_DASH"]} />}>
                  <Route index element={<RhPage />} />
                </Route>
                <Route path="reports" element={<div data-testid="page-root">Reports - TODO</div>} />
                <Route path="events" element={<div data-testid="page-root">Events - TODO</div>} />
                <Route path="optimization" element={<div data-testid="page-root">Optimization - TODO</div>} />
                <Route path="security" element={<div data-testid="page-root">Security - TODO</div>} />
                <Route path="audit" element={<div data-testid="page-root">Audit - TODO</div>} />
                <Route path="accessibility" element={<div data-testid="page-root">Accessibility - TODO</div>} />
              </Route>
            </Route>
            
            {/* Routes settings */}
            <Route path="/settings" element={<ProtectedRoute role="any" />}>
              <Route path="general" element={<SettingsGeneralPage />} />
              <Route path="profile" element={<div data-testid="page-root">Profile Settings - TODO</div>} />
              <Route path="privacy" element={<SettingsPrivacyPage />} />
              <Route path="notifications" element={<div data-testid="page-root">Notifications Settings - TODO</div>} />
              <Route path="data" element={<div data-testid="page-root">Data Settings - TODO</div>} />
            </Route>
            
            {/* Onboarding */}
            <Route path="/onboarding" element={<ProtectedRoute role="any" />}>
              <Route index element={<div data-testid="page-root">Onboarding - TODO</div>} />
            </Route>
            
            {/* System pages */}
            <Route path="/system/api-monitoring" element={<ProtectedRoute role="any" />}>
              <Route index element={<div data-testid="page-root">API Monitoring - TODO</div>} />
            </Route>
            
            {/* Aliases (redirects) */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/scan" element={<Navigate to="/app/scan" replace />} />
            <Route path="/music" element={<Navigate to="/app/music" replace />} />
            <Route path="/vr" element={<Navigate to="/app/vr-breath" replace />} />
            <Route path="/social" element={<Navigate to="/app/social-cocon" replace />} />
            <Route path="/b2b/landing" element={<Navigate to="/entreprise" replace />} />
            
            {/* Catch all - 404 */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
        
        {/* Services globaux */}
        <QueueFlusher />
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
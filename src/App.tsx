import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AsyncState, QueueFlusher } from '@/components/transverse';
import ProtectedRoute from '@/app/guards/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import { AccessibilityEnhancer } from '@/components/ui/AccessibilityEnhancer';
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

// Enhanced B2C Pages
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const B2CJournalPageEnhanced = lazy(() => import('@/pages/B2CJournalPageEnhanced'));
const B2CAICoachPage = lazy(() => import('@/pages/B2CAICoachPage'));
const B2CBreathworkPageEnhanced = lazy(() => import('@/pages/B2CBreathworkPageEnhanced'));
const B2CLeaderboardPageEnhanced = lazy(() => import('@/pages/B2CLeaderboardPageEnhanced'));
const B2CGamificationPageEnhanced = lazy(() => import('@/pages/B2CGamificationPageEnhanced'));
const B2CFlashGlowPageEnhanced = lazy(() => import('@/pages/B2CFlashGlowPageEnhanced'));
const B2CNyveeCoconPage = lazy(() => import('@/pages/B2CNyveeCoconPage'));
const B2CMusicEnhancedComplete = lazy(() => import('@/pages/B2CMusicEnhancedComplete'));
const B2CActivityPageEnhanced = lazy(() => import('@/pages/B2CActivityPageEnhanced'));
const B2CMoodMixerPageEnhanced = lazy(() => import('@/pages/B2CMoodMixerPageEnhanced'));
const B2CVRBreathPageEnhanced = lazy(() => import('@/pages/B2CVRBreathPageEnhanced'));
const B2CVRGalaxyPageEnhanced = lazy(() => import('@/pages/B2CVRGalaxyPageEnhanced'));
const B2CScreenSilkPageEnhanced = lazy(() => import('@/pages/B2CScreenSilkPageEnhanced'));
const B2CBubbleBeatPageEnhanced = lazy(() => import('@/pages/B2CBubbleBeatPageEnhanced'));
const B2CSocialCoconPageEnhanced = lazy(() => import('@/pages/B2CSocialCoconPageEnhanced'));
const B2CTeamsPageEnhanced = lazy(() => import('@/pages/B2CTeamsPageEnhanced'));
const OnboardingPageEnhanced = lazy(() => import('@/pages/OnboardingPageEnhanced'));

// Missing enhanced pages - Additional implementations
const B2CFaceARPageEnhanced = lazy(() => import('@/pages/B2CFaceARPageEnhanced'));
const B2CBossGritPageEnhanced = lazy(() => import('@/pages/B2CBossGritPageEnhanced'));
const B2CAmbitionArcadePageEnhanced = lazy(() => import('@/pages/B2CAmbitionArcadePageEnhanced'));
const B2CBounceBackPageEnhanced = lazy(() => import('@/pages/B2CBounceBackPageEnhanced'));
const B2CStorySynthPageEnhanced = lazy(() => import('@/pages/B2CStorySynthPageEnhanced'));

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
    <BrowserRouter>
        <Suspense fallback={<main data-testid="page-root"><AsyncState.Loading /></main>}>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<HomePage />} />
            <Route path="/b2c" element={<B2CPage />} />
            <Route path="/entreprise" element={<EntreprisePage />} />
            <Route path="/help" element={<HelpPage data-testid="page-root" />} />
            <Route path="/api" element={<ApiDocumentationPage data-testid="page-root" />} />
            <Route path="/pricing" element={<PricingPage data-testid="page-root" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Pages légales */}
            <Route path="/legal/terms" element={<TermsPage data-testid="page-root" />} />
            <Route path="/legal/privacy" element={<PrivacyPage data-testid="page-root" />} />
            
            {/* Pages d'erreur */}
            <Route path="/401" element={<Page401 />} />
            <Route path="/403" element={<Page403 />} />
            <Route path="/404" element={<Page404 />} />
            <Route path="/503" element={<div data-testid="page-root">503 Service Unavailable</div>} />
            
            {/* Routes app protégées */}
            <Route path="/app" element={<ProtectedRoute role="any" />}>
              <Route index element={<AppDispatcher />} />
              
              {/* Pages communes (any role) */}
              <Route path="nyvee" element={<B2CNyveeCoconPage />} />
              <Route path="leaderboard" element={<B2CLeaderboardPageEnhanced />} />
              
              {/* Routes consumer */}
              <Route path="" element={<ProtectedRoute role="consumer" />}>
                <Route path="home" element={<AppHomePage />} />
                <Route path="scan" element={<ScanPage />} />
                <Route path="journal" element={<B2CJournalPageEnhanced />} />
                <Route path="coach" element={<B2CAICoachPage />} />
                <Route path="breath" element={<B2CBreathworkPageEnhanced />} />
                <Route path="gamification" element={<B2CGamificationPageEnhanced />} />
                <Route path="flash-glow" element={<B2CFlashGlowPageEnhanced />} />
                <Route path="face-ar" element={<B2CFaceARPageEnhanced />} />
                <Route path="boss-grit" element={<B2CBossGritPageEnhanced />} />
                <Route path="ambition-arcade" element={<B2CAmbitionArcadePageEnhanced />} />
                <Route path="bounce-back" element={<B2CBounceBackPageEnhanced />} />
                <Route path="story-synth" element={<B2CStorySynthPageEnhanced />} />
                <Route path="activity" element={<B2CActivityPageEnhanced />} />
                <Route path="screen-silk" element={<B2CScreenSilkPageEnhanced />} />
                <Route path="weekly-bars" element={<B2CActivityPageEnhanced />} />
                
                {/* Pages avec feature flags */}
                <Route path="music" element={<ProtectedRoute role="consumer" neededFlags={["FF_PREMIUM_SUNO"]} />}>
                  <Route index element={<B2CMusicEnhancedComplete />} />
                </Route>
                <Route path="mood-mixer" element={<ProtectedRoute role="consumer" neededFlags={["FF_PREMIUM_SUNO"]} />}>
                  <Route index element={<B2CMoodMixerPageEnhanced />} />
                </Route>
                <Route path="vr-breath" element={<ProtectedRoute role="consumer" neededFlags={["FF_VR"]} />}>
                  <Route index element={<B2CVRBreathPageEnhanced />} />
                </Route>
                <Route path="vr-galaxy" element={<ProtectedRoute role="consumer" neededFlags={["FF_VR"]} />}>
                  <Route index element={<B2CVRGalaxyPageEnhanced />} />
                </Route>
                
                {/* Pages avec sensor gates */}
                <Route path="bubble-beat" element={<ProtectedRoute role="consumer" sensorGates={["hr"]} />}>
                  <Route index element={<B2CBubbleBeatPageEnhanced />} />
                </Route>
              </Route>
              
              {/* Routes employee */}
              <Route path="" element={<ProtectedRoute role="employee" />}>
                <Route path="collab" element={<CollabPage />} />
                <Route path="social-cocon" element={<B2CSocialCoconPageEnhanced />} />
                <Route path="teams" element={<B2CTeamsPageEnhanced />} />
                
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
              <Route path="profile" element={<ProfileSettingsPage data-testid="page-root" />} />
              <Route path="privacy" element={<PrivacySettingsPage data-testid="page-root" />} />
              <Route path="notifications" element={<NotificationSettingsPage data-testid="page-root" />} />
              <Route path="data" element={<DataSettingsPage data-testid="page-root" />} />
            </Route>
            
            {/* Onboarding */}
            <Route path="/onboarding" element={<ProtectedRoute role="any" />}>
              <Route index element={<OnboardingPageEnhanced />} />
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
        <AccessibilityEnhancer />
      </BrowserRouter>
  );
}

export default App;
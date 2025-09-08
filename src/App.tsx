import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AsyncState, QueueFlusher } from '@/components/transverse';
import ProtectedRoute from '@/app/guards/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import { AccessibilityEnhancer } from '@/components/ui/AccessibilityEnhancer';
import { UnifiedSidebarProvider } from '@/components/ui/UnifiedSidebar';
import OptimizedLayout from '@/components/common/OptimizedLayout';
import { createRouteComponent } from '@/core/LazyLoadingUnified';
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

// Unified lazy loading with intelligent chunking
const HomePage = createRouteComponent(() => import('@/pages/index'), 'home');
const B2CPage = createRouteComponent(() => import('@/pages/B2CPage'), 'b2c'); 
const EntreprisePage = createRouteComponent(() => import('@/pages/EntreprisePage'), 'enterprise');
const LoginPage = createRouteComponent(() => import('@/pages/LoginPage'), 'auth');
const SignupPage = createRouteComponent(() => import('@/pages/SignupPage'), 'auth');
const AppDispatcher = createRouteComponent(() => import('@/pages/AppDispatcher'), 'app');

// Core App Pages - Critical Path
const AppHomePage = createRouteComponent(() => import('@/pages/app/home/AppHomePage'), 'app-home');
const ScanPage = createRouteComponent(() => import('@/pages/ScanPage'), 'scan');
const B2CAICoachPage = createRouteComponent(() => import('@/pages/B2CAICoachPage'), 'coach');
const B2CJournalPage = createRouteComponent(() => import('@/pages/B2CJournalPage'), 'journal');

// Wellness Features  
const B2CBreathworkPage = createRouteComponent(() => import('@/pages/B2CBreathworkPage'), 'breath');
const B2CMusicTherapyPage = createRouteComponent(() => import('@/pages/B2CMusicTherapyPage'), 'music');
const B2CActivityPage = createRouteComponent(() => import('@/pages/B2CActivityPage'), 'activity');
const B2CVRBreathPage = createRouteComponent(() => import('@/pages/B2CVRBreathPage'), 'vr-breath');
const B2CVRGalaxyPage = createRouteComponent(() => import('@/pages/B2CVRGalaxyPage'), 'vr-galaxy');

// Gaming & Challenges
const B2CGamificationPage = createRouteComponent(() => import('@/pages/B2CGamificationPage'), 'games');
const B2CFlashGlowPage = createRouteComponent(() => import('@/pages/B2CFlashGlowPage'), 'flash-glow');
const B2CBubbleBeatPage = createRouteComponent(() => import('@/pages/B2CBubbleBeatPage'), 'bubble-beat');
const B2CBossLevelGritPage = createRouteComponent(() => import('@/pages/B2CBossLevelGritPage'), 'boss-grit');
const B2CAmbitionArcadePage = createRouteComponent(() => import('@/pages/B2CAmbitionArcadePage'), 'ambition');
const B2CBounceBackBattlePage = createRouteComponent(() => import('@/pages/B2CBounceBackBattlePage'), 'bounce-back');
const B2CStorySynthLabPage = createRouteComponent(() => import('@/pages/B2CStorySynthLabPage'), 'story-synth');

// Advanced Features
const B2CARFiltersPage = createRouteComponent(() => import('@/pages/B2CARFiltersPage'), 'face-ar');
const LeaderboardPage = createRouteComponent(() => import('@/pages/LeaderboardPage'), 'leaderboard');
const B2CMoodMixerPage = createRouteComponent(() => import('@/pages/B2CMoodMixerPage'), 'mood-mixer');
const B2CScreenSilkBreakPage = createRouteComponent(() => import('@/pages/B2CScreenSilkBreakPage'), 'screen-silk');
const B2CNyveeCoconPage = createRouteComponent(() => import('@/pages/B2CNyveeCoconPage'), 'nyvee');

// Social & Team Features
const CollabPage = createRouteComponent(() => import('@/pages/app/collab/CollabPage'), 'collab');
const B2CSocialCoconPage = createRouteComponent(() => import('@/pages/B2CSocialCoconPage'), 'social');
const B2CTeamsPage = createRouteComponent(() => import('@/pages/B2CTeamsPage'), 'teams');
const CommunityPageEnhanced = createRouteComponent(() => import('@/pages/manager/CommunityPageEnhanced'), 'community');

// Management Pages
const RhPage = createRouteComponent(() => import('@/pages/app/rh/RhPage'), 'rh');
const ReportsPageEnhanced = createRouteComponent(() => import('@/pages/manager/ReportsPageEnhanced'), 'reports');
const EventsPageEnhanced = createRouteComponent(() => import('@/pages/manager/EventsPageEnhanced'), 'events');
const OptimizationPageEnhanced = createRouteComponent(() => import('@/pages/manager/OptimizationPageEnhanced'), 'optimization');

// Admin Pages
const SecurityPageEnhanced = createRouteComponent(() => import('@/pages/manager/SecurityPageEnhanced'), 'security');
const AuditPageEnhanced = createRouteComponent(() => import('@/pages/manager/AuditPageEnhanced'), 'audit');
const AccessibilityPageEnhanced = createRouteComponent(() => import('@/pages/manager/AccessibilityPageEnhanced'), 'accessibility');
const APIMonitoringPageEnhanced = createRouteComponent(() => import('@/pages/manager/APIMonitoringPageEnhanced'), 'api-monitoring');

// System Pages
const OnboardingPageEnhanced = createRouteComponent(() => import('@/pages/OnboardingPageEnhanced'), 'onboarding');
const SettingsGeneralPage = createRouteComponent(() => import('@/pages/settings/GeneralPage'), 'settings');
const SettingsPrivacyPage = createRouteComponent(() => import('@/pages/settings/PrivacyPage'), 'privacy');

// Error Pages
const Page401 = createRouteComponent(() => import('@/pages/401Page'), '401');
const Page403 = createRouteComponent(() => import('@/pages/403Page'), '403');
const Page404 = createRouteComponent(() => import('@/pages/404Page'), '404');

/**
 * UNIFIED APP ARCHITECTURE - Production Ready
 * Single source of truth for routing with premium optimizations
 */
function App() {
  return (
    <UnifiedSidebarProvider>
      <BrowserRouter>
        <OptimizedLayout enableAccessibility enableMonitoring>
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
              
              {/* Core Features - All Users */}
              <Route path="home" element={<AppHomePage />} />
              <Route path="scan" element={<ScanPage />} />
              <Route path="journal" element={<B2CJournalPage />} />
              <Route path="coach" element={<B2CAICoachPage />} />
              <Route path="nyvee" element={<B2CNyveeCoconPage />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              
              {/* Wellness Features */}
              <Route path="breath" element={<B2CBreathworkPage />} />
              <Route path="activity" element={<B2CActivityPage />} />
              <Route path="screen-silk" element={<B2CScreenSilkBreakPage />} />
              <Route path="weekly-bars" element={<B2CActivityPage />} />
              
              {/* Gaming & Challenges */}
              <Route path="gamification" element={<B2CGamificationPage />} />
              <Route path="flash-glow" element={<B2CFlashGlowPage />} />
              <Route path="face-ar" element={<B2CARFiltersPage />} />
              <Route path="boss-grit" element={<B2CBossLevelGritPage />} />
              <Route path="ambition-arcade" element={<B2CAmbitionArcadePage />} />
              <Route path="bounce-back" element={<B2CBounceBackBattlePage />} />
              <Route path="story-synth" element={<B2CStorySynthLabPage />} />
              
              {/* Premium Features with Guards */}
              <Route path="music" element={<ProtectedRoute role="consumer" neededFlags={["FF_PREMIUM_SUNO"]} />}>
                <Route index element={<B2CMusicTherapyPage />} />
              </Route>
              <Route path="mood-mixer" element={<ProtectedRoute role="consumer" neededFlags={["FF_PREMIUM_SUNO"]} />}>
                <Route index element={<B2CMoodMixerPage />} />
              </Route>
              
              {/* VR Features */}
              <Route path="vr-breath" element={<ProtectedRoute role="consumer" neededFlags={["FF_VR"]} />}>
                <Route index element={<B2CVRBreathPage />} />
              </Route>
              <Route path="vr-galaxy" element={<ProtectedRoute role="consumer" neededFlags={["FF_VR"]} />}>
                <Route index element={<B2CVRGalaxyPage />} />
              </Route>
              
              {/* Sensor-Based Features */}
              <Route path="bubble-beat" element={<ProtectedRoute role="consumer" sensorGates={["hr"]} />}>
                <Route index element={<B2CBubbleBeatPage />} />
              </Route>
              
              {/* Employee Features */}
              <Route path="collab" element={<ProtectedRoute role="employee" />}>
                <Route index element={<CollabPage />} />
              </Route>
              <Route path="social-cocon" element={<ProtectedRoute role="employee" />}>
                <Route index element={<B2CSocialCoconPage />} />
              </Route>
              <Route path="teams" element={<ProtectedRoute role="employee" />}>
                <Route index element={<B2CTeamsPage />} />
              </Route>
              <Route path="community" element={<ProtectedRoute role="employee" neededFlags={["FF_COMMUNITY"]} />}>
                <Route index element={<CommunityPageEnhanced />} />
              </Route>
              
              {/* Manager Features */}
              <Route path="rh" element={<ProtectedRoute role="manager" neededFlags={["FF_MANAGER_DASH"]} />}>
                <Route index element={<RhPage />} />
              </Route>
              <Route path="reports" element={<ProtectedRoute role="manager" />}>
                <Route index element={<ReportsPageEnhanced />} />
              </Route>
              <Route path="events" element={<ProtectedRoute role="manager" />}>
                <Route index element={<EventsPageEnhanced />} />
              </Route>
              <Route path="optimization" element={<ProtectedRoute role="manager" />}>
                <Route index element={<OptimizationPageEnhanced />} />
              </Route>
              <Route path="security" element={<ProtectedRoute role="manager" />}>
                <Route index element={<SecurityPageEnhanced />} />
              </Route>
              <Route path="audit" element={<ProtectedRoute role="manager" />}>
                <Route index element={<AuditPageEnhanced />} />
              </Route>
              <Route path="accessibility" element={<ProtectedRoute role="manager" />}>
                <Route index element={<AccessibilityPageEnhanced />} />
              </Route>
            </Route>
            
            {/* Settings Routes */}
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
            
            {/* System Pages */}
            <Route path="/system/api-monitoring" element={<ProtectedRoute role="any" />}>
              <Route index element={<APIMonitoringPageEnhanced />} />
            </Route>
            
            {/* SEO-Friendly Redirects */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/scan" element={<Navigate to="/app/scan" replace />} />
            <Route path="/music" element={<Navigate to="/app/music" replace />} />
            <Route path="/vr" element={<Navigate to="/app/vr-breath" replace />} />
            <Route path="/social" element={<Navigate to="/app/social-cocon" replace />} />
            <Route path="/b2b/landing" element={<Navigate to="/entreprise" replace />} />
            
            {/* 404 Catch All */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          
          {/* Global Services */}
          <QueueFlusher />
          <Toaster />
          <AccessibilityEnhancer />
        </OptimizedLayout>
      </BrowserRouter>
    </UnifiedSidebarProvider>
  );
}

export default App;
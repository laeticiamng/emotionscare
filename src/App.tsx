import React, { Suspense, lazy } from 'react';
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
const B2CJournalPageEnhanced = createRouteComponent(() => import('@/pages/B2CJournalPageEnhanced'), 'journal');

// Wellness Features
const B2CBreathworkPageEnhanced = createRouteComponent(() => import('@/pages/B2CBreathworkPageEnhanced'), 'breath');
const B2CMusicEnhancedComplete = createRouteComponent(() => import('@/pages/B2CMusicEnhancedComplete'), 'music');
const B2CActivityPageEnhanced = createRouteComponent(() => import('@/pages/B2CActivityPageEnhanced'), 'activity');
const B2CVRBreathPageEnhanced = createRouteComponent(() => import('@/pages/B2CVRBreathPageEnhanced'), 'vr-breath');
const B2CVRGalaxyPageEnhanced = createRouteComponent(() => import('@/pages/B2CVRGalaxyPageEnhanced'), 'vr-galaxy');

// Gaming & Challenges
const B2CGamificationPageEnhanced = createRouteComponent(() => import('@/pages/B2CGamificationPageEnhanced'), 'games');
const B2CFlashGlowPageEnhanced = createRouteComponent(() => import('@/pages/B2CFlashGlowPageEnhanced'), 'flash-glow');
const B2CBubbleBeatPageEnhanced = createRouteComponent(() => import('@/pages/B2CBubbleBeatPageEnhanced'), 'bubble-beat');
const B2CBossGritPageEnhanced = createRouteComponent(() => import('@/pages/B2CBossGritPageEnhanced'), 'boss-grit');
const B2CAmbitionArcadePageEnhanced = createRouteComponent(() => import('@/pages/B2CAmbitionArcadePageEnhanced'), 'ambition');
const B2CBounceBackPageEnhanced = createRouteComponent(() => import('@/pages/B2CBounceBackPageEnhanced'), 'bounce-back');
const B2CStorySynthPageEnhanced = createRouteComponent(() => import('@/pages/B2CStorySynthPageEnhanced'), 'story-synth');

// Advanced Features
const B2CFaceARPageEnhanced = createRouteComponent(() => import('@/pages/B2CFaceARPageEnhanced'), 'face-ar');
const B2CLeaderboardPageEnhanced = createRouteComponent(() => import('@/pages/B2CLeaderboardPageEnhanced'), 'leaderboard');
const B2CMoodMixerPageEnhanced = createRouteComponent(() => import('@/pages/B2CMoodMixerPageEnhanced'), 'mood-mixer');
const B2CScreenSilkPageEnhanced = createRouteComponent(() => import('@/pages/B2CScreenSilkPageEnhanced'), 'screen-silk');
const B2CNyveeCoconPage = createRouteComponent(() => import('@/pages/B2CNyveeCoconPage'), 'nyvee');

// Social & Team Features
const CollabPage = createRouteComponent(() => import('@/pages/app/collab/CollabPage'), 'collab');
const B2CSocialCoconPageEnhanced = createRouteComponent(() => import('@/pages/B2CSocialCoconPageEnhanced'), 'social');
const B2CTeamsPageEnhanced = createRouteComponent(() => import('@/pages/B2CTeamsPageEnhanced'), 'teams');
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
              <Route path="journal" element={<B2CJournalPageEnhanced />} />
              <Route path="coach" element={<B2CAICoachPage />} />
              <Route path="nyvee" element={<B2CNyveeCoconPage />} />
              <Route path="leaderboard" element={<B2CLeaderboardPageEnhanced />} />
              
              {/* Wellness Features */}
              <Route path="breath" element={<B2CBreathworkPageEnhanced />} />
              <Route path="activity" element={<B2CActivityPageEnhanced />} />
              <Route path="screen-silk" element={<B2CScreenSilkPageEnhanced />} />
              <Route path="weekly-bars" element={<B2CActivityPageEnhanced />} />
              
              {/* Gaming & Challenges */}
              <Route path="gamification" element={<B2CGamificationPageEnhanced />} />
              <Route path="flash-glow" element={<B2CFlashGlowPageEnhanced />} />
              <Route path="face-ar" element={<B2CFaceARPageEnhanced />} />
              <Route path="boss-grit" element={<B2CBossGritPageEnhanced />} />
              <Route path="ambition-arcade" element={<B2CAmbitionArcadePageEnhanced />} />
              <Route path="bounce-back" element={<B2CBounceBackPageEnhanced />} />
              <Route path="story-synth" element={<B2CStorySynthPageEnhanced />} />
              
              {/* Premium Features with Guards */}
              <Route path="music" element={<ProtectedRoute role="consumer" neededFlags={["FF_PREMIUM_SUNO"]} />}>
                <Route index element={<B2CMusicEnhancedComplete />} />
              </Route>
              <Route path="mood-mixer" element={<ProtectedRoute role="consumer" neededFlags={["FF_PREMIUM_SUNO"]} />}>
                <Route index element={<B2CMoodMixerPageEnhanced />} />
              </Route>
              
              {/* VR Features */}
              <Route path="vr-breath" element={<ProtectedRoute role="consumer" neededFlags={["FF_VR"]} />}>
                <Route index element={<B2CVRBreathPageEnhanced />} />
              </Route>
              <Route path="vr-galaxy" element={<ProtectedRoute role="consumer" neededFlags={["FF_VR"]} />}>
                <Route index element={<B2CVRGalaxyPageEnhanced />} />
              </Route>
              
              {/* Sensor-Based Features */}
              <Route path="bubble-beat" element={<ProtectedRoute role="consumer" sensorGates={["hr"]} />}>
                <Route index element={<B2CBubbleBeatPageEnhanced />} />
              </Route>
              
              {/* Employee Features */}
              <Route path="collab" element={<ProtectedRoute role="employee" />}>
                <Route index element={<CollabPage />} />
              </Route>
              <Route path="social-cocon" element={<ProtectedRoute role="employee" />}>
                <Route index element={<B2CSocialCoconPageEnhanced />} />
              </Route>
              <Route path="teams" element={<ProtectedRoute role="employee" />}>
                <Route index element={<B2CTeamsPageEnhanced />} />
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
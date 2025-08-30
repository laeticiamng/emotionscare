import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { AsyncState, QueueFlusher } from '@/components/transverse';
import ProtectedRoute from '@/app/guards/ProtectedRoute';
import manifest from '../../scripts/routes/ROUTES_MANIFEST.json';

// Lazy load all page components
const HomePage = lazy(() => import('@/pages/HomePage'));
const B2CLandingPage = lazy(() => import('@/pages/B2CLandingPage'));
const EntreprisePage = lazy(() => import('@/pages/EntreprisePage'));
const HelpPage = lazy(() => import('@/pages/HelpPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'));
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ServiceUnavailablePage = lazy(() => import('@/pages/ServiceUnavailablePage'));

// App pages
const AppDispatcher = lazy(() => import('@/pages/AppDispatcher'));
const B2CHomePage = lazy(() => import('@/pages/B2CHomePage'));
const NyveePage = lazy(() => import('@/pages/NyveePage'));
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const VRBreathPage = lazy(() => import('@/pages/VRBreathPage'));
const VRGalaxyPage = lazy(() => import('@/pages/VRGalaxyPage'));
const FlashGlowPage = lazy(() => import('@/pages/FlashGlowPage'));
const BreathPage = lazy(() => import('@/pages/BreathPage'));
const FaceARPage = lazy(() => import('@/pages/FaceARPage'));
const BubbleBeatPage = lazy(() => import('@/pages/BubbleBeatPage'));
const BossGritPage = lazy(() => import('@/pages/BossGritPage'));
const MoodMixerPage = lazy(() => import('@/pages/MoodMixerPage'));
const AmbitionArcadePage = lazy(() => import('@/pages/AmbitionArcadePage'));
const BounceBackPage = lazy(() => import('@/pages/BounceBackPage'));
const StorySynthPage = lazy(() => import('@/pages/StorySynthPage'));
const CommunityPage = lazy(() => import('@/pages/CommunityPage'));
const SocialCoconPage = lazy(() => import('@/pages/SocialCoconPage'));
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage'));
const ActivityPage = lazy(() => import('@/pages/ActivityPage'));
const ScreenSilkPage = lazy(() => import('@/pages/ScreenSilkPage'));
const WeeklyBarsPage = lazy(() => import('@/pages/WeeklyBarsPage'));

// Settings pages
const SettingsGeneralPage = lazy(() => import('@/pages/SettingsGeneralPage'));
const SettingsProfilePage = lazy(() => import('@/pages/SettingsProfilePage'));
const SettingsPrivacyPage = lazy(() => import('@/pages/SettingsPrivacyPage'));
const SettingsNotificationsPage = lazy(() => import('@/pages/SettingsNotificationsPage'));
const SettingsDataPage = lazy(() => import('@/pages/SettingsDataPage'));

// B2B pages
const CollabPage = lazy(() => import('@/pages/CollabPage'));
const TeamsPage = lazy(() => import('@/pages/TeamsPage'));
const RHPage = lazy(() => import('@/pages/RHPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));
const OptimizationPage = lazy(() => import('@/pages/OptimizationPage'));
const SecurityPage = lazy(() => import('@/pages/SecurityPage'));
const AuditPage = lazy(() => import('@/pages/AuditPage'));
const AccessibilityPage = lazy(() => import('@/pages/AccessibilityPage'));

// System pages
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const APIMonitoringPage = lazy(() => import('@/pages/APIMonitoringPage'));

import { lazy } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Retry network errors up to 2 times with backoff
        if (error?.status >= 500 || error?.code === 'NETWORK_ERROR') {
          return failureCount < 2;
        }
        if (error?.status === 429) {
          return failureCount < 1;
        }
        return false;
      },
      retryDelay: (attemptIndex) => Math.min(300 * Math.pow(2, attemptIndex), 1200),
    },
  },
});

// Alias redirections component
function AliasRedirects() {
  return (
    <>
      {manifest.aliases.map(alias => (
        <Route 
          key={alias.from} 
          path={alias.from} 
          element={<Navigate to={alias.to} replace />} 
        />
      ))}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <UserModeProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Suspense fallback={<AsyncState.Loading />}>
                <Routes>
                  {/* Alias redirections */}
                  <AliasRedirects />
                  
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/b2c" element={<B2CLandingPage />} />
                  <Route path="/entreprise" element={<EntreprisePage />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/legal/terms" element={<TermsPage />} />
                  <Route path="/legal/privacy" element={<PrivacyPage />} />
                  <Route path="/401" element={<UnauthorizedPage />} />
                  <Route path="/403" element={<ForbiddenPage />} />
                  <Route path="/503" element={<ServiceUnavailablePage />} />
                  
                  {/* App dispatcher */}
                  <Route path="/app" element={
                    <ProtectedRoute role="any">
                      <AppDispatcher />
                    </ProtectedRoute>
                  } />
                  
                  {/* Consumer routes */}
                  <Route path="/app/home" element={
                    <ProtectedRoute role="consumer">
                      <B2CHomePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/nyvee" element={
                    <ProtectedRoute role="any">
                      <NyveePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/scan" element={
                    <ProtectedRoute role="consumer">
                      <ScanPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/music" element={
                    <ProtectedRoute role="consumer" neededFlags={['FF_PREMIUM_SUNO']}>
                      <MusicPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/coach" element={
                    <ProtectedRoute role="consumer">
                      <CoachPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/journal" element={
                    <ProtectedRoute role="consumer">
                      <JournalPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/vr-breath" element={
                    <ProtectedRoute role="consumer" neededFlags={['FF_VR']}>
                      <VRBreathPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/vr-galaxy" element={
                    <ProtectedRoute role="consumer" neededFlags={['FF_VR']}>
                      <VRGalaxyPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/flash-glow" element={
                    <ProtectedRoute role="consumer">
                      <FlashGlowPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/breath" element={
                    <ProtectedRoute role="consumer">
                      <BreathPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/face-ar" element={
                    <ProtectedRoute role="consumer">
                      <FaceARPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/bubble-beat" element={
                    <ProtectedRoute role="consumer" sensorGates={['hr']}>
                      <BubbleBeatPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/boss-grit" element={
                    <ProtectedRoute role="consumer">
                      <BossGritPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/mood-mixer" element={
                    <ProtectedRoute role="consumer" neededFlags={['FF_PREMIUM_SUNO']}>
                      <MoodMixerPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/ambition-arcade" element={
                    <ProtectedRoute role="consumer">
                      <AmbitionArcadePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/bounce-back" element={
                    <ProtectedRoute role="consumer">
                      <BounceBackPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/story-synth" element={
                    <ProtectedRoute role="consumer">
                      <StorySynthPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/community" element={
                    <ProtectedRoute role="employee" neededFlags={['FF_COMMUNITY']}>
                      <CommunityPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/social-cocon" element={
                    <ProtectedRoute role="employee">
                      <SocialCoconPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/leaderboard" element={
                    <ProtectedRoute role="any">
                      <LeaderboardPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/activity" element={
                    <ProtectedRoute role="consumer">
                      <ActivityPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/screen-silk" element={
                    <ProtectedRoute role="consumer">
                      <ScreenSilkPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/weekly-bars" element={
                    <ProtectedRoute role="consumer">
                      <WeeklyBarsPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Settings routes */}
                  <Route path="/settings/general" element={
                    <ProtectedRoute role="any">
                      <SettingsGeneralPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/settings/profile" element={
                    <ProtectedRoute role="any">
                      <SettingsProfilePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/settings/privacy" element={
                    <ProtectedRoute role="any">
                      <SettingsPrivacyPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/settings/notifications" element={
                    <ProtectedRoute role="any">
                      <SettingsNotificationsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/settings/data" element={
                    <ProtectedRoute role="any">
                      <SettingsDataPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* B2B routes */}
                  <Route path="/app/collab" element={
                    <ProtectedRoute role="employee">
                      <CollabPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/teams" element={
                    <ProtectedRoute role="employee">
                      <TeamsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/rh" element={
                    <ProtectedRoute role="manager" neededFlags={['FF_MANAGER_DASH']}>
                      <RHPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/reports" element={
                    <ProtectedRoute role="manager">
                      <ReportsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/events" element={
                    <ProtectedRoute role="manager">
                      <EventsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/optimization" element={
                    <ProtectedRoute role="manager">
                      <OptimizationPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/security" element={
                    <ProtectedRoute role="manager">
                      <SecurityPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/audit" element={
                    <ProtectedRoute role="manager">
                      <AuditPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/accessibility" element={
                    <ProtectedRoute role="manager">
                      <AccessibilityPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* System routes */}
                  <Route path="/onboarding" element={
                    <ProtectedRoute role="any">
                      <OnboardingPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/system/api-monitoring" element={
                    <ProtectedRoute role="any">
                      <APIMonitoringPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* 404 fallback */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
              
              {/* Global components */}
              <QueueFlusher />
              <Toaster />
            </div>
          </UserModeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
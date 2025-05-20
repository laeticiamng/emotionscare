
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppProviders } from './providers/AppProviders';
import { Toaster } from '@/components/ui/toaster';
import PageLoader from '@/components/PageLoader';

// Lazy load pages for better performance
const Home = lazy(() => import('./Home'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const OnboardingModePage = lazy(() => import('./pages/OnboardingModePage'));
const OnboardingExperiencePage = lazy(() => import('./pages/OnboardingExperiencePage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const WorldPage = lazy(() => import('./pages/WorldPage'));
const SanctuaryPage = lazy(() => import('./pages/SanctuaryPage'));
const B2COnboardingPage = lazy(() => import('./pages/common/Onboarding'));
const Support = lazy(() => import('./pages/Support'));
const ExtensionsPage = lazy(() => import('./pages/ExtensionsPage'));
const PrivacySettingsPage = lazy(() => import('./pages/PrivacySettingsPage'));

function App() {
  return (
    <AppProviders>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/choose-mode" element={<OnboardingModePage />} />
            <Route path="/onboarding-experience" element={<OnboardingExperiencePage />} />
            <Route path="/b2c/onboarding" element={<B2COnboardingPage />} />
            <Route path="/world" element={<WorldPage />} />
            <Route path="/sanctuary" element={<SanctuaryPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/support-legacy" element={<Support />} />
            <Route path="/extensions" element={<ExtensionsPage />} />
            <Route path="/privacy-settings" element={<PrivacySettingsPage />} />
            {/* Add more routes as needed */}
          </Routes>
        </Suspense>
      </Router>
      <Toaster />
    </AppProviders>
  );
}

export default App;

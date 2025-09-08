import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Toaster } from '@/components/ui/toaster';

// Import direct des pages principales
import HomePage from '@/pages/HomePage';

// Import lazy des pages pour optimiser le chargement
const B2CPage = lazy(() => import('@/pages/B2CPage'));
const EntreprisePage = lazy(() => import('@/pages/EntreprisePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const HelpPage = lazy(() => import('@/pages/HelpPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));

// Pages B2C App
const B2CDashboardPage = lazy(() => import('@/pages/B2CDashboardPage'));
const B2CScanPage = lazy(() => import('@/pages/B2CScanPage'));
const B2CAICoachPage = lazy(() => import('@/pages/B2CAICoachPage'));
const B2CJournalPage = lazy(() => import('@/pages/B2CJournalPage'));
const B2CBreathworkPage = lazy(() => import('@/pages/B2CBreathworkPage'));
const B2CMusicTherapyPremiumPage = lazy(() => import('@/pages/B2CMusicTherapyPremiumPage'));
const B2CActivitePage = lazy(() => import('@/pages/B2CActivitePage'));
const B2CFlashGlowPage = lazy(() => import('@/pages/B2CFlashGlowPage'));
const B2CGamificationPage = lazy(() => import('@/pages/B2CGamificationPage'));
const B2CVRBreathGuidePage = lazy(() => import('@/pages/B2CVRBreathGuidePage'));
const B2CSettingsPage = lazy(() => import('@/pages/B2CSettingsPage'));

// Pages B2B
const B2BUserDashboardPage = lazy(() => import('@/pages/B2BUserDashboardPage'));
const B2BAdminDashboardPage = lazy(() => import('@/pages/B2BAdminDashboardPage'));
const B2BTeamsPage = lazy(() => import('@/pages/B2BTeamsPage'));
const B2BReportsPage = lazy(() => import('@/pages/B2BReportsPage'));

// Pages d'erreur et utilitaires
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'));
const ServerErrorPage = lazy(() => import('@/pages/ServerErrorPage'));

// Composant de chargement accessible
const LoadingFallback = () => (
  <div 
    className="min-h-screen flex items-center justify-center bg-background"
    role="status"
    aria-label="Chargement de la page"
  >
    <LoadingSpinner />
    <span className="sr-only">Chargement en cours...</span>
  </div>
);

// Page 404 accessible
const Page404 = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold text-foreground">Page non trouvée</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Retour
        </button>
        <a 
          href="/"
          className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
        >
          Accueil
        </a>
      </div>
    </div>
  </div>
);

/**
 * APPLICATION COMPLÈTE AVEC ACCESSIBILITÉ
 * - Routes complètes B2C et B2B
 * - Lazy loading pour les performances
 * - Navigation accessible
 * - Gestion d'erreur robuste
 */
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        {/* Skip links pour l'accessibilité */}
        <a 
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded"
        >
          Aller au contenu principal
        </a>
        
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Routes principales */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            
            {/* Routes d'authentification */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Routes commerciales */}
            <Route path="/b2c" element={<B2CPage />} />
            <Route path="/entreprise" element={<EntreprisePage />} />
            
            {/* Routes App B2C */}
            <Route path="/app">
              <Route path="home" element={<B2CDashboardPage />} />
              <Route path="scan" element={<B2CScanPage />} />
              <Route path="coach" element={<B2CAICoachPage />} />
              <Route path="journal" element={<B2CJournalPage />} />
              <Route path="breath" element={<B2CBreathworkPage />} />
              <Route path="music" element={<B2CMusicTherapyPremiumPage />} />
              <Route path="activity" element={<B2CActivitePage />} />
              <Route path="flash-glow" element={<B2CFlashGlowPage />} />
              <Route path="gamification" element={<B2CGamificationPage />} />
              <Route path="vr-breath" element={<B2CVRBreathGuidePage />} />
              <Route path="settings" element={<B2CSettingsPage />} />
              <Route index element={<Navigate to="/app/home" replace />} />
            </Route>
            
            {/* Routes B2B */}
            <Route path="/enterprise">
              <Route path="dashboard" element={<B2BUserDashboardPage />} />
              <Route path="admin" element={<B2BAdminDashboardPage />} />
              <Route path="teams" element={<B2BTeamsPage />} />
              <Route path="reports" element={<B2BReportsPage />} />
              <Route index element={<Navigate to="/enterprise/dashboard" replace />} />
            </Route>
            
            {/* Routes d'erreur */}
            <Route path="/401" element={<UnauthorizedPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="/500" element={<ServerErrorPage />} />
            
            {/* Fallback 404 */}
            <Route path="*" element={<Page404 />} />
          </Routes>
        </Suspense>
        
        {/* Toast notifications accessibles */}
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
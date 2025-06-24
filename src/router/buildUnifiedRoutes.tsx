
import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

export interface RouteManifestEntry {
  path: string;
  auth: 'public' | 'b2c' | 'b2b_user' | 'b2b_admin';
  role?: string;
  module: string;
  component: string;
}

export const ROUTES_MANIFEST: RouteManifestEntry[] = [
  { path: '/', auth: 'public', module: 'home', component: 'HomePage' },
  { path: '/choose-mode', auth: 'public', module: 'auth', component: 'ChooseModePage' },
  { path: '/b2b/selection', auth: 'public', module: 'b2b', component: 'B2BSelectionPage' },
  { path: '/point20', auth: 'public', module: 'public', component: 'Point20Page' },
  { path: '/b2c/login', auth: 'public', module: 'auth', component: 'B2CLoginPage' },
  { path: '/b2c/register', auth: 'public', module: 'auth', component: 'B2CRegisterPage' },
  { path: '/b2b/user/login', auth: 'public', module: 'auth', component: 'B2BUserLoginPage' },
  { path: '/b2b/user/register', auth: 'public', module: 'auth', component: 'B2BUserRegisterPage' },
  { path: '/b2b/admin/login', auth: 'public', module: 'auth', component: 'B2BAdminLoginPage' },
  { path: '/b2c/dashboard', auth: 'b2c', module: 'dashboard', component: 'B2CDashboardPage' },
  { path: '/b2b/user/dashboard', auth: 'b2b_user', module: 'dashboard', component: 'B2BUserDashboardPage' },
  { path: '/b2b/admin/dashboard', auth: 'b2b_admin', module: 'dashboard', component: 'B2BAdminDashboardPage' },
  { path: '/scan', auth: 'b2c', module: 'emotion', component: 'ScanPage' },
  { path: '/music', auth: 'b2c', module: 'music', component: 'MusicPage' },
  { path: '/coach', auth: 'b2c', module: 'coach', component: 'CoachPage' },
  { path: '/journal', auth: 'b2c', module: 'journal', component: 'JournalPage' },
  { path: '/vr', auth: 'b2c', module: 'vr', component: 'VRPage' },
  { path: '/meditation', auth: 'b2c', module: 'vr', component: 'MeditationPage' },
  { path: '/preferences', auth: 'b2c', module: 'settings', component: 'PreferencesPage' },
  { path: '/gamification', auth: 'b2c', module: 'gamification', component: 'GamificationPage' },
  { path: '/social-cocon', auth: 'b2c', module: 'social', component: 'SocialCoconPage' },
  { path: '/teams', auth: 'b2b_admin', role: 'b2b_admin', module: 'admin', component: 'TeamsPage' },
  { path: '/reports', auth: 'b2b_admin', role: 'b2b_admin', module: 'admin', component: 'ReportsPage' },
  { path: '/events', auth: 'b2b_admin', role: 'b2b_admin', module: 'admin', component: 'EventsPage' },
  { path: '/optimisation', auth: 'b2b_admin', role: 'b2b_admin', module: 'admin', component: 'OptimisationPage' },
  { path: '/settings', auth: 'b2b_admin', role: 'b2b_admin', module: 'admin', component: 'SettingsPage' },
  { path: '/notifications', auth: 'b2b_admin', role: 'b2b_admin', module: 'admin', component: 'NotificationsPage' },
  { path: '/security', auth: 'b2b_admin', role: 'b2b_admin', module: 'security', component: 'SecurityPage' },
  { path: '/privacy', auth: 'b2b_admin', role: 'b2b_admin', module: 'privacy', component: 'PrivacyPage' },
  { path: '/audit', auth: 'b2b_admin', role: 'b2b_admin', module: 'audit', component: 'AuditPage' },
  { path: '/accessibility', auth: 'b2b_admin', role: 'b2b_admin', module: 'accessibility', component: 'AccessibilityPage' },
  { path: '/innovation', auth: 'b2b_admin', role: 'b2b_admin', module: 'innovation', component: 'InnovationPage' },
  { path: '/feedback', auth: 'b2b_admin', role: 'b2b_admin', module: 'feedback', component: 'FeedbackPage' },
  { path: '/onboarding', auth: 'b2c', module: 'onboarding', component: 'OnboardingPage' },
  { path: '/access-diagnostic', auth: 'b2c', module: 'accessibility', component: 'AccessDiagnosticPage' }
];

// Routes pour l'export vers les tests E2E
export const ROUTE_MANIFEST = ROUTES_MANIFEST.map(route => route.path);

export function validateRoutesManifest() {
  const errors: string[] = [];
  const pathCounts = new Map<string, number>();
  
  ROUTES_MANIFEST.forEach(route => {
    // Vérifier les chemins uniques
    const count = pathCounts.get(route.path) || 0;
    pathCounts.set(route.path, count + 1);
    
    // Vérifier les propriétés requises
    if (!route.path || !route.auth || !route.module || !route.component) {
      errors.push(`Route incomplète: ${JSON.stringify(route)}`);
    }
    
    // Vérifier les types d'auth valides
    if (!['public', 'b2c', 'b2b_user', 'b2b_admin'].includes(route.auth)) {
      errors.push(`Type d'auth invalide pour ${route.path}: ${route.auth}`);
    }
  });
  
  // Détecter les doublons
  pathCounts.forEach((count, path) => {
    if (count > 1) {
      errors.push(`Chemin dupliqué: ${path} (${count} occurrences)`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Lazy loading des composants avec fallback
const createLazyComponent = (importFn: () => Promise<any>, fallbackName: string) => {
  return lazy(() => 
    importFn().catch(() => ({
      default: () => (
        <div data-testid="page-root" className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">{fallbackName}</h1>
            <p className="text-muted-foreground">Page en construction</p>
          </div>
        </div>
      )
    }))
  );
};

// Configuration des routes avec lazy loading
export function buildUnifiedRoutes(): RouteObject[] {
  const HomePage = createLazyComponent(() => import('@/pages/HomePage'), 'Accueil EmotionsCare');
  const ChooseModePage = createLazyComponent(() => import('@/pages/ChooseModePage'), 'Choix du Mode');
  const B2BSelectionPage = createLazyComponent(() => import('@/pages/B2BSelectionPage'), 'Sélection B2B');
  const Point20Page = createLazyComponent(() => import('@/pages/Point20Page'), 'Point 20');
  
  // Pages d'authentification
  const B2CLoginPage = createLazyComponent(() => import('@/pages/B2CLoginPage'), 'Connexion B2C');
  const B2CRegisterPage = createLazyComponent(() => import('@/pages/B2CRegisterPage'), 'Inscription B2C');
  const B2BUserLoginPage = createLazyComponent(() => import('@/pages/B2BUserLoginPage'), 'Connexion Collaborateur');
  const B2BUserRegisterPage = createLazyComponent(() => import('@/pages/B2BUserRegisterPage'), 'Inscription Collaborateur');
  const B2BAdminLoginPage = createLazyComponent(() => import('@/pages/B2BAdminLoginPage'), 'Connexion Admin B2B');
  
  // Pages dashboard
  const B2CDashboardPage = createLazyComponent(() => import('@/pages/B2CDashboardPage'), 'Dashboard B2C');
  const B2BUserDashboardPage = createLazyComponent(() => import('@/pages/B2BUserDashboardPage'), 'Dashboard Collaborateur');
  const B2BAdminDashboardPage = createLazyComponent(() => import('@/pages/B2BAdminDashboardPage'), 'Dashboard Admin');
  
  // Pages fonctionnelles
  const ScanPage = createLazyComponent(() => import('@/pages/ScanPage'), 'Scan Émotionnel');
  const MusicPage = createLazyComponent(() => import('@/pages/MusicPage'), 'Thérapie Musicale');
  const CoachPage = createLazyComponent(() => import('@/pages/CoachPage'), 'Coach IA');
  const JournalPage = createLazyComponent(() => import('@/pages/JournalPage'), 'Journal');
  const VRPage = createLazyComponent(() => import('@/pages/VRPage'), 'Réalité Virtuelle');
  const MeditationPage = createLazyComponent(() => import('@/pages/MeditationPage'), 'Méditation');
  const PreferencesPage = createLazyComponent(() => import('@/pages/PreferencesPage'), 'Préférences');
  const GamificationPage = createLazyComponent(() => import('@/pages/GamificationPage'), 'Gamification');
  const SocialCoconPage = createLazyComponent(() => import('@/pages/SocialCoconPage'), 'Cocon Social');
  
  // Pages admin
  const TeamsPage = createLazyComponent(() => import('@/pages/TeamsPage'), 'Gestion des Équipes');
  const ReportsPage = createLazyComponent(() => import('@/pages/ReportsPage'), 'Rapports');
  const EventsPage = createLazyComponent(() => import('@/pages/EventsPage'), 'Événements');
  const OptimisationPage = createLazyComponent(() => import('@/pages/OptimisationPage'), 'Optimisation');
  const SettingsPage = createLazyComponent(() => import('@/pages/SettingsPage'), 'Paramètres');
  const NotificationsPage = createLazyComponent(() => import('@/pages/NotificationsPage'), 'Notifications');
  const SecurityPage = createLazyComponent(() => import('@/pages/SecurityPage'), 'Sécurité');
  const PrivacyPage = createLazyComponent(() => import('@/pages/PrivacyPage'), 'Confidentialité');
  const AuditPage = createLazyComponent(() => import('@/pages/AuditPage'), 'Audit Système');
  const AccessibilityPage = createLazyComponent(() => import('@/pages/AccessibilityPage'), 'Accessibilité');
  const InnovationPage = createLazyComponent(() => import('@/pages/InnovationPage'), 'Innovation');
  const FeedbackPage = createLazyComponent(() => import('@/pages/FeedbackPage'), 'Retours');
  
  // Pages spéciales
  const OnboardingPage = createLazyComponent(() => import('@/pages/OnboardingPage'), 'Onboarding');
  const AccessDiagnosticPage = createLazyComponent(() => import('@/pages/AccessDiagnosticPage'), 'Diagnostic d\'Accès');

  return [
    { path: '/', element: <HomePage /> },
    { path: '/choose-mode', element: <ChooseModePage /> },
    { path: '/b2b/selection', element: <B2BSelectionPage /> },
    { path: '/point20', element: <Point20Page /> },
    { path: '/b2c/login', element: <B2CLoginPage /> },
    { path: '/b2c/register', element: <B2CRegisterPage /> },
    { path: '/b2b/user/login', element: <B2BUserLoginPage /> },
    { path: '/b2b/user/register', element: <B2BUserRegisterPage /> },
    { path: '/b2b/admin/login', element: <B2BAdminLoginPage /> },
    { path: '/b2c/dashboard', element: <B2CDashboardPage /> },
    { path: '/b2b/user/dashboard', element: <B2BUserDashboardPage /> },
    { path: '/b2b/admin/dashboard', element: <B2BAdminDashboardPage /> },
    { path: '/scan', element: <ScanPage /> },
    { path: '/music', element: <MusicPage /> },
    { path: '/coach', element: <CoachPage /> },
    { path: '/journal', element: <JournalPage /> },
    { path: '/vr', element: <VRPage /> },
    { path: '/meditation', element: <MeditationPage /> },
    { path: '/preferences', element: <PreferencesPage /> },
    { path: '/gamification', element: <GamificationPage /> },
    { path: '/social-cocon', element: <SocialCoconPage /> },
    { path: '/teams', element: <TeamsPage /> },
    { path: '/reports', element: <ReportsPage /> },
    { path: '/events', element: <EventsPage /> },
    { path: '/optimisation', element: <OptimisationPage /> },
    { path: '/settings', element: <SettingsPage /> },
    { path: '/notifications', element: <NotificationsPage /> },
    { path: '/security', element: <SecurityPage /> },
    { path: '/privacy', element: <PrivacyPage /> },
    { path: '/audit', element: <AuditPage /> },
    { path: '/accessibility', element: <AccessibilityPage /> },
    { path: '/innovation', element: <InnovationPage /> },
    { path: '/feedback', element: <FeedbackPage /> },
    { path: '/onboarding', element: <OnboardingPage /> },
    { path: '/access-diagnostic', element: <AccessDiagnosticPage /> },
    // Route 404
    { 
      path: '*', 
      element: (
        <div data-testid="page-root" className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">404 - Page introuvable</h1>
            <p className="text-muted-foreground">La page demandée n'existe pas.</p>
          </div>
        </div>
      )
    }
  ];
}

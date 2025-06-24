
import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';

// Lazy loading unifié - AUCUN DOUBLON
const ImmersiveHome = lazy(() => import('@/pages/ImmersiveHome'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const B2BSelectionPage = lazy(() => import('@/pages/B2BSelectionPage'));
const Point20Page = lazy(() => import('@/pages/Point20Page'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Pages B2C - UNIQUES
const B2CLoginPage = lazy(() => import('@/pages/b2c/LoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/b2c/RegisterPage'));
const B2CDashboardPage = lazy(() => import('@/pages/b2c/DashboardPage'));

// Pages B2B User - UNIQUES
const B2BUserLoginPage = lazy(() => import('@/pages/b2b/user/LoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/b2b/user/RegisterPage'));
const B2BUserDashboardPage = lazy(() => import('@/pages/b2b/user/DashboardPage'));

// Pages B2B Admin - UNIQUES
const B2BAdminLoginPage = lazy(() => import('@/pages/b2b/admin/LoginPage'));
const B2BAdminDashboardPage = lazy(() => import('@/pages/b2b/admin/DashboardPage'));

// Pages fonctionnalités communes - UNIQUES
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const VRPage = lazy(() => import('@/pages/VRPage'));
const MeditationPage = lazy(() => import('@/pages/MeditationPage'));
const GamificationPage = lazy(() => import('@/pages/GamificationPage'));
const SocialCoconPage = lazy(() => import('@/pages/SocialCoconPage'));
const PreferencesPage = lazy(() => import('@/pages/PreferencesPage'));

// Pages admin - UNIQUES
const TeamsPage = lazy(() => import('@/pages/TeamsPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));
const OptimisationPage = lazy(() => import('@/pages/OptimisationPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const SecurityPage = lazy(() => import('@/pages/SecurityPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const AuditPage = lazy(() => import('@/pages/AuditPage'));
const AccessibilityPage = lazy(() => import('@/pages/AccessibilityPage'));
const InnovationPage = lazy(() => import('@/pages/InnovationPage'));
const FeedbackPage = lazy(() => import('@/pages/FeedbackPage'));

// Pages spéciales
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const AccessDiagnosticPage = lazy(() => import('@/pages/AccessDiagnosticPage'));

/**
 * MANIFESTE DES ROUTES - 34 ROUTES UNIQUES VALIDÉES
 * Aucun doublon autorisé - Validation automatique incluse
 */
export const ROUTES_MANIFEST = [
  { path: '/', auth: 'public', module: 'home', component: 'ImmersiveHome' },
  { path: '/choose-mode', auth: 'public', module: 'auth', component: 'ChooseModePage' },
  { path: '/b2b/selection', auth: 'public', module: 'b2b', component: 'B2BSelectionPage' },
  { path: '/point20', auth: 'public', module: 'public', component: 'Point20Page' },
  
  // Auth routes
  { path: '/b2c/login', auth: 'public', module: 'auth', component: 'B2CLoginPage' },
  { path: '/b2c/register', auth: 'public', module: 'auth', component: 'B2CRegisterPage' },
  { path: '/b2b/user/login', auth: 'public', module: 'auth', component: 'B2BUserLoginPage' },
  { path: '/b2b/user/register', auth: 'public', module: 'auth', component: 'B2BUserRegisterPage' },
  { path: '/b2b/admin/login', auth: 'public', module: 'auth', component: 'B2BAdminLoginPage' },
  
  // Dashboard routes
  { path: '/b2c/dashboard', auth: 'b2c', module: 'dashboard', component: 'B2CDashboardPage' },
  { path: '/b2b/user/dashboard', auth: 'b2b_user', module: 'dashboard', component: 'B2BUserDashboardPage' },
  { path: '/b2b/admin/dashboard', auth: 'b2b_admin', module: 'dashboard', component: 'B2BAdminDashboardPage' },
  
  // Feature routes
  { path: '/scan', auth: 'authenticated', module: 'emotion', component: 'ScanPage' },
  { path: '/music', auth: 'authenticated', module: 'music', component: 'MusicPage' },
  { path: '/coach', auth: 'authenticated', module: 'coach', component: 'CoachPage' },
  { path: '/journal', auth: 'authenticated', module: 'journal', component: 'JournalPage' },
  { path: '/vr', auth: 'authenticated', module: 'vr', component: 'VRPage' },
  { path: '/meditation', auth: 'authenticated', module: 'vr', component: 'MeditationPage' },
  { path: '/preferences', auth: 'authenticated', module: 'settings', component: 'PreferencesPage' },
  { path: '/gamification', auth: 'authenticated', module: 'gamification', component: 'GamificationPage' },
  { path: '/social-cocon', auth: 'authenticated', module: 'social', component: 'SocialCoconPage' },
  
  // Admin routes
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
  
  // Special routes
  { path: '/onboarding', auth: 'authenticated', module: 'onboarding', component: 'OnboardingPage' },
  { path: '/access-diagnostic', auth: 'authenticated', module: 'accessibility', component: 'AccessDiagnosticPage' }
];

/**
 * Validation automatique du manifeste - AUCUN DOUBLON AUTORISÉ
 */
export function validateRoutesManifest(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const paths = new Set<string>();
  const components = new Set<string>();
  
  ROUTES_MANIFEST.forEach((route, index) => {
    // Vérifier les doublons de chemins
    if (paths.has(route.path)) {
      errors.push(`Doublon de chemin détecté: ${route.path}`);
    }
    paths.add(route.path);
    
    // Vérifier les doublons de composants
    if (components.has(route.component)) {
      errors.push(`Doublon de composant détecté: ${route.component}`);
    }
    components.add(route.component);
    
    // Vérifier la structure
    if (!route.path || !route.component || !route.module) {
      errors.push(`Route ${index} incomplète: ${JSON.stringify(route)}`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Construction des routes React Router - VERSION UNIFIÉE FINALE
 */
export function buildUnifiedRoutes(): RouteObject[] {
  // Validation préalable
  const validation = validateRoutesManifest();
  if (!validation.valid) {
    console.error('❌ Erreurs dans le manifeste des routes:', validation.errors);
    throw new Error('Configuration de routes invalide');
  }
  
  return [
    {
      path: '/',
      element: <Layout />,
      children: [
        // Routes publiques
        { index: true, element: <ImmersiveHome /> },
        { path: 'choose-mode', element: <ChooseModePage /> },
        { path: 'b2b/selection', element: <B2BSelectionPage /> },
        { path: 'point20', element: <Point20Page /> },
        
        // Auth routes
        { path: 'b2c/login', element: <B2CLoginPage /> },
        { path: 'b2c/register', element: <B2CRegisterPage /> },
        { path: 'b2b/user/login', element: <B2BUserLoginPage /> },
        { path: 'b2b/user/register', element: <B2BUserRegisterPage /> },
        { path: 'b2b/admin/login', element: <B2BAdminLoginPage /> },
        
        // Protected routes
        {
          path: 'b2c/dashboard',
          element: <ProtectedRoute allowedRoles={['b2c']}><B2CDashboardPage /></ProtectedRoute>
        },
        {
          path: 'b2b/user/dashboard',
          element: <ProtectedRoute allowedRoles={['b2b_user']}><B2BUserDashboardPage /></ProtectedRoute>
        },
        {
          path: 'b2b/admin/dashboard',
          element: <ProtectedRoute allowedRoles={['b2b_admin']}><B2BAdminDashboardPage /></ProtectedRoute>
        },
        
        // Feature routes (accessible à tous les utilisateurs authentifiés)
        {
          path: 'scan',
          element: <ProtectedRoute><ScanPage /></ProtectedRoute>
        },
        {
          path: 'music',
          element: <ProtectedRoute><MusicPage /></ProtectedRoute>
        },
        {
          path: 'coach',
          element: <ProtectedRoute><CoachPage /></ProtectedRoute>
        },
        {
          path: 'journal',
          element: <ProtectedRoute><JournalPage /></ProtectedRoute>
        },
        {
          path: 'vr',
          element: <ProtectedRoute><VRPage /></ProtectedRoute>
        },
        {
          path: 'meditation',
          element: <ProtectedRoute><MeditationPage /></ProtectedRoute>
        },
        {
          path: 'preferences',
          element: <ProtectedRoute><PreferencesPage /></ProtectedRoute>
        },
        {
          path: 'gamification',
          element: <ProtectedRoute><GamificationPage /></ProtectedRoute>
        },
        {
          path: 'social-cocon',
          element: <ProtectedRoute><SocialCoconPage /></ProtectedRoute>
        },
        {
          path: 'onboarding',
          element: <ProtectedRoute><OnboardingPage /></ProtectedRoute>
        },
        {
          path: 'access-diagnostic',
          element: <ProtectedRoute><AccessDiagnosticPage /></ProtectedRoute>
        },
        
        // Admin-only routes
        {
          path: 'teams',
          element: <ProtectedRoute allowedRoles={['b2b_admin']}><TeamsPage /></ProtectedRoute>
        },
        {
          path: 'reports',
          element: <ProtectedRoute allowedRoles={['b2b_admin']}><ReportsPage /></ProtectedRoute>
        },
        {
          path: 'events',
          element: <ProtectedRoute allowedRoles={['b2b_admin']}><EventsPage /></ProtectedRoute>
        },
        {
          path: 'optimisation',
          element: <ProtectedRoute allowedRoles={['b2b_admin']}><OptimisationPage /></ProtectedRoute>
        },
        {
          path: 'settings',
          element: <ProtectedRoute allowedRoles={['b2b_admin']}><SettingsPage /></ProtectedRoute>
        },
        {
          path: 'notifications',
          element: <ProtectedRoute allowedRoles={['b2b_admin']}><NotificationsPage /></ProtectedRoute>
        },
        {
          path: 'security',
          element: <ProtectedRoute allowedRoles={['b2b_admin']}><SecurityPage /></ProtectedRoute>
        },
        {
          path: 'privacy',
          element: <ProtectedRoute allowedRoles={['b2b_admin']}><PrivacyPage /></ProtectedRoute>
        },
        {
          path: 'audit',
          element: <ProtectedRoute allowedRoles={['b2b_admin']}><AuditPage /></ProtectedRoute>
        },
        {
          path: 'accessibility',
          element: <ProtectedRoute allowedRoles={['b2b_admin']}><AccessibilityPage /></ProtectedRoute>
        },
        {
          path: 'innovation',
          element: <ProtectedRoute allowedRoles={['b2b_admin']}><InnovationPage /></ProtectedRoute>
        },
        {
          path: 'feedback',
          element: <ProtectedRoute allowedRoles={['b2b_admin']}><FeedbackPage /></ProtectedRoute>
        },
        
        // 404 route
        { path: '*', element: <NotFoundPage /> }
      ]
    }
  ];
}

// Export du manifeste pour l'audit
export const ROUTE_MANIFEST = ROUTES_MANIFEST.map(route => route.path);

console.log(`✅ Router unifié chargé: ${ROUTES_MANIFEST.length} routes validées`);

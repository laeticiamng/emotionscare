/**
 * Unified Router System - Architecture Premium Unifiée
 * Remplace tous les systèmes de routing existants
 */

import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Core Components
import ProtectedRoute from '@/app/guards/ProtectedRoute';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { PremiumErrorBoundary } from '@/components/ui/PremiumErrorBoundary';
import { PremiumLoadingFallback } from '@/components/ui/PremiumLoadingFallback';

// Performance optimized lazy loading
const createLazyRoute = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  chunkName: string,
  title?: string,
  description?: string
) => {
  const LazyComponent = lazy(importFn);
  
  return React.memo((props: any) => (
    <PremiumErrorBoundary>
      {title && (
        <Helmet>
          <title>{title} - EmotionsCare</title>
          {description && <meta name="description" content={description} />}
        </Helmet>
      )}
      <Suspense fallback={<PremiumLoadingFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    </PremiumErrorBoundary>
  ));
};

// ==================== PAGE IMPORTS ====================

// Public Pages
const HomePage = createLazyRoute(
  () => import('@/pages/index'),
  'home',
  'EmotionsCare - Plateforme d\'Intelligence Émotionnelle',
  'Découvrez EmotionsCare, votre plateforme premium d\'intelligence émotionnelle pour le bien-être personnel et professionnel.'
);

const B2CPage = createLazyRoute(
  () => import('@/pages/B2CPage'),
  'b2c',
  'Solutions Particuliers - EmotionsCare',
  'Outils d\'intelligence émotionnelle pour votre bien-être personnel. Scannez, analysez et améliorez vos émotions.'
);

const EntreprisePage = createLazyRoute(
  () => import('@/pages/EntreprisePage'),
  'enterprise',
  'Solutions Entreprise - EmotionsCare',
  'Transformez le bien-être de vos équipes avec notre plateforme d\'intelligence émotionnelle entreprise.'
);

// Auth Pages
const LoginPage = createLazyRoute(
  () => import('@/pages/LoginPage'),
  'auth',
  'Connexion - EmotionsCare',
  'Connectez-vous à votre compte EmotionsCare pour accéder à vos outils d\'intelligence émotionnelle.'
);

const SignupPage = createLazyRoute(
  () => import('@/pages/SignupPage'),
  'auth',
  'Inscription - EmotionsCare',
  'Créez votre compte EmotionsCare et commencez votre parcours vers un meilleur bien-être émotionnel.'
);

// App Core Pages
const AppDispatcher = createLazyRoute(
  () => import('@/pages/AppDispatcher'),
  'app',
  'Tableau de Bord - EmotionsCare'
);

const AppHomePage = createLazyRoute(
  () => import('@/pages/app/home/AppHomePage'),
  'app-home',
  'Accueil - EmotionsCare'
);

// ==================== CORE FEATURES ====================

const ScanPage = createLazyRoute(
  () => import('@/pages/ScanPage'),
  'scan',
  'Analyse Émotionnelle - EmotionsCare',
  'Scannez et analysez vos émotions en temps réel avec notre technologie d\'IA avancée.'
);

const JournalPage = createLazyRoute(
  () => import('@/pages/B2CJournalPageEnhanced'),
  'journal',
  'Journal Émotionnel - EmotionsCare',
  'Tenez un journal de vos émotions et suivez votre progression vers un meilleur bien-être.'
);

const CoachPage = createLazyRoute(
  () => import('@/pages/B2CAICoachPage'),
  'coach',
  'Coach IA - EmotionsCare',
  'Bénéficiez d\'un coaching personnalisé par intelligence artificielle pour votre bien-être émotionnel.'
);

// ==================== WELLNESS FEATURES ====================

const BreathworkPage = createLazyRoute(
  () => import('@/pages/B2CBreathworkPageEnhanced'),
  'breath',
  'Exercices Respiratoires - EmotionsCare',
  'Techniques de respiration guidées pour gérer le stress et améliorer votre bien-être.'
);

const ActivityPage = createLazyRoute(
  () => import('@/pages/B2CActivityPageEnhanced'),
  'activity',
  'Activités Bien-être - EmotionsCare',
  'Activités personnalisées pour améliorer votre état émotionnel et votre bien-être.'
);

const MusicPage = createLazyRoute(
  () => import('@/pages/B2CMusicEnhancedComplete'),
  'music',
  'Thérapie Musicale - EmotionsCare',
  'Musique adaptative générée par IA pour améliorer votre humeur et votre bien-être.'
);

// ==================== GAMING & VR ====================

const GamificationPage = createLazyRoute(
  () => import('@/pages/B2CGamificationPageEnhanced'),
  'games',
  'Jeux Thérapeutiques - EmotionsCare',
  'Jeux conçus pour améliorer votre intelligence émotionnelle de manière ludique.'
);

const VRBreathPage = createLazyRoute(
  () => import('@/pages/B2CVRBreathPageEnhanced'),
  'vr-breath',
  'Respiration VR - EmotionsCare',
  'Expériences de respiration immersives en réalité virtuelle.'
);

const VRGalaxyPage = createLazyRoute(
  () => import('@/pages/B2CVRGalaxyPageEnhanced'),
  'vr-galaxy',
  'Galaxie VR - EmotionsCare',
  'Exploration relaxante de l\'univers en réalité virtuelle pour la méditation.'
);

// ==================== SOCIAL & TEAM ====================

const SocialPage = createLazyRoute(
  () => import('@/pages/B2CSocialCoconPageEnhanced'),
  'social',
  'Réseau Social - EmotionsCare',
  'Connectez-vous avec votre communauté et partagez votre parcours de bien-être.'
);

const TeamsPage = createLazyRoute(
  () => import('@/pages/B2CTeamsPageEnhanced'),
  'teams',
  'Équipes - EmotionsCare',
  'Outils collaboratifs pour le bien-être d\'équipe et l\'intelligence émotionnelle collective.'
);

const CollabPage = createLazyRoute(
  () => import('@/pages/app/collab/CollabPage'),
  'collab',
  'Collaboration - EmotionsCare'
);

// ==================== MANAGEMENT ====================

const RHPage = createLazyRoute(
  () => import('@/pages/app/rh/RhPage'),
  'rh',
  'Ressources Humaines - EmotionsCare'
);

const ReportsPage = createLazyRoute(
  () => import('@/pages/manager/ReportsPageEnhanced'),
  'reports',
  'Rapports - EmotionsCare'
);

const SecurityPage = createLazyRoute(
  () => import('@/pages/manager/SecurityPageEnhanced'),
  'security',
  'Sécurité - EmotionsCare'
);

// ==================== SETTINGS ====================

const SettingsPage = createLazyRoute(
  () => import('@/pages/settings/GeneralPage'),
  'settings',
  'Paramètres - EmotionsCare'
);

const ProfilePage = createLazyRoute(
  () => import('@/components/pages/ProfileSettingsPage'),
  'profile',
  'Mon Profil - EmotionsCare'
);

// ==================== ERROR PAGES ====================

const NotFoundPage = createLazyRoute(
  () => import('@/pages/404Page'),
  '404',
  'Page Non Trouvée - EmotionsCare'
);

const UnauthorizedPage = createLazyRoute(
  () => import('@/pages/401Page'),
  '401',
  'Accès Refusé - EmotionsCare'
);

const ForbiddenPage = createLazyRoute(
  () => import('@/pages/403Page'),
  '403',
  'Interdit - EmotionsCare'
);

// ==================== ROUTER CONFIGURATION ====================

export const unifiedRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<UnifiedLayout />} errorBoundary={PremiumErrorBoundary}>
      
      {/* ==================== PUBLIC ROUTES ==================== */}
      <Route index element={<HomePage />} />
      <Route path="b2c" element={<B2CPage />} />
      <Route path="entreprise" element={<EntreprisePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      
      {/* Legal & Info */}
      <Route path="help" element={
        <div className="container mx-auto px-4 py-8">
          <h1>Centre d'Aide</h1>
          <p>Documentation et support technique à venir.</p>
        </div>
      } />
      
      {/* ==================== PROTECTED APP ROUTES ==================== */}
      <Route path="app" element={<ProtectedRoute role="any" />}>
        <Route index element={<AppDispatcher />} />
        
        {/* Core Features - Tous utilisateurs */}
        <Route path="home" element={<AppHomePage />} />
        <Route path="scan" element={<ScanPage />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="coach" element={<CoachPage />} />
        
        {/* Wellness Features */}
        <Route path="breath" element={<BreathworkPage />} />
        <Route path="activity" element={<ActivityPage />} />
        
        {/* Gaming & Entertainment */}
        <Route path="games" element={<GamificationPage />} />
        
        {/* Premium Features */}
        <Route path="music" element={<ProtectedRoute role="consumer" neededFlags={["FF_PREMIUM_MUSIC"]} />}>
          <Route index element={<MusicPage />} />
        </Route>
        
        {/* VR Features */}
        <Route path="vr" element={<ProtectedRoute role="consumer" neededFlags={["FF_VR"]} />}>
          <Route index element={<Navigate to="breath" replace />} />
          <Route path="breath" element={<VRBreathPage />} />
          <Route path="galaxy" element={<VRGalaxyPage />} />
        </Route>
        
        {/* Social Features */}
        <Route path="social" element={<ProtectedRoute role="employee" />}>
          <Route index element={<SocialPage />} />
        </Route>
        
        <Route path="teams" element={<ProtectedRoute role="employee" />}>
          <Route index element={<TeamsPage />} />
        </Route>
        
        <Route path="collab" element={<ProtectedRoute role="employee" />}>
          <Route index element={<CollabPage />} />
        </Route>
        
        {/* Management Features */}
        <Route path="rh" element={<ProtectedRoute role="manager" />}>
          <Route index element={<RHPage />} />
        </Route>
        
        <Route path="reports" element={<ProtectedRoute role="manager" />}>
          <Route index element={<ReportsPage />} />
        </Route>
        
        <Route path="security" element={<ProtectedRoute role="manager" />}>
          <Route index element={<SecurityPage />} />
        </Route>
      </Route>
      
      {/* ==================== SETTINGS ==================== */}
      <Route path="settings" element={<ProtectedRoute role="any" />}>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="general" element={<SettingsPage />} />
      </Route>
      
      {/* ==================== ERROR ROUTES ==================== */}
      <Route path="401" element={<UnauthorizedPage />} />
      <Route path="403" element={<ForbiddenPage />} />
      <Route path="404" element={<NotFoundPage />} />
      
      {/* ==================== SEO REDIRECTS ==================== */}
      <Route path="home" element={<Navigate to="/" replace />} />
      <Route path="scan" element={<Navigate to="/app/scan" replace />} />
      <Route path="music" element={<Navigate to="/app/music" replace />} />
      <Route path="vr" element={<Navigate to="/app/vr" replace />} />
      
      {/* ==================== 404 CATCH ALL ==================== */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

export default unifiedRouter;
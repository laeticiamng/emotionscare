// @ts-nocheck

import { ROUTER_V2_MANIFEST } from '@/routerV2/manifest';

export interface RouteAuditData {
  route: string;
  name: string;
  requiresAuth: boolean;
  category: string;
  description: string;
}

export const COMPLETE_ROUTES_AUDIT: RouteAuditData[] = [
  // Routes publiques
  { route: '/', name: 'home', requiresAuth: false, category: 'Public', description: 'Page d\'accueil principale' },
  { route: '/mode-selection', name: 'modeSelection', requiresAuth: false, category: 'Public', description: 'Sélection du mode utilisateur' },
  { route: '/auth', name: 'auth', requiresAuth: false, category: 'Public', description: 'Page d\'authentification' },
  
  // Routes B2C
  { route: '/b2c/login', name: 'b2cLogin', requiresAuth: false, category: 'B2C Auth', description: 'Connexion B2C' },
  { route: '/b2c/register', name: 'b2cRegister', requiresAuth: false, category: 'B2C Auth', description: 'Inscription B2C' },
  { route: '/b2c/dashboard', name: 'b2cDashboard', requiresAuth: true, category: 'B2C', description: 'Tableau de bord B2C' },
  
  // Routes B2B Selection
  { route: '/b2b/selection', name: 'b2bSelection', requiresAuth: false, category: 'B2B', description: 'Sélection du type B2B' },
  
  // Routes B2B User
  { route: '/b2b/user/login', name: 'b2bUserLogin', requiresAuth: false, category: 'B2B Auth', description: 'Connexion utilisateur B2B' },
  { route: '/b2b/user/register', name: 'b2bUserRegister', requiresAuth: false, category: 'B2B Auth', description: 'Inscription utilisateur B2B' },
  { route: '/b2b/user/dashboard', name: 'b2bUserDashboard', requiresAuth: true, category: 'B2B User', description: 'Tableau de bord utilisateur B2B' },
  
  // Routes B2B Admin
  { route: '/b2b/admin/login', name: 'b2bAdminLogin', requiresAuth: false, category: 'B2B Auth', description: 'Connexion admin B2B' },
  { route: '/b2b/admin/dashboard', name: 'b2bAdminDashboard', requiresAuth: true, category: 'B2B Admin', description: 'Tableau de bord admin B2B' },
  
  // Routes communes fonctionnelles
  { route: '/scan', name: 'scan', requiresAuth: true, category: 'Features', description: 'Scanner d\'émotions' },
  { route: '/music', name: 'music', requiresAuth: true, category: 'Features', description: 'Thérapie musicale' },
  { route: '/coach', name: 'coach', requiresAuth: true, category: 'Features', description: 'Coach virtuel' },
  { route: '/journal', name: 'journal', requiresAuth: true, category: 'Features', description: 'Journal émotionnel' },
  { route: '/vr', name: 'vr', requiresAuth: true, category: 'Features', description: 'Réalité virtuelle' },
  { route: '/preferences', name: 'preferences', requiresAuth: true, category: 'Settings', description: 'Préférences utilisateur' },
  { route: '/gamification', name: 'gamification', requiresAuth: true, category: 'Features', description: 'Système de gamification' },
  { route: '/social-cocon', name: 'socialCocon', requiresAuth: true, category: 'Features', description: 'Cocon social' },
  
  // Routes administrateur
  { route: '/teams', name: 'teams', requiresAuth: true, category: 'Admin', description: 'Gestion des équipes' },
  { route: '/reports', name: 'reports', requiresAuth: true, category: 'Admin', description: 'Rapports et analyses' },
  { route: '/events', name: 'events', requiresAuth: true, category: 'Admin', description: 'Gestion des événements' },
  { route: '/optimisation', name: 'optimisation', requiresAuth: true, category: 'Admin', description: 'Optimisation système' },
  { route: '/settings', name: 'settings', requiresAuth: true, category: 'Admin', description: 'Paramètres système' },
  
  // Routes légales
  { route: '/legal/mentions', name: 'mentions', requiresAuth: false, category: 'Legal', description: 'Mentions légales' },
  { route: '/legal/terms', name: 'terms', requiresAuth: false, category: 'Legal', description: 'Conditions d\'utilisation' },
  { route: '/legal/sales', name: 'sales', requiresAuth: false, category: 'Legal', description: 'Conditions de vente' },
  { route: '/legal/privacy', name: 'privacy', requiresAuth: false, category: 'Legal', description: 'Politique de confidentialité' },
  { route: '/legal/cookies', name: 'cookies', requiresAuth: false, category: 'Legal', description: 'Politique cookies' },
  { route: '/contact', name: 'contact', requiresAuth: false, category: 'Legal', description: 'Contact' },
  { route: '/about', name: 'about', requiresAuth: false, category: 'Legal', description: 'À propos' },
  { route: '/pricing', name: 'pricing', requiresAuth: false, category: 'Legal', description: 'Tarification' },
  { route: '/features', name: 'features', requiresAuth: false, category: 'Legal', description: 'Fonctionnalités' },
  { route: '/faq', name: 'faq', requiresAuth: false, category: 'Legal', description: 'Questions fréquentes' },
  
  // Routes spécialisées
  { route: '/onboarding', name: 'onboarding', requiresAuth: true, category: 'Onboarding', description: 'Processus d\'intégration' },
  { route: '/complete-audit', name: 'completeAudit', requiresAuth: true, category: 'Admin', description: 'Audit complet des routes' },
  { route: '/notifications', name: 'notifications', requiresAuth: true, category: 'Features', description: 'Centre de notifications' },
];

export function validateAllRoutes() {
  const manifestRoutes = ROUTER_V2_MANIFEST;
  const auditRoutes = COMPLETE_ROUTES_AUDIT.map(r => r.route);
  
  const missingInAudit = manifestRoutes.filter(route => !auditRoutes.includes(route));
  const missingInManifest = auditRoutes.filter(route => !manifestRoutes.includes(route));
  
  return {
    totalManifest: manifestRoutes.length,
    totalAudit: auditRoutes.length,
    missingInAudit,
    missingInManifest,
    isComplete: missingInAudit.length === 0 && missingInManifest.length === 0
  };
}

export function getRoutesByCategory() {
  const categories = COMPLETE_ROUTES_AUDIT.reduce((acc, route) => {
    if (!acc[route.category]) {
      acc[route.category] = [];
    }
    acc[route.category].push(route);
    return acc;
  }, {} as Record<string, RouteAuditData[]>);
  
  return categories;
}

export function getAuthRequiredRoutes() {
  return COMPLETE_ROUTES_AUDIT.filter(route => route.requiresAuth);
}

export function getPublicRoutes() {
  return COMPLETE_ROUTES_AUDIT.filter(route => !route.requiresAuth);
}

// @ts-nocheck
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PageMetadata {
  title: string;
  description: string;
  breadcrumbs: Array<{ label: string; path: string }>;
  requiresAuth: boolean;
  allowedRoles: string[];
  hasQuickActions: boolean;
  loadingState: 'loading' | 'success' | 'error' | 'idle';
}

const PAGE_METADATA: Record<string, Omit<PageMetadata, 'loadingState'>> = {
  // Routes unifiées /app/*
  '/app/home': {
    title: 'Tableau de bord',
    description: 'Vue d\'ensemble de votre bien-être émotionnel',
    breadcrumbs: [{ label: 'Accueil', path: '/app/home' }],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: true
  },
  '/app/scan': {
    title: 'Scan Émotions',
    description: 'Analysez votre état émotionnel en temps réel',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Scan Émotions', path: '/app/scan' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/app/music': {
    title: 'Musique Thérapeutique',
    description: 'Musique adaptée à votre état émotionnel',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Musique', path: '/app/music' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/app/coach': {
    title: 'Coach IA',
    description: 'Conseils personnalisés pour votre bien-être',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Coach IA', path: '/app/coach' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/app/journal': {
    title: 'Journal Émotionnel',
    description: 'Tenez votre journal de bien-être quotidien',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Journal', path: '/app/journal' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/app/vr': {
    title: 'Réalité Virtuelle',
    description: 'Expériences immersives pour le bien-être',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'VR', path: '/app/vr' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  
  // Modules Fun-First
  '/app/flash-glow': {
    title: 'Flash Glow',
    description: 'Boost instantané d\'énergie positive',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Flash Glow', path: '/app/flash-glow' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/app/breath': {
    title: 'Respiration Guidée',
    description: 'Exercices de respiration pour se détendre',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Respiration', path: '/app/breath' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/app/face-ar': {
    title: 'Filtres AR Émotionnels',
    description: 'Filtres de réalité augmentée pour le bien-être',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Filtres AR', path: '/app/face-ar' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/app/emotion-scan': {
    title: 'Scan Émotionnel',
    description: 'Analyse avancée de vos émotions',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Emotion Scan', path: '/app/emotion-scan' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/app/voice-journal': {
    title: 'Journal Vocal',
    description: 'Enregistrez vos pensées et émotions',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Journal Vocal', path: '/app/voice-journal' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/app/bubble-beat': {
    title: 'Bubble Beat',
    description: 'Jeu interactif de bien-être avec simulation cardiaque',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Bubble Beat', path: '/app/bubble-beat' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/app/screen-silk': {
    title: 'Screen Silk Break',
    description: 'Pause écran relaxante et apaisante',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Screen Silk', path: '/app/screen-silk' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/app/vr-galaxy': {
    title: 'VR Galactique',
    description: 'Voyage spatial immersif pour la détente',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'VR Galaxy', path: '/app/vr-galaxy' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/app/boss-grit': {
    title: 'Boss Level Grit',
    description: 'Développez votre résilience et détermination',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Boss Grit', path: '/app/boss-grit' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/app/mood-mixer': {
    title: 'Mood Mixer',
    description: 'Créez votre ambiance sonore personnalisée',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Mood Mixer', path: '/app/mood-mixer' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/app/ambition-arcade': {
    title: 'Ambition Arcade',
    description: 'Gamification de vos objectifs personnels',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Ambition Arcade', path: '/app/ambition-arcade' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/app/bounce-back': {
    title: 'Bounce Back Battle',
    description: 'Stratégies de résilience face aux défis',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Bounce Back', path: '/app/bounce-back' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/app/story-synth': {
    title: 'Story Synth Lab',
    description: 'Créez des histoires thérapeutiques personnalisées',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Story Synth', path: '/app/story-synth' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/app/social-cocon': {
    title: 'Social Cocon',
    description: 'Espace de partage et d\'entraide communautaire',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Social Cocon', path: '/app/social-cocon' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  
  // Analytics & Data
  '/app/leaderboard': {
    title: 'Tableau des Leaders',
    description: 'Classements et achievements',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Leaderboard', path: '/app/leaderboard' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/app/activity': {
    title: 'Historique d\'Activité',
    description: 'Vos statistiques de bien-être',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Activité', path: '/app/activity' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/app/scores': {
    title: 'Scores & vibes',
    description: 'Courbes d’humeur, séances et heatmap quotidienne',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Scores & vibes', path: '/app/scores' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/app/heatmap': {
    title: 'Scores & vibes',
    description: 'Courbes d’humeur, séances et heatmap quotidienne',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Scores & vibes', path: '/app/scores' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },

  // Paramètres
  '/settings/general': {
    title: 'Paramètres Généraux',
    description: 'Configuration de base de votre compte',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Paramètres', path: '/settings/general' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/settings/profile': {
    title: 'Paramètres de Profil',
    description: 'Gestion de votre profil utilisateur',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Paramètres', path: '/settings/general' },
      { label: 'Profil', path: '/settings/profile' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/settings/privacy': {
    title: 'Paramètres de Confidentialité',
    description: 'Contrôlez vos données et votre confidentialité',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Paramètres', path: '/settings/general' },
      { label: 'Confidentialité', path: '/settings/privacy' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/settings/notifications': {
    title: 'Paramètres de Notifications',
    description: 'Gérez vos préférences de notifications',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Paramètres', path: '/settings/general' },
      { label: 'Notifications', path: '/settings/notifications' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c', 'b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },

  // B2B Features
  '/app/teams': {
    title: 'Gestion d\'Équipe',
    description: 'Collaboration et bien-être en équipe',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Équipes', path: '/app/teams' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },
  '/app/social': {
    title: 'Espace Social B2B',
    description: 'Réseau social d\'entreprise pour le bien-être',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Social', path: '/app/social' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2b_user', 'b2b_admin'],
    hasQuickActions: false
  },

  // B2B Admin
  '/app/reports': {
    title: 'Rapports Administrateur',
    description: 'Analyses et rapports détaillés',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Rapports', path: '/app/reports' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2b_admin'],
    hasQuickActions: false
  },
  '/app/events': {
    title: 'Gestion d\'Événements',
    description: 'Organisation d\'événements bien-être',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Événements', path: '/app/events' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2b_admin'],
    hasQuickActions: false
  },
  '/app/optimization': {
    title: 'Optimisation Plateforme',
    description: 'Outils d\'optimisation et performance',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Optimisation', path: '/app/optimization' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2b_admin'],
    hasQuickActions: false
  },
  '/app/security': {
    title: 'Sécurité',
    description: 'Gestion de la sécurité et conformité',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Sécurité', path: '/app/security' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2b_admin'],
    hasQuickActions: false
  },
  '/app/audit': {
    title: 'Audit Système',
    description: 'Audits et vérifications de conformité',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Audit', path: '/app/audit' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2b_admin'],
    hasQuickActions: false
  },
  '/app/accessibility': {
    title: 'Accessibilité',
    description: 'Outils et paramètres d\'accessibilité',
    breadcrumbs: [
      { label: 'Accueil', path: '/app/home' },
      { label: 'Accessibilité', path: '/app/accessibility' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2b_admin'],
    hasQuickActions: false
  }
};

export const usePageMetadata = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [loadingState, setLoadingState] = useState<'loading' | 'success' | 'error' | 'idle'>('idle');

  const metadata = PAGE_METADATA[location.pathname];

  useEffect(() => {
    setLoadingState('loading');
    
    // Simulation de validation de page
    setTimeout(() => {
      if (metadata) {
        if (metadata.requiresAuth && !isAuthenticated) {
          setLoadingState('error');
        } else if (metadata.allowedRoles.length > 0 && user && !metadata.allowedRoles.includes(user.role)) {
          setLoadingState('error');
        } else {
          setLoadingState('success');
        }
      } else {
        setLoadingState('error');
      }
    }, 100);
  }, [location.pathname, isAuthenticated, user, metadata]);

  if (!metadata) {
    return {
      title: 'Page non trouvée',
      description: 'Cette page n\'existe pas',
      breadcrumbs: [],
      requiresAuth: false,
      allowedRoles: [],
      hasQuickActions: false,
      loadingState: 'error' as const
    };
  }

  return {
    ...metadata,
    loadingState
  };
};
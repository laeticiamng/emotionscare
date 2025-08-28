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
  // Routes B2C
  '/b2c/dashboard': {
    title: 'Tableau de bord B2C',
    description: 'Vue d\'ensemble de votre bien-être émotionnel',
    breadcrumbs: [{ label: 'Accueil', path: '/b2c/dashboard' }],
    requiresAuth: true,
    allowedRoles: ['b2c'],
    hasQuickActions: true
  },
  '/b2c/scan': {
    title: 'Scan Émotions',
    description: 'Analysez votre état émotionnel en temps réel',
    breadcrumbs: [
      { label: 'Accueil', path: '/b2c/dashboard' },
      { label: 'Scan Émotions', path: '/b2c/scan' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c'],
    hasQuickActions: false
  },
  '/b2c/music': {
    title: 'Musique Thérapeutique',
    description: 'Musique adaptée à votre état émotionnel',
    breadcrumbs: [
      { label: 'Accueil', path: '/b2c/dashboard' },
      { label: 'Musique', path: '/b2c/music' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c'],
    hasQuickActions: false
  },
  '/b2c/coach': {
    title: 'Coach IA',
    description: 'Conseils personnalisés pour votre bien-être',
    breadcrumbs: [
      { label: 'Accueil', path: '/b2c/dashboard' },
      { label: 'Coach IA', path: '/b2c/coach' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c'],
    hasQuickActions: false
  },
  '/b2c/journal': {
    title: 'Journal Émotionnel',
    description: 'Tenez votre journal de bien-être quotidien',
    breadcrumbs: [
      { label: 'Accueil', path: '/b2c/dashboard' },
      { label: 'Journal', path: '/b2c/journal' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c'],
    hasQuickActions: false
  },
  
  // Fun-First B2C
  '/b2c/bubble-beat': {
    title: 'Bubble Beat',
    description: 'Jeu interactif de bien-être avec simulation cardiaque',
    breadcrumbs: [
      { label: 'Accueil', path: '/b2c/dashboard' },
      { label: 'Bubble Beat', path: '/b2c/bubble-beat' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c'],
    hasQuickActions: false
  },
  '/b2c/flash-glow': {
    title: 'Flash Glow',
    description: 'Boost instantané d\'énergie positive',
    breadcrumbs: [
      { label: 'Accueil', path: '/b2c/dashboard' },
      { label: 'Flash Glow', path: '/b2c/flash-glow' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2c'],
    hasQuickActions: false
  },
  
  // Routes B2B User
  '/b2b/user/dashboard': {
    title: 'Dashboard RH',
    description: 'Vue d\'ensemble du bien-être de votre équipe',
    breadcrumbs: [{ label: 'RH Dashboard', path: '/b2b/user/dashboard' }],
    requiresAuth: true,
    allowedRoles: ['b2b_user'],
    hasQuickActions: true
  },
  '/b2b/user/scan': {
    title: 'Scan Équipe',
    description: 'Analysez le bien-être de votre équipe',
    breadcrumbs: [
      { label: 'RH Dashboard', path: '/b2b/user/dashboard' },
      { label: 'Scan Équipe', path: '/b2b/user/scan' }
    ],
    requiresAuth: true,
    allowedRoles: ['b2b_user'],
    hasQuickActions: false
  },
  
  // Routes B2B Admin
  '/b2b/admin/dashboard': {
    title: 'Administration',
    description: 'Gestion complète de la plateforme EmotionsCare',
    breadcrumbs: [{ label: 'Administration', path: '/b2b/admin/dashboard' }],
    requiresAuth: true,
    allowedRoles: ['b2b_admin'],
    hasQuickActions: true
  },
  '/b2b/admin/teams': {
    title: 'Gestion Équipes',
    description: 'Administration des équipes et utilisateurs',
    breadcrumbs: [
      { label: 'Administration', path: '/b2b/admin/dashboard' },
      { label: 'Équipes', path: '/b2b/admin/teams' }
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
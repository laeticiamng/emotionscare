/**
 * Configuration centralisée de la navigation
 * Architecture scalable pour gérer routes, permissions et métadonnées
 */

import { 
  Home, Brain, Music, Book, Wind, Camera, Bot, Users, 
  Settings, BarChart3, Heart, Zap, Target, Shield,
  Globe, Headphones, Gamepad2, Palette, Clock
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon: any;
  description: string;
  category: NavigationCategory;
  status: 'active' | 'beta' | 'coming-soon' | 'maintenance';
  permissions?: string[];
  children?: NavigationItem[];
  metadata?: {
    tags?: string[];
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    duration?: string;
    premium?: boolean;
  };
}

export type NavigationCategory = 
  | 'main' 
  | 'wellbeing' 
  | 'analysis' 
  | 'social' 
  | 'settings' 
  | 'admin';

export const navigationConfig: NavigationItem[] = [
  // Pages principales
  {
    id: 'home',
    title: 'Accueil',
    path: '/',
    icon: Home,
    description: 'Vue d\'ensemble personnalisée de votre bien-être',
    category: 'main',
    status: 'active',
    metadata: {
      tags: ['dashboard', 'overview'],
      difficulty: 'beginner'
    }
  },

  // Modules de bien-être
  {
    id: 'scan',
    title: 'Scanner Émotionnel',
    path: '/scan',
    icon: Brain,
    description: 'Analyse de votre état émotionnel en temps réel',
    category: 'analysis',
    status: 'active',
    metadata: {
      tags: ['emotions', 'ai', 'analysis'],
      difficulty: 'beginner',
      duration: '2-5 min'
    },
    children: [
      {
        id: 'scan-voice',
        title: 'Analyse Vocale',
        path: '/scan/voice',
        icon: Camera,
        description: 'Détection émotionnelle par analyse vocale',
        category: 'analysis',
        status: 'active',
        metadata: { difficulty: 'intermediate' }
      },
      {
        id: 'scan-text',
        title: 'Analyse Textuelle',
        path: '/scan/text',
        icon: Brain,
        description: 'Analyse des émotions dans vos écrits',
        category: 'analysis',
        status: 'active',
        metadata: { difficulty: 'beginner' }
      },
      {
        id: 'scan-history',
        title: 'Historique des Scans',
        path: '/scan/history',
        icon: BarChart3,
        description: 'Suivi de l\'évolution de votre état émotionnel',
        category: 'analysis',
        status: 'active',
        metadata: { difficulty: 'intermediate' }
      }
    ]
  },

  {
    id: 'music',
    title: 'Musicothérapie',
    path: '/music',
    icon: Music,
    description: 'Musique thérapeutique adaptée à votre état',
    category: 'wellbeing',
    status: 'active',
    metadata: {
      tags: ['music', 'therapy', 'relaxation'],
      difficulty: 'beginner',
      duration: '5-30 min'
    },
    children: [
      {
        id: 'music-generator',
        title: 'Générateur de Musique',
        path: '/music/generate',
        icon: Zap,
        description: 'Création de musique personnalisée par IA',
        category: 'wellbeing',
        status: 'active',
        metadata: { premium: true, difficulty: 'intermediate' }
      },
      {
        id: 'music-library',
        title: 'Bibliothèque',
        path: '/music/library',
        icon: Headphones,
        description: 'Collection de musiques thérapeutiques',
        category: 'wellbeing',
        status: 'active'
      },
      {
        id: 'mood-mixer',
        title: 'Mood Mixer',
        path: '/music/mood-mixer',
        icon: Palette,
        description: 'Mixage musical basé sur votre humeur',
        category: 'wellbeing',
        status: 'beta'
      }
    ]
  },

  {
    id: 'breathwork',
    title: 'Breathwork',
    path: '/breathwork',
    icon: Wind,
    description: 'Techniques de respiration guidées',
    category: 'wellbeing',
    status: 'active',
    metadata: {
      tags: ['breathing', 'meditation', 'wellness'],
      difficulty: 'beginner',
      duration: '3-15 min'
    },
    children: [
      {
        id: 'breathwork-box',
        title: 'Respiration Carrée',
        path: '/breathwork/box',
        icon: Target,
        description: 'Technique de respiration 4-4-4-4',
        category: 'wellbeing',
        status: 'active'
      },
      {
        id: 'breathwork-coherence',
        title: 'Cohérence Cardiaque',
        path: '/breathwork/coherence',
        icon: Heart,
        description: 'Synchronisation cœur-respiration',
        category: 'wellbeing',
        status: 'active'
      },
      {
        id: 'breathwork-sessions',
        title: 'Historique des Sessions',
        path: '/breathwork/sessions',
        icon: Clock,
        description: 'Suivi de vos sessions de respiration',
        category: 'wellbeing',
        status: 'active'
      }
    ]
  },

  {
    id: 'journal',
    title: 'Journal Émotionnel',
    path: '/journal',
    icon: Book,
    description: 'Suivi quotidien de votre bien-être',
    category: 'wellbeing',
    status: 'active',
    metadata: {
      tags: ['journal', 'emotions', 'tracking'],
      difficulty: 'beginner',
      duration: '5-20 min'
    },
    children: [
      {
        id: 'journal-new',
        title: 'Nouvelle Entrée',
        path: '/journal/new',
        icon: Book,
        description: 'Créer une nouvelle entrée de journal',
        category: 'wellbeing',
        status: 'active'
      },
      {
        id: 'journal-entries',
        title: 'Mes Entrées',
        path: '/journal/entries',
        icon: BarChart3,
        description: 'Historique de vos réflexions',
        category: 'wellbeing',
        status: 'active'
      }
    ]
  },

  {
    id: 'coach',
    title: 'Coach IA',
    path: '/coach',
    icon: Bot,
    description: 'Accompagnement personnalisé par intelligence artificielle',
    category: 'wellbeing',
    status: 'active',
    metadata: {
      tags: ['ai', 'coaching', 'personalized'],
      difficulty: 'intermediate'
    }
  },

  {
    id: 'vr',
    title: 'Réalité Virtuelle',
    path: '/vr',
    icon: Gamepad2,
    description: 'Expériences immersives de relaxation',
    category: 'wellbeing',
    status: 'beta',
    metadata: {
      tags: ['vr', 'immersion', 'relaxation'],
      difficulty: 'intermediate',
      premium: true
    }
  },

  // Fonctionnalités EDN & ECOS
  {
    id: 'edn',
    title: 'EDN',
    path: '/edn',
    icon: Shield,
    description: 'Épreuves Dématérialisées Nationales',
    category: 'main',
    status: 'active',
    permissions: ['student', 'educator']
  },

  {
    id: 'ecos',
    title: 'ECOS',
    path: '/ecos',
    icon: Globe,
    description: 'Examens Cliniques Objectifs Structurés',
    category: 'main',
    status: 'active',
    permissions: ['student', 'educator']
  },

  // Social & Communauté
  {
    id: 'community',
    title: 'Communauté',
    path: '/community',
    icon: Users,
    description: 'Connexion avec d\'autres utilisateurs',
    category: 'social',
    status: 'coming-soon'
  },

  // Paramètres & Compte
  {
    id: 'account',
    title: 'Mon Compte',
    path: '/account',
    icon: Settings,
    description: 'Gestion de votre profil et préférences',
    category: 'settings',
    status: 'active',
    children: [
      {
        id: 'account-profile',
        title: 'Profil',
        path: '/account/profile',
        icon: Settings,
        description: 'Informations personnelles',
        category: 'settings',
        status: 'active'
      },
      {
        id: 'account-preferences',
        title: 'Préférences',
        path: '/account/preferences',
        icon: Settings,
        description: 'Paramètres de l\'application',
        category: 'settings',
        status: 'active'
      },
      {
        id: 'account-privacy',
        title: 'Confidentialité',
        path: '/account/privacy',
        icon: Shield,
        description: 'Gestion de vos données personnelles',
        category: 'settings',
        status: 'active'
      }
    ]
  }
];

/**
 * Utilitaires pour la navigation
 */
export class NavigationHelper {
  /**
   * Trouve un item de navigation par son ID
   */
  static findById(id: string): NavigationItem | undefined {
    const findRecursive = (items: NavigationItem[]): NavigationItem | undefined => {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children) {
          const found = findRecursive(item.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findRecursive(navigationConfig);
  }

  /**
   * Trouve un item par son chemin
   */
  static findByPath(path: string): NavigationItem | undefined {
    const findRecursive = (items: NavigationItem[]): NavigationItem | undefined => {
      for (const item of items) {
        if (item.path === path) return item;
        if (item.children) {
          const found = findRecursive(item.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findRecursive(navigationConfig);
  }

  /**
   * Récupère les items par catégorie
   */
  static getByCategory(category: NavigationCategory): NavigationItem[] {
    return navigationConfig.filter(item => item.category === category);
  }

  /**
   * Récupère les items accessibles selon les permissions
   */
  static getAccessibleItems(userPermissions: string[] = []): NavigationItem[] {
    return navigationConfig.filter(item => {
      if (!item.permissions) return true;
      return item.permissions.some(permission => userPermissions.includes(permission));
    });
  }

  /**
   * Génère le breadcrumb pour un chemin donné
   */
  static generateBreadcrumb(path: string): NavigationItem[] {
    const breadcrumb: NavigationItem[] = [];
    
    const findPath = (items: NavigationItem[], currentPath: NavigationItem[] = []): boolean => {
      for (const item of items) {
        const newPath = [...currentPath, item];
        
        if (item.path === path) {
          breadcrumb.push(...newPath);
          return true;
        }
        
        if (item.children && findPath(item.children, newPath)) {
          return true;
        }
      }
      return false;
    };
    
    findPath(navigationConfig);
    return breadcrumb;
  }

  /**
   * Vérifie si un item est actif
   */
  static isActive(item: NavigationItem): boolean {
    return item.status === 'active';
  }

  /**
   * Récupère tous les chemins possibles (pour le routeur)
   */
  static getAllPaths(): string[] {
    const paths: string[] = [];
    
    const collectPaths = (items: NavigationItem[]) => {
      for (const item of items) {
        paths.push(item.path);
        if (item.children) {
          collectPaths(item.children);
        }
      }
    };
    
    collectPaths(navigationConfig);
    return paths;
  }
}

export default navigationConfig;
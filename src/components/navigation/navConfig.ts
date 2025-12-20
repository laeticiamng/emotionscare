// @ts-nocheck

import { 
  Home, 
  Brain, 
  FileText, 
  Scan, 
  Music, 
  MessageCircle, 
  Glasses, 
  Settings,
  Users,
  BarChart3,
  Calendar,
  Sparkles,
  Watch,
  Heart,
  Target,
  Shield,
  User
} from 'lucide-react';

export interface NavItem {
  href: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: string;
  roles: ('b2c' | 'b2b_user' | 'b2b_admin')[];
  category: 'core' | 'tools' | 'admin' | 'social';
  priority: number; // Pour l'ordre d'affichage
}

// Navigation pour utilisateurs B2C (Particuliers)
export const b2cNavItems: NavItem[] = [
  {
    href: '/app/consumer/home',
    title: 'Tableau de bord',
    icon: Home,
    description: 'Vue d\'ensemble de votre bien-être',
    roles: ['b2c'],
    category: 'core',
    priority: 1
  },
  {
    href: '/app/scan',
    title: 'Scan Émotionnel',
    icon: Scan,
    description: 'Analysez votre état émotionnel',
    badge: 'IA',
    roles: ['b2c'],
    category: 'core',
    priority: 2
  },
  {
    href: '/app/journal',
    title: 'Journal Personnel',
    icon: FileText,
    description: 'Espace de réflexion quotidien',
    roles: ['b2c'],
    category: 'core',
    priority: 3
  },
  {
    href: '/app/emotion-sessions',
    title: 'Sessions Émotionnelles',
    icon: Sparkles,
    description: 'Résumé IA et actions immédiates',
    badge: 'Nouveau',
    roles: ['b2c'],
    category: 'core',
    priority: 4
  },
  {
    href: '/app/coach',
    title: 'Coach IA',
    icon: Brain,
    description: 'Accompagnement personnalisé',
    badge: 'Premium',
    roles: ['b2c'],
    category: 'core',
    priority: 5
  },
  {
    href: '/app/music',
    title: 'Musicothérapie',
    icon: Music,
    description: 'Sons et musiques thérapeutiques',
    roles: ['b2c'],
    category: 'tools',
    priority: 5
  },
  {
    href: '/app/vr',
    title: 'Réalité Virtuelle',
    icon: Glasses,
    description: 'Expériences immersives',
    badge: 'VR',
    roles: ['b2c'],
    category: 'tools',
    priority: 6
  },
  {
    href: '/gamification',
    title: 'Défis & Récompenses',
    icon: Target,
    description: 'Progressez en vous amusant',
    roles: ['b2c'],
    category: 'tools',
    priority: 7
  },
  {
    href: '/app/community',
    title: 'Communauté',
    icon: Users,
    description: 'Groupes de soutien',
    badge: 'Nouveau',
    roles: ['b2c'],
    category: 'social',
    priority: 8
  },
  {
    href: '/app/wearables',
    title: 'Appareils',
    icon: Watch,
    description: 'Sync santé connectée',
    roles: ['b2c'],
    category: 'tools',
    priority: 9
  },
  {
    href: '/app/social-cocon',
    title: 'Cocon Social',
    icon: Heart,
    description: 'Communauté bienveillante',
    roles: ['b2c'],
    category: 'social',
    priority: 10
  },
  {
    href: '/settings/privacy',
    title: 'Préférences',
    icon: Settings,
    description: 'Configuration personnelle',
    roles: ['b2c'],
    category: 'core',
    priority: 9
  }
];

// Navigation pour collaborateurs B2B
export const b2bUserNavItems: NavItem[] = [
  {
    href: '/app/collab',
    title: 'Tableau de bord',
    icon: Home,
    description: 'Vue d\'ensemble personnelle et équipe',
    roles: ['b2b_user'],
    category: 'core',
    priority: 1
  },
  {
    href: '/app/scan',
    title: 'Scan Émotionnel',
    icon: Scan,
    description: 'Analysez votre état émotionnel',
    badge: 'IA',
    roles: ['b2b_user'],
    category: 'core',
    priority: 2
  },
  {
    href: '/app/journal',
    title: 'Journal Personnel',
    icon: FileText,
    description: 'Espace de réflexion quotidien',
    roles: ['b2b_user'],
    category: 'core',
    priority: 3
  },
  {
    href: '/app/emotion-sessions',
    title: 'Sessions Émotionnelles',
    icon: Sparkles,
    description: 'Résumé IA et actions immédiates',
    badge: 'Nouveau',
    roles: ['b2b_user'],
    category: 'core',
    priority: 4
  },
  {
    href: '/app/coach',
    title: 'Coach IA',
    icon: Brain,
    description: 'Accompagnement personnalisé',
    badge: 'Premium',
    roles: ['b2b_user'],
    category: 'core',
    priority: 5
  },
  {
    href: '/app/music',
    title: 'Musicothérapie',
    icon: Music,
    description: 'Sons et musiques thérapeutiques',
    roles: ['b2b_user'],
    category: 'tools',
    priority: 5
  },
  {
    href: '/app/vr',
    title: 'Réalité Virtuelle',
    icon: Glasses,
    description: 'Expériences immersives',
    badge: 'VR',
    roles: ['b2b_user'],
    category: 'tools',
    priority: 6
  },
  {
    href: '/gamification',
    title: 'Défis & Récompenses',
    icon: Target,
    description: 'Progressez en vous amusant',
    roles: ['b2b_user'],
    category: 'tools',
    priority: 7
  },
  {
    href: '/app/social-cocon',
    title: 'Cocon Social',
    icon: Heart,
    description: 'Communauté d\'entreprise',
    roles: ['b2b_user'],
    category: 'social',
    priority: 8
  },
  {
    href: '/settings/privacy',
    title: 'Préférences',
    icon: Settings,
    description: 'Configuration personnelle',
    roles: ['b2b_user'],
    category: 'core',
    priority: 9
  }
];

// Navigation pour administrateurs B2B
export const b2bAdminNavItems: NavItem[] = [
  {
    href: '/app/rh',
    title: 'Dashboard Admin',
    icon: Home,
    description: 'Vue d\'ensemble de l\'organisation',
    roles: ['b2b_admin'],
    category: 'core',
    priority: 1
  },
  {
    href: '/app/teams',
    title: 'Gestion d\'Équipes',
    icon: Users,
    description: 'Gérez vos collaborateurs',
    roles: ['b2b_admin'],
    category: 'admin',
    priority: 2
  },
  {
    href: '/app/reports',
    title: 'Rapports Analytics',
    icon: BarChart3,
    description: 'Analyses et métriques détaillées',
    badge: 'Analytics',
    roles: ['b2b_admin'],
    category: 'admin',
    priority: 3
  },
  {
    href: '/app/events',
    title: 'Événements RH',
    icon: Calendar,
    description: 'Planification et suivi',
    roles: ['b2b_admin'],
    category: 'admin',
    priority: 4
  },
  {
    href: '/app/optimization',
    title: 'Optimisation',
    icon: Sparkles,
    description: 'Outils d\'optimisation avancés',
    badge: 'Pro',
    roles: ['b2b_admin'],
    category: 'admin',
    priority: 5
  },
  {
    href: '/app/scan',
    title: 'Scan Émotionnel',
    icon: Scan,
    description: 'Outil d\'analyse personnelle',
    roles: ['b2b_admin'],
    category: 'tools',
    priority: 6
  },
  {
    href: '/app/journal',
    title: 'Journal Personnel',
    icon: FileText,
    description: 'Espace de réflexion',
    roles: ['b2b_admin'],
    category: 'tools',
    priority: 7
  },
  {
    href: '/app/coach',
    title: 'Coach IA',
    icon: Brain,
    description: 'Accompagnement personnalisé',
    roles: ['b2b_admin'],
    category: 'tools',
    priority: 8
  },
  {
    href: '/app/music',
    title: 'Musicothérapie',
    icon: Music,
    description: 'Sons thérapeutiques',
    roles: ['b2b_admin'],
    category: 'tools',
    priority: 9
  },
  {
    href: '/app/vr',
    title: 'Réalité Virtuelle',
    icon: Glasses,
    description: 'Expériences immersives',
    roles: ['b2b_admin'],
    category: 'tools',
    priority: 10
  },
  {
    href: '/app/social-cocon',
    title: 'Cocon Social',
    icon: Heart,
    description: 'Communauté d\'entreprise',
    roles: ['b2b_admin'],
    category: 'social',
    priority: 11
  },
  {
    href: '/settings/general',
    title: 'Paramètres Système',
    icon: Settings,
    description: 'Configuration globale',
    roles: ['b2b_admin'],
    category: 'admin',
    priority: 12
  }
];

// Utilitaires pour obtenir les éléments de navigation
export const getNavItemsByRole = (role: 'b2c' | 'b2b_user' | 'b2b_admin') => {
  switch (role) {
    case 'b2b_admin':
      return b2bAdminNavItems.sort((a, b) => a.priority - b.priority);
    case 'b2b_user':
      return b2bUserNavItems.sort((a, b) => a.priority - b.priority);
    case 'b2c':
    default:
      return b2cNavItems.sort((a, b) => a.priority - b.priority);
  }
};

export const getNavItemsByCategory = (role: 'b2c' | 'b2b_user' | 'b2b_admin', category: string) => {
  const items = getNavItemsByRole(role);
  return items.filter(item => item.category === category);
};

export const getAllUniqueRoutes = () => {
  const allItems = [...b2cNavItems, ...b2bUserNavItems, ...b2bAdminNavItems];
  const uniqueRoutes = new Set(allItems.map(item => item.href));
  return Array.from(uniqueRoutes);
};

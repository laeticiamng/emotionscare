
import { Home, Scan, Bot, Music, BookOpen, Users, Settings, HelpCircle, BarChart, UserCheck, Calendar, Target, Gamepad2, Sliders } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
}

// Navigation items for B2C users - CHEMINS UNIQUES ABSOLUS
export const b2cNavItems: NavItem[] = [
  {
    title: 'Tableau de bord',
    href: UNIFIED_ROUTES.B2C_DASHBOARD,
    icon: Home,
    description: 'Vue d\'ensemble de votre bien-être'
  },
  {
    title: 'Scanner Émotions',
    href: UNIFIED_ROUTES.SCAN,
    icon: Scan,
    description: 'Analysez vos émotions'
  },
  {
    title: 'Coach IA',
    href: UNIFIED_ROUTES.COACH,
    icon: Bot,
    description: 'Assistant personnel'
  },
  {
    title: 'Musique Thérapie',
    href: UNIFIED_ROUTES.MUSIC,
    icon: Music,
    description: 'Musiques personnalisées'
  },
  {
    title: 'Journal Personnel',
    href: UNIFIED_ROUTES.JOURNAL,
    icon: BookOpen,
    description: 'Votre journal intime'
  },
  {
    title: 'VR Expérience',
    href: UNIFIED_ROUTES.VR,
    icon: Target,
    description: 'Expériences immersives'
  },
  {
    title: 'Gamification',
    href: UNIFIED_ROUTES.GAMIFICATION,
    icon: Gamepad2,
    description: 'Défis et récompenses'
  },
  {
    title: 'Préférences',
    href: UNIFIED_ROUTES.PREFERENCES,
    icon: Sliders,
    description: 'Vos préférences'
  }
];

// Navigation items for B2B users (collaborators) - CHEMINS UNIQUES ABSOLUS
export const b2bUserNavItems: NavItem[] = [
  {
    title: 'Tableau de bord',
    href: UNIFIED_ROUTES.B2B_USER_DASHBOARD,
    icon: Home,
    description: 'Vue d\'ensemble personnelle'
  },
  {
    title: 'Scanner Émotions',
    href: UNIFIED_ROUTES.SCAN,
    icon: Scan,
    description: 'Analysez vos émotions'
  },
  {
    title: 'Coach IA',
    href: UNIFIED_ROUTES.COACH,
    icon: Bot,
    description: 'Assistant personnel'
  },
  {
    title: 'Musique Thérapie',
    href: UNIFIED_ROUTES.MUSIC,
    icon: Music,
    description: 'Musiques personnalisées'
  },
  {
    title: 'Journal Personnel',
    href: UNIFIED_ROUTES.JOURNAL,
    icon: BookOpen,
    description: 'Votre journal personnel'
  },
  {
    title: 'VR Expérience',
    href: UNIFIED_ROUTES.VR,
    icon: Target,
    description: 'Expériences immersives'
  },
  {
    title: 'Cocon Social',
    href: UNIFIED_ROUTES.SOCIAL_COCON,
    icon: Users,
    description: 'Espace collaboratif'
  },
  {
    title: 'Gamification',
    href: UNIFIED_ROUTES.GAMIFICATION,
    icon: Gamepad2,
    description: 'Défis d\'équipe'
  },
  {
    title: 'Préférences',
    href: UNIFIED_ROUTES.PREFERENCES,
    icon: Sliders,
    description: 'Vos préférences'
  }
];

// Navigation items for B2B admins - CHEMINS UNIQUES ABSOLUS
export const b2bAdminNavItems: NavItem[] = [
  {
    title: 'Tableau de bord',
    href: UNIFIED_ROUTES.B2B_ADMIN_DASHBOARD,
    icon: Home,
    description: 'Vue d\'ensemble administrateur'
  },
  {
    title: 'Gestion Équipes',
    href: UNIFIED_ROUTES.TEAMS,
    icon: Users,
    description: 'Gérer les équipes'
  },
  {
    title: 'Rapports',
    href: UNIFIED_ROUTES.REPORTS,
    icon: BarChart,
    description: 'Analyses et rapports'
  },
  {
    title: 'Événements',
    href: UNIFIED_ROUTES.EVENTS,
    icon: Calendar,
    description: 'Gestion des événements'
  },
  {
    title: 'Optimisation',
    href: UNIFIED_ROUTES.OPTIMISATION,
    icon: Target,
    description: 'Optimisation RH'
  },
  {
    title: 'Scanner Émotions',
    href: UNIFIED_ROUTES.SCAN,
    icon: Scan,
    description: 'Analysez vos émotions'
  },
  {
    title: 'Coach IA',
    href: UNIFIED_ROUTES.COACH,
    icon: Bot,
    description: 'Assistant personnel'
  },
  {
    title: 'Musique Thérapie',
    href: UNIFIED_ROUTES.MUSIC,
    icon: Music,
    description: 'Musiques personnalisées'
  },
  {
    title: 'Journal Personnel',
    href: UNIFIED_ROUTES.JOURNAL,
    icon: BookOpen,
    description: 'Votre journal personnel'
  },
  {
    title: 'Cocon Social',
    href: UNIFIED_ROUTES.SOCIAL_COCON,
    icon: Users,
    description: 'Espace collaboratif'
  },
  {
    title: 'Paramètres',
    href: UNIFIED_ROUTES.SETTINGS,
    icon: Settings,
    description: 'Paramètres administrateur'
  }
];

// Common navigation items (footer) - CHEMINS UNIQUES ABSOLUS
export const commonNavItems: NavItem[] = [
  {
    title: 'Paramètres',
    href: UNIFIED_ROUTES.SETTINGS,
    icon: Settings,
    description: 'Configurer l\'application'
  },
  {
    title: 'Aide',
    href: '/help',
    icon: HelpCircle,
    description: 'Support et documentation'
  }
];

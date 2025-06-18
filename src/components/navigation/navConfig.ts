
import { Home, Scan, Bot, Music, BookOpen, Users, Settings, HelpCircle, BarChart, UserCheck, Calendar, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
}

// Navigation items for B2C users - CHEMINS UNIQUES
export const b2cNavItems: NavItem[] = [
  {
    title: 'Tableau de bord',
    href: '/b2c/dashboard',
    icon: Home,
    description: 'Vue d\'ensemble de votre bien-être'
  },
  {
    title: 'Scanner Émotions',
    href: '/scan',
    icon: Scan,
    description: 'Analysez vos émotions'
  },
  {
    title: 'Coach IA',
    href: '/coach',
    icon: Bot,
    description: 'Assistant personnel'
  },
  {
    title: 'Musique Thérapie',
    href: '/music',
    icon: Music,
    description: 'Musiques personnalisées'
  },
  {
    title: 'Journal Personnel',
    href: '/journal',
    icon: BookOpen,
    description: 'Votre journal intime'
  },
  {
    title: 'VR Expérience',
    href: '/vr',
    icon: Target,
    description: 'Expériences immersives'
  },
  {
    title: 'Gamification',
    href: '/gamification',
    icon: Target,
    description: 'Défis et récompenses'
  },
  {
    title: 'Préférences',
    href: '/preferences',
    icon: Settings,
    description: 'Vos préférences'
  }
];

// Navigation items for B2B users (collaborators) - CHEMINS UNIQUES
export const b2bUserNavItems: NavItem[] = [
  {
    title: 'Tableau de bord',
    href: '/b2b/user/dashboard',
    icon: Home,
    description: 'Vue d\'ensemble personnelle'
  },
  {
    title: 'Scanner Émotions',
    href: '/scan',
    icon: Scan,
    description: 'Analysez vos émotions'
  },
  {
    title: 'Coach IA',
    href: '/coach',
    icon: Bot,
    description: 'Assistant personnel'
  },
  {
    title: 'Musique Thérapie',
    href: '/music',
    icon: Music,
    description: 'Musiques personnalisées'
  },
  {
    title: 'Journal Personnel',
    href: '/journal',
    icon: BookOpen,
    description: 'Votre journal personnel'
  },
  {
    title: 'VR Expérience',
    href: '/vr',
    icon: Target,
    description: 'Expériences immersives'
  },
  {
    title: 'Cocon Social',
    href: '/social-cocon',
    icon: Users,
    description: 'Espace collaboratif'
  },
  {
    title: 'Gamification',
    href: '/gamification',
    icon: Target,
    description: 'Défis d\'équipe'
  },
  {
    title: 'Préférences',
    href: '/preferences',
    icon: Settings,
    description: 'Vos préférences'
  }
];

// Navigation items for B2B admins - CHEMINS UNIQUES
export const b2bAdminNavItems: NavItem[] = [
  {
    title: 'Tableau de bord',
    href: '/b2b/admin/dashboard',
    icon: Home,
    description: 'Vue d\'ensemble administrateur'
  },
  {
    title: 'Gestion Équipes',
    href: '/teams',
    icon: Users,
    description: 'Gérer les équipes'
  },
  {
    title: 'Rapports',
    href: '/reports',
    icon: BarChart,
    description: 'Analyses et rapports'
  },
  {
    title: 'Événements',
    href: '/events',
    icon: Calendar,
    description: 'Gestion des événements'
  },
  {
    title: 'Optimisation',
    href: '/optimisation',
    icon: Target,
    description: 'Optimisation RH'
  },
  {
    title: 'Scanner Émotions',
    href: '/scan',
    icon: Scan,
    description: 'Analysez vos émotions'
  },
  {
    title: 'Coach IA',
    href: '/coach',
    icon: Bot,
    description: 'Assistant personnel'
  },
  {
    title: 'Musique Thérapie',
    href: '/music',
    icon: Music,
    description: 'Musiques personnalisées'
  },
  {
    title: 'Journal Personnel',
    href: '/journal',
    icon: BookOpen,
    description: 'Votre journal personnel'
  },
  {
    title: 'Cocon Social',
    href: '/social-cocon',
    icon: Users,
    description: 'Espace collaboratif'
  },
  {
    title: 'Paramètres',
    href: '/settings',
    icon: Settings,
    description: 'Paramètres administrateur'
  }
];

// Common navigation items (footer) - CHEMINS UNIQUES
export const commonNavItems: NavItem[] = [
  {
    title: 'Paramètres',
    href: '/settings',
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

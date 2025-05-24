
import { Home, Scan, Bot, Music, BookOpen, Users, Settings, HelpCircle, BarChart, UserCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
}

// Navigation items for B2C users
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
  }
];

// Navigation items for B2B users (collaborators)
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
  }
];

// Navigation items for B2B admins
export const b2bAdminNavItems: NavItem[] = [
  {
    title: 'Tableau de bord',
    href: '/b2b/admin/dashboard',
    icon: Home,
    description: 'Vue d\'ensemble administrateur'
  },
  {
    title: 'Analytics',
    href: '/b2b/admin/analytics',
    icon: BarChart,
    description: 'Analyses et statistiques'
  },
  {
    title: 'Gestion Utilisateurs',
    href: '/b2b/admin/users',
    icon: UserCheck,
    description: 'Gérer les collaborateurs'
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
  }
];

// Common navigation items (footer)
export const commonNavItems: NavItem[] = [
  {
    title: 'Profil',
    href: '/profile',
    icon: Users,
    description: 'Gérer votre profil'
  },
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

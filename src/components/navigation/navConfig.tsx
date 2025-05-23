
import React from 'react';
import {
  Home,
  Brain,
  Music,
  MessageSquare,
  FileText,
  Users,
  BarChart3,
  Settings,
  Calendar,
  Target,
  Camera,
  HeartHandshake,
  Shield
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const b2cNavItems: NavItem[] = [
  {
    title: 'Tableau de bord',
    href: '/b2c/dashboard',
    icon: Home
  },
  {
    title: 'Scanner émotions',
    href: '/scan',
    icon: Brain
  },
  {
    title: 'Coach IA',
    href: '/coach',
    icon: MessageSquare
  },
  {
    title: 'Musicothérapie',
    href: '/music',
    icon: Music
  },
  {
    title: 'Journal',
    href: '/journal',
    icon: FileText
  },
  {
    title: 'Mes objectifs',
    href: '/goals',
    icon: Target
  }
];

// Navigation limitée pour les collaborateurs B2B - uniquement données personnelles
export const b2bUserNavItems: NavItem[] = [
  {
    title: 'Mon tableau de bord',
    href: '/b2b/user/dashboard',
    icon: Home
  },
  {
    title: 'Scanner émotions',
    href: '/scan',
    icon: Brain
  },
  {
    title: 'Coach IA',
    href: '/coach',
    icon: MessageSquare
  },
  {
    title: 'Musicothérapie',
    href: '/music',
    icon: Music
  },
  {
    title: 'Mon journal',
    href: '/journal',
    icon: FileText
  },
  {
    title: 'Mes objectifs',
    href: '/goals',
    icon: Target
  }
  // Suppression de l'accès aux données d'équipe
];

// Navigation pour les RH - données agrégées et anonymisées uniquement
export const b2bAdminNavItems: NavItem[] = [
  {
    title: 'Tableau de bord RH',
    href: '/b2b/admin/dashboard',
    icon: Home
  },
  {
    title: 'Statistiques agrégées',
    href: '/b2b/admin/analytics',
    icon: BarChart3
  },
  {
    title: 'Bien-être collectif',
    href: '/b2b/admin/team-wellness',
    icon: HeartHandshake
  },
  {
    title: 'Rapports anonymisés',
    href: '/reports',
    icon: FileText
  },
  {
    title: 'Gestion des accès',
    href: '/b2b/admin/access-management',
    icon: Shield
  },
  {
    title: 'Paramètres RH',
    href: '/admin/settings',
    icon: Settings
  }
];


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
  HeartHandshake
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

export const b2bUserNavItems: NavItem[] = [
  {
    title: 'Tableau de bord',
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
    title: 'Mon équipe',
    href: '/team',
    icon: Users
  },
  {
    title: 'Sessions',
    href: '/sessions',
    icon: Calendar
  }
];

export const b2bAdminNavItems: NavItem[] = [
  {
    title: 'Tableau de bord',
    href: '/b2b/admin/dashboard',
    icon: Home
  },
  {
    title: 'Analytiques',
    href: '/b2b/admin/analytics',
    icon: BarChart3
  },
  {
    title: 'Utilisateurs',
    href: '/b2b/admin/users',
    icon: Users
  },
  {
    title: 'Rapports',
    href: '/reports',
    icon: FileText
  },
  {
    title: 'Paramètres',
    href: '/admin/settings',
    icon: Settings
  }
];

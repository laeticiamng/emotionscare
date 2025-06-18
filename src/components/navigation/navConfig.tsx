
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
  Shield,
  Gamepad2,
  Sliders
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
    title: 'VR',
    href: '/vr',
    icon: Target
  },
  {
    title: 'Gamification',
    href: '/gamification',
    icon: Gamepad2
  },
  {
    title: 'Préférences',
    href: '/preferences',
    icon: Sliders
  }
];

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
    title: 'VR',
    href: '/vr',
    icon: Target
  },
  {
    title: 'Cocon Social',
    href: '/social-cocon',
    icon: Users
  },
  {
    title: 'Gamification',
    href: '/gamification',
    icon: Gamepad2
  },
  {
    title: 'Préférences',
    href: '/preferences',
    icon: Sliders
  }
];

export const b2bAdminNavItems: NavItem[] = [
  {
    title: 'Tableau de bord RH',
    href: '/b2b/admin/dashboard',
    icon: Home
  },
  {
    title: 'Gestion Équipes',
    href: '/teams',
    icon: Users
  },
  {
    title: 'Rapports',
    href: '/reports',
    icon: BarChart3
  },
  {
    title: 'Événements',
    href: '/events',
    icon: Calendar
  },
  {
    title: 'Optimisation',
    href: '/optimisation',
    icon: Target
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
    title: 'Cocon Social',
    href: '/social-cocon',
    icon: Users
  },
  {
    title: 'Paramètres',
    href: '/settings',
    icon: Settings
  }
];

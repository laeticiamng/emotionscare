
import React from 'react';
import {
  Home,
  Heart,
  Gauge,
  BarChart3,
  Users,
  Settings,
  FileText,
  Music,
  Headphones,
  VolumeX,
  ThumbsUp,
  Layout,
  ArrowRightLeft,
  BookOpen,
  Clock,
  Shuffle,
  Shield,
  UserCog,
  Webhook,
  Database,
  Bell,
  LineChart,
  ClipboardList,
  CalendarDays,
  Activity,
  VideoIcon
} from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  description?: string;
  isDisabled?: boolean;
  isExternal?: boolean;
  isPro?: boolean;
  badge?: string | number;
};

// Sidebar navigation items for regular users
export const sidebarItems: NavItem[] = [
  {
    title: 'Tableau de bord',
    href: '/dashboard',
    icon: Gauge,
    description: 'Aperçu de votre bien-être émotionnel',
  },
  {
    title: 'Scan émotionnel',
    href: '/scan',
    icon: Heart,
    description: 'Analyser votre état émotionnel',
  },
  {
    title: 'Journal',
    href: '/journal',
    icon: FileText,
    description: 'Votre journal émotionnel',
  },
  {
    title: 'Musique',
    href: '/music',
    icon: Headphones,
    description: 'Thérapie musicale basée sur vos émotions',
  },
  {
    title: 'Réalité virtuelle',
    href: '/vr',
    icon: VideoIcon,
    description: 'Immersion VR pour rééquilibrage émotionnel',
  },
  {
    title: 'Coach IA',
    href: '/coach',
    icon: ThumbsUp,
    description: 'Votre coach d\'équilibre émotionnel',
  },
];

// Sidebar navigation items for admin users
export const adminSidebarItems: NavItem[] = [
  {
    title: 'Administration',
    href: '/dashboard',
    icon: Gauge,
    description: 'Tableau de bord d\'administration',
  },
  {
    title: 'Utilisateurs',
    href: '/admin/users',
    icon: Users,
    description: 'Gestion des utilisateurs',
  },
  {
    title: 'Analyse',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'Analyser les données',
  },
  {
    title: 'Paramètres',
    href: '/admin/settings',
    icon: Settings,
    description: 'Configuration du système',
  }
];

// Footer navigation items (shown at the bottom of the sidebar)
export const footerNavItems: NavItem[] = [
  {
    title: 'Paramètres',
    href: '/settings',
    icon: Settings,
    description: 'Personnaliser votre environnement',
  },
];

// Navigation items for the mobile drawer
export const drawerItems: NavItem[] = [
  ...sidebarItems,
  ...footerNavItems
];

// Desktop navigation items (shown in the header)
export const desktopItems: NavItem[] = [
  {
    title: 'Accueil',
    href: '/',
    icon: Home,
  },
  {
    title: 'Tableau de bord',
    href: '/dashboard',
    icon: Gauge,
  },
  {
    title: 'Scan',
    href: '/scan',
    icon: Heart,
  },
  {
    title: 'Journal',
    href: '/journal',
    icon: FileText,
  },
];

// Dashboard shortcuts for quick navigation
export const dashboardShortcuts: NavItem[] = [
  {
    title: 'Nouveau scan',
    href: '/scan',
    icon: Heart,
    description: 'Faire un scan émotionnel',
  },
  {
    title: 'Journal',
    href: '/journal',
    icon: FileText,
    description: 'Noter mon ressenti',
  },
  {
    title: 'Musique',
    href: '/music',
    icon: Music,
    description: 'Thérapie musicale',
  },
  {
    title: 'VR',
    href: '/vr',
    icon: VideoIcon,
    description: 'Session immersive',
  },
];

// Admin dashboard tabs
export const adminDashboardTabs = [
  {
    id: 'overview',
    label: 'Vue d\'ensemble',
    icon: Layout,
  },
  {
    id: 'users',
    label: 'Utilisateurs',
    icon: Users,
  },
  {
    id: 'analytics',
    label: 'Analyses',
    icon: BarChart3,
  },
  {
    id: 'scan',
    label: 'Scan d\'équipes',
    icon: Heart,
  },
  {
    id: 'vr',
    label: 'Sessions VR',
    icon: VideoIcon,
  },
  {
    id: 'journal',
    label: 'Tendances journal',
    icon: LineChart,
  },
  {
    id: 'social',
    label: 'Cocon social',
    icon: Users,
  },
  {
    id: 'gamification',
    label: 'Gamification',
    icon: ThumbsUp,
  },
  {
    id: 'invitations',
    label: 'Invitations',
    icon: Bell,
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: Settings,
  },
];

// Export the navigation items for use throughout the app
export default {
  sidebar: sidebarItems,
  adminSidebar: adminSidebarItems,
  footer: footerNavItems,
  drawer: drawerItems,
  desktop: desktopItems,
  dashboardShortcuts,
  adminDashboardTabs,
};

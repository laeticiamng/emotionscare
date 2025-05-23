
import { 
  Home, BookOpen, Music, Scan, MessageSquare, Glasses, Trophy, HeartHandshake, 
  Settings, LayoutDashboard, Users, FileBarChart, Calendar, Building, Box, 
  LineChart, Brain 
} from 'lucide-react';
import { ReactNode } from 'react';

interface NavItem {
  title: string;
  href: string;
  icon: any;
  requiresAuth?: boolean;
  adminOnly?: boolean;
}

// Navigation pour les utilisateurs B2C
export const b2cNavItems: NavItem[] = [
  {
    title: 'Tableau de bord',
    href: '/b2c/dashboard',
    icon: Home,
    requiresAuth: true,
  },
  {
    title: 'Journal émotionnel',
    href: '/b2c/journal',
    icon: BookOpen,
    requiresAuth: true,
  },
  {
    title: 'Thérapie musicale',
    href: '/b2c/music',
    icon: Music,
    requiresAuth: true,
  },
  {
    title: 'Scan émotionnel',
    href: '/b2c/scan',
    icon: Scan,
    requiresAuth: true,
  },
  {
    title: 'Coach IA',
    href: '/b2c/coach',
    icon: MessageSquare,
    requiresAuth: true,
  },
  {
    title: 'Expériences VR',
    href: '/b2c/vr',
    icon: Glasses,
    requiresAuth: true,
  },
  {
    title: 'Défis bien-être',
    href: '/b2c/gamification',
    icon: Trophy,
    requiresAuth: true,
  },
  {
    title: 'Cocon social',
    href: '/b2c/social',
    icon: HeartHandshake,
    requiresAuth: true,
  },
  {
    title: 'Préférences',
    href: '/b2c/settings',
    icon: Settings,
    requiresAuth: true,
  },
];

// Navigation pour les utilisateurs B2B (collaborateurs)
export const b2bUserNavItems: NavItem[] = [
  {
    title: 'Tableau de bord',
    href: '/b2b/user/dashboard',
    icon: Home,
    requiresAuth: true,
  },
  {
    title: 'Journal émotionnel',
    href: '/b2b/user/journal',
    icon: BookOpen,
    requiresAuth: true,
  },
  {
    title: 'Thérapie musicale',
    href: '/b2b/user/music',
    icon: Music,
    requiresAuth: true,
  },
  {
    title: 'Scan émotionnel',
    href: '/b2b/user/scan',
    icon: Scan,
    requiresAuth: true,
  },
  {
    title: 'Coach IA',
    href: '/b2b/user/coach',
    icon: MessageSquare,
    requiresAuth: true,
  },
  {
    title: 'Expériences VR',
    href: '/b2b/user/vr',
    icon: Glasses,
    requiresAuth: true,
  },
  {
    title: 'Défis d\'équipe',
    href: '/b2b/user/team-challenges',
    icon: Trophy,
    requiresAuth: true,
  },
  {
    title: 'Cocon social',
    href: '/b2b/user/social',
    icon: HeartHandshake,
    requiresAuth: true,
  },
  {
    title: 'Paramètres',
    href: '/b2b/user/settings',
    icon: Settings,
    requiresAuth: true,
  },
];

// Navigation pour les administrateurs B2B
export const b2bAdminNavItems: NavItem[] = [
  {
    title: 'Tableau de bord',
    href: '/b2b/admin/dashboard',
    icon: LayoutDashboard,
    requiresAuth: true,
    adminOnly: true,
  },
  {
    title: 'Utilisateurs',
    href: '/b2b/admin/users',
    icon: Users,
    requiresAuth: true,
    adminOnly: true,
  },
  {
    title: 'Équipes',
    href: '/b2b/admin/teams',
    icon: Building,
    requiresAuth: true,
    adminOnly: true,
  },
  {
    title: 'Rapports',
    href: '/b2b/admin/reports',
    icon: FileBarChart,
    requiresAuth: true,
    adminOnly: true,
  },
  {
    title: 'Événements',
    href: '/b2b/admin/events',
    icon: Calendar,
    requiresAuth: true,
    adminOnly: true,
  },
  {
    title: 'Statistiques',
    href: '/b2b/admin/analytics',
    icon: LineChart,
    requiresAuth: true,
    adminOnly: true,
  },
  {
    title: 'Ressources',
    href: '/b2b/admin/resources',
    icon: Brain,
    requiresAuth: true,
    adminOnly: true,
  },
  {
    title: 'Extensions',
    href: '/b2b/admin/extensions',
    icon: Box,
    requiresAuth: true,
    adminOnly: true,
  },
  {
    title: 'Paramètres',
    href: '/b2b/admin/settings',
    icon: Settings,
    requiresAuth: true,
    adminOnly: true,
  },
];

// Navigation pour toutes les extensions
export const extensionsNavItems: NavItem[] = [
  {
    title: 'Marketplace',
    href: '/extensions',
    icon: Box,
  },
  {
    title: 'Installées',
    href: '/extensions/installed',
    icon: Box,
  },
];

export default {
  b2cNavItems,
  b2bUserNavItems,
  b2bAdminNavItems,
  extensionsNavItems,
};

import React from 'react';
import {
  Home,
  FileText,
  Calendar,
  HeartPulse,
  Users,
  Settings,
  VrHeadset,
  Music,
  LineChart,
  MessageCircle,
  Award,
  Database,
  Bell,
  Shield,
  Clock
} from 'lucide-react';
import { NavItemConfig } from '@/components/ui/sidebar/SidebarNavGroup';

// Top navigation items (for desktop header)
export const topNavItems = [
  {
    path: '/dashboard',
    label: 'Tableau de bord',
    icon: <Home className="h-5 w-5" />
  },
  {
    path: '/scan',
    label: 'Scan émotionnel',
    icon: <HeartPulse className="h-5 w-5" />
  },
  {
    path: '/music',
    label: 'Musicothérapie',
    icon: <Music className="h-5 w-5" />
  },
  {
    path: '/vr',
    label: 'VR Immersive',
    icon: <VrHeadset className="h-5 w-5" />
  }
];

// Admin top navigation items
export const adminTopNavItems = [
  {
    path: '/admin',
    label: 'Administration',
    icon: <Home className="h-5 w-5" />
  },
  {
    path: '/admin/users',
    label: 'Utilisateurs',
    icon: <Users className="h-5 w-5" />
  },
  {
    path: '/admin/activity',
    label: 'Activité',
    icon: <LineChart className="h-5 w-5" />
  },
  {
    path: '/admin/settings',
    label: 'Paramètres',
    icon: <Settings className="h-5 w-5" />
  }
];

// Sidebar navigation items (for desktop sidebar)
export const sidebarItems: NavItemConfig[] = [
  {
    path: '/dashboard',
    label: 'Tableau de bord',
    icon: <Home className="h-5 w-5" />
  },
  {
    path: '/scan',
    label: 'Scan émotionnel',
    icon: <HeartPulse className="h-5 w-5" />
  },
  {
    path: '/music',
    label: 'Musicothérapie',
    icon: <Music className="h-5 w-5" />
  },
  {
    path: '/vr',
    label: 'VR Immersive',
    icon: <VrHeadset className="h-5 w-5" />
  },
  {
    path: '/journal',
    label: 'Journal intime',
    icon: <FileText className="h-5 w-5" />
  },
  {
    path: '/community',
    label: 'Communauté',
    icon: <Users className="h-5 w-5" />
  },
  {
    path: '/chat',
    label: 'Coach IA',
    icon: <MessageCircle className="h-5 w-5" />
  },
  {
    path: '/events',
    label: 'Événements',
    icon: <Calendar className="h-5 w-5" />
  }
];

// Admin sidebar navigation items
export const adminSidebarItems: NavItemConfig[] = [
  {
    path: '/admin',
    label: 'Vue d\'ensemble',
    icon: <Home className="h-5 w-5" />
  },
  {
    path: '/admin/users',
    label: 'Gestion des utilisateurs',
    icon: <Users className="h-5 w-5" />
  },
  {
    path: '/admin/activity',
    label: 'Suivi de l\'activité',
    icon: <LineChart className="h-5 w-5" />
  },
  {
    path: '/admin/notifications',
    label: 'Notifications',
    icon: <Bell className="h-5 w-5" />
  },
  {
    path: '/admin/security',
    label: 'Sécurité',
    icon: <Shield className="h-5 w-5" />
  },
  {
    path: '/admin/audit-log',
    label: 'Journal d\'audit',
    icon: <Clock className="h-5 w-5" />
  },
  {
    path: '/admin/database',
    label: 'Base de données',
    icon: <Database className="h-5 w-5" />
  },
  {
    path: '/admin/rewards',
    label: 'Récompenses',
    icon: <Award className="h-5 w-5" />
  },
  {
    path: '/admin/settings',
    label: 'Paramètres',
    icon: <Settings className="h-5 w-5" />
  }
];

// Footer navigation items (for desktop sidebar footer)
export const footerNavItems: NavItemConfig[] = [
  {
    path: '/settings',
    label: 'Paramètres',
    icon: <Settings className="h-5 w-5" />
  },
  {
    path: '/help',
    label: 'Aide',
    icon: <MessageCircle className="h-5 w-5" />
  }
];

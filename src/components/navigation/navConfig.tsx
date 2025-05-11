
import { Home, Heart, FileText, Music, Headphones, Video, Settings, User, Building, Users, BarChart2 } from 'lucide-react';

// Mapping d'icônes pour utilisation dans les composants de sidebar
export const sidebarItems = [
  {
    title: 'Accueil',
    href: '/',
    icon: Home,
  },
  {
    title: 'Tableau de bord',
    href: '/dashboard',
    icon: BarChart2,
  },
  {
    title: 'Scan émotionnel',
    href: '/scan',
    icon: Heart,
  },
  {
    title: 'Journal',
    href: '/journal',
    icon: FileText,
  },
  {
    title: 'Musicothérapie',
    href: '/music',
    icon: Music,
  },
  {
    title: 'Audio',
    href: '/audio',
    icon: Headphones,
  },
  {
    title: 'Vidéothérapie',
    href: '/video',
    icon: Video,
  },
];

// Items spécifiques pour admin
export const adminSidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: BarChart2,
  },
  {
    title: 'Utilisateurs',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Organisation',
    href: '/admin/organization',
    icon: Building,
  },
];

// Items du bas de la sidebar
export const footerNavItems = [
  {
    title: 'Profil',
    href: '/profile',
    icon: User,
  },
  {
    title: 'Paramètres',
    href: '/settings',
    icon: Settings,
  },
];

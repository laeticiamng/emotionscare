
import { Home, Heart, FileText, Music, Headphones, Video, Settings, User, Building, Users, BarChart2, Box, BookOpen, Brain, Calendar, MessageSquare } from 'lucide-react';

// B2C Nav Items
export const b2cNavItems = [
  {
    title: 'Tableau de bord',
    href: '/b2c/dashboard',
    icon: <BarChart2 className="h-5 w-5" />,
  },
  {
    title: 'Analyse émotionnelle',
    href: '/b2c/scan',
    icon: <Heart className="h-5 w-5" />,
  },
  {
    title: 'Journal',
    href: '/b2c/journal',
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: 'Musicothérapie',
    href: '/b2c/music',
    icon: <Music className="h-5 w-5" />,
  },
  {
    title: 'Coach IA',
    href: '/b2c/coach',
    icon: <Brain className="h-5 w-5" />,
  },
  {
    title: 'Social',
    href: '/b2c/social',
    icon: <Users className="h-5 w-5" />,
  },
];

// B2B User Nav Items
export const b2bUserNavItems = [
  {
    title: 'Tableau de bord',
    href: '/b2b/user/dashboard',
    icon: <BarChart2 className="h-5 w-5" />,
  },
  {
    title: 'Analyse émotionnelle',
    href: '/b2b/user/scan',
    icon: <Heart className="h-5 w-5" />,
  },
  {
    title: 'Agenda',
    href: '/b2b/user/calendar',
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: 'Social',
    href: '/b2b/user/social',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Chat équipe',
    href: '/b2b/user/chat',
    icon: <MessageSquare className="h-5 w-5" />,
  },
];

// B2B Admin Nav Items
export const b2bAdminNavItems = [
  {
    title: 'Tableau de bord',
    href: '/b2b/admin/dashboard',
    icon: <BarChart2 className="h-5 w-5" />,
  },
  {
    title: 'Utilisateurs',
    href: '/b2b/admin/users',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Équipes',
    href: '/b2b/admin/teams',
    icon: <Building className="h-5 w-5" />,
  },
  {
    title: 'Social',
    href: '/b2b/admin/social-cocoon',
    icon: <MessageSquare className="h-5 w-5" />,
  },
];

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
  {
    title: "Réalité Augmentée",
    href: "/ar",
    icon: Box
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

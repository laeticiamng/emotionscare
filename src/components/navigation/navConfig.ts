
import { 
  Home, 
  Activity, 
  Music, 
  MessageCircle, 
  Calendar,
  Users,
  BarChart2,
  Settings,
  UserCheck,
  Building,
  Trophy,
  Target,
  FileText,
  Headphones,
  Heart,
  Glasses
} from 'lucide-react';

export const b2cNavItems = [
  {
    title: 'Tableau de bord',
    href: '/b2c/dashboard',
    icon: Home
  },
  {
    title: 'Scanner émotionnel',
    href: '/scan',
    icon: Activity
  },
  {
    title: 'Musique thérapeutique',
    href: '/music',
    icon: Music
  },
  {
    title: 'Coach personnel',
    href: '/coach',
    icon: MessageCircle
  },
  {
    title: 'Journal',
    href: '/journal',
    icon: FileText
  },
  {
    title: 'Audio thérapie',
    href: '/audio',
    icon: Headphones
  },
  {
    title: 'Cocon VR',
    href: '/cocon',
    icon: Glasses
  },
  {
    title: 'Préférences',
    href: '/preferences',
    icon: Heart
  }
];

export const b2bUserNavItems = [
  {
    title: 'Tableau de bord',
    href: '/b2b/user/dashboard',
    icon: Home
  },
  {
    title: 'Scanner émotionnel',
    href: '/scan',
    icon: Activity
  },
  {
    title: 'Musique d\'équipe',
    href: '/music',
    icon: Music
  },
  {
    title: 'Coach professionnel',
    href: '/coach',
    icon: MessageCircle
  },
  {
    title: 'Sessions d\'équipe',
    href: '/sessions',
    icon: Calendar
  },
  {
    title: 'Bien-être collectif',
    href: '/team-wellness',
    icon: Users
  },
  {
    title: 'Gamification',
    href: '/gamification',
    icon: Trophy
  }
];

export const b2bAdminNavItems = [
  {
    title: 'Tableau de bord',
    href: '/b2b/admin/dashboard',
    icon: Home
  },
  {
    title: 'Analytics',
    href: '/b2b/admin/analytics',
    icon: BarChart2
  },
  {
    title: 'Utilisateurs',
    href: '/b2b/admin/users',
    icon: Users
  },
  {
    title: 'Gestion équipes',
    href: '/b2b/admin/teams',
    icon: Building
  },
  {
    title: 'Rapports',
    href: '/b2b/admin/reports',
    icon: FileText
  },
  {
    title: 'Configuration',
    href: '/b2b/admin/settings',
    icon: Settings
  },
  {
    title: 'Invitations',
    href: '/b2b/admin/invitations',
    icon: UserCheck
  },
  {
    title: 'Objectifs',
    href: '/b2b/admin/goals',
    icon: Target
  }
];

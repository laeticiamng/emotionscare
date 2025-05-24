
import { 
  Home, 
  Scan, 
  Brain, 
  Music, 
  BookOpen, 
  BarChart3, 
  Users, 
  Settings, 
  HelpCircle,
  Shield,
  UserCheck
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  description?: string;
}

export const b2cNavItems: NavItem[] = [
  {
    title: 'Tableau de bord',
    href: '/b2c/dashboard',
    icon: Home,
    description: 'Vue d\'ensemble de votre bien-être'
  },
  {
    title: 'Scanner',
    href: '/scan',
    icon: Scan,
    description: 'Analysez vos émotions'
  },
  {
    title: 'Coach IA',
    href: '/coach',
    icon: Brain,
    description: 'Accompagnement personnalisé'
  },
  {
    title: 'Musique',
    href: '/music',
    icon: Music,
    description: 'Thérapie musicale'
  },
  {
    title: 'Journal',
    href: '/journal',
    icon: BookOpen,
    description: 'Votre journal personnel'
  }
];

export const b2bUserNavItems: NavItem[] = [
  {
    title: 'Tableau de bord',
    href: '/b2b/user/dashboard',
    icon: Home,
    description: 'Vue d\'ensemble de votre bien-être'
  },
  {
    title: 'Scanner',
    href: '/scan',
    icon: Scan,
    description: 'Analysez vos émotions'
  },
  {
    title: 'Coach IA',
    href: '/coach',
    icon: Brain,
    description: 'Accompagnement personnalisé'
  },
  {
    title: 'Musique',
    href: '/music',
    icon: Music,
    description: 'Thérapie musicale'
  },
  {
    title: 'Journal',
    href: '/journal',
    icon: BookOpen,
    description: 'Votre journal personnel'
  }
];

export const b2bAdminNavItems: NavItem[] = [
  {
    title: 'Tableau de bord',
    href: '/b2b/admin/dashboard',
    icon: Home,
    description: 'Vue d\'ensemble RH'
  },
  {
    title: 'Analytics',
    href: '/b2b/admin/analytics',
    icon: BarChart3,
    description: 'Analyses détaillées'
  },
  {
    title: 'Équipes',
    href: '/b2b/admin/users',
    icon: Users,
    description: 'Gestion des utilisateurs'
  },
  {
    title: 'Rapports',
    href: '/b2b/admin/reports',
    icon: Shield,
    description: 'Rapports RGPD'
  }
];

export const commonNavItems: NavItem[] = [
  {
    title: 'Profil',
    href: '/profile',
    icon: UserCheck,
    description: 'Votre profil'
  },
  {
    title: 'Paramètres',
    href: '/settings',
    icon: Settings,
    description: 'Configuration'
  },
  {
    title: 'Aide',
    href: '/help',
    icon: HelpCircle,
    description: 'Support et aide'
  }
];

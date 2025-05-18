import { 
  Home, 
  BarChart2, 
  Scan, 
  BookOpen, 
  Music, 
  Headphones, 
  Video, 
  Settings, 
  User, 
  Activity, 
  Layers, 
  Store, 
  Box, 
  Users, 
  Building,
  MessageSquare,
  HeartHandshake,
  Trophy,
  Glasses
} from "lucide-react";

export interface NavItemType {
  title: string;
  href: string;
  icon: any;
  b2cOnly?: boolean;
  b2bOnly?: boolean;
}

// B2C User Navigation
export const b2cNavItems: NavItemType[] = [
  {
    title: "Accueil",
    href: "/b2c/dashboard",
    icon: Home,
  },
  {
    title: "Scan",
    href: "/b2c/scan",
    icon: Scan,
  },
  {
    title: "Journal",
    href: "/b2c/journal",
    icon: BookOpen,
  },
  {
    title: "Musique",
    href: "/b2c/music",
    icon: Music,
  },
  {
    title: "Audio",
    href: "/b2c/audio",
    icon: Headphones,
  },
  {
    title: "Coach",
    href: "/b2c/coach",
    icon: MessageSquare,
  },
  {
    title: "Réalité virtuelle",
    href: "/b2c/vr",
    icon: Glasses,
  },
  {
    title: "Cocon",
    href: "/b2c/cocon",
    icon: HeartHandshake,
  },
  {
    title: "Défis",
    href: "/b2c/gamification",
    icon: Trophy,
  },
  {
    title: "Paramètres",
    href: "/b2c/preferences",
    icon: Settings,
  }
];

// B2B User Navigation
export const b2bUserNavItems: NavItemType[] = [
  {
    title: "Accueil",
    href: "/b2b/user/dashboard",
    icon: Home,
  },
  {
    title: "Scan",
    href: "/b2b/user/scan",
    icon: Scan,
  },
  {
    title: "Journal",
    href: "/b2b/user/journal",
    icon: BookOpen,
  },
  {
    title: "Musique",
    href: "/b2b/user/music",
    icon: Music,
  },
  {
    title: "Audio",
    href: "/b2b/user/audio",
    icon: Headphones,
  },
  {
    title: "Coach",
    href: "/b2b/user/coach",
    icon: MessageSquare,
  },
  {
    title: "Réalité virtuelle",
    href: "/b2b/user/vr",
    icon: Glasses,
  },
  {
    title: "Cocon",
    href: "/b2b/user/cocon",
    icon: HeartHandshake,
  },
  {
    title: "Défis",
    href: "/b2b/user/gamification",
    icon: Trophy,
  },
  {
    title: "Paramètres",
    href: "/b2b/user/preferences",
    icon: Settings,
  }
];

// B2B Admin Navigation
export const b2bAdminNavItems: NavItemType[] = [
  {
    title: "Tableau de bord",
    href: "/b2b/admin/dashboard",
    icon: Home,
  },
  {
    title: "Journal",
    href: "/b2b/admin/journal",
    icon: BookOpen,
  },
  {
    title: "Scan",
    href: "/b2b/admin/scan",
    icon: Scan,
  },
  {
    title: "Musique",
    href: "/b2b/admin/music",
    icon: Music,
  },
  {
    title: "Équipes",
    href: "/b2b/admin/teams",
    icon: Users,
  },
  {
    title: "Rapports",
    href: "/b2b/admin/reports",
    icon: BarChart2,
  },
  {
    title: "Événements",
    href: "/b2b/admin/events",
    icon: Activity,
  },
  {
    title: "Optimisation",
    href: "/b2b/admin/optimisation",
    icon: BarChart2,
  },
  {
    title: "Paramètres",
    href: "/b2b/admin/settings",
    icon: Settings,
  }
];

// Keeping sidebarItems, adminSidebarItems and footerNavItems for backward compatibility
export const sidebarItems = b2cNavItems;
export const adminSidebarItems = b2bAdminNavItems;

export const footerNavItems: NavItemType[] = [
  {
    title: "Profil",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
  }
];

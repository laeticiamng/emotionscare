
import { Home, BarChart2, Scan, BookOpen, Music, Headphones, Video, Settings, User, HeadsetIcon, Activity, Layers, Store, Box, Users, Building } from "lucide-react";

export const sidebarItems = [
  {
    title: "Accueil",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Scan",
    href: "/dashboard/scan",
    icon: Scan,
  },
  {
    title: "Journal",
    href: "/dashboard/journal",
    icon: BookOpen,
  },
  {
    title: "Musique",
    href: "/dashboard/music",
    icon: Music,
  },
  {
    title: "Musicothérapie",
    href: "/dashboard/musicotherapy",
    icon: HeadsetIcon,
  },
  {
    title: "Audio",
    href: "/dashboard/audio",
    icon: Headphones,
  },
  {
    title: "Vidéo",
    href: "/dashboard/video",
    icon: Video,
  },
  {
    title: "Réalité augmentée",
    href: "/dashboard/ar",
    icon: Layers,
  },
  {
    title: "Marketplace",
    href: "/dashboard/marketplace",
    icon: Store,
    b2cOnly: true
  },
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

export const adminSidebarItems = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Rapports",
    href: "/dashboard/reports",
    icon: BarChart2,
  },
  {
    title: "Utilisateurs",
    href: "/dashboard/users",
    icon: User,
  },
  {
    title: "Groupes",
    href: "/dashboard/groups",
    icon: Users,
    b2bOnly: true
  },
  {
    title: "Entreprises",
    href: "/dashboard/companies",
    icon: Building,
    b2bOnly: true
  },
  {
    title: "Activité",
    href: "/dashboard/activity",
    icon: Activity,
  },
  {
    title: "Produits",
    href: "/dashboard/products",
    icon: Box,
  },
  {
    title: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
  }
];

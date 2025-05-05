import { 
  LayoutDashboard, 
  Heart, 
  BookText, 
  Users, 
  MessageSquare, 
  Music,
  Trophy, 
  Settings,
  UserIcon, 
  HeadphonesIcon,
  Video,
  Brain,
  BarChart2,
  FileText,
  LineChart,
  ShieldCheck,
  CalendarDays,
  Gauge,
  Sparkles
} from "lucide-react";

console.log("Loading navConfig");

// Cette liste est utilisée pour la navigation globale et mobile pour les utilisateurs normaux
export const navItems = [
  {
    path: "/dashboard",
    label: "Tableau de bord",
    icon: <LayoutDashboard className="h-5 w-5 mr-2" />,
  },
  {
    path: "/scan",
    label: "Scan émotionnel",
    icon: <Heart className="h-5 w-5 mr-2" />,
  },
  {
    path: "/journal",
    label: "Journal",
    icon: <BookText className="h-5 w-5 mr-2" />,
  },
  {
    path: "/buddy",
    label: "Buddy",
    icon: <UserIcon className="h-5 w-5 mr-2" />,
  },
  {
    path: "/social-cocoon",
    label: "Communauté",
    icon: <Users className="h-5 w-5 mr-2" />,
  },
  {
    path: "/groups",
    label: "Groupes",
    icon: <MessageSquare className="h-5 w-5 mr-2" />,
  },
  {
    path: "/coach",
    label: "Coach IA",
    icon: <Brain className="h-5 w-5 mr-2" />,
  },
  {
    path: "/vr-sessions",
    label: "Micro-pauses VR",
    icon: <Video className="h-5 w-5 mr-2" />,
  },
  {
    path: "/music-wellbeing",
    label: "Musicothérapie",
    icon: <HeadphonesIcon className="h-5 w-5 mr-2" />,
  },
  {
    path: "/gamification",
    label: "Récompenses",
    icon: <Trophy className="h-5 w-5 mr-2" />,
  },
];

// Nouvelle configuration pour les éléments de navigation d'administration
export const adminNavItems = [
  {
    title: "Tableau de bord global",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    showRoles: ["admin", "Admin"],
  },
  {
    title: "Scan émotionnel - Équipe",
    href: "/admin/scan-team",
    icon: <Heart className="h-5 w-5" />,
    showRoles: ["admin", "Admin"],
  },
  {
    title: "Journal - Tendances",
    href: "/admin/journal-trends",
    icon: <LineChart className="h-5 w-5" />,
    showRoles: ["admin", "Admin"],
  },
  {
    title: "Social Cocoon - Pilotage",
    href: "/admin/social-cocoon",
    icon: <Users className="h-5 w-5" />,
    showRoles: ["admin", "Admin"],
  },
  {
    title: "Gamification - Synthèse",
    href: "/admin/gamification",
    icon: <Trophy className="h-5 w-5" />,
    showRoles: ["admin", "Admin"],
  },
  {
    title: "Actions & Solutions RH",
    href: "/admin/hr-actions",
    icon: <Sparkles className="h-5 w-5" />,
    showRoles: ["admin", "Admin"],
  },
  {
    title: "Events & Calendrier",
    href: "/admin/events",
    icon: <CalendarDays className="h-5 w-5" />,
    showRoles: ["admin", "Admin"],
  },
  {
    title: "Conformité & Sécurité",
    href: "/admin/compliance",
    icon: <ShieldCheck className="h-5 w-5" />,
    showRoles: ["admin", "Admin"],
  },
  {
    title: "Paramètres Admin",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
    showRoles: ["admin", "Admin"],
  },
];

// Maintenir cette version pour la rétrocompatibilité avec d'autres composants
export const mainNavItems = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    showRoles: ["user", "admin", "Admin", "Utilisateur"],
  },
  {
    title: "Scan émotionnel",
    href: "/scan",
    icon: <Heart className="h-5 w-5" />,
    showRoles: ["user", "admin", "Admin", "Utilisateur"],
  },
  {
    title: "Journal",
    href: "/journal",
    icon: <BookText className="h-5 w-5" />,
    showRoles: ["user", "admin", "Admin", "Utilisateur"],
  },
  {
    title: "Buddy",
    href: "/buddy",
    icon: <UserIcon className="h-5 w-5" />,
    showRoles: ["user", "admin", "Admin", "Utilisateur"],
  },
  {
    title: "Communauté",
    href: "/social-cocoon",
    icon: <Users className="h-5 w-5" />,
    showRoles: ["user", "admin", "Admin", "Utilisateur"],
  },
  {
    title: "Groupes",
    href: "/groups",
    icon: <MessageSquare className="h-5 w-5" />,
    showRoles: ["user", "admin", "Admin", "Utilisateur"],
  },
  {
    title: "Coach IA",
    href: "/coach",
    icon: <Brain className="h-5 w-5" />,
    showRoles: ["user", "admin", "Admin", "Utilisateur"],
  },
  {
    title: "Micro-pauses VR",
    href: "/vr-sessions",
    icon: <Video className="h-5 w-5" />,
    showRoles: ["user", "admin", "Admin", "Utilisateur"],
  },
  {
    title: "Musicothérapie",
    href: "/music-wellbeing",
    icon: <HeadphonesIcon className="h-5 w-5" />,
    showRoles: ["user", "admin", "Admin", "Utilisateur"],
  },
  {
    title: "Récompenses",
    href: "/gamification",
    icon: <Trophy className="h-5 w-5" />,
    showRoles: ["user", "admin", "Admin", "Utilisateur"],
  },
];

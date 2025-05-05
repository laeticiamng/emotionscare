
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
  ShieldCheck,
  CalendarDays,
  Gauge,
  Sparkles
} from "lucide-react";

// Configuration unifiée de navigation pour tout type d'utilisateur
export const navItems = [
  {
    path: "/dashboard",
    label: "Tableau de bord",
    icon: <LayoutDashboard className="h-5 w-5 mr-2" />,
    roles: ["user", "admin", "Admin", "Utilisateur"],
  },
  {
    path: "/scan",
    label: "Scan émotionnel",
    icon: <Heart className="h-5 w-5 mr-2" />,
    roles: ["user", "admin", "Admin", "Utilisateur"],
  },
  {
    path: "/journal",
    label: "Journal",
    icon: <BookText className="h-5 w-5 mr-2" />,
    roles: ["user", "admin", "Admin", "Utilisateur"],
  },
  {
    path: "/buddy",
    label: "Buddy",
    icon: <UserIcon className="h-5 w-5 mr-2" />,
    roles: ["user", "admin", "Admin", "Utilisateur"],
  },
  {
    path: "/social-cocoon",
    label: "Communauté",
    icon: <Users className="h-5 w-5 mr-2" />,
    roles: ["user", "admin", "Admin", "Utilisateur"],
  },
  {
    path: "/groups",
    label: "Groupes",
    icon: <MessageSquare className="h-5 w-5 mr-2" />,
    roles: ["user", "admin", "Admin", "Utilisateur"],
  },
  {
    path: "/coach",
    label: "Coach IA",
    icon: <Brain className="h-5 w-5 mr-2" />,
    roles: ["user", "admin", "Admin", "Utilisateur"],
  },
  {
    path: "/vr-sessions",
    label: "Micro-pauses VR",
    icon: <Video className="h-5 w-5 mr-2" />,
    roles: ["user", "admin", "Admin", "Utilisateur"],
  },
  {
    path: "/music-wellbeing",
    label: "Musicothérapie",
    icon: <HeadphonesIcon className="h-5 w-5 mr-2" />,
    roles: ["user", "admin", "Admin", "Utilisateur"],
  },
  {
    path: "/gamification",
    label: "Récompenses",
    icon: <Trophy className="h-5 w-5 mr-2" />,
    roles: ["user", "admin", "Admin", "Utilisateur"],
  },
];

// Configuration spécifique pour les administrateurs
export const adminNavItems = [
  {
    path: "/dashboard",
    label: "Tableau de bord global",
    icon: <LayoutDashboard className="h-5 w-5 mr-2" />,
    roles: ["admin", "Admin"],
  },
  {
    path: "/scan",
    label: "Scan émotionnel - Équipe",
    icon: <Heart className="h-5 w-5 mr-2" />,
    roles: ["admin", "Admin"],
  },
  {
    path: "/journal",
    label: "Journal - Tendances",
    icon: <BookText className="h-5 w-5 mr-2" />,
    roles: ["admin", "Admin"],
  },
  {
    path: "/social-cocoon",
    label: "Social Cocoon - Pilotage",
    icon: <Users className="h-5 w-5 mr-2" />,
    roles: ["admin", "Admin"],
  },
  {
    path: "/gamification",
    label: "Gamification - Synthèse",
    icon: <Trophy className="h-5 w-5 mr-2" />,
    roles: ["admin", "Admin"],
  },
  {
    path: "/vr-analytics",
    label: "Statistiques VR",
    icon: <BarChart2 className="h-5 w-5 mr-2" />,
    roles: ["admin", "Admin"],
  },
  {
    path: "/compliance",
    label: "Conformité & Sécurité",
    icon: <ShieldCheck className="h-5 w-5 mr-2" />,
    roles: ["admin", "Admin"],
  },
  {
    path: "/account",
    label: "Paramètres Admin",
    icon: <Settings className="h-5 w-5 mr-2" />,
    roles: ["admin", "Admin"],
  },
];

// Éléments de pied de page communs
export const footerNavItems = [
  {
    path: "/my-data",
    label: "Mes Données",
    icon: <Settings className="h-5 w-5 mr-2" />,
    roles: ["user", "admin", "Admin", "Utilisateur"],
  }
];

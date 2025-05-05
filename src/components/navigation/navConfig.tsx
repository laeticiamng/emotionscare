
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
  Video
} from "lucide-react";

// This array is used by both GlobalNav and MobileNavigation components
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
    path: "/community",
    label: "Communauté",
    icon: <Users className="h-5 w-5 mr-2" />,
  },
  {
    path: "/groups",
    label: "Groupes",
    icon: <MessageSquare className="h-5 w-5 mr-2" />,
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

export const mainNavItems = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    showRoles: ["user", "admin"],
  },
  {
    title: "Scan émotionnel",
    href: "/scan",
    icon: <Heart className="h-5 w-5" />,
    showRoles: ["user"],
  },
  {
    title: "Journal",
    href: "/journal",
    icon: <BookText className="h-5 w-5" />,
    showRoles: ["user"],
  },
  {
    title: "Buddy",
    href: "/buddy",
    icon: <UserIcon className="h-5 w-5" />,
    showRoles: ["user"],
  },
  {
    title: "Communauté",
    href: "/community",
    icon: <Users className="h-5 w-5" />,
    showRoles: ["user"],
  },
  {
    title: "Groupes",
    href: "/groups",
    icon: <MessageSquare className="h-5 w-5" />,
    showRoles: ["user"],
  },
  {
    title: "Micro-pauses VR",
    href: "/vr-sessions",
    icon: <Video className="h-5 w-5" />,
    showRoles: ["user"],
  },
  {
    title: "Musicothérapie",
    href: "/music-wellbeing",
    icon: <HeadphonesIcon className="h-5 w-5" />,
    showRoles: ["user"],
  },
  {
    title: "Récompenses",
    href: "/gamification",
    icon: <Trophy className="h-5 w-5" />,
    showRoles: ["user", "admin"],
  },
];

export const adminNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Team Management",
    href: "/team",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

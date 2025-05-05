
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


import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Home, Scan, BookOpen, Music, Headphones, MessageSquare, 
  Users, Activity, BarChart2, Calendar, Settings, Glasses,
  HeartHandshake, Trophy, Building
} from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';
import NavItemButton from './NavItemButton';

interface UnifiedNavigationProps {
  collapsed?: boolean;
  onItemClick?: () => void;
}

// Define navigation items separately to avoid circular imports
const defaultNavItems = [
  { title: "Accueil", href: "/", icon: Home },
  { title: "Scan", href: "/scan", icon: Scan },
  { title: "Journal", href: "/journal", icon: BookOpen },
  { title: "Musique", href: "/music", icon: Music },
  { title: "Audio", href: "/audio", icon: Headphones },
  { title: "Coach", href: "/coach", icon: MessageSquare },
  { title: "VR", href: "/vr", icon: Glasses },
  { title: "Cocon Social", href: "/social-cocoon", icon: HeartHandshake },
  { title: "Équipes", href: "/teams", icon: Users },
  { title: "Événements", href: "/events", icon: Calendar },
  { title: "Gamification", href: "/gamification", icon: Trophy },
  { title: "Organisation", href: "/organization", icon: Building },
  { title: "Rapports", href: "/reports", icon: BarChart2 },
  { title: "Paramètres", href: "/settings", icon: Settings },
];

// B2C navigation items
const b2cNavItems = [
  { title: "Accueil", href: "/b2c/dashboard", icon: Home },
  { title: "Scan", href: "/b2c/scan", icon: Scan },
  { title: "Coach", href: "/b2c/coach", icon: MessageSquare },
  { title: "Journal", href: "/b2c/journal", icon: BookOpen },
  { title: "Musique", href: "/b2c/music", icon: Music },
  { title: "Social", href: "/b2c/social", icon: HeartHandshake },
  { title: "Paramètres", href: "/b2c/settings", icon: Settings },
];

// B2B User navigation items
const b2bUserNavItems = [
  { title: "Accueil", href: "/b2b/user/dashboard", icon: Home },
  { title: "Scan", href: "/b2b/user/scan", icon: Scan },
  { title: "Coach", href: "/b2b/user/coach", icon: MessageSquare },
  { title: "Journal", href: "/b2b/user/journal", icon: BookOpen },
  { title: "Musique", href: "/b2b/user/music", icon: Music },
  { title: "Équipe", href: "/b2b/user/team", icon: Users },
  { title: "Social", href: "/b2b/user/social", icon: HeartHandshake },
  { title: "Paramètres", href: "/b2b/user/settings", icon: Settings },
];

// B2B Admin navigation items
const b2bAdminNavItems = [
  { title: "Dashboard", href: "/b2b/admin/dashboard", icon: Home },
  { title: "Organisation", href: "/b2b/admin/organization", icon: Building },
  { title: "Utilisateurs", href: "/b2b/admin/users", icon: Users },
  { title: "Rapports", href: "/b2b/admin/reports", icon: BarChart2 },
  { title: "Social", href: "/b2b/admin/social", icon: HeartHandshake },
  { title: "Paramètres", href: "/b2b/admin/settings", icon: Settings },
];

const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({ collapsed = false, onItemClick }) => {
  const location = useLocation();
  const { userMode } = useUserMode();
  
  // Determine which navigation items to display based on user mode
  const getNavigationItems = () => {
    switch (userMode) {
      case 'b2b_admin':
        return b2bAdminNavItems;
      case 'b2b_user':
        return b2bUserNavItems;
      case 'b2c':
        return b2cNavItems;
      default:
        return defaultNavItems;
    }
  };

  const navItems = getNavigationItems();

  return (
    <nav className="space-y-2 py-4">
      {navItems.map((item, index) => (
        <NavItemButton
          key={`${item.title}-${index}`}
          label={item.title}
          path={item.href}
          icon={item.icon}
          collapsed={collapsed}
          onClick={() => {
            if (onItemClick) onItemClick();
          }}
        />
      ))}
    </nav>
  );
};

export default UnifiedNavigation;

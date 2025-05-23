
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Home, Scan, BookOpen, Music, Headphones, MessageSquare, 
  Users, Calendar, Settings, Glasses, HeartHandshake, Trophy, 
  Building, BarChart2, Brain
} from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';
import NavItemButton from './NavItemButton';

interface UnifiedNavigationProps {
  collapsed?: boolean;
  onItemClick?: () => void;
}

const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({ collapsed = false, onItemClick }) => {
  const location = useLocation();
  const { userMode } = useUserMode();
  
  // Définir les éléments de navigation communs à tous les modes
  const commonItems = [
    { title: "Paramètres", href: `/${userMode || 'b2c'}/settings`, icon: Settings }
  ];
  
  // B2C navigation items
  const b2cItems = [
    { title: "Accueil", href: "/b2c/dashboard", icon: Home },
    { title: "Scan", href: "/b2c/scan", icon: Scan },
    { title: "Coach", href: "/b2c/coach", icon: MessageSquare },
    { title: "Journal", href: "/b2c/journal", icon: BookOpen },
    { title: "Musique", href: "/b2c/music", icon: Music },
    { title: "VR", href: "/b2c/vr", icon: Glasses },
    { title: "Social", href: "/b2c/social", icon: HeartHandshake },
    ...commonItems
  ];
  
  // B2B User navigation items
  const b2bUserItems = [
    { title: "Accueil", href: "/b2b/user/dashboard", icon: Home },
    { title: "Scan", href: "/b2b/user/scan", icon: Scan },
    { title: "Coach", href: "/b2b/user/coach", icon: MessageSquare },
    { title: "Journal", href: "/b2b/user/journal", icon: BookOpen },
    { title: "Musique", href: "/b2b/user/music", icon: Music },
    { title: "VR", href: "/b2b/user/vr", icon: Glasses },
    { title: "Équipe", href: "/b2b/user/team", icon: Users },
    { title: "Social", href: "/b2b/user/social", icon: HeartHandshake },
    ...commonItems
  ];
  
  // B2B Admin navigation items
  const b2bAdminItems = [
    { title: "Dashboard", href: "/b2b/admin/dashboard", icon: Home },
    { title: "Organisation", href: "/b2b/admin/organization", icon: Building },
    { title: "Utilisateurs", href: "/b2b/admin/users", icon: Users },
    { title: "Rapports", href: "/b2b/admin/reports", icon: BarChart2 },
    { title: "Bien-être", href: "/b2b/admin/wellbeing", icon: Brain },
    { title: "Social", href: "/b2b/admin/social", icon: HeartHandshake },
    ...commonItems
  ];
  
  // Sélectionner les éléments de navigation en fonction du mode utilisateur
  let navItems = userMode === 'b2b_admin' 
    ? b2bAdminItems 
    : userMode === 'b2b_user' 
      ? b2bUserItems 
      : b2cItems;

  return (
    <nav className="space-y-2 py-4">
      {navItems.map((item, index) => (
        <NavItemButton
          key={`${item.title}-${index}`}
          label={item.title}
          path={item.href}
          icon={item.icon}
          collapsed={collapsed}
          onClick={onItemClick}
        />
      ))}
    </nav>
  );
};

export default UnifiedNavigation;

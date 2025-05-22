
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Home, Scan, BookOpen, Music, Headphones, MessageSquare, 
  Users, Activity, BarChart2, Calendar, Settings, Glasses,
  HeartHandshake, Trophy, Building
} from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';
import NavItemButton from './NavItemButton';
import { b2cNavItems, b2bUserNavItems, b2bAdminNavItems } from './navConfig';

interface UnifiedNavigationProps {
  collapsed?: boolean;
  onItemClick?: () => void;
}

const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({ collapsed = false, onItemClick }) => {
  const location = useLocation();
  const { userMode } = useUserMode();
  
  // Déterminer quels éléments de navigation afficher en fonction du mode utilisateur
  const getNavigationItems = () => {
    switch (userMode) {
      case 'b2b_admin':
        return b2bAdminNavItems;
      case 'b2b_user':
        return b2bUserNavItems;
      case 'b2c':
        return b2cNavItems;
      default:
        // Mode par défaut avec les principales fonctionnalités
        return [
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

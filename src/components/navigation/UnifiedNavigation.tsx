
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { 
  LayoutDashboard, 
  Brain, 
  Heart, 
  Music, 
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Target,
  Calendar
} from 'lucide-react';

interface UnifiedNavigationProps {
  collapsed?: boolean;
  onItemClick?: () => void;
}

const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({ 
  collapsed = false, 
  onItemClick 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userMode } = useUserMode();

  const getNavigationItems = () => {
    const commonItems = [
      {
        title: 'Tableau de bord',
        icon: <LayoutDashboard className="h-4 w-4" />,
        path: userMode === 'b2c' ? '/b2c/dashboard' : 
              userMode === 'b2b_user' ? '/b2b/user/dashboard' : 
              '/b2b/admin/dashboard'
      },
      {
        title: 'Scanner émotions',
        icon: <Brain className="h-4 w-4" />,
        path: '/scan'
      },
      {
        title: 'Coach IA',
        icon: <Heart className="h-4 w-4" />,
        path: '/coach'
      },
      {
        title: 'Musique',
        icon: <Music className="h-4 w-4" />,
        path: '/music'
      },
      {
        title: 'Journal',
        icon: <BookOpen className="h-4 w-4" />,
        path: '/journal'
      }
    ];

    // Add specific items based on user mode
    if (userMode === 'b2b_admin') {
      commonItems.push(
        {
          title: 'Analytiques',
          icon: <BarChart3 className="h-4 w-4" />,
          path: '/b2b/admin/analytics'
        },
        {
          title: 'Utilisateurs',
          icon: <Users className="h-4 w-4" />,
          path: '/b2b/admin/users'
        }
      );
    }

    return commonItems;
  };

  const navigationItems = getNavigationItems();

  const handleNavigation = (path: string) => {
    navigate(path);
    onItemClick?.();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="space-y-2 px-2">
      {navigationItems.map((item, index) => (
        <Button
          key={index}
          variant={isActive(item.path) ? "default" : "ghost"}
          onClick={() => handleNavigation(item.path)}
          className={`w-full justify-start ${collapsed ? 'px-2' : 'px-3'}`}
        >
          {item.icon}
          {!collapsed && <span className="ml-2">{item.title}</span>}
        </Button>
      ))}
    </nav>
  );
};

export default UnifiedNavigation;

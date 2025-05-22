
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Home, BookOpen, Music, Headphones, 
  MessageCircle, Settings, User, LayoutDashboard,
  LineChart, Medal, Heart, Glasses
} from 'lucide-react';
import { cn } from '@/lib/utils';
import NavItem from './NavItem';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';

interface UnifiedNavigationProps {
  onItemClick?: () => void;
}

const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({ onItemClick }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { userMode } = useUserMode();

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/' && path.length > 1 && location.pathname.startsWith(path));
  };

  const getModePath = (basePath: string) => {
    if (userMode === 'b2c') {
      return `/b2c${basePath}`;
    } else if (userMode === 'b2b_user') {
      return `/b2b/user${basePath}`;
    } else if (userMode === 'b2b_admin') {
      return `/b2b/admin${basePath}`;
    }
    return basePath;
  };

  const commonLinks = [
    { 
      path: '/', 
      label: 'Accueil', 
      icon: <Home className="h-5 w-5" />
    },
    { 
      path: '/dashboard', 
      label: 'Tableau de bord', 
      icon: <LayoutDashboard className="h-5 w-5" />,
      requiresAuth: true
    }
  ];

  const featureLinks = [
    { 
      path: '/journal', 
      label: 'Journal', 
      icon: <BookOpen className="h-5 w-5" />, 
      requiresAuth: true 
    },
    { 
      path: '/music', 
      label: 'Musique', 
      icon: <Music className="h-5 w-5" />, 
      requiresAuth: true 
    },
    { 
      path: '/audio', 
      label: 'Audio', 
      icon: <Headphones className="h-5 w-5" />, 
      requiresAuth: true 
    },
    { 
      path: '/coach', 
      label: 'Coach', 
      icon: <MessageCircle className="h-5 w-5" />, 
      requiresAuth: true 
    },
    { 
      path: '/progress', 
      label: 'Progression', 
      icon: <LineChart className="h-5 w-5" />, 
      requiresAuth: true 
    },
    { 
      path: '/gamification', 
      label: 'Défis', 
      icon: <Medal className="h-5 w-5" />,
      requiresAuth: true
    },
    { 
      path: '/vr', 
      label: 'Réalité virtuelle', 
      icon: <Glasses className="h-5 w-5" />,
      requiresAuth: true
    },
    { 
      path: '/social', 
      label: 'Social Cocoon', 
      icon: <Heart className="h-5 w-5" />,
      requiresAuth: true
    }
  ];

  const userLinks = [
    { 
      path: '/profile', 
      label: 'Profil', 
      icon: <User className="h-5 w-5" />,
      requiresAuth: true
    },
    { 
      path: '/settings', 
      label: 'Paramètres', 
      icon: <Settings className="h-5 w-5" />,
      requiresAuth: true
    }
  ];

  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  const renderNavItems = (links: any[]) => {
    return links
      .filter(link => !link.requiresAuth || isAuthenticated)
      .map((link) => (
        <NavItem
          key={link.path}
          to={link.path}
          icon={link.icon}
          label={link.label}
          active={isActive(link.path)}
          onClick={handleItemClick}
          testId={`nav-${link.path.replace(/\//g, '-')}`}
          className={cn(
            "mb-1",
            isActive(link.path) ? "bg-accent/30" : ""
          )}
        />
      ));
  };

  return (
    <nav className="flex flex-col p-2 gap-6 w-full">
      <div className="space-y-1">
        {renderNavItems(commonLinks)}
      </div>
      
      <div className="space-y-1">
        <h3 className="px-3 text-xs font-medium text-muted-foreground mb-2">
          Fonctionnalités
        </h3>
        {renderNavItems(featureLinks)}
      </div>
      
      <div className="space-y-1">
        <h3 className="px-3 text-xs font-medium text-muted-foreground mb-2">
          Utilisateur
        </h3>
        {renderNavItems(userLinks)}
      </div>
    </nav>
  );
};

export default UnifiedNavigation;


import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home, BookOpen, Music, Headphones, 
  MessageCircle, Settings, User, LayoutDashboard,
  LineChart, Medal, Heart, Activity, 
  Building2, ShieldCheck, Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import NavItem from './NavItem';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';

interface UnifiedNavigationProps {
  onItemClick?: () => void;
  collapsed?: boolean;
}

const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({ 
  onItemClick,
  collapsed = false 
}) => {
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

  // Définir les liens en fonction du mode utilisateur
  let commonLinks = [
    { 
      path: '/', 
      label: 'Accueil', 
      icon: <Home className="h-5 w-5" />
    }
  ];

  if (isAuthenticated) {
    const dashboardPath = getModePath('/dashboard');
    commonLinks.push({
      path: dashboardPath,
      label: 'Tableau de bord',
      icon: <LayoutDashboard className="h-5 w-5" />,
      requiresAuth: true
    });
  }

  let featureLinks = [];

  // Ajouter des liens spécifiques au mode
  if (userMode === 'b2c') {
    featureLinks = [
      { 
        path: '/b2c/journal', 
        label: 'Journal', 
        icon: <BookOpen className="h-5 w-5" />
      },
      { 
        path: '/b2c/music', 
        label: 'Musique', 
        icon: <Music className="h-5 w-5" />
      },
      { 
        path: '/b2c/audio', 
        label: 'Audio', 
        icon: <Headphones className="h-5 w-5" />
      },
      { 
        path: '/b2c/coach', 
        label: 'Coach', 
        icon: <MessageCircle className="h-5 w-5" />
      },
      { 
        path: '/b2c/progress', 
        label: 'Progression', 
        icon: <LineChart className="h-5 w-5" />
      },
      { 
        path: '/b2c/social', 
        label: 'Social', 
        icon: <Heart className="h-5 w-5" />
      }
    ];
  } else if (userMode === 'b2b_user') {
    featureLinks = [
      { 
        path: '/b2b/user/journal', 
        label: 'Journal', 
        icon: <BookOpen className="h-5 w-5" />
      },
      { 
        path: '/b2b/user/teams', 
        label: 'Équipe', 
        icon: <Users className="h-5 w-5" />
      },
      { 
        path: '/b2b/user/coach', 
        label: 'Coach', 
        icon: <MessageCircle className="h-5 w-5" />
      },
      { 
        path: '/b2b/user/gamification', 
        label: 'Défis', 
        icon: <Medal className="h-5 w-5" />
      },
      { 
        path: '/teams', 
        label: 'Teams', 
        icon: <Users className="h-5 w-5" />
      }
    ];
  } else if (userMode === 'b2b_admin') {
    featureLinks = [
      { 
        path: '/b2b/admin/reports', 
        label: 'Rapports', 
        icon: <LineChart className="h-5 w-5" />
      },
      { 
        path: '/b2b/admin/teams', 
        label: 'Équipes', 
        icon: <Users className="h-5 w-5" />
      },
      { 
        path: '/b2b/admin/events', 
        label: 'Événements', 
        icon: <Activity className="h-5 w-5" />
      },
      { 
        path: '/b2b/admin/optimisation', 
        label: 'Optimisation', 
        icon: <LineChart className="h-5 w-5" />
      },
      { 
        path: '/optimization', 
        label: 'Optimisation', 
        icon: <Activity className="h-5 w-5" />
      }
    ];
  }

  const userLinks = [
    { 
      path: getModePath('/profile'), 
      label: 'Profil', 
      icon: <User className="h-5 w-5" />
    },
    { 
      path: getModePath('/settings'), 
      label: 'Paramètres', 
      icon: <Settings className="h-5 w-5" />
    },
    {
      path: '/mode-switcher',
      label: 'Changer de mode',
      icon: userMode === 'b2c' 
        ? <User className="h-5 w-5" />
        : userMode === 'b2b_user'
          ? <Building2 className="h-5 w-5" />
          : <ShieldCheck className="h-5 w-5" />
    }
  ];

  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  const renderNavItems = (links: any[], title?: string) => {
    const filteredLinks = links.filter(link => !link.requiresAuth || isAuthenticated);
    
    if (filteredLinks.length === 0) {
      return null;
    }
    
    return (
      <div className="space-y-1">
        {title && !collapsed && (
          <h3 className="px-3 text-xs font-medium text-muted-foreground mb-2">
            {title}
          </h3>
        )}
        
        {filteredLinks.map((link) => (
          <Link 
            key={link.path}
            to={link.path}
            onClick={handleItemClick}
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isActive(link.path) ? "bg-accent/50 text-accent-foreground" : "text-foreground",
              collapsed ? "justify-center" : "justify-start"
            )}
            title={collapsed ? link.label : undefined}
          >
            <span className={cn("flex-shrink-0", collapsed ? "" : "mr-3")}>{link.icon}</span>
            {!collapsed && <span>{link.label}</span>}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <nav className="flex flex-col p-2 gap-6 w-full">
      {renderNavItems(commonLinks)}
      {renderNavItems(featureLinks, "Fonctionnalités")}
      {renderNavItems(userLinks, "Utilisateur")}
    </nav>
  );
};

export default UnifiedNavigation;

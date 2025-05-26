
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Eye, 
  Music, 
  Brain, 
  BookOpen, 
  Heart, 
  Users, 
  Settings, 
  BarChart3,
  Shield,
  UserPlus,
  Building2
} from 'lucide-react';

interface UnifiedNavigationProps {
  onItemClick?: () => void;
}

const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({ onItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const getNavItems = () => {
    if (!user) return [];

    const baseItems = [
      { 
        path: getDashboardPath(), 
        label: 'Tableau de bord', 
        icon: Home,
        description: 'Vue d\'ensemble'
      }
    ];

    if (user.role === 'b2c') {
      return [
        ...baseItems,
        { 
          path: '/b2c/scan', 
          label: 'Scanner Émotionnel', 
          icon: Eye,
          description: 'Analysez vos émotions',
          badge: 'Nouveau'
        },
        { 
          path: '/b2c/music', 
          label: 'Musicothérapie', 
          icon: Music,
          description: 'Playlists thérapeutiques'
        },
        { 
          path: '/b2c/coach', 
          label: 'Coach IA', 
          icon: Brain,
          description: 'Assistance personnalisée'
        },
        { 
          path: '/b2c/journal', 
          label: 'Journal', 
          icon: BookOpen,
          description: 'Vos pensées quotidiennes'
        },
        { 
          path: '/b2c/vr', 
          label: 'Expériences VR', 
          icon: Heart,
          description: 'Immersion relaxante'
        },
        { 
          path: '/b2c/social', 
          label: 'Social Cocoon', 
          icon: Users,
          description: 'Communauté bienveillante'
        },
        { 
          path: '/b2c/settings', 
          label: 'Paramètres', 
          icon: Settings,
          description: 'Configuration'
        }
      ];
    }

    if (user.role === 'b2b_user') {
      return [
        ...baseItems,
        { 
          path: '/b2b/user/scan', 
          label: 'Scanner Émotionnel', 
          icon: Eye,
          description: 'Analyse personnelle'
        },
        { 
          path: '/b2b/user/music', 
          label: 'Musicothérapie', 
          icon: Music,
          description: 'Relaxation musicale'
        },
        { 
          path: '/b2b/user/coach', 
          label: 'Coach IA', 
          icon: Brain,
          description: 'Coaching personnel'
        },
        { 
          path: '/b2b/user/journal', 
          label: 'Journal', 
          icon: BookOpen,
          description: 'Journal personnel'
        },
        { 
          path: '/b2b/user/cocon', 
          label: 'Cocoon d\'équipe', 
          icon: Users,
          description: 'Échanges équipe'
        },
        { 
          path: '/b2b/user/settings', 
          label: 'Paramètres', 
          icon: Settings,
          description: 'Préférences'
        }
      ];
    }

    if (user.role === 'b2b_admin') {
      return [
        ...baseItems,
        { 
          path: '/b2b/admin/users', 
          label: 'Gestion Utilisateurs', 
          icon: UserPlus,
          description: 'Collaborateurs'
        },
        { 
          path: '/b2b/admin/teams', 
          label: 'Équipes', 
          icon: Users,
          description: 'Organisation'
        },
        { 
          path: '/b2b/admin/analytics', 
          label: 'Analytics', 
          icon: BarChart3,
          description: 'Statistiques détaillées'
        },
        { 
          path: '/b2b/admin/reports', 
          label: 'Rapports', 
          icon: Building2,
          description: 'Rapports RH'
        },
        { 
          path: '/b2b/admin/settings', 
          label: 'Administration', 
          icon: Shield,
          description: 'Configuration système'
        }
      ];
    }

    return baseItems;
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'b2c':
        return '/b2c/dashboard';
      case 'b2b_user':
        return '/b2b/user/dashboard';
      case 'b2b_admin':
        return '/b2b/admin/dashboard';
      default:
        return '/';
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onItemClick?.();
  };

  const navItems = getNavItems();

  return (
    <nav className="space-y-2">
      {navItems.map((item) => (
        <Button
          key={item.path}
          variant={isActive(item.path) ? "secondary" : "ghost"}
          className="w-full justify-start h-auto p-3 text-left"
          onClick={() => handleNavigation(item.path)}
        >
          <div className="flex items-center w-full">
            <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium truncate">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </div>
              {item.description && (
                <p className="text-xs text-muted-foreground truncate">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        </Button>
      ))}
    </nav>
  );
};

export default UnifiedNavigation;

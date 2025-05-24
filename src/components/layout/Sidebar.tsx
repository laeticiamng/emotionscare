
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useUserMode } from '@/contexts/UserModeContext';
import { 
  Heart, 
  Brain, 
  Music, 
  BookOpen, 
  User, 
  Settings, 
  HelpCircle, 
  BarChart3, 
  Users,
  Building2
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { userMode } = useUserMode();

  const getNavItems = () => {
    const commonItems = [
      { href: '/scan', label: 'Scanner émotions', icon: Brain },
      { href: '/coach', label: 'Coach IA', icon: Heart },
      { href: '/music', label: 'Musique', icon: Music },
      { href: '/journal', label: 'Journal', icon: BookOpen },
    ];

    const userItems = [
      { href: '/profile', label: 'Profil', icon: User },
      { href: '/settings', label: 'Paramètres', icon: Settings },
      { href: '/help', label: 'Aide', icon: HelpCircle },
    ];

    let dashboardItem;
    let adminItems = [];

    switch (userMode) {
      case 'b2c':
        dashboardItem = { href: '/b2c/dashboard', label: 'Tableau de bord', icon: BarChart3 };
        break;
      case 'b2b_user':
        dashboardItem = { href: '/b2b/user/dashboard', label: 'Tableau de bord', icon: BarChart3 };
        break;
      case 'b2b_admin':
        dashboardItem = { href: '/b2b/admin/dashboard', label: 'Tableau de bord', icon: BarChart3 };
        adminItems = [
          { href: '/b2b/admin/analytics', label: 'Analytics', icon: BarChart3 },
          { href: '/b2b/admin/users', label: 'Utilisateurs', icon: Users },
        ];
        break;
      default:
        dashboardItem = { href: '/choose-mode', label: 'Choisir mode', icon: Building2 };
    }

    return [dashboardItem, ...commonItems, ...adminItems, ...userItems];
  };

  const navItems = getNavItems();

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-red-500" />
          <span className="text-xl font-bold">EmotionsCare</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export { Sidebar };

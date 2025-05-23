
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Brain, 
  Users, 
  Settings, 
  User, 
  HelpCircle, 
  LogOut,
  BarChart3,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getModeDashboardPath } from '@/utils/userModeHelpers';
import { useState } from 'react';

const Shell: React.FC = () => {
  const { user, logout } = useAuth();
  const { userMode } = useUserMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavigationItems = () => {
    const dashboardPath = getModeDashboardPath(userMode);
    
    const baseItems = [
      { path: dashboardPath, icon: Home, label: 'Tableau de bord' },
    ];

    switch (userMode) {
      case 'b2c':
        return [
          ...baseItems,
          { path: '/b2c/scan', icon: Brain, label: 'Analyser' },
          { path: '/b2c/social', icon: Users, label: 'Communauté' },
        ];
      case 'b2b_user':
        return [
          ...baseItems,
          { path: '/b2b/user/scan', icon: Brain, label: 'Analyser' },
          { path: '/b2b/user/social', icon: Users, label: 'Équipe' },
        ];
      case 'b2b_admin':
        return [
          ...baseItems,
          { path: '/b2b/admin/analytics', icon: BarChart3, label: 'Analytics' },
          { path: '/b2b/admin/users', icon: Shield, label: 'Utilisateurs' },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  const commonItems = [
    { path: '/profile', icon: User, label: 'Profil' },
    { path: '/settings', icon: Settings, label: 'Paramètres' },
    { path: '/help', icon: HelpCircle, label: 'Aide' },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  const NavItem = ({ item, onClick }: { item: any; onClick?: () => void }) => (
    <Button
      key={item.path}
      variant={isActivePath(item.path) ? "default" : "ghost"}
      className="w-full justify-start"
      onClick={() => {
        navigate(item.path);
        onClick?.();
      }}
    >
      <item.icon className="mr-3 h-4 w-4" />
      {item.label}
    </Button>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border
        transform transition-transform duration-300 ease-in-out
        md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">EmotionsCare</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {user?.name} • {userMode === 'b2c' ? 'Particulier' : 
                              userMode === 'b2b_user' ? 'Collaborateur' : 
                              'Administrateur'}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Principal
              </div>
              {navigationItems.map((item) => (
                <NavItem 
                  key={item.path} 
                  item={item} 
                  onClick={() => setSidebarOpen(false)} 
                />
              ))}
            </div>

            <div className="pt-4 space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Compte
              </div>
              {commonItems.map((item) => (
                <NavItem 
                  key={item.path} 
                  item={item} 
                  onClick={() => setSidebarOpen(false)} 
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Se déconnecter
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
        {/* Top bar for mobile */}
        <div className="md:hidden h-16 bg-card border-b border-border flex items-center justify-center">
          <span className="font-semibold">EmotionsCare</span>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Shell;

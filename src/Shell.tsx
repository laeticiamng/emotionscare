
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Home, 
  MessageCircle, 
  Users, 
  Settings, 
  HelpCircle, 
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { toast } from 'sonner';
import { getUserModeLabel } from '@/utils/userModeHelpers';

const Shell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { userMode } = useUserMode();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Déconnexion réussie");
      navigate('/choose-mode');
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const getNavigationItems = () => {
    const baseItems = [
      { 
        label: 'Tableau de bord', 
        icon: Home, 
        path: userMode === 'b2c' ? '/b2c/dashboard' : 
              userMode === 'b2b_user' ? '/b2b/user/dashboard' : 
              '/b2b/admin/dashboard' 
      },
      { 
        label: 'Analyse émotionnelle', 
        icon: Brain, 
        path: userMode === 'b2c' ? '/b2c/scan' : '/b2b/user/scan',
        hidden: userMode === 'b2b_admin'
      },
      { 
        label: 'Communauté', 
        icon: MessageCircle, 
        path: userMode === 'b2c' ? '/b2c/social' : '/b2b/user/social',
        hidden: userMode === 'b2b_admin'
      }
    ];

    if (userMode === 'b2b_admin') {
      baseItems.push(
        { label: 'Analytics', icon: BarChart3, path: '/b2b/admin/analytics' },
        { label: 'Utilisateurs', icon: Users, path: '/b2b/admin/users' }
      );
    }

    baseItems.push(
      { label: 'Profil', icon: User, path: '/profile' },
      { label: 'Paramètres', icon: Settings, path: '/settings' },
      { label: 'Aide', icon: HelpCircle, path: '/help' }
    );

    return baseItems.filter(item => !item.hidden);
  };

  const navigationItems = getNavigationItems();

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">EmotionsCare</span>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 border rounded-md bg-muted/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user?.name || 'Utilisateur'}</p>
                <Badge variant="secondary" className="text-xs">
                  {getUserModeLabel(userMode)}
                </Badge>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out
          md:relative md:translate-x-0 md:z-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full pt-16 md:pt-0">
            <nav className="flex-1 px-4 py-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);
                
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
            
            <div className="p-4 border-t">
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
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Shell;

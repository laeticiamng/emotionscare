
import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Brain, 
  User, 
  Settings, 
  LogOut, 
  Home,
  Scan,
  MessageCircle,
  Music,
  Users,
  BarChart3,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { getUserModeLabel } from '@/utils/userModeHelpers';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { userMode } = useUserMode();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getNavItems = () => {
    if (!isAuthenticated || !userMode) return [];

    const items = [];

    // Navigation commune
    items.push({
      label: 'Tableau de bord',
      icon: Home,
      path: userMode === 'b2c' ? '/b2c/dashboard' : 
            userMode === 'b2b_user' ? '/b2b/user/dashboard' :
            '/b2b/admin/dashboard'
    });

    if (userMode === 'b2c' || userMode === 'b2b_user') {
      items.push(
        {
          label: 'Scanner IA',
          icon: Scan,
          path: userMode === 'b2c' ? '/b2c/scan' : '/b2b/user/scan'
        },
        {
          label: 'Coach IA',
          icon: MessageCircle,
          path: userMode === 'b2c' ? '/b2c/coach' : '/b2b/user/coach'
        }
      );
    }

    if (userMode === 'b2b_admin') {
      items.push(
        {
          label: 'Utilisateurs',
          icon: Users,
          path: '/b2b/admin/users'
        },
        {
          label: 'Analytiques',
          icon: BarChart3,
          path: '/b2b/admin/analytics'
        }
      );
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">EmotionsCare</span>
          </Link>

          {/* Navigation principale */}
          {isAuthenticated && navItems.length > 0 && (
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? 'default' : 'ghost'}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          )}

          {/* Actions utilisateur */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Badge du mode utilisateur */}
                {userMode && (
                  <Badge variant="outline" className="hidden sm:inline-flex">
                    {userMode === 'b2b_admin' && <Shield className="h-3 w-3 mr-1" />}
                    {userMode === 'b2b_user' && <Users className="h-3 w-3 mr-1" />}
                    {userMode === 'b2c' && <User className="h-3 w-3 mr-1" />}
                    {getUserModeLabel(userMode)}
                  </Badge>
                )}

                {/* Menu utilisateur */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="hidden sm:inline">{user?.name || 'Utilisateur'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Paramètres
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Navigation mobile */}
                    <div className="md:hidden">
                      {navItems.map((item) => (
                        <DropdownMenuItem 
                          key={item.path}
                          onClick={() => navigate(item.path)}
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.label}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                    </div>
                    
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/choose-mode')}
                >
                  Se connecter
                </Button>
                <Button 
                  onClick={() => navigate('/choose-mode')}
                >
                  Commencer
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

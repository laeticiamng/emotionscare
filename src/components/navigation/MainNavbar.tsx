
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Menu, X, User, Settings, LogOut } from 'lucide-react';

const MainNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userMode } = useUserMode();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  // Function to determine if a path is active
  const isActivePath = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // Function to get navigation items based on user mode
  const getNavItems = () => {
    if (userMode === 'b2c') {
      return [
        { path: '/b2c/dashboard', label: 'Tableau de bord' },
        { path: '/b2c/journal', label: 'Journal' },
        { path: '/b2c/music', label: 'Musicothérapie' },
        { path: '/b2c/audio', label: 'Audio' },
      ];
    } else if (userMode === 'b2b_user') {
      return [
        { path: '/b2b/user/dashboard', label: 'Tableau de bord' },
        { path: '/b2b/user/journal', label: 'Journal' },
        { path: '/b2b/user/music', label: 'Musicothérapie' },
        { path: '/b2b/user/audio', label: 'Audio' },
      ];
    } else if (userMode === 'b2b_admin') {
      return [
        { path: '/b2b/admin/dashboard', label: 'Tableau de bord' },
        { path: '/b2b/admin/users', label: 'Utilisateurs' },
        { path: '/b2b/admin/analytics', label: 'Analyses' },
        { path: '/b2b/admin/settings', label: 'Paramètres' },
      ];
    }
    
    // Default items for non-authenticated users
    return [
      { path: '/', label: 'Accueil' },
      { path: '/pricing', label: 'Tarifs' },
      { path: '/support', label: 'Support' },
    ];
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="font-bold text-white">EC</span>
                </div>
                <span className="ml-2 font-semibold text-xl">EmotionsCare</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActivePath(item.path)
                      ? 'border-blue-500 text-primary'
                      : 'border-transparent hover:border-slate-300 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.location.href = '/profile'}
                  className="rounded-full"
                  aria-label="User profile"
                >
                  <User className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.location.href = '/settings'}
                  className="rounded-full"
                  aria-label="Settings"
                >
                  <Settings className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logout()}
                  className="rounded-full"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Se connecter</Button>
                </Link>
                <Link to="/register">
                  <Button>S'inscrire</Button>
                </Link>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActivePath(item.path)
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent hover:bg-gray-50 hover:border-gray-300 text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          {isAuthenticated && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    {user?.firstName?.charAt(0) || 'U'}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.firstName} {user?.lastName}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Button
                  variant="ghost"
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.href = '/profile';
                  }}
                >
                  <User className="h-5 w-5 inline mr-2" />
                  Profil
                </Button>
                <Button
                  variant="ghost"
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.href = '/settings';
                  }}
                >
                  <Settings className="h-5 w-5 inline mr-2" />
                  Paramètres
                </Button>
                <Button
                  variant="ghost"
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                >
                  <LogOut className="h-5 w-5 inline mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          )}
          {!isAuthenticated && (
            <div className="pt-4 pb-3 border-t border-gray-200 px-4 space-y-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                <Button variant="outline" className="w-full">Se connecter</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                <Button className="w-full">S'inscrire</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default MainNavbar;

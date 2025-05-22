
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUserMode } from '@/contexts/UserModeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, User, LogOut, Settings, Music, Book, Headphones } from 'lucide-react';

const MainNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userMode } = useUserMode();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  let navigationLinks = [];

  if (isAuthenticated) {
    if (userMode === 'b2c') {
      navigationLinks = [
        { name: 'Tableau de bord', href: '/b2c/dashboard' },
        { name: 'Journal', href: '/b2c/journal' },
        { name: 'Musicothérapie', href: '/b2c/music' },
        { name: 'Audio', href: '/b2c/audio' }
      ];
    } else if (userMode === 'b2b_user') {
      navigationLinks = [
        { name: 'Tableau de bord', href: '/b2b/user/dashboard' },
        { name: 'Journal', href: '/b2b/user/journal' },
        { name: 'Musicothérapie', href: '/b2b/user/music' },
        { name: 'Audio', href: '/b2b/user/audio' }
      ];
    } else if (userMode === 'b2b_admin') {
      navigationLinks = [
        { name: 'Tableau de bord', href: '/b2b/admin/dashboard' },
        { name: 'Utilisateurs', href: '/b2b/admin/users' },
        { name: 'Rapports', href: '/b2b/admin/reports' }
      ];
    }
  } else {
    navigationLinks = [
      { name: 'Accueil', href: '/' },
      { name: 'Tarifs', href: '/pricing' },
      { name: 'Support', href: '/support' }
    ];
  }

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="font-bold text-xl text-primary">
                EmotionsCare
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-4 items-center">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/profile')}
                  title="Profil"
                >
                  <User className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  title="Déconnexion"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/b2c/login')}
                >
                  Se connecter
                </Button>
                <Button
                  onClick={() => navigate('/b2c/register')}
                >
                  S'inscrire
                </Button>
              </div>
            )}
          </div>
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium">Utilisateur</div>
                  <div className="text-sm text-muted-foreground">user@example.com</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate('/profile');
                    setIsMenuOpen(false);
                  }}
                >
                  <User className="h-5 w-5 mr-2" />
                  Profil
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="mt-3 px-2 space-y-1">
                <Button
                  className="w-full"
                  onClick={() => {
                    navigate('/b2c/login');
                    setIsMenuOpen(false);
                  }}
                >
                  Se connecter
                </Button>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => {
                    navigate('/b2c/register');
                    setIsMenuOpen(false);
                  }}
                >
                  S'inscrire
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNavbar;

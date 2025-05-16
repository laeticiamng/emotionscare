
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut } from 'lucide-react';
import { UserNav } from './UserNav';

const NavBar = () => {
  const { userMode } = useUserMode();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  // Function to determine if a link is active
  const isActiveLink = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // Function to determine navigation items based on user mode
  const renderNavItems = () => {
    if (userMode === 'b2c') {
      return (
        <>
          <Link to="/b2c/dashboard">
            <Button variant={isActiveLink('/b2c/dashboard') ? 'default' : 'ghost'}>Tableau de bord</Button>
          </Link>
          <Link to="/b2c/journal">
            <Button variant={isActiveLink('/b2c/journal') ? 'default' : 'ghost'}>Journal</Button>
          </Link>
          <Link to="/b2c/coaching">
            <Button variant={isActiveLink('/b2c/coaching') ? 'default' : 'ghost'}>Coaching</Button>
          </Link>
        </>
      );
    } else if (userMode === 'b2b_user') {
      return (
        <>
          <Link to="/b2b/user/dashboard">
            <Button variant={isActiveLink('/b2b/user/dashboard') ? 'default' : 'ghost'}>Tableau de bord</Button>
          </Link>
          <Link to="/b2b/user/sessions">
            <Button variant={isActiveLink('/b2b/user/sessions') ? 'default' : 'ghost'}>Sessions</Button>
          </Link>
          <Link to="/b2b/user/resources">
            <Button variant={isActiveLink('/b2b/user/resources') ? 'default' : 'ghost'}>Ressources</Button>
          </Link>
        </>
      );
    } else if (userMode === 'b2b_admin') {
      return (
        <>
          <Link to="/b2b/admin/dashboard">
            <Button variant={isActiveLink('/b2b/admin/dashboard') ? 'default' : 'ghost'}>Tableau de bord</Button>
          </Link>
          <Link to="/b2b/admin/users">
            <Button variant={isActiveLink('/b2b/admin/users') ? 'default' : 'ghost'}>Utilisateurs</Button>
          </Link>
          <Link to="/b2b/admin/analytics">
            <Button variant={isActiveLink('/b2b/admin/analytics') ? 'default' : 'ghost'}>Analyse</Button>
          </Link>
          <Link to="/b2b/admin/settings">
            <Button variant={isActiveLink('/b2b/admin/settings') ? 'default' : 'ghost'}>Paramètres</Button>
          </Link>
        </>
      );
    }
    
    return null;
  };

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="font-bold text-white">EC</span>
            </div>
            <span className="ml-2 font-semibold text-xl">EmotionsCare</span>
          </Link>
          
          {isAuthenticated && (
            <nav className="ml-10 hidden md:flex items-center space-x-4">
              {renderNavItems()}
            </nav>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <UserNav />
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Déconnexion</span>
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link to="/login">
                <Button variant="outline">Connexion</Button>
              </Link>
              <Link to="/register">
                <Button>Inscription</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;

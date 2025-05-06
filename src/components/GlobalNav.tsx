
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { topNavItems, adminTopNavItems } from './navigation/navConfig';
import { isAdminRole } from '@/utils/roleUtils';
import Logo from './navigation/Logo';
import DesktopNavigation from './navigation/DesktopNavigation';
import UserMenu from './navigation/UserMenu';
import MobileNavigation from './navigation/MobileNavigation';
import ThemeSwitcher from './ui/ThemeSwitcher';
import { Button } from './ui/button';
import { HomeIcon, LogIn } from 'lucide-react';

interface GlobalNavProps {
  isAuthenticated?: boolean;
}

const GlobalNav: React.FC<GlobalNavProps> = ({ isAuthenticated }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user ? isAdminRole(user.role) : false;
  
  // Sélectionner les bons éléments de navigation en fonction du rôle
  const navigationItems = isAdmin ? adminTopNavItems : topNavItems;
  
  return (
    <header className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo - cliquable pour revenir à l'accueil (/) */}
        <Logo isAdmin={isAdmin} homePath="/" />
        
        {isAuthenticated ? (
          <>
            {/* Desktop Navigation pour utilisateurs authentifiés */}
            <DesktopNavigation navigationItems={navigationItems} />
            
            {/* User Profile - Desktop */}
            <div className="flex items-center gap-4">
              <ThemeSwitcher variant="outline" size="sm" showLabel={false} />
              <UserMenu badgesCount={0} />
            </div>
          </>
        ) : (
          <>
            {/* Navigation pour visiteurs non authentifiés */}
            <div className="flex-1 flex justify-center">
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/" className="text-foreground/90 hover:text-foreground font-medium text-sm flex items-center gap-1.5">
                  <HomeIcon size={18} />
                  <span>Accueil</span>
                </Link>
              </nav>
            </div>
            
            {/* Actions pour visiteurs */}
            <div className="flex items-center gap-4">
              <ThemeSwitcher variant="outline" size="sm" showLabel={false} />
              <Button 
                variant="default" 
                size="sm" 
                className="hover-lift shadow-sm"
                onClick={() => navigate('/login')}
              >
                <LogIn size={16} className="mr-2" />
                Connexion
              </Button>
            </div>
          </>
        )}
        
        {/* Mobile Navigation */}
        <MobileNavigation />
      </div>
    </header>
  );
};

export default GlobalNav;

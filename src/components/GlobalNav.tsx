
import React, { useCallback, memo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { topNavItems, adminTopNavItems } from './navigation/navConfig';
import { isAdminRole } from '@/utils/roleUtils';
import Logo from './navigation/Logo';
import DesktopNavigation from './navigation/DesktopNavigation';
import UserMenu from './navigation/UserMenu';
import MobileNavigation from './navigation/MobileNavigation';
import ThemeSwitcher from './ui/ThemeSwitcher';
import GlobalSearch from './search/GlobalSearch';
import NotificationsPanel from './notifications/NotificationsPanel';
import { useNotificationBadge } from '@/hooks/useNotificationBadge';
import { Button } from './ui/button';
import { HomeIcon, LogIn } from 'lucide-react';
import useLogger from '@/hooks/useLogger';

interface GlobalNavProps {
  isAuthenticated?: boolean;
}

const GlobalNav: React.FC<GlobalNavProps> = ({ isAuthenticated = false }) => {
  const { user, isAuthenticated: authState } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user ? isAdminRole(user.role) : false;
  const { unreadCount } = useNotificationBadge();
  const logger = useLogger('GlobalNav');
  
  // Utiliser l'état d'authentification du contexte si isAuthenticated n'est pas fourni en prop
  const authenticated = isAuthenticated || authState;
  
  // Sélectionner les bons éléments de navigation en fonction du rôle
  const navigationItems = isAdmin ? adminTopNavItems : topNavItems;
  
  logger.info('Rendering navigation', { 
    authenticated, 
    userName: user?.name,
    userRole: user?.role
  });
  
  const handleLoginClick = useCallback(() => {
    logger.debug('Login button clicked');
    navigate('/login');
  }, [navigate, logger]);
  
  const handleRegisterClick = useCallback(() => {
    logger.debug('Register button clicked');
    navigate('/register');
  }, [navigate, logger]);
  
  return (
    <header className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b shadow-sm">
      <div className="container h-16 flex items-center justify-between max-w-[1400px] px-4 md:px-6 lg:px-8">
        {/* Logo - cliquable pour revenir à l'accueil (/) */}
        <Logo isAdmin={isAdmin} homePath="/" />
        
        {authenticated ? (
          <>
            {/* Desktop Navigation pour utilisateurs authentifiés */}
            <DesktopNavigation navigationItems={navigationItems} />
            
            {/* Global Search - only for authenticated users */}
            <div className="flex items-center ml-auto mr-4">
              <GlobalSearch />
            </div>
            
            {/* User Profile - Desktop */}
            <div className="flex items-center gap-4">
              {/* Add NotificationsPanel */}
              <NotificationsPanel />
              <ThemeSwitcher variant="outline" size="sm" showLabel={false} />
              <UserMenu badgesCount={unreadCount} />
            </div>
          </>
        ) : (
          <>
            {/* Navigation pour visiteurs non authentifiés */}
            <div className="flex-1 flex justify-center">
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/" className="text-foreground/90 hover:text-foreground font-medium text-sm flex items-center gap-1.5 hover:translate-y-[-2px] transition-transform">
                  <HomeIcon size={18} />
                  <span>Accueil</span>
                </Link>
                <Link to="/docs" className="text-foreground/80 hover:text-foreground text-sm flex items-center hover:translate-y-[-2px] transition-transform">
                  Documentation
                </Link>
                <Link to="/pricing" className="text-foreground/80 hover:text-foreground text-sm flex items-center hover:translate-y-[-2px] transition-transform">
                  Tarifs
                </Link>
                <Link to="/contact" className="text-foreground/80 hover:text-foreground text-sm flex items-center hover:translate-y-[-2px] transition-transform">
                  Contact
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
                onClick={handleLoginClick}
              >
                <LogIn size={16} className="mr-2" />
                Connexion
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="hover-lift"
                onClick={handleRegisterClick}
              >
                Inscription
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

// Utilisation de memo pour éviter les re-rendus inutiles
export default memo(GlobalNav);

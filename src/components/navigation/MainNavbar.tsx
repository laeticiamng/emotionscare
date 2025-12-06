// @ts-nocheck

// @ts-nocheck
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { routes } from '@/routerV2';
import { Button } from '@/components/ui/button';
import { Heart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeDashboardPath } from '@/utils/userModeHelpers';

const MainNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { userMode } = useUserMode();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
    closeMobileMenu();
  };
  
  const handleDashboardClick = () => {
    navigate(getModeDashboardPath(userMode));
    closeMobileMenu();
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={routes.public.home()} className="flex items-center" onClick={closeMobileMenu}>
              <Heart className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold text-lg">Emotion Care</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate(routes.public.pricing())}
              className={isActive('/pricing') ? 'bg-accent' : ''}
            >
              Tarifs
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate(routes.public.support())}
              className={isActive('/support') ? 'bg-accent' : ''}
            >
              Support
            </Button>
            
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={handleDashboardClick}
                >
                  Tableau de bord
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate(routes.auth.login())}
                >
                  Connexion
                </Button>
                <Button
                  onClick={() => navigate(routes.auth.b2cRegister())}
                >
                  Essai gratuit
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate(routes.public.pricing());
                  closeMobileMenu();
                }}
              >
                Tarifs
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate(routes.public.support());
                  closeMobileMenu();
                }}
              >
                Support
              </Button>
              
              {isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleDashboardClick}
                  >
                    Tableau de bord
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate(routes.auth.login());
                      closeMobileMenu();
                    }}
                  >
                    Connexion
                  </Button>
                  <Button
                    className="w-full justify-start"
                    onClick={() => {
                      navigate(routes.auth.b2cRegister());
                      closeMobileMenu();
                    }}
                  >
                    Essai gratuit
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default MainNavbar;

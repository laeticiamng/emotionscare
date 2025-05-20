
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { getUserDisplayName } from '@/utils/userHelpers';
import { getModeDashboardPath, getUserModeLabel } from '@/utils/userModeHelpers';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Home, LogOut, Settings, User, Menu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UnifiedHeaderProps {
  onMenuClick?: () => void;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { userMode } = useUserMode();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [scrolled, setScrolled] = useState(false);
  
  // Track scroll for header appearance change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur EmotionsCare !"
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Erreur",
        description: "Un problème est survenu lors de la déconnexion.",
        variant: "destructive"
      });
    }
  };
  
  const goToDashboard = () => {
    const dashboardPath = getModeDashboardPath(userMode);
    navigate(dashboardPath);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
          
          <div 
            className="font-bold text-lg cursor-pointer"
            onClick={goToDashboard}
          >
            EmotionsCare
            {userMode !== 'b2c' && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
              >
                {getUserModeLabel(userMode)}
              </motion.span>
            )}
          </div>
        </div>
        
        <AnimatePresence>
          {user ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 md:gap-2"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hidden sm:flex items-center gap-1 px-2"
                      onClick={goToDashboard}
                    >
                      <Home className="h-4 w-4" />
                      <span className="hidden md:inline">Accueil</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Accueil</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hidden sm:flex items-center gap-1 px-2"
                      onClick={() => navigate('/settings')}
                    >
                      <Settings className="h-4 w-4" />
                      <span className="hidden md:inline">Paramètres</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Paramètres</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="items-center gap-1 px-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden md:inline">Déconnexion</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Déconnexion</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => navigate('/profile')}
              >
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate">
                  {getUserDisplayName(user)}
                </span>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Connexion
              </Button>
              <Button
                size="sm"
                onClick={() => navigate('/register')}
              >
                Inscription
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default UnifiedHeader;

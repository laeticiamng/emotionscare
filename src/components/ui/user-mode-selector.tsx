
import React, { useState, useEffect } from 'react';
import { useUserMode } from '@/contexts/UserModeContext';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';
import { Building2, User, Users, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface UserModeSelectorProps {
  minimal?: boolean;
  className?: string;
}

export const UserModeSelector: React.FC<UserModeSelectorProps> = ({ minimal = false, className = '' }) => {
  const { userMode, setUserMode } = useUserMode();
  const navigate = useNavigate();
  const [recentlyChangedMode, setRecentlyChangedMode] = useState<string | null>(null);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (recentlyChangedMode) {
      timer = setTimeout(() => {
        setRecentlyChangedMode(null);
      }, 2000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [recentlyChangedMode]);
  
  const handleModeChange = (mode: string) => {
    if (mode === userMode) return;
    
    setUserMode(mode);
    setRecentlyChangedMode(mode);
    
    // Show toast notification for mode change
    toast.success(`Mode changé: ${getUserModeDisplayName(mode)}`, {
      description: "Redirection vers le tableau de bord approprié..."
    });
    
    // Show a success feedback animation
    const feedbackEl = document.getElementById('mode-change-feedback');
    if (feedbackEl) {
      feedbackEl.classList.add('opacity-100');
      setTimeout(() => feedbackEl.classList.remove('opacity-100'), 1500);
    }
    
    // Navigate to mode switcher or directly to dashboard
    navigate('/mode-switcher');
  };
  
  const getModeIcon = (mode: string = userMode) => {
    switch (mode) {
      case 'b2b_admin':
        return <Building2 className="h-4 w-4 mr-2" />;
      case 'b2b_user':
        return <Users className="h-4 w-4 mr-2" />;
      default:
        return <User className="h-4 w-4 mr-2" />;
    }
  };
  
  return (
    <TooltipProvider>
      <div className={`relative ${className}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 transition-all duration-300 hover:bg-accent" 
                    aria-label="Changer de mode utilisateur"
                  >
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="flex items-center"
                    >
                      {getModeIcon()}
                      {!minimal && (
                        <span className="hidden sm:inline">{getUserModeDisplayName(userMode)}</span>
                      )}
                    </motion.div>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Changer de mode</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <AnimatePresence>
                    {['b2c', 'b2b_user', 'b2b_admin'].map((mode) => (
                      <DropdownMenuItem 
                        key={mode}
                        onClick={() => handleModeChange(mode)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center">
                          {getModeIcon(mode)}
                          <span>{getUserModeDisplayName(mode)}</span>
                        </span>
                        
                        {userMode === mode && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-primary"
                          >
                            <Check className="h-4 w-4" />
                          </motion.div>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </AnimatePresence>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/mode-switcher')} className="cursor-pointer">
                    Écran de sélection complet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={5}>
            <p className="text-sm">Mode utilisateur actuel: <span className="font-medium">{getUserModeDisplayName(userMode)}</span></p>
            <p className="text-xs text-muted-foreground mt-1">Cliquez pour changer</p>
          </TooltipContent>
        </Tooltip>
        
        {/* Feedback animation element */}
        <div id="mode-change-feedback" className="absolute top-0 left-0 w-full h-full bg-primary/10 rounded-md pointer-events-none opacity-0 transition-opacity flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5, times: [0, 0.6, 1] }}
            className="bg-primary/20 p-1 rounded-full"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="text-primary"
            >
              {getModeIcon()}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Pulse indicator for recent changes */}
        <AnimatePresence>
          {recentlyChangedMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
            >
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-full h-full bg-primary/50 rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
};

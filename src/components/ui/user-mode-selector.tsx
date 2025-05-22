
import React from 'react';
import { useUserMode } from '@/contexts/UserModeContext';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';
import { Building2, User, Users, ChevronDown } from 'lucide-react';
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
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserModeSelectorProps {
  minimal?: boolean;
  className?: string;
}

export const UserModeSelector: React.FC<UserModeSelectorProps> = ({ minimal = false, className = '' }) => {
  const { userMode, setUserMode } = useUserMode();
  const navigate = useNavigate();
  
  const handleModeChange = (mode: string) => {
    setUserMode(mode);
    // Show a success feedback animation
    const feedbackEl = document.getElementById('mode-change-feedback');
    if (feedbackEl) {
      feedbackEl.classList.add('opacity-100');
      setTimeout(() => feedbackEl.classList.remove('opacity-100'), 1500);
    }
    // Navigate to mode switcher or directly to dashboard
    navigate('/mode-switcher');
  };
  
  const getModeIcon = () => {
    switch (userMode) {
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
                    className="flex items-center gap-2" 
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
                  <DropdownMenuItem 
                    onClick={() => handleModeChange('b2c')}
                    className="flex items-center cursor-pointer"
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span>Particulier</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleModeChange('b2b_user')}
                    className="flex items-center cursor-pointer"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    <span>Collaborateur</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleModeChange('b2b_admin')}
                    className="flex items-center cursor-pointer"
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    <span>Administrateur</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/mode-switcher')} className="cursor-pointer">
                    Écran de sélection complet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Mode utilisateur actuel: {getUserModeDisplayName(userMode)}</p>
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
      </div>
    </TooltipProvider>
  );
};

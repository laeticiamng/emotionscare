import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { User, Building, Shield, Check, SwitchCamera } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';
import { useUserModeHelpers } from '@/hooks/useUserModeHelpers';
import { normalizeUserMode } from '@/utils/userModeHelpers';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

interface ModeSwitcherProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ 
  variant = "outline",
  size = "default"
}) => {
  const navigate = useNavigate();
  const { userMode, setUserMode } = useUserMode();
  const { isB2C, isB2BUser, isB2BAdmin } = useUserModeHelpers();
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Sync logs were used during development; remove in production
  useEffect(() => {
    // placeholder effect to keep dependency check
  }, [userMode, user?.role]);
  
  const handleSwitchMode = async (mode: string) => {
    const normalizedMode = normalizeUserMode(mode);
    
    if (userMode && normalizedMode === normalizeUserMode(userMode)) {
      return; // Do nothing if selecting the same mode
    }
    
    // Set transitioning state to trigger animations
    setIsTransitioning(true);
    
    // Update UserModeContext
    if (normalizedMode) {
      setUserMode(normalizedMode);
    }
    
    // Update localStorage values
    localStorage.setItem('userMode', normalizedMode || mode);
    localStorage.setItem('user_role', normalizedMode);
    
    setIsOpen(false);
    
    // Show animated toast for better feedback
    toast({
      title: "Mode changé",
      description: `Vous utilisez maintenant EmotionsCare en mode ${
        normalizedMode === 'b2c' ? 'Personnel' : 
        normalizedMode === 'b2b_user' ? 'Collaborateur' : 
        'Administrateur'
      }.`,
      variant: "default",
    });
    
    // Add a slight delay before navigation for smoother transition
    setTimeout(() => {
      // Redirect to the appropriate page
      switch (normalizedMode) {
        case 'b2c':
          navigate('/b2c/dashboard');
          break;
        case 'b2b_user':
          navigate('/b2b/user/dashboard');
          break;
        case 'b2b_admin':
          navigate('/b2b/admin/dashboard');
          break;
        default:
          navigate('/choose-mode');
      }
      
      // Reset transitioning state after navigation
      setTimeout(() => setIsTransitioning(false), 300);
    }, 100);
  };
  
  // Get the appropriate icon based on current mode
  const getCurrentModeIcon = () => {
    if (isB2C) return <User className="h-4 w-4" />;
    if (isB2BUser) return <Building className="h-4 w-4" />;
    if (isB2BAdmin) return <Shield className="h-4 w-4" />;
    return <SwitchCamera className="h-4 w-4" />;
  };
  
  // Get the name of the current mode
  const getCurrentModeName = () => {
    if (isB2C) return "Personnel";
    if (isB2BUser) return "Collaborateur";
    if (isB2BAdmin) return "Administrateur";
    return "Changer de mode";
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className="gap-2 transition-all duration-300 hover:shadow-md focus:ring-2 focus:ring-primary/20"
          aria-label="Changer de mode utilisateur"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: isTransitioning ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {getCurrentModeIcon()}
          </motion.div>
          <span>{getCurrentModeName()}</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem 
          onClick={() => handleSwitchMode('b2c')}
          className="gap-2 cursor-pointer transition-colors focus:bg-blue-50 dark:focus:bg-blue-900/20"
          disabled={isB2C}
        >
          <User className="h-4 w-4" />
          <span>Mode Personnel</span>
          {isB2C && (
            <motion.div
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }}
              className="ml-auto"
            >
              <Check className="h-4 w-4 text-primary" />
            </motion.div>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleSwitchMode('b2b_user')}
          className="gap-2 cursor-pointer transition-colors focus:bg-green-50 dark:focus:bg-green-900/20"
          disabled={isB2BUser}
        >
          <Building className="h-4 w-4" />
          <span>Mode Collaborateur</span>
          {isB2BUser && (
            <motion.div
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }}
              className="ml-auto"
            >
              <Check className="h-4 w-4 text-primary" />
            </motion.div>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => handleSwitchMode('b2b_admin')}
          className="gap-2 cursor-pointer transition-colors focus:bg-purple-50 dark:focus:bg-purple-900/20"
          disabled={isB2BAdmin}
        >
          <Shield className="h-4 w-4" />
          <span>Mode Administrateur</span>
          {isB2BAdmin && (
            <motion.div
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }}
              className="ml-auto"
            >
              <Check className="h-4 w-4 text-primary" />
            </motion.div>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModeSwitcher;


import React, { useState } from 'react';
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
import { toast } from '@/hooks/use-toast';

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
  
  const handleSwitchMode = (mode: string) => {
    const normalizedMode = normalizeUserMode(mode);
    
    if (normalizedMode === normalizeUserMode(userMode)) {
      return; // Ne rien faire si on sélectionne le même mode
    }
    
    setUserMode(normalizedMode);
    setIsOpen(false);
    
    toast({
      title: "Mode changé",
      description: `Vous utilisez maintenant EmotionsCare en mode ${
        mode === 'b2c' ? 'Personnel' : 
        mode === 'b2b_user' ? 'Collaborateur' : 
        'Administrateur'
      }.`
    });
    
    // Rediriger vers la page appropriée
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
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <SwitchCamera className="h-4 w-4" />
          <span>Changer de mode</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem 
          onClick={() => handleSwitchMode('b2c')}
          className="gap-2 cursor-pointer"
          disabled={isB2C}
        >
          <User className="h-4 w-4" />
          <span>Mode Personnel</span>
          {isB2C && <Check className="h-4 w-4 ml-auto" />}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleSwitchMode('b2b_user')}
          className="gap-2 cursor-pointer"
          disabled={isB2BUser}
        >
          <Building className="h-4 w-4" />
          <span>Mode Collaborateur</span>
          {isB2BUser && <Check className="h-4 w-4 ml-auto" />}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => handleSwitchMode('b2b_admin')}
          className="gap-2 cursor-pointer"
          disabled={isB2BAdmin}
        >
          <Shield className="h-4 w-4" />
          <span>Mode Administrateur</span>
          {isB2BAdmin && <Check className="h-4 w-4 ml-auto" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModeSwitcher;

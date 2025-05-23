
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Building2, ShieldCheck, ChevronDown } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface UserModeSelectorProps {
  className?: string;
  minimal?: boolean;
  showLabel?: boolean;
  onModeChange?: (mode: string) => void;
}

export function UserModeSelector({ 
  className = '', 
  minimal = false,
  showLabel = true,
  onModeChange
}: UserModeSelectorProps) {
  const { userMode, changeUserMode } = useUserMode();
  const navigate = useNavigate();
  
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'b2c':
        return <User className="h-4 w-4" />;
      case 'b2b_user':
        return <Building2 className="h-4 w-4" />;
      case 'b2b_admin':
        return <ShieldCheck className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };
  
  const handleModeChange = (mode: string) => {
    changeUserMode(mode as any);
    toast.success(`Mode ${getUserModeDisplayName(mode)} activé`);
    
    if (onModeChange) {
      onModeChange(mode);
    } else {
      // Rediriger vers le dashboard approprié
      const dashboardPaths = {
        'b2c': '/b2c/dashboard',
        'b2b_user': '/b2b/user/dashboard',
        'b2b_admin': '/b2b/admin/dashboard'
      };
      
      navigate(dashboardPaths[mode as keyof typeof dashboardPaths] || '/dashboard');
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={minimal ? "ghost" : "outline"}
          size={minimal ? "sm" : "default"}
          className={cn("flex items-center gap-2", className)}
        >
          {getModeIcon(userMode || 'b2c')}
          {showLabel && (
            <span className="hidden sm:inline">{getUserModeDisplayName(userMode || 'b2c')}</span>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          onClick={() => handleModeChange('b2c')}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            userMode === 'b2c' && "bg-primary/10"
          )}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Particulier</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleModeChange('b2b_user')}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            userMode === 'b2b_user' && "bg-primary/10"
          )}
        >
          <Building2 className="mr-2 h-4 w-4" />
          <span>Collaborateur</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleModeChange('b2b_admin')}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            userMode === 'b2b_admin' && "bg-primary/10"
          )}
        >
          <ShieldCheck className="mr-2 h-4 w-4" />
          <span>Administration</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserModeSelector;

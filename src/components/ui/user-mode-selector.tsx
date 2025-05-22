
import React from 'react';
import { useUserMode } from '@/contexts/UserModeContext';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';
import { Building2, User, Users } from 'lucide-react';
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

interface UserModeSelectorProps {
  minimal?: boolean;
  className?: string;
}

export const UserModeSelector: React.FC<UserModeSelectorProps> = ({ minimal = false, className = '' }) => {
  const { userMode, setUserMode } = useUserMode();
  const navigate = useNavigate();
  
  const handleModeChange = (mode: string) => {
    setUserMode(mode);
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          {getModeIcon()}
          {!minimal && <span>{getUserModeDisplayName(userMode)}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Changer de mode</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => handleModeChange('b2c')}
          className="flex items-center"
        >
          <User className="h-4 w-4 mr-2" />
          <span>Particulier</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleModeChange('b2b_user')}
          className="flex items-center"
        >
          <Users className="h-4 w-4 mr-2" />
          <span>Collaborateur</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleModeChange('b2b_admin')}
          className="flex items-center"
        >
          <Building2 className="h-4 w-4 mr-2" />
          <span>Administrateur</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/mode-switcher')}>
          Écran de sélection complet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

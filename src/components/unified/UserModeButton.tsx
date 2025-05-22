
import React from 'react';
import { Button } from '@/components/ui/button';
import { useUserMode } from '@/contexts/UserModeContext';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { UserIcon, Users, Building2, Settings } from 'lucide-react';

const UserModeButton = () => {
  const { userMode, setUserMode } = useUserMode();
  
  // Handle mode change
  const handleModeChange = (mode: string) => {
    setUserMode(mode);
    localStorage.setItem('userMode', mode);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <span className="hidden md:inline mr-2">{getUserModeDisplayName(userMode)}</span>
          <UserIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem 
          onClick={() => handleModeChange('b2c')}
          className={userMode === 'b2c' ? 'bg-secondary' : ''}
        >
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Particulier</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleModeChange('b2b_user')}
          className={userMode === 'b2b_user' ? 'bg-secondary' : ''}
        >
          <Users className="mr-2 h-4 w-4" />
          <span>Collaborateur</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleModeChange('b2b_admin')}
          className={userMode === 'b2b_admin' ? 'bg-secondary' : ''}
        >
          <Building2 className="mr-2 h-4 w-4" />
          <span>Administrateur</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => window.location.href = '/choose-mode'}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Changer de mode</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserModeButton;

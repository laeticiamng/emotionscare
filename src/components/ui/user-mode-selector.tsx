
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserIcon, Building, BuildingCog } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';
import { UserMode } from '@/types/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserModeSelectorProps {
  className?: string;
  minimal?: boolean;
  showLabel?: boolean;
}

export function UserModeSelector({ 
  className = '', 
  minimal = false,
  showLabel = true 
}: UserModeSelectorProps) {
  const { userMode, changeUserMode } = useUserMode();
  
  const getModeIcon = (mode: UserMode) => {
    switch (mode) {
      case 'b2c':
        return <UserIcon className="h-4 w-4" />;
      case 'b2b_user':
        return <Building className="h-4 w-4" />;
      case 'b2b_admin':
        return <BuildingCog className="h-4 w-4" />;
      default:
        return <UserIcon className="h-4 w-4" />;
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={minimal ? "ghost" : "outline"}
          size={minimal ? "sm" : "default"}
          className={className}
        >
          {getModeIcon(userMode as UserMode)}
          {showLabel && (
            <span className="ml-2">{getUserModeDisplayName(userMode || 'b2c')}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeUserMode('b2c')}>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Particulier</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeUserMode('b2b_user')}>
          <Building className="mr-2 h-4 w-4" />
          <span>Collaborateur</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeUserMode('b2b_admin')}>
          <BuildingCog className="mr-2 h-4 w-4" />
          <span>Administration</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

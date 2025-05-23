
import React, { useState } from 'react';
import { useUserMode } from '@/contexts/UserModeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';
import { User, Users, ShieldCheck } from 'lucide-react';

interface UserModeSelectorProps {
  minimal?: boolean;
}

export const UserModeSelector: React.FC<UserModeSelectorProps> = ({ minimal = false }) => {
  const { userMode, changeUserMode } = useUserMode();
  const [isChanging, setIsChanging] = useState(false);
  
  const handleChangeMode = async (mode: 'b2c' | 'b2b_user' | 'b2b_admin') => {
    try {
      setIsChanging(true);
      await changeUserMode(mode);
    } finally {
      setIsChanging(false);
    }
  };
  
  // Get current mode icon
  const getModeIcon = () => {
    switch (userMode) {
      case 'b2c':
        return <User className="h-4 w-4" />;
      case 'b2b_user':
        return <Users className="h-4 w-4" />;
      case 'b2b_admin':
        return <ShieldCheck className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isChanging}>
        <Button variant="ghost" size={minimal ? "sm" : "default"}>
          {getModeIcon()}
          {!minimal && (
            <span className="ml-2">{getUserModeDisplayName(userMode || 'b2c')}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleChangeMode('b2c')}
          disabled={userMode === 'b2c' || isChanging}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Particulier</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleChangeMode('b2b_user')}
          disabled={userMode === 'b2b_user' || isChanging}
        >
          <Users className="mr-2 h-4 w-4" />
          <span>Collaborateur</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleChangeMode('b2b_admin')}
          disabled={userMode === 'b2b_admin' || isChanging}
        >
          <ShieldCheck className="mr-2 h-4 w-4" />
          <span>Administrateur</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

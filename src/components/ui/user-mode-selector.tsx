
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Building2, ShieldCheck } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';
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
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={minimal ? "ghost" : "outline"}
          size={minimal ? "sm" : "default"}
          className={className}
        >
          {getModeIcon(userMode || 'b2c')}
          {showLabel && (
            <span className="ml-2">{getUserModeDisplayName(userMode || 'b2c')}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeUserMode('b2c')}>
          <User className="mr-2 h-4 w-4" />
          <span>Particulier</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeUserMode('b2b_user')}>
          <Building2 className="mr-2 h-4 w-4" />
          <span>Collaborateur</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeUserMode('b2b_admin')}>
          <ShieldCheck className="mr-2 h-4 w-4" />
          <span>Administration</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

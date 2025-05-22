
import React from 'react';
import { Button } from "@/components/ui/button";
import { useUserMode } from '@/contexts/UserModeContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserModeType, USER_MODE_LABELS } from '@/types/userMode';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';
import { Building2, User, Users } from 'lucide-react';

export interface UserModeSelectorProps {
  minimal?: boolean;
  className?: string;
}

export function UserModeSelector({ minimal = false, className = '' }: UserModeSelectorProps) {
  const { userMode, setUserMode } = useUserMode();
  
  const handleModeChange = (mode: UserModeType) => {
    setUserMode(mode);
    // Save to localStorage to persist across refreshes
    localStorage.setItem('userMode', mode);
  };
  
  const getIcon = (mode: UserModeType) => {
    switch(mode) {
      case 'b2c':
        return <User className="mr-2 h-4 w-4" />;
      case 'b2b_user':
        return <Users className="mr-2 h-4 w-4" />;
      case 'b2b_admin':
        return <Building2 className="mr-2 h-4 w-4" />;
      default:
        return <User className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          {!minimal && (
            <span className="mr-2">{getUserModeDisplayName(userMode)}</span>
          )}
          {getIcon(userMode as UserModeType)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(USER_MODE_LABELS).map(([mode, label]) => (
          <DropdownMenuItem
            key={mode}
            onClick={() => handleModeChange(mode as UserModeType)}
            className={mode === userMode ? "bg-secondary" : ""}
          >
            {getIcon(mode as UserModeType)}
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserModeSelector;

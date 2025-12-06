// @ts-nocheck

import React from 'react';
import { useUserMode } from '@/contexts/UserModeContext';
import { Button } from '@/components/ui/button';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';
import { User, Building2, ShieldCheck } from 'lucide-react';

interface UserModeButtonProps {
  onClick?: () => void;
  className?: string;
  minimal?: boolean;
}

const UserModeButton: React.FC<UserModeButtonProps> = ({ 
  onClick, 
  className = '', 
  minimal = false 
}) => {
  const { userMode } = useUserMode();
  
  const getModeIcon = () => {
    switch (userMode) {
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
    <Button
      variant="ghost"
      size={minimal ? "sm" : "default"}
      onClick={onClick}
      className={className}
    >
      {getModeIcon()}
      {!minimal && (
        <span className="ml-2">{getUserModeDisplayName(userMode || 'b2c')}</span>
      )}
    </Button>
  );
};

export default UserModeButton;

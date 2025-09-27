import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useUserMode } from '@/contexts/UserModeContext';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';
import { User, Building, Shield } from 'lucide-react';

interface UserModeIndicatorProps {
  className?: string;
  showIcon?: boolean;
}

const UserModeIndicator: React.FC<UserModeIndicatorProps> = ({
  className = '',
  showIcon = true
}) => {
  const { userMode } = useUserMode();

  const getIcon = () => {
    switch (userMode) {
      case 'b2c':
        return <User className="h-3 w-3" />;
      case 'b2b_user':
        return <Building className="h-3 w-3" />;
      case 'b2b_admin':
        return <Shield className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const getVariant = () => {
    switch (userMode) {
      case 'b2c':
        return 'default' as const;
      case 'b2b_user':
        return 'secondary' as const;
      case 'b2b_admin':
        return 'outline' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <Badge variant={getVariant()} className={`flex items-center gap-1 ${className}`}>
      {showIcon && getIcon()}
      {getUserModeDisplayName(userMode)}
    </Badge>
  );
};

export default UserModeIndicator;
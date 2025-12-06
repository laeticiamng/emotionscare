
import React from 'react';
import { useUserMode } from '@/contexts/UserModeContext';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';
import { Badge } from '@/components/ui/badge';
import { User, Building, Shield } from 'lucide-react';

interface UserModeIndicatorProps {
  showLabel?: boolean;
  className?: string;
}

/**
 * Affiche un indicateur du mode utilisateur actuel
 */
const UserModeIndicator: React.FC<UserModeIndicatorProps> = ({ 
  showLabel = true, 
  className = '' 
}) => {
  const { userMode } = useUserMode();
  const displayName = getUserModeDisplayName(userMode);
  
  // Déterminer la couleur et l'icône en fonction du mode
  let variant = 'default';
  let Icon = User;
  
  switch (userMode) {
    case 'b2c':
      variant = 'default';
      Icon = User;
      break;
    case 'b2b_user':
      variant = 'secondary';
      Icon = Building;
      break;
    case 'b2b_admin':
      variant = 'outline';
      Icon = Shield;
      break;
    default:
      break;
  }
  
  return (
    <Badge 
      variant={variant as any} 
      className={`flex items-center gap-1 ${className}`}
    >
      <Icon className="h-3 w-3" />
      {showLabel && <span>{displayName}</span>}
    </Badge>
  );
};

export default UserModeIndicator;

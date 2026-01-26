import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useUserMode } from '@/contexts/UserModeContext';
import { UserModeType } from '@/types/userMode';
import { User, Users, Shield } from 'lucide-react';

interface UserModeSelectorProps {
  minimal?: boolean;
  disabled?: boolean;
}

export const UserModeSelector: React.FC<UserModeSelectorProps> = ({ 
  minimal = false, 
  disabled = false 
}) => {
  const { userMode, changeUserMode, isLoading } = useUserMode();
  
  const modes: { value: UserModeType; label: string; icon: React.ReactNode }[] = [
    { value: 'b2c', label: 'Particulier', icon: <User className="h-4 w-4" /> },
    { value: 'b2b_user', label: 'Collaborateur', icon: <Users className="h-4 w-4" /> },
    { value: 'b2b_admin', label: 'Administrateur', icon: <Shield className="h-4 w-4" /> }
  ];
  
  if (minimal && userMode) {
    const currentMode = modes.find(m => m.value === userMode);
    return (
      <Badge variant="outline" className="flex items-center gap-2">
        {currentMode?.icon}
        {currentMode?.label}
      </Badge>
    );
  }
  
  return (
    <Select
      value={userMode || ''}
      onValueChange={(value) => changeUserMode(value as UserModeType)}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Choisir un mode" />
      </SelectTrigger>
      <SelectContent>
        {modes.map((mode) => (
          <SelectItem key={mode.value} value={mode.value}>
            <div className="flex items-center gap-2">
              {mode.icon}
              {mode.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default UserModeSelector;

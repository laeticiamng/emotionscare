import React from 'react';
import { useUserMode } from '@/contexts/UserModeContext';
import { UserMode } from '@/utils/userModeHelpers';

interface ModeAwareContentProps {
  children: React.ReactNode;
  modes?: UserMode[];
  fallback?: React.ReactNode;
}

const ModeAwareContent: React.FC<ModeAwareContentProps> = ({
  children,
  modes = ['b2c', 'b2b_user', 'b2b_admin'],
  fallback = null
}) => {
  const { userMode } = useUserMode();

  const shouldShow = modes.includes(userMode || 'b2c');

  if (!shouldShow) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default ModeAwareContent;
// @ts-nocheck

import { useContext } from 'react';
import { UserModeContext } from '@/contexts/UserModeContext';
import { USER_MODES, USER_MODE_LABELS, UserModeType } from '@/types/userMode';

export const useUserModeHelpers = () => {
  const { userMode } = useContext(UserModeContext);

  // Helper functions
  const isB2C = userMode === USER_MODES.B2C;
  const isB2BUser = userMode === USER_MODES.B2B_USER;
  const isB2BAdmin = userMode === USER_MODES.B2B_ADMIN;
  const isAdmin = userMode === USER_MODES.ADMIN;
  
  const normalizeMode = (mode: string): UserModeType => {
    const lowerMode = mode.toLowerCase();
    
    if (lowerMode.includes('b2c') || lowerMode.includes('particulier')) {
      return USER_MODES.B2C;
    } 
    
    if (lowerMode.includes('admin') || lowerMode.includes('rh')) {
      return USER_MODES.B2B_ADMIN;
    }
    
    if (lowerMode.includes('b2b') || lowerMode.includes('collaborateur') || lowerMode.includes('user')) {
      return USER_MODES.B2B_USER;
    }
    
    return USER_MODES.B2C; // Default
  };
  
  const getModeLabel = (mode: UserModeType | string): string => {
    const normalizedMode = normalizeMode(mode);
    return USER_MODE_LABELS[normalizedMode] || 'Utilisateur';
  };
  
  return {
    isB2C,
    isB2BUser,
    isB2BAdmin,
    isAdmin,
    normalizeMode,
    getModeLabel,
    normalizedMode: userMode, // Current normalized mode
    currentModeLabel: USER_MODE_LABELS[userMode] || 'Utilisateur'
  };
};

export default useUserModeHelpers;

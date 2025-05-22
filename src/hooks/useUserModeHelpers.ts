import { useUserMode } from '@/contexts/UserModeContext';
import { useAuth } from '@/contexts/AuthContext';
import { normalizeUserMode, getModeDashboardPath, getUserModeDisplayName } from '@/utils/userModeHelpers';
import { useEffect } from 'react';
import { UserRole } from '@/types/user';

export function useUserModeHelpers() {
  const { userMode, setUserMode } = useUserMode();
  const { user } = useAuth();
  
  // Keep user role and userMode in sync
  useEffect(() => {
    if (user?.role && userMode) {
      const normalizedRole = normalizeUserMode(user.role);
      const normalizedMode = normalizeUserMode(userMode);
      
      // If role and mode don't match, synchronize userMode with the user role
      if (normalizedRole !== normalizedMode) {
        setUserMode(normalizedRole);
        localStorage.setItem('userMode', normalizedRole);
      }
    }
  }, [user?.role, userMode, setUserMode]);
  
  const normalizedMode = normalizeUserMode(userMode);
  
  return {
    isB2C: normalizedMode === 'b2c',
    isB2BUser: normalizedMode === 'b2b_user',
    isB2BAdmin: normalizedMode === 'b2b_admin',
    normalizedMode,
    
    // Helper method to get a human-readable name for the current mode
    getModeName: () => getUserModeDisplayName(normalizedMode),
    
    // Helper to get the home path for the current mode
    getHomePathForCurrentMode: () => getModeDashboardPath(normalizedMode),
    
    // Helper to check if the current mode matches a given role
    matchesRole: (role: UserRole | string) => {
      return normalizeUserMode(role) === normalizedMode;
    }
  };
}

export default useUserModeHelpers;


import { useUserMode } from '@/contexts/UserModeContext';
import { useAuth } from '@/contexts/AuthContext';
import { normalizeUserMode } from '@/utils/userModeHelpers';
import { useEffect } from 'react';
import { UserRole } from '@/types/user';
import { UserModeType } from '@/types/userMode';

export function useUserModeHelpers() {
  const { userMode, setUserMode } = useUserMode();
  const { user } = useAuth();
  
  // Keep user role and userMode in sync
  useEffect(() => {
    if (user?.role && userMode) {
      const normalizedRole = normalizeUserMode(user.role);
      const normalizedMode = normalizeUserMode(userMode);
      
      // If role and mode don't match, log a warning
      if (normalizedRole !== normalizedMode) {
        console.warn('[useUserModeHelpers] User role and mode mismatch:', {
          role: user.role,
          normalizedRole,
          userMode,
          normalizedMode
        });
        
        // Synchronize by setting userMode to match the user role
        setUserMode(normalizedRole);
        localStorage.setItem('userMode', normalizedRole);
        console.log('[useUserModeHelpers] Synchronized mode with role:', normalizedRole);
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
    getModeName: () => {
      switch (normalizedMode) {
        case 'b2b_admin': return 'Administrateur';
        case 'b2b_user': return 'Collaborateur';
        case 'b2c': default: return 'Particulier';
      }
    },
    
    // Helper to get the home path for the current mode
    getHomePathForCurrentMode: () => {
      switch (normalizedMode) {
        case 'b2b_admin': return '/b2b/admin/dashboard';
        case 'b2b_user': return '/b2b/user/dashboard';
        case 'b2c': default: return '/b2c/dashboard';
      }
    },
    
    // Helper to check if the current mode matches a given role
    matchesRole: (role: UserRole | string) => {
      return normalizeUserMode(role) === normalizedMode;
    }
  };
}

export default useUserModeHelpers;

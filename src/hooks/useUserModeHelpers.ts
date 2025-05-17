import { useUserMode } from '@/contexts/UserModeContext';
import { useAuth } from '@/contexts/AuthContext';
import { normalizeUserMode } from '@/utils/userModeHelpers';
import { useEffect } from 'react';

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
        localStorage.setItem('userMode', normalizedRole as string);
        console.log('[useUserModeHelpers] Synchronized mode with role:', normalizedRole);
      }
    }
  }, [user?.role, userMode, setUserMode]);
  
  const normalizedMode = normalizeUserMode(userMode);
  
  const isB2C = normalizedMode === 'b2c';
  const isB2BUser = normalizedMode === 'b2b_user';
  const isB2BAdmin = normalizedMode === 'b2b_admin';
  const isB2B = isB2BUser || isB2BAdmin;
  
  return {
    isB2C,
    isB2B,
    isB2BUser,
    isB2BAdmin,
    currentMode: normalizedMode
  };
}

export default useUserModeHelpers;

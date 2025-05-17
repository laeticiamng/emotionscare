
import { useUserMode } from '@/contexts/UserModeContext';
import { normalizeUserMode } from '@/utils/userModeHelpers';

export function useUserModeHelpers() {
  const { userMode } = useUserMode();
  
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

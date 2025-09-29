
import { useUserMode } from '@/contexts/UserModeContext';
import { normalizeUserMode, getModeDashboardPath, getUserModeDisplayName } from '@/utils/userModeHelpers';

const useUserModeHelpers = () => {
  const { userMode, setUserMode } = useUserMode();

  const switchToMode = (mode: string) => {
    const normalizedMode = normalizeUserMode(mode);
    setUserMode(normalizedMode);
  };

  const getDashboardPath = () => {
    return getModeDashboardPath(userMode);
  };

  const getDisplayName = () => {
    return getUserModeDisplayName(userMode);
  };

  return {
    userMode,
    switchToMode,
    getDashboardPath,
    getDisplayName,
    setUserMode,
    isB2C: userMode === 'b2c',
    isB2BUser: userMode === 'b2b_user', 
    isB2BAdmin: userMode === 'b2b_admin',
    normalizedMode: userMode
  };
};

export { useUserModeHelpers };
export default useUserModeHelpers;

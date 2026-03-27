// @ts-nocheck
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
    setUserMode
  };
};

export default useUserModeHelpers;

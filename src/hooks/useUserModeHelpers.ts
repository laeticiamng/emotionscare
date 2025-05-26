
import { UserRole } from '@/types/user';
import { useUserMode } from '@/contexts/UserModeContext';

const useUserModeHelpers = () => {
  const { currentMode } = useUserMode();

  const getFormattedPath = (path: string): string => {
    switch (currentMode) {
      case 'b2b_user':
        return `/b2b/user/${path}`;
      case 'b2b_admin':
        return `/b2b/admin/${path}`;
      case 'b2c':
      default:
        return `/b2c/${path}`;
    }
  };

  const isB2BMode = (): boolean => {
    return currentMode === 'b2b_user' || currentMode === 'b2b_admin';
  };

  const isAdminMode = (): boolean => {
    return currentMode === 'b2b_admin';
  };

  return {
    getFormattedPath,
    isB2BMode,
    isAdminMode,
    currentMode
  };
};

export default useUserModeHelpers;

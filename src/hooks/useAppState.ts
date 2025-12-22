import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useLayout } from '@/contexts/LayoutContext';

export const useAppState = () => {
  const auth = useAuth();
  const userMode = useUserMode();
  const layout = useLayout();

  return {
    // État d'authentification
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    isAuthLoading: auth.isLoading,
    
    // Mode utilisateur
    currentUserMode: userMode.userMode,
    isModeLoading: userMode.isLoading,
    
    // Layout
    sidebarCollapsed: layout.sidebarCollapsed,
    theme: layout.theme,
    fullscreen: layout.fullscreen,
    
    // Actions
    logout: auth.logout,
    setUserMode: userMode.setUserMode,
    toggleSidebar: layout.toggleSidebar,
    setTheme: layout.setTheme,
  };
};

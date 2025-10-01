// @ts-nocheck
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useLayout } from '@/contexts/LayoutContext';
import { useSidebar } from '@/contexts/SidebarContext';

export const useAppState = () => {
  const auth = useAuth();
  const userMode = useUserMode();
  const layout = useLayout();
  const sidebar = useSidebar();

  return {
    // État d'authentification
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    isAuthLoading: auth.isLoading,
    
    // Mode utilisateur
    currentUserMode: userMode.userMode,
    isModeLoading: userMode.isLoading,
    
    // Layout
    layoutSidebarCollapsed: layout.sidebarCollapsed,
    theme: layout.theme,
    fullscreen: layout.fullscreen,
    
    // Sidebar
    sidebarCollapsed: sidebar.collapsed,
    
    // Actions
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
    setUserMode: userMode.setUserMode,
    toggleSidebar: layout.toggleSidebar,
    setTheme: layout.setTheme,
    toggleSidebarCollapsed: sidebar.toggleCollapsed,
  };
};

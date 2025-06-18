
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
    authError: auth.error,
    
    // Mode utilisateur
    currentUserMode: userMode.userMode,
    isModeLoading: userMode.isLoading,
    
    // Layout
    sidebarCollapsed: layout.sidebarCollapsed,
    theme: layout.theme,
    fullscreen: layout.fullscreen,
    
    // Sidebar
    sidebarOpen: sidebar.isOpen,
    
    // Actions
    signIn: auth.signIn,
    signUp: auth.signUp,
    signOut: auth.signOut,
    setUserMode: userMode.setUserMode,
    toggleSidebar: layout.toggleSidebar,
    setTheme: layout.setTheme,
    toggleSidebarOpen: sidebar.toggleSidebar,
  };
};

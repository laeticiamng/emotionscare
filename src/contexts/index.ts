
// Re-export all contexts
export { AuthProvider, useAuth } from './AuthContext';
export { ThemeContext, ThemeProvider, useTheme } from './ThemeContext';
export { UserPreferencesContext, UserPreferencesProvider, useUserPreferences } from './UserPreferencesContext';
export { UserModeProvider, useUserMode } from './UserModeContext';
export { MusicProvider } from './MusicContext';
export { SidebarProvider, useSidebar } from './SidebarContext';

// Ensure proper export for useMusic
export { useMusic } from './music';

// Remove default exports that don't exist

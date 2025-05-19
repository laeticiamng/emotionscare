
// Re-export all contexts
export { AuthContext, AuthProvider, useAuth } from './AuthContext';
export { ThemeContext, ThemeProvider, useTheme } from './ThemeContext';
export { UserPreferencesContext, UserPreferencesProvider, useUserPreferences } from './UserPreferencesContext';
export { UserModeContext, UserModeProvider, useUserMode } from './UserModeContext';
export { MusicContext, MusicProvider, useMusic } from './MusicContext';
export { SidebarContext, SidebarProvider, useSidebar } from './SidebarContext';

// You can also export default contexts if needed
export { default as AuthContextDefault } from './AuthContext';
export { default as ThemeContextDefault } from './ThemeContext';
export { default as UserPreferencesContextDefault } from './UserPreferencesContext';
export { default as UserModeContextDefault } from './UserModeContext';
export { default as MusicContextDefault } from './MusicContext';
export { default as SidebarContextDefault } from './SidebarContext';

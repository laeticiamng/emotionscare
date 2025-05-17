
// Centralisation des exports de contextes pour simplifier les imports

export { ThemeProvider, useTheme } from './ThemeContext';
export { UserPreferencesProvider, useUserPreferences } from './UserPreferencesContext';
export { UserModeProvider, useUserMode } from './UserModeContext';
export { LayoutProvider, useLayout } from './LayoutContext';
export { SidebarProvider, useSidebar } from './SidebarContext';
export { AuthProvider, useAuth } from './AuthContext';
export { MusicContext, MusicProvider, useMusic } from './music/MusicProvider';

// Autres contexts si besoin

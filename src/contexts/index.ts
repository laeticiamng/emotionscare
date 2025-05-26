// Re-export all contexts
export { AuthProvider, useAuth } from './AuthContext';
export { ThemeContext, ThemeProvider, useTheme } from './ThemeContext';
export { UserPreferencesContext, UserPreferencesProvider, useUserPreferences } from './UserPreferencesContext';
export { UserModeProvider, useUserMode } from './UserModeContext';
export { MusicProvider, useMusic } from './MusicContext';
export { SidebarProvider, useSidebar } from './SidebarContext';
export { SupportProvider, useSupport } from './SupportContext';
export { OnboardingProvider, useOnboarding } from './OnboardingContext';

// Add missing context exports
export { ThemeProvider } from '@/providers/ThemeProvider';

// Create missing contexts placeholders
export const ThemeContext = React.createContext(null);
export const UserPreferencesContext = React.createContext(null);
export const SidebarContext = React.createContext(null);
export const SupportContext = React.createContext(null);
export const OnboardingContext = React.createContext(null);

// Placeholder providers and hooks
export const UserPreferencesProvider = ({ children }: { children: React.ReactNode }) => children;
export const SidebarProvider = ({ children }: { children: React.ReactNode }) => children;
export const SupportProvider = ({ children }: { children: React.ReactNode }) => children;
export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => children;

export const useUserPreferences = () => ({});
export const useSidebar = () => ({});
export const useSupport = () => ({});
export const useOnboarding = () => ({});

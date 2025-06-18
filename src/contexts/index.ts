
import React from 'react';

// Re-export all contexts
export { AuthProvider, useAuth } from './AuthContext';
export { ThemeProvider, useTheme } from '@/components/theme-provider';

// Create missing contexts placeholders  
export const UserModeContext = React.createContext(null);
export const MusicContext = React.createContext(null);
export const UserPreferencesContext = React.createContext(null);
export const SidebarContext = React.createContext(null);
export const SupportContext = React.createContext(null);
export const OnboardingContext = React.createContext(null);

// Placeholder providers and hooks
export const UserModeProvider = ({ children }: { children: React.ReactNode }) => children;
export const MusicProvider = ({ children }: { children: React.ReactNode }) => children;
export const UserPreferencesProvider = ({ children }: { children: React.ReactNode }) => children;
export const SidebarProvider = ({ children }: { children: React.ReactNode }) => children;
export const SupportProvider = ({ children }: { children: React.ReactNode }) => children;
export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => children;

export const useUserMode = () => ({ userMode: 'b2c', isLoading: false });
export const useMusic = () => ({});
export const useUserPreferences = () => ({});
export const useSidebar = () => ({ collapsed: false, toggleCollapsed: () => {}, setCollapsed: () => {} });
export const useSupport = () => ({});
export const useOnboarding = () => ({});

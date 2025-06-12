
import React from 'react';

// Re-export all contexts
export { AuthProvider, useAuth } from './AuthContext';
export { ThemeProvider, useTheme } from '@/providers/ThemeProvider';
export { UserModeProvider, useUserMode } from './UserModeContext';
export { MusicProvider, useMusic, MusicContext } from './MusicContext';

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
export const useSidebar = () => ({ collapsed: false, toggleCollapsed: () => {}, setCollapsed: () => {} });
export const useSupport = () => ({});
export const useOnboarding = () => ({});

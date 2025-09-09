
import React from 'react';

// Re-export all contexts
export { AuthProvider, useAuth } from './AuthContext';
export { UserModeProvider, useUserMode } from './UserModeContext';
export { ThemeProvider, useTheme } from '@/components/theme-provider';

// Contextes simplifiés pour compatibilité
export const MusicContext = React.createContext(null);
export const UserPreferencesContext = React.createContext(null);
export const SidebarContext = React.createContext(null);
export const SupportContext = React.createContext(null);
export const OnboardingContext = React.createContext(null);

// Providers placeholders pour compatibilité
export const MusicProvider = ({ children }: { children: React.ReactNode }) => children;
export const UserPreferencesProvider = ({ children }: { children: React.ReactNode }) => children;
export const SidebarProvider = ({ children }: { children: React.ReactNode }) => children;
export const SupportProvider = ({ children }: { children: React.ReactNode }) => children;
export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => children;

// Hooks simplifiés pour compatibilité avec interfaces minimales
export const useMusic = () => ({ 
  currentTrack: null,
  isPlaying: false,
  play: () => {},
  pause: () => {},
  stop: () => {}
});

export const useUserPreferences = () => ({ 
  theme: 'light',
  language: 'fr',
  accessibility: {}
});

export const useSidebar = () => ({ 
  collapsed: false, 
  toggleCollapsed: () => {}, 
  setCollapsed: () => {} 
});

export const useSupport = () => ({ 
  contactSupport: () => {},
  getFAQ: () => []
});

export const useOnboarding = () => ({ 
  isCompleted: true,
  currentStep: 0,
  nextStep: () => {},
  complete: () => {}
});

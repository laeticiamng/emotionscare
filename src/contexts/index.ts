
// Centralisation des exports de contextes pour simplifier les imports

export { ThemeProvider, useTheme, ThemeContext, type ThemeContextType } from './ThemeContext';
export { UserPreferencesProvider, useUserPreferences, UserPreferencesContext } from './UserPreferencesContext';
export { UserModeProvider, useUserMode, UserModeContext } from './UserModeContext';
export { LayoutProvider, useLayout, LayoutContext } from './LayoutContext';
export { SidebarProvider, useSidebar } from './SidebarContext';
export { AuthProvider, useAuth } from './AuthContext';
export { AudioProvider, useAudio, AudioContext } from './AudioContext';
export { StorytellingProvider, useStorytelling } from './StorytellingContext';
export { SoundscapeProvider, useSoundscape } from './SoundscapeContext';
export { BrandingProvider, BrandingContext } from './BrandingContext';
export { SegmentProvider, useSegment } from './SegmentContext';
export { SessionProvider, useSession } from './SessionContext';
export { OnboardingProvider, useOnboarding } from './OnboardingContext';
export { PredictiveAnalyticsProvider, usePredictiveAnalytics } from './PredictiveAnalyticsContext';

// Export depuis les sous-dossiers de contextes
export { CoachProvider, useCoach, CoachContext, type CoachContextType } from './coach';
export { MusicProvider, MusicContext, useMusic } from './music';

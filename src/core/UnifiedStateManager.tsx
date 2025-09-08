/**
 * UNIFIED STATE MANAGER - Single Source of Truth
 * Remplace tous les contexts/stores éparpillés par un système unifié
 */

import React, { createContext, useContext, ReactNode, useReducer, useEffect } from 'react';
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

// ==================== TYPES CENTRALISÉS ====================

interface User {
  id: string;
  email: string;
  role: 'consumer' | 'employee' | 'manager' | 'admin';
  preferences: UserPreferences;
  profile: UserProfile;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  accessibility: AccessibilitySettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  colorBlind: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  sound: boolean;
}

interface PrivacySettings {
  dataCollection: boolean;
  analytics: boolean;
  marketing: boolean;
  cookies: boolean;
}

interface UserProfile {
  name: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

interface AppState {
  isLoading: boolean;
  error: string | null;
  currentView: string;
  sidebarOpen: boolean;
  modals: Record<string, boolean>;
}

interface MusicState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  playlist: Track[];
  history: Track[];
  preferences: MusicPreferences;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  emotion?: string;
}

interface MusicPreferences {
  autoPlay: boolean;
  crossfade: boolean;
  equalizer: EqualizerSettings;
}

interface EqualizerSettings {
  bass: number;
  mid: number;
  treble: number;
  preset: string;
}

interface EmotionState {
  currentEmotion: Emotion | null;
  history: EmotionReading[];
  insights: EmotionInsight[];
}

interface Emotion {
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  surprise: number;
  disgust: number;
  timestamp: string;
}

interface EmotionReading {
  id: string;
  emotion: Emotion;
  context?: string;
  timestamp: string;
}

interface EmotionInsight {
  type: 'pattern' | 'recommendation' | 'alert';
  message: string;
  timestamp: string;
}

// ==================== STORE UNIFIÉ ZUSTAND ====================

interface UnifiedStore {
  // User State
  user: User | null;
  isAuthenticated: boolean;
  
  // App State
  app: AppState;
  
  // Music State
  music: MusicState;
  
  // Emotion State
  emotions: EmotionState;
  
  // Actions
  setUser: (user: User | null) => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  setAppState: (state: Partial<AppState>) => void;
  toggleSidebar: () => void;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  
  // Music Actions
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  setVolume: (volume: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  addToPlaylist: (track: Track) => void;
  removeFromPlaylist: (trackId: string) => void;
  
  // Emotion Actions
  recordEmotion: (reading: EmotionReading) => void;
  addInsight: (insight: EmotionInsight) => void;
  clearEmotionHistory: () => void;
}

export const useUnifiedStore = create<UnifiedStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        user: null,
        isAuthenticated: false,
        
        app: {
          isLoading: false,
          error: null,
          currentView: '/',
          sidebarOpen: false,
          modals: {},
        },
        
        music: {
          currentTrack: null,
          isPlaying: false,
          volume: 0.7,
          playlist: [],
          history: [],
          preferences: {
            autoPlay: true,
            crossfade: true,
            equalizer: {
              bass: 0,
              mid: 0,
              treble: 0,
              preset: 'flat',
            },
          },
        },
        
        emotions: {
          currentEmotion: null,
          history: [],
          insights: [],
        },
        
        // User Actions
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        
        updateUserPreferences: (preferences) => set(state => ({
          user: state.user ? {
            ...state.user,
            preferences: { ...state.user.preferences, ...preferences }
          } : null
        })),
        
        // App Actions
        setAppState: (appState) => set(state => ({
          app: { ...state.app, ...appState }
        })),
        
        toggleSidebar: () => set(state => ({
          app: { ...state.app, sidebarOpen: !state.app.sidebarOpen }
        })),
        
        openModal: (id) => set(state => ({
          app: { ...state.app, modals: { ...state.app.modals, [id]: true } }
        })),
        
        closeModal: (id) => set(state => ({
          app: { ...state.app, modals: { ...state.app.modals, [id]: false } }
        })),
        
        // Music Actions
        playTrack: (track) => set(state => ({
          music: {
            ...state.music,
            currentTrack: track,
            isPlaying: true,
            history: [track, ...state.music.history.slice(0, 49)] // Keep last 50
          }
        })),
        
        pauseTrack: () => set(state => ({
          music: { ...state.music, isPlaying: false }
        })),
        
        setVolume: (volume) => set(state => ({
          music: { ...state.music, volume: Math.max(0, Math.min(1, volume)) }
        })),
        
        nextTrack: () => {
          const { music } = get();
          if (music.playlist.length > 0) {
            const currentIndex = music.playlist.findIndex(t => t.id === music.currentTrack?.id);
            const nextIndex = (currentIndex + 1) % music.playlist.length;
            const nextTrack = music.playlist[nextIndex];
            get().playTrack(nextTrack);
          }
        },
        
        previousTrack: () => {
          const { music } = get();
          if (music.playlist.length > 0) {
            const currentIndex = music.playlist.findIndex(t => t.id === music.currentTrack?.id);
            const prevIndex = currentIndex === 0 ? music.playlist.length - 1 : currentIndex - 1;
            const prevTrack = music.playlist[prevIndex];
            get().playTrack(prevTrack);
          }
        },
        
        addToPlaylist: (track) => set(state => ({
          music: {
            ...state.music,
            playlist: [...state.music.playlist, track]
          }
        })),
        
        removeFromPlaylist: (trackId) => set(state => ({
          music: {
            ...state.music,
            playlist: state.music.playlist.filter(t => t.id !== trackId)
          }
        })),
        
        // Emotion Actions
        recordEmotion: (reading) => set(state => ({
          emotions: {
            ...state.emotions,
            currentEmotion: reading.emotion,
            history: [reading, ...state.emotions.history.slice(0, 999)] // Keep last 1000
          }
        })),
        
        addInsight: (insight) => set(state => ({
          emotions: {
            ...state.emotions,
            insights: [insight, ...state.emotions.insights.slice(0, 99)] // Keep last 100
          }
        })),
        
        clearEmotionHistory: () => set(state => ({
          emotions: { ...state.emotions, history: [], insights: [] }
        })),
      }),
      {
        name: 'emotions-care-unified-store',
        partialize: (state) => ({
          user: state.user,
          music: {
            volume: state.music.volume,
            preferences: state.music.preferences,
          },
          emotions: {
            history: state.emotions.history.slice(0, 100), // Persist last 100 only
          }
        })
      }
    ),
    { name: 'EmotionsCare Store' }
  )
);

// ==================== CONTEXT POUR ACTIONS AVANCÉES ====================

interface UnifiedContextType {
  // Performance monitoring
  recordPerformanceMetric: (name: string, value: number) => void;
  
  // Accessibility helpers
  announceToScreenReader: (message: string) => void;
  applyAccessibilityPreferences: () => void;
  
  // Security functions
  logSecurityEvent: (event: string, details?: any) => void;
  validateSecureAction: (action: string) => boolean;
  
  // Analytics (privacy-compliant)
  trackEvent: (event: string, properties?: Record<string, any>) => void;
  
  // Error handling
  reportError: (error: Error, context?: string) => void;
}

const UnifiedContext = createContext<UnifiedContextType | null>(null);

export const useUnifiedContext = () => {
  const context = useContext(UnifiedContext);
  if (!context) {
    throw new Error('useUnifiedContext must be used within UnifiedProvider');
  }
  return context;
};

// ==================== PROVIDER UNIFIÉ ====================

interface UnifiedProviderProps {
  children: ReactNode;
}

export const UnifiedProvider: React.FC<UnifiedProviderProps> = ({ children }) => {
  const store = useUnifiedStore();
  
  // Performance Monitoring
  const recordPerformanceMetric = (name: string, value: number) => {
    if (import.meta.env.DEV) {
      console.log(`📊 Performance: ${name} = ${value.toFixed(2)}ms`);
    }
    
    // En production, envoyer à un service de monitoring
    if (import.meta.env.PROD && store.user?.preferences.privacy.analytics) {
      // Envoyer les métriques de façon anonyme
    }
  };
  
  // Accessibility
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };
  
  const applyAccessibilityPreferences = () => {
    const prefs = store.user?.preferences.accessibility;
    if (!prefs) return;
    
    const root = document.documentElement;
    
    // Motion
    if (prefs.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    // Contrast
    if (prefs.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Font size
    if (prefs.largeText) {
      root.style.setProperty('--font-scale', '1.25');
    } else {
      root.style.setProperty('--font-scale', '1');
    }
    
    // Dyslexic font
    if (prefs.screenReader) {
      root.classList.add('dyslexic-font');
    } else {
      root.classList.remove('dyslexic-font');
    }
    
    // Color blind support
    if (prefs.colorBlind !== 'none') {
      root.setAttribute('data-colorblind', prefs.colorBlind);
    } else {
      root.removeAttribute('data-colorblind');
    }
  };
  
  // Security
  const logSecurityEvent = (event: string, details?: any) => {
    if (import.meta.env.DEV) {
      console.warn(`🚨 Security Event: ${event}`, details);
    }
    // En production, log to security service
  };
  
  const validateSecureAction = (action: string): boolean => {
    // Implement security validation logic
    return true;
  };
  
  // Analytics (Privacy-compliant)
  const trackEvent = (event: string, properties?: Record<string, any>) => {
    if (!store.user?.preferences.privacy.analytics) return;
    
    if (import.meta.env.DEV) {
      console.log(`📊 Event: ${event}`, properties);
    }
    
    // En production, envoyer de façon anonyme et respectueuse de la vie privée
  };
  
  // Error Handling
  const reportError = (error: Error, context?: string) => {
    console.error(`❌ Error${context ? ` in ${context}` : ''}:`, error);
    
    store.setAppState({
      error: error.message,
      isLoading: false
    });
    
    // En production, envoyer à un service d'erreur
  };
  
  // Apply accessibility preferences on user change
  useEffect(() => {
    applyAccessibilityPreferences();
  }, [store.user?.preferences.accessibility]);
  
  const contextValue: UnifiedContextType = {
    recordPerformanceMetric,
    announceToScreenReader,
    applyAccessibilityPreferences,
    logSecurityEvent,
    validateSecureAction,
    trackEvent,
    reportError,
  };
  
  return (
    <UnifiedContext.Provider value={contextValue}>
      {children}
    </UnifiedContext.Provider>
  );
};

// ==================== HOOKS UTILITAIRES ====================

// Hook pour l'authentification
export const useAuth = () => {
  const { user, isAuthenticated, setUser } = useUnifiedStore();
  const { trackEvent, reportError } = useUnifiedContext();
  
  const login = async (email: string, password: string) => {
    try {
      // Implement login logic
      trackEvent('user_login_attempt', { email: email.split('@')[1] }); // Privacy-safe
    } catch (error) {
      reportError(error as Error, 'login');
    }
  };
  
  const logout = () => {
    setUser(null);
    trackEvent('user_logout');
  };
  
  return { user, isAuthenticated, login, logout };
};

// Hook pour la musique
export const useMusic = () => {
  const {
    music,
    playTrack,
    pauseTrack,
    setVolume,
    nextTrack,
    previousTrack,
    addToPlaylist,
    removeFromPlaylist
  } = useUnifiedStore();
  
  const { trackEvent } = useUnifiedContext();
  
  const play = (track?: Track) => {
    if (track) {
      playTrack(track);
      trackEvent('music_play', { trackId: track.id, emotion: track.emotion });
    } else if (music.currentTrack) {
      playTrack(music.currentTrack);
    }
  };
  
  const pause = () => {
    pauseTrack();
    trackEvent('music_pause');
  };
  
  return {
    ...music,
    play,
    pause,
    setVolume,
    nextTrack,
    previousTrack,
    addToPlaylist,
    removeFromPlaylist,
  };
};

// Hook pour les émotions
export const useEmotions = () => {
  const { emotions, recordEmotion, addInsight, clearEmotionHistory } = useUnifiedStore();
  const { trackEvent, announceToScreenReader } = useUnifiedContext();
  
  const recordEmotionReading = (reading: EmotionReading) => {
    recordEmotion(reading);
    trackEvent('emotion_recorded', { 
      dominantEmotion: getDominantEmotion(reading.emotion),
      context: reading.context 
    });
    
    announceToScreenReader(`Émotion enregistrée: ${getDominantEmotion(reading.emotion)}`);
  };
  
  const getDominantEmotion = (emotion: Emotion): string => {
    const emotions = Object.entries(emotion).filter(([key]) => key !== 'timestamp');
    emotions.sort((a, b) => b[1] - a[1]);
    return emotions[0][0];
  };
  
  return {
    ...emotions,
    recordEmotion: recordEmotionReading,
    addInsight,
    clearEmotionHistory,
    getDominantEmotion,
  };
};

// Hook pour l'accessibilité
export const useAccessibility = () => {
  const { user, updateUserPreferences } = useUnifiedStore();
  const { announceToScreenReader, applyAccessibilityPreferences } = useUnifiedContext();
  
  const updateAccessibilitySettings = (settings: Partial<AccessibilitySettings>) => {
    updateUserPreferences({
      accessibility: { ...user?.preferences.accessibility, ...settings }
    });
    applyAccessibilityPreferences();
    announceToScreenReader('Paramètres d\'accessibilité mis à jour');
  };
  
  return {
    settings: user?.preferences.accessibility,
    updateSettings: updateAccessibilitySettings,
    announce: announceToScreenReader,
  };
};

export default UnifiedProvider;
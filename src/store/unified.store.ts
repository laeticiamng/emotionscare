/**
 * Unified Store - Centralizes all application state
 * Replaces redundant contexts with a single Zustand store
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { logger } from '@/lib/logger';

// Auth State
interface AuthState {
  user: any | null;
  session: any | null;
  isLoading: boolean;
  error: string | null;
}

// Theme State
interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  reducedMotion: boolean;
}

// Music State
interface MusicState {
  currentTrack: any | null;
  isPlaying: boolean;
  volume: number;
  playlist: any[];
  repeat: 'none' | 'one' | 'all';
  shuffle: boolean;
}

// Coach State
interface CoachState {
  conversations: any[];
  currentConversation: any | null;
  isLoading: boolean;
  preferences: {
    personality: 'empathetic' | 'analytical' | 'motivational';
    language: string;
    responseLength: 'short' | 'medium' | 'long';
  };
}

// Notifications State
interface NotificationState {
  notifications: any[];
  preferences: {
    push: boolean;
    email: boolean;
    sound: boolean;
    emailFrequency: 'immediate' | 'daily' | 'weekly';
  };
}

// Dashboard State
interface DashboardState {
  widgets: any[];
  layout: string;
  preferences: Record<string, any>;
}

// Combined Store State
interface AppStore extends AuthState, ThemeState, MusicState, CoachState, NotificationState, DashboardState {
  // Auth Actions
  setUser: (user: any) => void;
  setSession: (session: any) => void;
  setAuthLoading: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;
  signOut: () => void;

  // Theme Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;

  // Music Actions
  setCurrentTrack: (track: any) => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  addToPlaylist: (track: any) => void;
  removeFromPlaylist: (trackId: string) => void;
  setRepeat: (repeat: 'none' | 'one' | 'all') => void;
  toggleShuffle: () => void;

  // Coach Actions
  addConversation: (conversation: any) => void;
  setCurrentConversation: (conversation: any) => void;
  updateConversation: (id: string, updates: any) => void;
  deleteConversation: (id: string) => void;
  setCoachePreferences: (prefs: Partial<CoachState['preferences']>) => void;

  // Notifications Actions
  addNotification: (notification: any) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  setNotificationPreferences: (prefs: Partial<NotificationState['preferences']>) => void;

  // Dashboard Actions
  addWidget: (widget: any) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: any) => void;
  setDashboardLayout: (layout: string) => void;
  setDashboardPreferences: (prefs: Record<string, any>) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial Auth State
      user: null,
      session: null,
      isLoading: false,
      error: null,

      // Initial Theme State
      theme: 'system',
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false,

      // Initial Music State
      currentTrack: null,
      isPlaying: false,
      volume: 0.7,
      playlist: [],
      repeat: 'none',
      shuffle: false,

      // Initial Coach State
      conversations: [],
      currentConversation: null,
      preferences: {
        personality: 'empathetic',
        language: 'fr',
        responseLength: 'medium',
      },

      // Initial Notifications State
      notifications: [],
      preferences: {
        push: true,
        email: true,
        sound: true,
        emailFrequency: 'daily',
      },

      // Initial Dashboard State
      widgets: [],
      layout: 'grid',
      preferences: {},

      // Auth Actions
      setUser: (user) => {
        set({ user });
        logger.info('User updated', { userId: user?.id }, 'AUTH');
      },

      setSession: (session) => {
        set({ session });
        logger.info('Session updated', { hasSession: !!session }, 'AUTH');
      },

      setAuthLoading: (isLoading) => set({ isLoading }),

      setAuthError: (error) => {
        set({ error });
        if (error) logger.error('Auth error', { error }, 'AUTH');
      },

      signOut: () => {
        set({
          user: null,
          session: null,
          error: null,
          conversations: [],
          currentConversation: null,
        });
        logger.info('User signed out', {}, 'AUTH');
      },

      // Theme Actions
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.className = theme === 'dark' ? 'dark' : '';
        logger.debug('Theme changed', { theme }, 'THEME');
      },

      setFontSize: (fontSize) => {
        set({ fontSize });
        document.documentElement.style.fontSize = 
          fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px';
      },

      toggleHighContrast: () => {
        const { highContrast } = get();
        set({ highContrast: !highContrast });
        document.documentElement.classList.toggle('high-contrast', !highContrast);
      },

      toggleReducedMotion: () => {
        const { reducedMotion } = get();
        set({ reducedMotion: !reducedMotion });
        document.documentElement.classList.toggle('reduce-motion', !reducedMotion);
      },

      // Music Actions
      setCurrentTrack: (currentTrack) => {
        set({ currentTrack });
        logger.info('Track changed', { track: currentTrack?.title }, 'MUSIC');
      },

      togglePlayPause: () => {
        const { isPlaying } = get();
        set({ isPlaying: !isPlaying });
        logger.debug(`Music ${!isPlaying ? 'started' : 'paused'}`, {}, 'MUSIC');
      },

      setVolume: (volume) => {
        set({ volume: Math.max(0, Math.min(1, volume)) });
      },

      addToPlaylist: (track) => {
        const { playlist } = get();
        if (!playlist.find(t => t.id === track.id)) {
          set({ playlist: [...playlist, track] });
          logger.info('Track added to playlist', { track: track.title }, 'MUSIC');
        }
      },

      removeFromPlaylist: (trackId) => {
        const { playlist } = get();
        set({ playlist: playlist.filter(t => t.id !== trackId) });
      },

      setRepeat: (repeat) => set({ repeat }),
      toggleShuffle: () => {
        const { shuffle } = get();
        set({ shuffle: !shuffle });
      },

      // Coach Actions
      addConversation: (conversation) => {
        const { conversations } = get();
        set({ 
          conversations: [conversation, ...conversations],
          currentConversation: conversation 
        });
        logger.info('New coach conversation created', { id: conversation.id }, 'COACH');
      },

      setCurrentConversation: (currentConversation) => {
        set({ currentConversation });
      },

      updateConversation: (id, updates) => {
        const { conversations, currentConversation } = get();
        const updatedConversations = conversations.map(c => 
          c.id === id ? { ...c, ...updates } : c
        );
        set({ 
          conversations: updatedConversations,
          currentConversation: currentConversation?.id === id 
            ? { ...currentConversation, ...updates } 
            : currentConversation
        });
      },

      deleteConversation: (id) => {
        const { conversations, currentConversation } = get();
        set({
          conversations: conversations.filter(c => c.id !== id),
          currentConversation: currentConversation?.id === id ? null : currentConversation
        });
        logger.info('Coach conversation deleted', { id }, 'COACH');
      },

      setCoachePreferences: (prefs) => {
        const { preferences } = get();
        set({ preferences: { ...preferences, ...prefs } });
      },

      // Notifications Actions
      addNotification: (notification) => {
        const { notifications } = get();
        const newNotification = {
          ...notification,
          id: notification.id || Date.now().toString(),
          createdAt: new Date().toISOString(),
          read: false,
        };
        set({ notifications: [newNotification, ...notifications] });
        logger.info('Notification added', { type: notification.type }, 'NOTIFICATIONS');
      },

      removeNotification: (id) => {
        const { notifications } = get();
        set({ notifications: notifications.filter(n => n.id !== id) });
      },

      markAsRead: (id) => {
        const { notifications } = get();
        set({ 
          notifications: notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          )
        });
      },

      setNotificationPreferences: (prefs) => {
        const { preferences } = get();
        set({ preferences: { ...preferences, ...prefs } });
      },

      // Dashboard Actions
      addWidget: (widget) => {
        const { widgets } = get();
        set({ widgets: [...widgets, widget] });
      },

      removeWidget: (id) => {
        const { widgets } = get();
        set({ widgets: widgets.filter(w => w.id !== id) });
      },

      updateWidget: (id, updates) => {
        const { widgets } = get();
        set({ 
          widgets: widgets.map(w => 
            w.id === id ? { ...w, ...updates } : w
          )
        });
      },

      setDashboardLayout: (layout) => set({ layout }),

      setDashboardPreferences: (preferences) => {
        const current = get().preferences;
        set({ preferences: { ...current, ...preferences } });
      },
    }),
    {
      name: 'emotionscare-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist non-sensitive data
        theme: state.theme,
        fontSize: state.fontSize,
        highContrast: state.highContrast,
        reducedMotion: state.reducedMotion,
        volume: state.volume,
        repeat: state.repeat,
        shuffle: state.shuffle,
        preferences: state.preferences,
        layout: state.layout,
      }),
    }
  )
);

// Selectors for optimized re-renders
export const useAuth = () => useAppStore((state) => ({
  user: state.user,
  session: state.session,
  isLoading: state.isLoading,
  error: state.error,
  setUser: state.setUser,
  setSession: state.setSession,
  setAuthLoading: state.setAuthLoading,
  setAuthError: state.setAuthError,
  signOut: state.signOut,
}));

export const useTheme = () => useAppStore((state) => ({
  theme: state.theme,
  fontSize: state.fontSize,
  highContrast: state.highContrast,
  reducedMotion: state.reducedMotion,
  setTheme: state.setTheme,
  setFontSize: state.setFontSize,
  toggleHighContrast: state.toggleHighContrast,
  toggleReducedMotion: state.toggleReducedMotion,
}));

export const useMusic = () => useAppStore((state) => ({
  currentTrack: state.currentTrack,
  isPlaying: state.isPlaying,
  volume: state.volume,
  playlist: state.playlist,
  repeat: state.repeat,
  shuffle: state.shuffle,
  setCurrentTrack: state.setCurrentTrack,
  togglePlayPause: state.togglePlayPause,
  setVolume: state.setVolume,
  addToPlaylist: state.addToPlaylist,
  removeFromPlaylist: state.removeFromPlaylist,
  setRepeat: state.setRepeat,
  toggleShuffle: state.toggleShuffle,
}));

export const useCoach = () => useAppStore((state) => ({
  conversations: state.conversations,
  currentConversation: state.currentConversation,
  isLoading: state.isLoading,
  preferences: state.preferences,
  addConversation: state.addConversation,
  setCurrentConversation: state.setCurrentConversation,
  updateConversation: state.updateConversation,
  deleteConversation: state.deleteConversation,
  setCoachePreferences: state.setCoachePreferences,
}));

export const useNotifications = () => useAppStore((state) => ({
  notifications: state.notifications,
  preferences: state.preferences,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  markAsRead: state.markAsRead,
  setNotificationPreferences: state.setNotificationPreferences,
}));

export const useDashboard = () => useAppStore((state) => ({
  widgets: state.widgets,
  layout: state.layout,
  preferences: state.preferences,
  addWidget: state.addWidget,
  removeWidget: state.removeWidget,
  updateWidget: state.updateWidget,
  setDashboardLayout: state.setDashboardLayout,
  setDashboardPreferences: state.setDashboardPreferences,
}));
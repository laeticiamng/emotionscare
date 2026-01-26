/**
 * Unified Store - Centralizes all application state
 * Replaces redundant contexts with a single Zustand store
 */

import { create } from 'zustand';

import { persist } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';
import { logger } from '@/lib/logger';

// Generic types for store entities
interface UserData {
  id?: string;
  email?: string;
  [key: string]: unknown;
}

interface SessionData {
  access_token?: string;
  [key: string]: unknown;
}

// Auth State
interface AuthState {
  user: UserData | null;
  session: SessionData | null;
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
  coachPreferences: {
    personality: 'empathetic' | 'analytical' | 'motivational';
    language: string;
    responseLength: 'short' | 'medium' | 'long';
  };
}

// Notifications State
interface NotificationState {
  notifications: any[];
  notificationPreferences: {
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
  dashboardPreferences: Record<string, any>;
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
  setCoachPreferences: (prefs: Partial<CoachState['coachPreferences']>) => void;

  // Notifications Actions
  addNotification: (notification: any) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  setNotificationPreferences: (prefs: Partial<NotificationState['notificationPreferences']>) => void;

  // Dashboard Actions
  addWidget: (widget: any) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: any) => void;
  setDashboardLayout: (layout: string) => void;
  setDashboardPreferences: (prefs: Record<string, any>) => void;
}

const initialState: Pick<AppStore, 'user' | 'session' | 'isLoading' | 'error' | 'theme' | 'fontSize' | 'highContrast' | 'reducedMotion' | 'currentTrack' | 'isPlaying' | 'volume' | 'playlist' | 'repeat' | 'shuffle' | 'conversations' | 'currentConversation' | 'coachPreferences' | 'notifications' | 'notificationPreferences' | 'widgets' | 'layout' | 'dashboardPreferences'> = {
  // Initial Auth State
  user: null,
  session: null,
  isLoading: false,
  error: null,

  // Initial Theme State
  theme: 'system' as const,
  fontSize: 'medium' as const,
  highContrast: false,
  reducedMotion: false,

  // Initial Music State
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  playlist: [],
  repeat: 'none' as const,
  shuffle: false,

  // Initial Coach State
  conversations: [],
  currentConversation: null,
  coachPreferences: {
    personality: 'empathetic' as const,
    language: 'fr',
    responseLength: 'medium' as const,
  },

  // Initial Notifications State
  notifications: [],
  notificationPreferences: {
    push: true,
    email: true,
    sound: true,
    emailFrequency: 'daily' as const,
  },

  // Initial Dashboard State
  widgets: [],
  layout: 'grid',
  dashboardPreferences: {},
};

const unifiedStoreBase = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,

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

      setCoachPreferences: (prefs) => {
        const { coachPreferences } = get();
        set({ coachPreferences: { ...coachPreferences, ...prefs } });
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
        const { notificationPreferences } = get();
        set({ notificationPreferences: { ...notificationPreferences, ...prefs } });
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
        const current = get().dashboardPreferences;
        set({ dashboardPreferences: { ...current, ...preferences } });
      },
    }),
    {
      name: 'emotionscare-store',
      storage: () => localStorage,
      partialize: (state) => ({
        theme: state.theme,
        fontSize: state.fontSize,
        highContrast: state.highContrast,
        reducedMotion: state.reducedMotion,
        volume: state.volume,
        repeat: state.repeat,
        shuffle: state.shuffle,
        coachPreferences: state.coachPreferences,
        notificationPreferences: state.notificationPreferences,
        dashboardPreferences: state.dashboardPreferences,
        layout: state.layout,
      }),
    }
  )
);

export const useAppStore = createSelectors(unifiedStoreBase);

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
  coachPreferences: state.coachPreferences,
  addConversation: state.addConversation,
  setCurrentConversation: state.setCurrentConversation,
  updateConversation: state.updateConversation,
  deleteConversation: state.deleteConversation,
  setCoachPreferences: state.setCoachPreferences,
}));

export const useNotifications = () => useAppStore((state) => ({
  notifications: state.notifications,
  notificationPreferences: state.notificationPreferences,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  markAsRead: state.markAsRead,
  setNotificationPreferences: state.setNotificationPreferences,
}));

export const useDashboard = () => useAppStore((state) => ({
  widgets: state.widgets,
  layout: state.layout,
  dashboardPreferences: state.dashboardPreferences,
  addWidget: state.addWidget,
  removeWidget: state.removeWidget,
  updateWidget: state.updateWidget,
  setDashboardLayout: state.setDashboardLayout,
  setDashboardPreferences: state.setDashboardPreferences,
}));

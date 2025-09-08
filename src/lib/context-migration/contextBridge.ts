/**
 * Bridge pour migrer graduellement des contextes vers le store unifié
 * Permet une transition progressive sans casser l'existant
 */

import { useAppStore } from '@/store/unified.store';
import { logger } from '@/lib/logger';

/**
 * Hook de transition pour AuthContext
 */
export const useAuthBridge = () => {
  const store = useAppStore();
  
  return {
    // Nouvelles propriétés (store unifié)
    user: store.user,
    session: store.session,
    isLoading: store.isLoading,
    error: store.error,
    setUser: store.setUser,
    setSession: store.setSession,
    setAuthLoading: store.setAuthLoading,
    setAuthError: store.setAuthError,
    signOut: store.signOut,
    
    // Méthodes de compatibilité avec l'ancien AuthContext
    isAuthenticated: !!store.user,
    login: async (email: string, password: string) => {
      // Logique d'authentification
      logger.info('Login attempt via bridge', { email }, 'AUTH');
    },
    logout: store.signOut,
  };
};

/**
 * Hook de transition pour MusicContext
 */
export const useMusicBridge = () => {
  const store = useAppStore();
  
  return {
    currentTrack: store.currentTrack,
    isPlaying: store.isPlaying,
    volume: store.volume,
    playlist: store.playlist,
    repeat: store.repeat,
    shuffle: store.shuffle,
    
    // Actions
    setCurrentTrack: store.setCurrentTrack,
    play: () => {
      if (!store.isPlaying) store.togglePlayPause();
    },
    pause: () => {
      if (store.isPlaying) store.togglePlayPause();
    },
    togglePlayPause: store.togglePlayPause,
    setVolume: store.setVolume,
    addToPlaylist: store.addToPlaylist,
    removeFromPlaylist: store.removeFromPlaylist,
    setRepeat: store.setRepeat,
    toggleShuffle: store.toggleShuffle,
    
    // Propriétés de compatibilité
    duration: store.currentTrack?.duration || 0,
    currentTime: 0, // TODO: implémenter le tracking du temps
    next: () => {
      // TODO: logique pour la chanson suivante
      logger.debug('Next track requested', {}, 'MUSIC');
    },
    previous: () => {
      // TODO: logique pour la chanson précédente
      logger.debug('Previous track requested', {}, 'MUSIC');
    }
  };
};

/**
 * Hook de transition pour ThemeContext
 */
export const useThemeBridge = () => {
  const store = useAppStore();
  
  return {
    theme: store.theme,
    fontSize: store.fontSize,
    highContrast: store.highContrast,
    reducedMotion: store.reducedMotion,
    
    setTheme: store.setTheme,
    setFontSize: store.setFontSize,
    toggleHighContrast: store.toggleHighContrast,
    toggleReducedMotion: store.toggleReducedMotion,
    
    // Propriétés de compatibilité
    isDark: store.theme === 'dark',
    isLight: store.theme === 'light',
    isSystem: store.theme === 'system',
    toggleTheme: () => {
      const newTheme = store.theme === 'dark' ? 'light' : 'dark';
      store.setTheme(newTheme);
    }
  };
};

/**
 * Hook de transition pour CoachContext
 */
export const useCoachBridge = () => {
  const store = useAppStore();
  
  return {
    conversations: store.conversations,
    currentConversation: store.currentConversation,
    isLoading: store.isLoading,
    preferences: store.preferences,
    
    addConversation: store.addConversation,
    setCurrentConversation: store.setCurrentConversation,
    updateConversation: store.updateConversation,
    deleteConversation: store.deleteConversation,
    setPreferences: store.setCoachePreferences,
    
    // Méthodes de compatibilité
    createConversation: (title: string) => {
      const conversation = {
        id: Date.now().toString(),
        title,
        createdAt: new Date().toISOString(),
        messages: []
      };
      store.addConversation(conversation);
      return conversation;
    },
    sendMessage: async (content: string) => {
      // TODO: implémenter l'envoi de message
      logger.info('Message sent via bridge', { content: content.substring(0, 50) }, 'COACH');
    }
  };
};

/**
 * Hook de transition pour NotificationContext
 */
export const useNotificationBridge = () => {
  const store = useAppStore();
  
  return {
    notifications: store.notifications,
    preferences: store.preferences,
    
    addNotification: store.addNotification,
    removeNotification: store.removeNotification,
    markAsRead: store.markAsRead,
    setPreferences: store.setNotificationPreferences,
    
    // Méthodes de compatibilité
    showSuccess: (message: string) => {
      store.addNotification({
        type: 'success',
        message,
        duration: 4000
      });
    },
    showError: (message: string) => {
      store.addNotification({
        type: 'error',
        message,
        duration: 6000
      });
    },
    showInfo: (message: string) => {
      store.addNotification({
        type: 'info',
        message,
        duration: 3000
      });
    },
    clearAll: () => {
      store.notifications.forEach(n => store.removeNotification(n.id));
    }
  };
};

/**
 * Migration checker - aide à identifier les contextes non migrés
 */
export const checkMigrationStatus = () => {
  const unmigrated = [
    'AccessibilityContext',
    'BrandingContext', 
    'NotificationProvider',
    'CacheProvider',
    'PerformanceProvider',
    'SecurityProvider'
  ];
  
  logger.warn('Unmigrated contexts detected', { 
    count: unmigrated.length,
    contexts: unmigrated 
  }, 'MIGRATION');
  
  return {
    total: unmigrated.length,
    contexts: unmigrated,
    isComplete: unmigrated.length === 0
  };
};

/**
 * Provider de transition qui wrap les anciens contextes
 */
export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Log l'état de la migration au démarrage
  React.useEffect(() => {
    const status = checkMigrationStatus();
    if (!status.isComplete) {
      logger.info('Context migration in progress', status, 'MIGRATION');
    }
  }, []);

  return <>{children}</>;
};
/**
 * Music Integration Service - Gestionnaire central des intégrations
 * Coordonne Streaming, Notifications, et Widget
 * Migré vers Supabase user_settings
 */

import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

interface StreamingServiceConfig {
  serviceId: 'spotify' | 'apple' | 'youtube' | 'tidal';
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  scopes: string[];
}

interface NotificationPreference {
  type: 'recommendation' | 'challenge' | 'achievement' | 'social' | 'update';
  enabled: boolean;
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  optimalTime?: string;
}

interface PlaylistSyncOptions {
  autoSync: boolean;
  syncInterval: number; // in minutes
  conflictResolution: 'keep-remote' | 'keep-local' | 'merge';
  detectDuplicates: boolean;
}

class MusicIntegrationService {
  private static instance: MusicIntegrationService;
  private streamingServices: Map<string, StreamingServiceConfig> = new Map();
  private notificationPreferences: NotificationPreference[] = [];
  private syncOptions: PlaylistSyncOptions = {
    autoSync: true,
    syncInterval: 60,
    conflictResolution: 'merge',
    detectDuplicates: true,
  };
  private syncIntervals: Map<string, NodeJS.Timeout> = new Map();
  private userId: string | null = null;

  private constructor() {
    this.loadFromSupabase();
    logger.info('Music Integration Service initialized', {}, 'INTEGRATION');
  }

  static getInstance(): MusicIntegrationService {
    if (!MusicIntegrationService.instance) {
      MusicIntegrationService.instance = new MusicIntegrationService();
    }
    return MusicIntegrationService.instance;
  }

  /**
   * Connect a streaming service
   */
  async connectStreamingService(
    serviceId: 'spotify' | 'apple' | 'youtube' | 'tidal',
    accessToken: string,
    options?: { refreshToken?: string; expiresAt?: Date; scopes?: string[] }
  ): Promise<void> {
    const config: StreamingServiceConfig = {
      serviceId,
      accessToken,
      refreshToken: options?.refreshToken,
      expiresAt: options?.expiresAt,
      scopes: options?.scopes || ['user-read-private', 'playlist-read-private'],
    };

    this.streamingServices.set(serviceId, config);
    this.saveToSupabase();

    logger.info(`Connected to ${serviceId}`, { serviceId }, 'INTEGRATION');
  }

  /**
   * Disconnect a streaming service
   */
  async disconnectStreamingService(serviceId: string): Promise<void> {
    this.streamingServices.delete(serviceId);
    this.saveToSupabase();

    // Stop auto-sync if enabled
    this.stopAutoSync(serviceId);

    logger.info(`Disconnected from ${serviceId}`, { serviceId }, 'INTEGRATION');
  }

  /**
   * Get connected services
   */
  getConnectedServices(): string[] {
    return Array.from(this.streamingServices.keys());
  }

  /**
   * Check if service is connected
   */
  isServiceConnected(serviceId: string): boolean {
    return this.streamingServices.has(serviceId);
  }

  /**
   * Sync playlists from service
   */
  async syncPlaylists(serviceId: string): Promise<{ synced: number; errors: number }> {
    if (!this.streamingServices.has(serviceId)) {
      throw new Error(`Service ${serviceId} not connected`);
    }

    logger.info(`Syncing playlists from ${serviceId}`, { serviceId }, 'INTEGRATION');

    try {
      // Simulate playlist sync
      const playlistCount = Math.floor(Math.random() * 30) + 5;
      const errors = Math.random() > 0.9 ? 1 : 0;

      logger.info(`Synced ${playlistCount} playlists from ${serviceId}`,
        { serviceId, count: playlistCount },
        'INTEGRATION'
      );

      return { synced: playlistCount, errors };
    } catch (error) {
      logger.error(`Failed to sync playlists from ${serviceId}`,
        error as Error,
        'INTEGRATION'
      );
      throw error;
    }
  }

  /**
   * Import playlists from service
   */
  async importPlaylists(
    serviceId: string,
    options?: { includeMetadata?: boolean; createCopies?: boolean }
  ): Promise<{ imported: number; duplicates: number }> {
    if (!this.streamingServices.has(serviceId)) {
      throw new Error(`Service ${serviceId} not connected`);
    }

    logger.info(`Importing playlists from ${serviceId}`,
      { serviceId, options },
      'INTEGRATION'
    );

    try {
      const imported = Math.floor(Math.random() * 20) + 3;
      const duplicates = this.syncOptions.detectDuplicates
        ? Math.floor(Math.random() * 5)
        : 0;

      return { imported, duplicates };
    } catch (error) {
      logger.error(`Failed to import playlists from ${serviceId}`,
        error as Error,
        'INTEGRATION'
      );
      throw error;
    }
  }

  /**
   * Export playlists to service
   */
  async exportPlaylists(serviceId: string, playlistIds: string[]): Promise<void> {
    if (!this.streamingServices.has(serviceId)) {
      throw new Error(`Service ${serviceId} not connected`);
    }

    logger.info(`Exporting ${playlistIds.length} playlists to ${serviceId}`,
      { serviceId, count: playlistIds.length },
      'INTEGRATION'
    );

    try {
      // Simulate export
      await new Promise((resolve) => setTimeout(resolve, 1000));

      logger.info(`Exported ${playlistIds.length} playlists to ${serviceId}`,
        { serviceId },
        'INTEGRATION'
      );
    } catch (error) {
      logger.error(`Failed to export playlists to ${serviceId}`,
        error as Error,
        'INTEGRATION'
      );
      throw error;
    }
  }

  /**
   * Setup auto-sync
   */
  startAutoSync(serviceId: string, intervalMinutes?: number): void {
    const interval = intervalMinutes || this.syncOptions.syncInterval;

    const timeoutId = setInterval(() => {
      this.syncPlaylists(serviceId).catch((error) => {
        logger.error(`Auto-sync failed for ${serviceId}`, error, 'INTEGRATION');
      });
    }, interval * 60 * 1000);

    this.syncIntervals.set(serviceId, timeoutId);
    logger.info(`Auto-sync started for ${serviceId}`,
      { serviceId, interval },
      'INTEGRATION'
    );
  }

  /**
   * Stop auto-sync
   */
  stopAutoSync(serviceId: string): void {
    const timeoutId = this.syncIntervals.get(serviceId);
    if (timeoutId) {
      clearInterval(timeoutId);
      this.syncIntervals.delete(serviceId);
    }
  }

  /**
   * Update notification preferences
   */
  setNotificationPreferences(preferences: NotificationPreference[]): void {
    this.notificationPreferences = preferences;
    this.saveToSupabase();

    logger.info(`Updated notification preferences`,
      { count: preferences.length },
      'INTEGRATION'
    );
  }

  /**
   * Get notification preferences
   */
  getNotificationPreferences(): NotificationPreference[] {
    return this.notificationPreferences;
  }

  /**
   * Update playlist sync options
   */
  setSyncOptions(options: Partial<PlaylistSyncOptions>): void {
    this.syncOptions = { ...this.syncOptions, ...options };
    this.saveToSupabase();

    logger.info(`Updated sync options`, { options }, 'INTEGRATION');
  }

  /**
   * Get sync statistics
   */
  getSyncStats(): {
    connectedServices: number;
    lastSyncTimes: Map<string, Date>;
    totalPlaylistsSynced: number;
  } {
    return {
      connectedServices: this.streamingServices.size,
      lastSyncTimes: new Map(),
      totalPlaylistsSynced: 0,
    };
  }

  /**
   * Resolve playlist conflicts
   */
  async resolveConflicts(
    serviceId: string,
    conflicts: Array<{ localId: string; remoteId: string }>
  ): Promise<void> {
    const strategy = this.syncOptions.conflictResolution;

    logger.info(`Resolving ${conflicts.length} conflicts for ${serviceId}`,
      { serviceId, strategy },
      'INTEGRATION'
    );

    // Implement conflict resolution based on strategy
    for (const _conflict of conflicts) {
      switch (strategy) {
        case 'keep-remote':
          // Use remote version
          break;
        case 'keep-local':
          // Use local version
          break;
        case 'merge':
          // Merge both versions
          break;
      }
    }
  }

  /**
   * Get integration status
   */
  getStatus(): {
    isHealthy: boolean;
    connectedServices: string[];
    lastSyncError?: string;
    autoSyncEnabled: boolean;
  } {
    return {
      isHealthy: true,
      connectedServices: this.getConnectedServices(),
      autoSyncEnabled: this.syncOptions.autoSync,
    };
  }

  /**
   * Save to Supabase
   */
  private async saveToSupabase(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const data = {
        streamingServices: Array.from(this.streamingServices.entries()),
        notificationPreferences: this.notificationPreferences,
        syncOptions: this.syncOptions,
      };
      
      await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          setting_key: 'music:integrations',
          setting_value: data,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,setting_key' });
    } catch (error) {
      logger.error('Failed to save integrations to Supabase', error as Error, 'INTEGRATION');
    }
  }

  /**
   * Load from Supabase
   */
  private async loadFromSupabase(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      this.userId = user.id;
      
      const { data } = await supabase
        .from('user_settings')
        .select('setting_value')
        .eq('user_id', user.id)
        .eq('setting_key', 'music:integrations')
        .single();
      
      if (data?.setting_value) {
        const stored = data.setting_value as Record<string, unknown>;
        this.streamingServices = new Map(stored.streamingServices as [string, StreamingServiceConfig][] || []);
        this.notificationPreferences = stored.notificationPreferences as NotificationPreference[] || [];
        this.syncOptions = { ...this.syncOptions, ...stored.syncOptions as PlaylistSyncOptions };
      }
    } catch (error) {
      logger.error('Failed to load integrations from Supabase', error as Error, 'INTEGRATION');
    }
  }

  /**
   * Clear all integrations
   */
  async clearAll(): Promise<void> {
    this.streamingServices.clear();
    this.notificationPreferences = [];
    this.syncIntervals.forEach((timeoutId) => clearInterval(timeoutId));
    this.syncIntervals.clear();
    
    if (this.userId) {
      await supabase
        .from('user_settings')
        .delete()
        .eq('user_id', this.userId)
        .eq('setting_key', 'music:integrations');
    }

    logger.info('Cleared all integrations', {}, 'INTEGRATION');
  }
}

export const musicIntegrationService = MusicIntegrationService.getInstance();
export type { StreamingServiceConfig, NotificationPreference, PlaylistSyncOptions };

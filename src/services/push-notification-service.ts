import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, type Messaging } from 'firebase/messaging';

// Configuration Firebase (à remplacer par vos vraies valeurs)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export interface PushNotification {
  id: string;
  user_id: string;
  notification_type: 'guild_invite' | 'duel_challenge' | 'tournament_match' | 'reward_unlocked' | 'challenge_completed' | 'level_up';
  title: string;
  body: string;
  data: Record<string, any>;
  status: 'pending' | 'sent' | 'failed' | 'read';
  sent_at: string | null;
  read_at: string | null;
  created_at: string;
}

class PushNotificationService {
  private messaging: Messaging | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize Firebase only if config is available
      if (firebaseConfig.apiKey) {
        const app = initializeApp(firebaseConfig);
        this.messaging = getMessaging(app);
        this.isInitialized = true;
        logger.info('Firebase messaging initialized', 'PushNotificationService');
      } else {
        logger.warn('Firebase config not found, push notifications disabled', 'PushNotificationService');
      }
    } catch (error) {
      logger.error('Error initializing Firebase', error as Error, 'PushNotificationService');
    }
  }

  async requestPermission(): Promise<boolean> {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      logger.error('Error requesting notification permission', error as Error, 'PushNotificationService');
      return false;
    }
  }

  async registerDevice(): Promise<boolean> {
    try {
      await this.initialize();
      if (!this.messaging) return false;

      const permission = await this.requestPermission();
      if (!permission) return false;

      const token = await getToken(this.messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });

      if (token) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        // Save token to database
        await supabase
          .from('fcm_tokens')
          .upsert({
            user_id: user.id,
            token,
            device_type: 'web',
            last_used_at: new Date().toISOString(),
          });

        logger.info('FCM token registered', 'PushNotificationService');
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Error registering device', error as Error, 'PushNotificationService');
      return false;
    }
  }

  async createNotification(
    userId: string,
    type: PushNotification['notification_type'],
    title: string,
    body: string,
    data: Record<string, any> = {}
  ): Promise<PushNotification | null> {
    try {
      const { data: notification, error } = await supabase
        .from('push_notifications')
        .insert({
          user_id: userId,
          notification_type: type,
          title,
          body,
          data,
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger notification via Supabase Edge Function
      await this.sendNotification(notification.id);

      return notification;
    } catch (error) {
      logger.error('Error creating notification', error as Error, 'PushNotificationService');
      return null;
    }
  }

  async sendNotification(notificationId: string): Promise<boolean> {
    try {
      // Call edge function to send push notification
      const { error } = await supabase.functions.invoke('send-push-notification', {
        body: { notificationId },
      });

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error sending notification', error as Error, 'PushNotificationService');
      return false;
    }
  }

  async getUserNotifications(limit: number = 50): Promise<PushNotification[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('push_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching notifications', error as Error, 'PushNotificationService');
      return [];
    }
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('push_notifications')
        .update({
          status: 'read',
          read_at: new Date().toISOString(),
        })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error marking notification as read', error as Error, 'PushNotificationService');
      return false;
    }
  }

  listenToMessages(callback: (payload: any) => void): void {
    if (!this.messaging) return;

    onMessage(this.messaging, (payload) => {
      logger.info('Message received', 'PushNotificationService');
      callback(payload);
    });
  }

  async subscribeToNotifications(callback: (notification: PushNotification) => void) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return () => {};

    const channel = supabase
      .channel('push_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'push_notifications',
        },
        (payload) => {
          if (payload.new.user_id === user.id) {
            callback(payload.new as PushNotification);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  // Helper methods for specific notification types
  async notifyGuildInvite(userId: string, guildName: string, guildId: string): Promise<void> {
    await this.createNotification(
      userId,
      'guild_invite',
      'Invitation à une guilde',
      `Vous avez été invité à rejoindre la guilde "${guildName}"`,
      { guildId }
    );
  }

  async notifyDuelChallenge(userId: string, challengerName: string, duelId: string): Promise<void> {
    await this.createNotification(
      userId,
      'duel_challenge',
      'Nouveau défi !',
      `${challengerName} vous a défié en duel !`,
      { duelId }
    );
  }

  async notifyTournamentMatch(userId: string, opponentName: string, matchId: string): Promise<void> {
    await this.createNotification(
      userId,
      'tournament_match',
      'Match de tournoi',
      `Votre match contre ${opponentName} commence bientôt !`,
      { matchId }
    );
  }

  async notifyRewardUnlocked(userId: string, rewardName: string, rewardId: string): Promise<void> {
    await this.createNotification(
      userId,
      'reward_unlocked',
      'Récompense débloquée !',
      `Vous avez débloqué "${rewardName}" !`,
      { rewardId }
    );
  }

  async notifyChallengeCompleted(userId: string, challengeName: string, xpReward: number): Promise<void> {
    await this.createNotification(
      userId,
      'challenge_completed',
      'Défi terminé !',
      `Vous avez complété "${challengeName}" et gagné ${xpReward} XP !`,
      { xpReward }
    );
  }

  async notifyLevelUp(userId: string, newLevel: number): Promise<void> {
    await this.createNotification(
      userId,
      'level_up',
      'Niveau atteint !',
      `Félicitations ! Vous avez atteint le niveau ${newLevel} !`,
      { level: newLevel }
    );
  }
}

export const pushNotificationService = new PushNotificationService();

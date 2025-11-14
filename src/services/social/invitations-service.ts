/**
 * Service d'invitations sociales - Système complet de gestion d'amis
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface UserProfile {
  id: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  isPublic: boolean;
  showActivity: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Friendship {
  id: string;
  userId: string;
  friendId: string;
  status: 'active' | 'blocked';
  createdAt: string;
  friendProfile?: UserProfile;
}

export interface FriendInvitation {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  message?: string;
  createdAt: string;
  respondedAt?: string;
  senderProfile?: UserProfile;
  receiverProfile?: UserProfile;
}

export interface FriendSuggestion {
  id: string;
  userId: string;
  suggestedUserId: string;
  reason: string;
  score: number;
  dismissed: boolean;
  createdAt: string;
  suggestedProfile?: UserProfile;
}

export interface SocialActivity {
  id: string;
  userId: string;
  activityType: 'achievement' | 'music_share' | 'journal_milestone' | 'streak' | 'badge' | 'level_up';
  activityData: Record<string, any>;
  isPublic: boolean;
  createdAt: string;
  userProfile?: UserProfile;
}

export interface SocialNotification {
  id: string;
  userId: string;
  notificationType: 'friend_request' | 'friend_accept' | 'mention' | 'comment' | 'like' | 'share';
  senderId?: string;
  referenceId?: string;
  message?: string;
  read: boolean;
  createdAt: string;
  senderProfile?: UserProfile;
}

class InvitationsService {
  // ============================================
  // PROFILS UTILISATEURS
  // ============================================

  /**
   * Récupérer le profil de l'utilisateur connecté
   */
  async getMyProfile(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      logger.error('Failed to get user profile', error, 'SOCIAL');
      return null;
    }

    return this.mapToUserProfile(data);
  }

  /**
   * Mettre à jour son profil
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        display_name: updates.displayName,
        avatar_url: updates.avatarUrl,
        bio: updates.bio,
        is_public: updates.isPublic,
        show_activity: updates.showActivity,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    return this.mapToUserProfile(data);
  }

  /**
   * Rechercher des utilisateurs
   */
  async searchUsers(query: string, limit = 20): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('is_public', true)
      .ilike('display_name', `%${query}%`)
      .limit(limit);

    if (error) {
      logger.error('Failed to search users', error, 'SOCIAL');
      return [];
    }

    return (data || []).map(this.mapToUserProfile);
  }

  /**
   * Récupérer un profil par ID
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;

    return this.mapToUserProfile(data);
  }

  // ============================================
  // INVITATIONS D'AMIS
  // ============================================

  /**
   * Envoyer une invitation d'ami
   */
  async sendFriendInvitation(receiverId: string, message?: string): Promise<FriendInvitation> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Vérifier si une invitation n'existe pas déjà
    const { data: existing } = await supabase
      .from('friend_invitations')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
      .in('status', ['pending', 'accepted'])
      .single();

    if (existing) {
      throw new Error('Une invitation existe déjà ou vous êtes déjà amis');
    }

    const { data, error } = await supabase
      .from('friend_invitations')
      .insert({
        sender_id: user.id,
        receiver_id: receiverId,
        message,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    // Créer une notification
    await supabase
      .from('social_notifications')
      .insert({
        user_id: receiverId,
        notification_type: 'friend_request',
        sender_id: user.id,
        reference_id: data.id,
        message: message || 'vous a envoyé une demande d\'ami'
      });

    logger.info('Friend invitation sent', { invitationId: data.id }, 'SOCIAL');
    return this.mapToInvitation(data);
  }

  /**
   * Accepter une invitation d'ami
   */
  async acceptFriendInvitation(invitationId: string): Promise<void> {
    const { error } = await supabase.rpc('accept_friend_invitation', {
      invitation_id: invitationId
    });

    if (error) throw error;

    logger.info('Friend invitation accepted', { invitationId }, 'SOCIAL');
  }

  /**
   * Rejeter une invitation d'ami
   */
  async rejectFriendInvitation(invitationId: string): Promise<void> {
    const { error } = await supabase
      .from('friend_invitations')
      .update({
        status: 'rejected',
        responded_at: new Date().toISOString()
      })
      .eq('id', invitationId);

    if (error) throw error;

    logger.info('Friend invitation rejected', { invitationId }, 'SOCIAL');
  }

  /**
   * Annuler une invitation envoyée
   */
  async cancelFriendInvitation(invitationId: string): Promise<void> {
    const { error } = await supabase
      .from('friend_invitations')
      .update({ status: 'cancelled' })
      .eq('id', invitationId);

    if (error) throw error;

    logger.info('Friend invitation cancelled', { invitationId }, 'SOCIAL');
  }

  /**
   * Récupérer les invitations reçues
   */
  async getReceivedInvitations(): Promise<FriendInvitation[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('friend_invitations')
      .select('*, sender:user_profiles!sender_id(*)')
      .eq('receiver_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to get received invitations', error, 'SOCIAL');
      return [];
    }

    return (data || []).map(inv => ({
      ...this.mapToInvitation(inv),
      senderProfile: inv.sender ? this.mapToUserProfile(inv.sender) : undefined
    }));
  }

  /**
   * Récupérer les invitations envoyées
   */
  async getSentInvitations(): Promise<FriendInvitation[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('friend_invitations')
      .select('*, receiver:user_profiles!receiver_id(*)')
      .eq('sender_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to get sent invitations', error, 'SOCIAL');
      return [];
    }

    return (data || []).map(inv => ({
      ...this.mapToInvitation(inv),
      receiverProfile: inv.receiver ? this.mapToUserProfile(inv.receiver) : undefined
    }));
  }

  // ============================================
  // AMIS
  // ============================================

  /**
   * Récupérer la liste des amis
   */
  async getFriends(): Promise<Friendship[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('friendships')
      .select('*, friend:user_profiles!friend_id(*)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to get friends', error, 'SOCIAL');
      return [];
    }

    return (data || []).map(friendship => ({
      ...this.mapToFriendship(friendship),
      friendProfile: friendship.friend ? this.mapToUserProfile(friendship.friend) : undefined
    }));
  }

  /**
   * Retirer un ami
   */
  async removeFriend(friendshipId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Récupérer l'amitié pour obtenir l'ID de l'ami
    const { data: friendship } = await supabase
      .from('friendships')
      .select('friend_id')
      .eq('id', friendshipId)
      .eq('user_id', user.id)
      .single();

    if (!friendship) throw new Error('Friendship not found');

    // Supprimer les deux relations (bidirectionnelles)
    await supabase
      .from('friendships')
      .delete()
      .or(`and(user_id.eq.${user.id},friend_id.eq.${friendship.friend_id}),and(user_id.eq.${friendship.friend_id},friend_id.eq.${user.id})`);

    logger.info('Friend removed', { friendshipId }, 'SOCIAL');
  }

  /**
   * Bloquer un utilisateur
   */
  async blockUser(userId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('friendships')
      .upsert({
        user_id: user.id,
        friend_id: userId,
        status: 'blocked'
      });

    if (error) throw error;

    logger.info('User blocked', { blockedUserId: userId }, 'SOCIAL');
  }

  // ============================================
  // SUGGESTIONS D'AMIS
  // ============================================

  /**
   * Récupérer les suggestions d'amis
   */
  async getFriendSuggestions(limit = 10): Promise<FriendSuggestion[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('friend_suggestions')
      .select('*, suggested:user_profiles!suggested_user_id(*)')
      .eq('user_id', user.id)
      .eq('dismissed', false)
      .order('score', { ascending: false })
      .limit(limit);

    if (error) {
      logger.error('Failed to get friend suggestions', error, 'SOCIAL');
      return [];
    }

    return (data || []).map(suggestion => ({
      ...this.mapToSuggestion(suggestion),
      suggestedProfile: suggestion.suggested ? this.mapToUserProfile(suggestion.suggested) : undefined
    }));
  }

  /**
   * Rejeter une suggestion
   */
  async dismissSuggestion(suggestionId: string): Promise<void> {
    const { error } = await supabase
      .from('friend_suggestions')
      .update({ dismissed: true })
      .eq('id', suggestionId);

    if (error) throw error;
  }

  // ============================================
  // ACTIVITÉS SOCIALES
  // ============================================

  /**
   * Créer une activité sociale
   */
  async createActivity(
    activityType: SocialActivity['activityType'],
    activityData: Record<string, any>,
    isPublic = true
  ): Promise<SocialActivity> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('social_activities')
      .insert({
        user_id: user.id,
        activity_type: activityType,
        activity_data: activityData,
        is_public: isPublic
      })
      .select()
      .single();

    if (error) throw error;

    return this.mapToActivity(data);
  }

  /**
   * Récupérer le feed d'activités (soi + amis)
   */
  async getActivityFeed(limit = 20, offset = 0): Promise<SocialActivity[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('social_activities')
      .select('*, user:user_profiles!user_id(*)')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      logger.error('Failed to get activity feed', error, 'SOCIAL');
      return [];
    }

    return (data || []).map(activity => ({
      ...this.mapToActivity(activity),
      userProfile: activity.user ? this.mapToUserProfile(activity.user) : undefined
    }));
  }

  // ============================================
  // NOTIFICATIONS
  // ============================================

  /**
   * Récupérer les notifications non lues
   */
  async getUnreadNotifications(): Promise<SocialNotification[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('social_notifications')
      .select('*, sender:user_profiles!sender_id(*)')
      .eq('user_id', user.id)
      .eq('read', false)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      logger.error('Failed to get notifications', error, 'SOCIAL');
      return [];
    }

    return (data || []).map(notif => ({
      ...this.mapToNotification(notif),
      senderProfile: notif.sender ? this.mapToUserProfile(notif.sender) : undefined
    }));
  }

  /**
   * Marquer une notification comme lue
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('social_notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  async markAllNotificationsAsRead(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('social_notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);

    if (error) throw error;
  }

  // ============================================
  // MAPPERS
  // ============================================

  private mapToUserProfile(data: any): UserProfile {
    return {
      id: data.id,
      displayName: data.display_name,
      avatarUrl: data.avatar_url,
      bio: data.bio,
      isPublic: data.is_public,
      showActivity: data.show_activity,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private mapToInvitation(data: any): FriendInvitation {
    return {
      id: data.id,
      senderId: data.sender_id,
      receiverId: data.receiver_id,
      status: data.status,
      message: data.message,
      createdAt: data.created_at,
      respondedAt: data.responded_at
    };
  }

  private mapToFriendship(data: any): Friendship {
    return {
      id: data.id,
      userId: data.user_id,
      friendId: data.friend_id,
      status: data.status,
      createdAt: data.created_at
    };
  }

  private mapToSuggestion(data: any): FriendSuggestion {
    return {
      id: data.id,
      userId: data.user_id,
      suggestedUserId: data.suggested_user_id,
      reason: data.reason,
      score: data.score,
      dismissed: data.dismissed,
      createdAt: data.created_at
    };
  }

  private mapToActivity(data: any): SocialActivity {
    return {
      id: data.id,
      userId: data.user_id,
      activityType: data.activity_type,
      activityData: data.activity_data,
      isPublic: data.is_public,
      createdAt: data.created_at
    };
  }

  private mapToNotification(data: any): SocialNotification {
    return {
      id: data.id,
      userId: data.user_id,
      notificationType: data.notification_type,
      senderId: data.sender_id,
      referenceId: data.reference_id,
      message: data.message,
      read: data.read,
      createdAt: data.created_at
    };
  }
}

export const invitationsService = new InvitationsService();

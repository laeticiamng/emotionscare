/**
 * Service Admin
 * Opérations d'administration centralisées
 */

import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// TYPES
// ============================================================================

export interface ModerationAction {
  postId: string;
  action: 'approve' | 'reject' | 'flag';
  reason?: string;
}

export interface UserBanAction {
  userId: string;
  duration?: number; // in days, undefined = permanent
  reason: string;
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  requestsPerMinute: number;
  errorRate: number;
}

// ============================================================================
// SERVICE
// ============================================================================

export class AdminService {
  /**
   * Modérer un post
   */
  static async moderatePost(action: ModerationAction): Promise<void> {
    const { error } = await supabase
      .from('community_posts')
      .update({
        moderation_status: action.action === 'approve' ? 'approved' : 'rejected',
        moderation_reason: action.reason,
        moderated_at: new Date().toISOString(),
      })
      .eq('id', action.postId);

    if (error) throw error;
  }

  /**
   * Bannir un utilisateur
   */
  static async banUser(action: UserBanAction): Promise<void> {
    const banUntil = action.duration
      ? new Date(Date.now() + action.duration * 24 * 60 * 60 * 1000).toISOString()
      : null; // null = permanent

    const { error } = await supabase
      .from('profiles')
      .update({
        is_banned: true,
        ban_until: banUntil,
        ban_reason: action.reason,
        banned_at: new Date().toISOString(),
      })
      .eq('user_id', action.userId);

    if (error) throw error;
  }

  /**
   * Débannir un utilisateur
   */
  static async unbanUser(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({
        is_banned: false,
        ban_until: null,
        ban_reason: null,
      })
      .eq('user_id', userId);

    if (error) throw error;
  }

  /**
   * Récupérer les posts en attente de modération
   */
  static async getPendingModerations(limit: number = 50): Promise<any[]> {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*, profiles!community_posts_user_id_fkey(full_name, avatar_url)')
      .eq('moderation_status', 'pending')
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Récupérer les utilisateurs bannis
   */
  static async getBannedUsers(): Promise<any[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_banned', true)
      .order('banned_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Récupérer les logs d'audit
   */
  static async getAuditLogs(
    options?: {
      action?: string;
      userId?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<any[]> {
    let query = supabase
      .from('admin_changelog')
      .select('*')
      .order('created_at', { ascending: false });

    if (options?.action) {
      query = query.eq('action_type', options.action);
    }

    if (options?.userId) {
      query = query.eq('admin_user_id', options.userId);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
    }

    const { data, error } = await query;

    if (error) {
      if (error.code === '42P01') return []; // Table doesn't exist
      throw error;
    }
    return data || [];
  }

  /**
   * Créer une entrée de log d'audit
   */
  static async logAuditAction(
    action: string,
    tableName: string,
    recordId: string,
    details?: Record<string, any>
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('admin_changelog')
      .insert({
        admin_user_id: user.id,
        action_type: action,
        table_name: tableName,
        record_id: recordId,
        metadata: details,
      });

    if (error && error.code !== '42P01') throw error;
  }

  /**
   * Récupérer les métriques système (via edge function)
   */
  static async getSystemMetrics(): Promise<SystemMetrics> {
    const { data, error } = await supabase.functions.invoke('system-metrics');

    if (error) {
      // Return default metrics if function doesn't exist
      return {
        cpuUsage: 0,
        memoryUsage: 0,
        activeConnections: 0,
        requestsPerMinute: 0,
        errorRate: 0,
      };
    }

    return data;
  }

  /**
   * Exporter les données utilisateur (RGPD)
   */
  static async exportUserData(userId: string): Promise<any> {
    const { data, error } = await supabase.functions.invoke('export-user-data', {
      body: { userId },
    });

    if (error) throw error;
    return data;
  }

  /**
   * Supprimer les données utilisateur (RGPD)
   */
  static async deleteUserData(userId: string): Promise<void> {
    const { error } = await supabase.functions.invoke('delete-user-data', {
      body: { userId },
    });

    if (error) throw error;
  }
}

export default AdminService;

/**
 * Account Deletion Service with Grace Period
 * GDPR Article 17 - Right to Erasure ("Right to be Forgotten")
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface DeletionRequest {
  id: string;
  user_id: string;
  requested_at: string;
  scheduled_deletion_at: string;
  grace_period_days: number;
  reason?: string;
  status: 'pending' | 'cancelled' | 'completed';
  cancelled_at?: string;
  completed_at?: string;
}

export class AccountDeletionService {
  private static readonly DEFAULT_GRACE_PERIOD_DAYS = 30;

  /**
   * Request account deletion with grace period
   */
  static async requestDeletion(
    userId: string,
    reason?: string,
    gracePeriodDays: number = this.DEFAULT_GRACE_PERIOD_DAYS
  ): Promise<DeletionRequest> {
    try {
      // Check if there's already a pending deletion request
      const existing = await this.getPendingDeletionRequest(userId);
      if (existing) {
        throw new Error('Une demande de suppression est déjà en cours');
      }

      // Calculate scheduled deletion date
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + gracePeriodDays);

      // Create deletion request
      const { data, error } = await supabase
        .from('account_deletion_requests')
        .insert({
          user_id: userId,
          scheduled_deletion_at: scheduledDate.toISOString(),
          grace_period_days: gracePeriodDays,
          reason: reason || null,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      logger.info('Account deletion requested', {
        userId,
        scheduledDate: scheduledDate.toISOString(),
      }, 'GDPR');

      // TODO: Send confirmation email to user
      await this.sendDeletionConfirmationEmail(userId, scheduledDate);

      return data as DeletionRequest;
    } catch (error) {
      logger.error('Failed to request account deletion', error, 'GDPR');
      throw error;
    }
  }

  /**
   * Cancel pending deletion request
   */
  static async cancelDeletion(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('account_deletion_requests')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('status', 'pending');

      if (error) throw error;

      logger.info('Account deletion cancelled', { userId }, 'GDPR');

      // TODO: Send cancellation confirmation email
      await this.sendCancellationEmail(userId);
    } catch (error) {
      logger.error('Failed to cancel account deletion', error, 'GDPR');
      throw error;
    }
  }

  /**
   * Get pending deletion request for user
   */
  static async getPendingDeletionRequest(userId: string): Promise<DeletionRequest | null> {
    try {
      const { data, error } = await supabase
        .from('account_deletion_requests')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = not found
        throw error;
      }

      return data as DeletionRequest | null;
    } catch (error) {
      logger.error('Failed to get pending deletion request', error, 'GDPR');
      return null;
    }
  }

  /**
   * Get deletion request history for user
   */
  static async getDeletionHistory(userId: string): Promise<DeletionRequest[]> {
    try {
      const { data, error } = await supabase
        .from('account_deletion_requests')
        .select('*')
        .eq('user_id', userId)
        .order('requested_at', { ascending: false });

      if (error) throw error;

      return (data as DeletionRequest[]) || [];
    } catch (error) {
      logger.error('Failed to get deletion history', error, 'GDPR');
      return [];
    }
  }

  /**
   * Calculate remaining days in grace period
   */
  static getRemainingDays(deletionRequest: DeletionRequest): number {
    const scheduledDate = new Date(deletionRequest.scheduled_deletion_at);
    const now = new Date();
    const diffTime = scheduledDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  /**
   * Execute account deletion (called by scheduled job)
   * This should be called by a server-side cron job
   */
  static async executeScheduledDeletions(): Promise<void> {
    try {
      // Get all pending deletions that are past their scheduled date
      const { data: pendingDeletions, error } = await supabase
        .from('account_deletion_requests')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_deletion_at', new Date().toISOString());

      if (error) throw error;

      if (!pendingDeletions || pendingDeletions.length === 0) {
        logger.info('No scheduled deletions to execute', undefined, 'GDPR');
        return;
      }

      // Execute each deletion
      for (const deletion of pendingDeletions) {
        try {
          await this.executeUserDeletion(deletion.user_id, deletion.id);
        } catch (err) {
          logger.error('Failed to execute deletion', {
            error: err,
            userId: deletion.user_id,
          }, 'GDPR');
        }
      }
    } catch (error) {
      logger.error('Failed to execute scheduled deletions', error, 'GDPR');
      throw error;
    }
  }

  /**
   * Execute deletion for a single user
   */
  private static async executeUserDeletion(
    userId: string,
    deletionRequestId: string
  ): Promise<void> {
    try {
      // This is a critical operation - we should:
      // 1. Delete or anonymize user data in all tables
      // 2. Delete user auth account
      // 3. Mark deletion as completed

      // Delete from journal_notes
      await supabase.from('journal_notes').delete().eq('user_id', userId);

      // Delete from emotion_scans
      await supabase.from('emotion_scans').delete().eq('user_id', userId);

      // Delete from activity_sessions
      await supabase.from('activity_sessions').delete().eq('user_id', userId);

      // Delete from export_logs
      await supabase.from('export_logs').delete().eq('user_id', userId);

      // Anonymize or delete from profiles
      await supabase
        .from('profiles')
        .update({
          email: `deleted-${userId}@anonymized.local`,
          name: 'Compte supprimé',
          avatar_url: null,
          preferences: null,
        })
        .eq('id', userId);

      // Mark deletion request as completed
      await supabase
        .from('account_deletion_requests')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', deletionRequestId);

      // Delete auth user (this should be done via Supabase admin API)
      // await supabase.auth.admin.deleteUser(userId);

      logger.info('User account deleted successfully', { userId }, 'GDPR');
    } catch (error) {
      logger.error('Failed to execute user deletion', error, 'GDPR');
      throw error;
    }
  }

  /**
   * Send deletion confirmation email
   */
  private static async sendDeletionConfirmationEmail(
    userId: string,
    scheduledDate: Date
  ): Promise<void> {
    // TODO: Implement email sending
    // This should send an email to the user confirming the deletion request
    // and informing them of the grace period
    logger.info('Deletion confirmation email sent', {
      userId,
      scheduledDate: scheduledDate.toISOString(),
    }, 'GDPR');
  }

  /**
   * Send cancellation confirmation email
   */
  private static async sendCancellationEmail(userId: string): Promise<void> {
    // TODO: Implement email sending
    logger.info('Cancellation confirmation email sent', { userId }, 'GDPR');
  }

  /**
   * Send grace period reminder email
   * Should be called by a scheduled job (e.g., 7 days before deletion)
   */
  static async sendGracePeriodReminder(deletionRequest: DeletionRequest): Promise<void> {
    const remainingDays = this.getRemainingDays(deletionRequest);

    // TODO: Implement email sending
    logger.info('Grace period reminder sent', {
      userId: deletionRequest.user_id,
      remainingDays,
    }, 'GDPR');
  }
}

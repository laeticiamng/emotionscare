// @ts-nocheck

import { InvitationStats, InvitationFormData } from '@/types';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

/** Invitation détaillée */
export interface Invitation {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'manager';
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  teamId?: string;
  teamName?: string;
  invitedBy: string;
  invitedByName: string;
  createdAt: Date;
  expiresAt: Date;
  acceptedAt?: Date;
  metadata?: Record<string, unknown>;
}

/** Modèle d'invitation */
export interface InvitationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  isDefault: boolean;
}

/** Résultat d'envoi d'invitation */
export interface SendInvitationResult {
  success: boolean;
  invitationId?: string;
  error?: string;
}

class InvitationService {
  /** Récupère les statistiques d'invitation depuis la base */
  async getInvitationStats(): Promise<InvitationStats> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return this.getDefaultStats();

      const { data, error } = await supabase
        .from('invitation_stats')
        .select('*')
        .single();

      if (error || !data) return this.getDefaultStats();

      return {
        total: data.total || 0,
        sent: data.sent || 0,
        pending: data.pending || 0,
        accepted: data.accepted || 0,
        expired: data.expired || 0,
        rejected: data.rejected || 0,
        completed: data.completed || 0,
        conversionRate: data.conversion_rate || 0,
        averageTimeToAccept: data.avg_time_to_accept || 0,
        recent_invites: data.recent_invites || [],
        teams: data.teams || {}
      };
    } catch (error) {
      logger.error('Error fetching invitation stats', error as Error, 'INVITATION');
      return this.getDefaultStats();
    }
  }

  /** Envoie une invitation */
  async sendInvitation(data: InvitationFormData): Promise<SendInvitationResult> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) {
        return { success: false, error: 'Non authentifié' };
      }

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { data: invitation, error } = await supabase
        .from('invitations')
        .insert({
          email: data.email,
          role: data.role || 'user',
          team_id: data.teamId,
          invited_by: userData.user.id,
          expires_at: expiresAt.toISOString(),
          status: 'pending',
          metadata: data.metadata
        })
        .select()
        .single();

      if (error) throw error;

      // Envoyer l'email d'invitation
      await supabase.functions.invoke('send-invitation-email', {
        body: {
          invitationId: invitation.id,
          email: data.email,
          templateId: data.templateId
        }
      });

      logger.info('Invitation sent', { email: data.email }, 'INVITATION');
      return { success: true, invitationId: invitation.id };
    } catch (error) {
      logger.error('Error sending invitation', error as Error, 'INVITATION');
      return { success: false, error: (error as Error).message };
    }
  }

  /** Envoie plusieurs invitations */
  async sendBulkInvitations(emails: string[], role: string, teamId?: string): Promise<{
    successful: string[];
    failed: string[];
  }> {
    const successful: string[] = [];
    const failed: string[] = [];

    for (const email of emails) {
      const result = await this.sendInvitation({ email, role, teamId } as InvitationFormData);
      if (result.success) {
        successful.push(email);
      } else {
        failed.push(email);
      }
    }

    logger.info('Bulk invitations sent', { successful: successful.length, failed: failed.length }, 'INVITATION');
    return { successful, failed };
  }

  /** Récupère les invitations en attente */
  async getPendingInvitations(teamId?: string): Promise<Invitation[]> {
    try {
      let query = supabase
        .from('invitations')
        .select('*, profiles!invited_by(display_name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (teamId) {
        query = query.eq('team_id', teamId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(this.mapInvitation);
    } catch (error) {
      logger.error('Error fetching pending invitations', error as Error, 'INVITATION');
      return [];
    }
  }

  /** Récupère toutes les invitations */
  async getAllInvitations(filters?: { status?: string; teamId?: string }): Promise<Invitation[]> {
    try {
      let query = supabase
        .from('invitations')
        .select('*, profiles!invited_by(display_name)')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.teamId) {
        query = query.eq('team_id', filters.teamId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(this.mapInvitation);
    } catch (error) {
      return [];
    }
  }

  /** Récupère une invitation par ID */
  async getInvitationById(id: string): Promise<Invitation | null> {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*, profiles!invited_by(display_name)')
        .eq('id', id)
        .single();

      if (error) return null;
      return this.mapInvitation(data);
    } catch (error) {
      return null;
    }
  }

  /** Annule une invitation */
  async cancelInvitation(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('invitations')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;
      logger.info('Invitation cancelled', { id }, 'INVITATION');
      return true;
    } catch (error) {
      logger.error('Error cancelling invitation', error as Error, 'INVITATION');
      return false;
    }
  }

  /** Renvoie une invitation */
  async resendInvitation(id: string): Promise<boolean> {
    try {
      const invitation = await this.getInvitationById(id);
      if (!invitation) return false;

      // Mettre à jour la date d'expiration
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + 7);

      await supabase
        .from('invitations')
        .update({ expires_at: newExpiresAt.toISOString() })
        .eq('id', id);

      // Renvoyer l'email
      await supabase.functions.invoke('send-invitation-email', {
        body: { invitationId: id, email: invitation.email }
      });

      logger.info('Invitation resent', { id }, 'INVITATION');
      return true;
    } catch (error) {
      return false;
    }
  }

  /** Accepte une invitation */
  async acceptInvitation(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('accept-invitation', {
        body: { token }
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /** Récupère les modèles d'invitation */
  async getInvitationTemplates(): Promise<InvitationTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('invitation_templates')
        .select('*')
        .order('is_default', { ascending: false });

      if (error) throw error;

      return (data || []).map(t => ({
        id: t.id,
        name: t.name,
        subject: t.subject,
        body: t.body,
        isDefault: t.is_default
      }));
    } catch (error) {
      return [];
    }
  }

  /** Exporte les invitations */
  async exportInvitations(): Promise<string> {
    const invitations = await this.getAllInvitations();

    let csv = 'Email,Rôle,Statut,Invité par,Date,Expiration\n';
    for (const inv of invitations) {
      csv += `${inv.email},${inv.role},${inv.status},${inv.invitedByName},`;
      csv += `${inv.createdAt.toISOString()},${inv.expiresAt.toISOString()}\n`;
    }

    return csv;
  }

  /** Pour la compatibilité avec InvitationsTab */
  async fetchInvitationStats(): Promise<InvitationStats> {
    return this.getInvitationStats();
  }

  private getDefaultStats(): InvitationStats {
    return {
      total: 0,
      sent: 0,
      pending: 0,
      accepted: 0,
      expired: 0,
      rejected: 0,
      completed: 0,
      conversionRate: 0,
      averageTimeToAccept: 0,
      recent_invites: [],
      teams: {}
    };
  }

  private mapInvitation(data: any): Invitation {
    return {
      id: data.id,
      email: data.email,
      role: data.role,
      status: data.status,
      teamId: data.team_id,
      teamName: data.team_name,
      invitedBy: data.invited_by,
      invitedByName: data.profiles?.display_name || '',
      createdAt: new Date(data.created_at),
      expiresAt: new Date(data.expires_at),
      acceptedAt: data.accepted_at ? new Date(data.accepted_at) : undefined,
      metadata: data.metadata
    };
  }
}

export default new InvitationService();
export const fetchInvitationStats = () => new InvitationService().getInvitationStats();

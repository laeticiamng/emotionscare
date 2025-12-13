// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { TeamSummary } from '@/types/dashboard';
import { logger } from '@/lib/logger';

/** Payload pour les opérations d'équipe */
export interface TeamPayload {
  id?: string;
  name?: string;
  fields?: Record<string, any>;
}

/** Membre d'équipe */
export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: 'admin' | 'manager' | 'member';
  email: string;
  displayName: string;
  joinedAt: Date;
  lastActive?: Date;
  status: 'active' | 'inactive' | 'pending';
}

/** Statistiques d'équipe */
export interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  averageMoodScore: number;
  engagementRate: number;
  totalSessions: number;
  weeklyProgress: number;
}

/** Invitation d'équipe */
export interface TeamInvitation {
  id: string;
  teamId: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  invitedBy: string;
  createdAt: Date;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
}

/** Activité d'équipe */
export interface TeamActivity {
  id: string;
  teamId: string;
  userId: string;
  activityType: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

async function invoke(action: string, payload?: TeamPayload) {
  const { data, error } = await supabase.functions.invoke('team-management', {
    body: { action, payload }
  });
  if (error) throw error;
  return data;
}

export const teamService = {
  /** Liste toutes les équipes */
  async listTeams(): Promise<TeamSummary[]> {
    const data = await invoke('list');
    return data?.teams || [];
  },

  /** Crée une nouvelle équipe */
  async createTeam(name: string, description?: string): Promise<TeamSummary> {
    const data = await invoke('create', { name, fields: { description } });
    logger.info('Team created', { name }, 'TEAM');
    return data.team;
  },

  /** Met à jour une équipe */
  async updateTeam(id: string, fields: Record<string, any>): Promise<TeamSummary> {
    const data = await invoke('update', { id, fields });
    logger.info('Team updated', { id }, 'TEAM');
    return data.team;
  },

  /** Supprime une équipe */
  async deleteTeam(id: string): Promise<boolean> {
    await invoke('delete', { id });
    logger.info('Team deleted', { id }, 'TEAM');
    return true;
  },

  /** Récupère une équipe par ID */
  async getTeamById(id: string): Promise<TeamSummary | null> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', id)
        .single();

      if (error) return null;
      return data as TeamSummary;
    } catch (error) {
      return null;
    }
  },

  /** Récupère les membres d'une équipe */
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*, profiles(email, display_name)')
        .eq('team_id', teamId)
        .order('joined_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(member => ({
        id: member.id,
        userId: member.user_id,
        teamId: member.team_id,
        role: member.role,
        email: member.profiles?.email || '',
        displayName: member.profiles?.display_name || '',
        joinedAt: new Date(member.joined_at),
        lastActive: member.last_active ? new Date(member.last_active) : undefined,
        status: member.status
      }));
    } catch (error) {
      logger.error('Error fetching team members', error as Error, 'TEAM');
      return [];
    }
  },

  /** Ajoute un membre à l'équipe */
  async addMember(teamId: string, userId: string, role: 'admin' | 'manager' | 'member' = 'member'): Promise<TeamMember | null> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: userId,
          role,
          joined_at: new Date().toISOString(),
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      logger.info('Member added to team', { teamId, userId }, 'TEAM');
      return data as unknown as TeamMember;
    } catch (error) {
      logger.error('Error adding team member', error as Error, 'TEAM');
      return null;
    }
  },

  /** Supprime un membre de l'équipe */
  async removeMember(teamId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId);

      if (error) throw error;
      logger.info('Member removed from team', { teamId, userId }, 'TEAM');
      return true;
    } catch (error) {
      logger.error('Error removing team member', error as Error, 'TEAM');
      return false;
    }
  },

  /** Met à jour le rôle d'un membre */
  async updateMemberRole(teamId: string, userId: string, role: 'admin' | 'manager' | 'member'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ role })
        .eq('team_id', teamId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      return false;
    }
  },

  /** Récupère les statistiques d'équipe */
  async getTeamStats(teamId: string): Promise<TeamStats> {
    try {
      const { data, error } = await supabase
        .from('team_stats')
        .select('*')
        .eq('team_id', teamId)
        .single();

      if (error || !data) {
        return {
          totalMembers: 0,
          activeMembers: 0,
          averageMoodScore: 0,
          engagementRate: 0,
          totalSessions: 0,
          weeklyProgress: 0
        };
      }

      return {
        totalMembers: data.total_members || 0,
        activeMembers: data.active_members || 0,
        averageMoodScore: data.average_mood_score || 0,
        engagementRate: data.engagement_rate || 0,
        totalSessions: data.total_sessions || 0,
        weeklyProgress: data.weekly_progress || 0
      };
    } catch (error) {
      return {
        totalMembers: 0,
        activeMembers: 0,
        averageMoodScore: 0,
        engagementRate: 0,
        totalSessions: 0,
        weeklyProgress: 0
      };
    }
  },

  /** Invite un utilisateur dans l'équipe */
  async inviteMember(teamId: string, email: string, role: 'admin' | 'manager' | 'member' = 'member'): Promise<TeamInvitation | null> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { data, error } = await supabase
        .from('team_invitations')
        .insert({
          team_id: teamId,
          email,
          role,
          invited_by: userData.user?.id,
          expires_at: expiresAt.toISOString(),
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      logger.info('Team invitation sent', { teamId, email }, 'TEAM');

      return {
        id: data.id,
        teamId: data.team_id,
        email: data.email,
        role: data.role,
        invitedBy: data.invited_by,
        createdAt: new Date(data.created_at),
        expiresAt: new Date(data.expires_at),
        status: data.status
      };
    } catch (error) {
      logger.error('Error inviting member', error as Error, 'TEAM');
      return null;
    }
  },

  /** Récupère les invitations en attente */
  async getPendingInvitations(teamId: string): Promise<TeamInvitation[]> {
    try {
      const { data, error } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('team_id', teamId)
        .eq('status', 'pending');

      if (error) throw error;

      return (data || []).map(inv => ({
        id: inv.id,
        teamId: inv.team_id,
        email: inv.email,
        role: inv.role,
        invitedBy: inv.invited_by,
        createdAt: new Date(inv.created_at),
        expiresAt: new Date(inv.expires_at),
        status: inv.status
      }));
    } catch (error) {
      return [];
    }
  },

  /** Annule une invitation */
  async cancelInvitation(invitationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('team_invitations')
        .update({ status: 'cancelled' })
        .eq('id', invitationId);

      if (error) throw error;
      return true;
    } catch (error) {
      return false;
    }
  },

  /** Récupère l'activité récente de l'équipe */
  async getTeamActivity(teamId: string, limit = 20): Promise<TeamActivity[]> {
    try {
      const { data, error } = await supabase
        .from('team_activity')
        .select('*')
        .eq('team_id', teamId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(activity => ({
        id: activity.id,
        teamId: activity.team_id,
        userId: activity.user_id,
        activityType: activity.activity_type,
        description: activity.description,
        timestamp: new Date(activity.timestamp),
        metadata: activity.metadata
      }));
    } catch (error) {
      return [];
    }
  },

  /** Recherche des équipes */
  async searchTeams(query: string): Promise<TeamSummary[]> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(10);

      if (error) throw error;
      return (data || []) as TeamSummary[];
    } catch (error) {
      return [];
    }
  },

  /** Exporte les données d'équipe */
  async exportTeamData(teamId: string): Promise<string> {
    const team = await this.getTeamById(teamId);
    const members = await this.getTeamMembers(teamId);
    const stats = await this.getTeamStats(teamId);

    let csv = 'Données équipe\n';
    csv += `Nom,${team?.name || ''}\n`;
    csv += `Membres,${stats.totalMembers}\n`;
    csv += `Score moyen,${stats.averageMoodScore}\n\n`;

    csv += 'Membres\nNom,Email,Rôle,Rejoint le\n';
    for (const member of members) {
      csv += `${member.displayName},${member.email},${member.role},${member.joinedAt.toISOString()}\n`;
    }

    return csv;
  }
};

/**
 * API B2B centralisée
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type {
  B2BTeam,
  B2BEvent,
  B2BInvitation,
  B2BReport,
  B2BAuditLog,
  B2BApiResponse,
  CreateTeamInput,
  CreateEventInput,
  InviteMemberInput,
  B2BEventRSVP
} from './types';

const LOG_TAG = 'B2B';

// ===== TEAMS =====

export async function fetchTeams(orgId: string): Promise<B2BApiResponse<B2BTeam[]>> {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('org_id', orgId)
      .order('name');

    if (error) throw error;

    const teams: B2BTeam[] = (data || []).map(team => ({
      id: team.id,
      name: team.name,
      description: team.description || '',
      members: 0, // Will be enriched
      lead: 'Manager',
      leadEmail: '',
      avgWellness: 75,
      status: 'active' as const,
      lastActivity: team.updated_at || team.created_at,
      createdAt: team.created_at
    }));

    return { success: true, data: teams };
  } catch (error) {
    logger.error('fetchTeams error', error as Error, LOG_TAG);
    return { success: false, error: (error as Error).message };
  }
}

export async function createTeam(orgId: string, input: CreateTeamInput): Promise<B2BApiResponse<B2BTeam>> {
  try {
    const { data, error } = await supabase
      .from('teams')
      .insert({
        org_id: orgId,
        name: input.name,
        description: input.description || null
      })
      .select()
      .single();

    if (error) throw error;

    await logAudit('team_created', 'team', data.id, { name: input.name });

    return {
      success: true,
      data: {
        id: data.id,
        name: data.name,
        description: data.description || '',
        members: 0,
        lead: '',
        leadEmail: input.leadEmail || '',
        avgWellness: 0,
        status: 'active',
        lastActivity: data.created_at,
        createdAt: data.created_at
      }
    };
  } catch (error) {
    logger.error('createTeam error', error as Error, LOG_TAG);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteTeam(teamId: string): Promise<B2BApiResponse<void>> {
  try {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);

    if (error) throw error;

    await logAudit('team_deleted', 'team', teamId, {});

    return { success: true };
  } catch (error) {
    logger.error('deleteTeam error', error as Error, LOG_TAG);
    return { success: false, error: (error as Error).message };
  }
}

// ===== EVENTS =====

export async function fetchEvents(orgId: string): Promise<B2BApiResponse<B2BEvent[]>> {
  try {
    const { data, error } = await supabase
      .from('b2b_events')
      .select('*')
      .eq('org_id', orgId)
      .order('event_date', { ascending: true });

    if (error) throw error;

    const now = new Date();
    const events: B2BEvent[] = (data || []).map(event => {
      const eventDate = new Date(event.event_date);
      let status: B2BEvent['status'] = 'upcoming';
      if (event.status === 'cancelled') status = 'cancelled';
      else if (eventDate < now) status = 'completed';

      return {
        id: event.id,
        title: event.title,
        description: event.description || '',
        date: event.event_date,
        time: event.start_time || '09:00',
        endTime: event.end_time,
        location: event.location || 'À définir',
        locationType: event.location_type || 'onsite',
        participants: event.current_participants || 0,
        maxParticipants: event.max_participants || 20,
        status,
        category: event.category || 'wellness',
        organizer: event.organizer_name || 'Organisateur',
        organizerId: event.organizer_id,
        createdAt: event.created_at
      };
    });

    return { success: true, data: events };
  } catch (error) {
    logger.error('fetchEvents error', error as Error, LOG_TAG);
    return { success: false, error: (error as Error).message };
  }
}

export async function createEvent(orgId: string, userId: string, input: CreateEventInput): Promise<B2BApiResponse<B2BEvent>> {
  try {
    const { data, error } = await supabase
      .from('b2b_events')
      .insert({
        org_id: orgId,
        title: input.title,
        description: input.description,
        event_date: input.date,
        start_time: input.time,
        end_time: input.endTime,
        location: input.location,
        location_type: input.locationType,
        max_participants: input.maxParticipants,
        category: input.category,
        organizer_id: userId,
        status: 'upcoming'
      })
      .select()
      .single();

    if (error) throw error;

    await logAudit('event_created', 'event', data.id, { title: input.title });

    return {
      success: true,
      data: {
        id: data.id,
        title: data.title,
        description: data.description || '',
        date: data.event_date,
        time: data.start_time || '09:00',
        endTime: data.end_time,
        location: data.location || '',
        locationType: data.location_type || 'onsite',
        participants: 0,
        maxParticipants: data.max_participants || 20,
        status: 'upcoming',
        category: data.category || 'wellness',
        organizer: '',
        organizerId: userId,
        createdAt: data.created_at
      }
    };
  } catch (error) {
    logger.error('createEvent error', error as Error, LOG_TAG);
    return { success: false, error: (error as Error).message };
  }
}

export async function rsvpEvent(eventId: string, userId: string, status: B2BEventRSVP['status']): Promise<B2BApiResponse<void>> {
  try {
    const { error } = await supabase
      .from('b2b_event_rsvps')
      .upsert({
        event_id: eventId,
        user_id: userId,
        status,
        responded_at: new Date().toISOString()
      }, {
        onConflict: 'event_id,user_id'
      });

    if (error) throw error;

    // Update participant count
    if (status === 'confirmed') {
      await supabase.rpc('increment_event_participants', { p_event_id: eventId });
    }

    return { success: true };
  } catch (error) {
    logger.error('rsvpEvent error', error as Error, LOG_TAG);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteEvent(eventId: string): Promise<B2BApiResponse<void>> {
  try {
    const { error } = await supabase
      .from('b2b_events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;

    await logAudit('event_deleted', 'event', eventId, {});

    return { success: true };
  } catch (error) {
    logger.error('deleteEvent error', error as Error, LOG_TAG);
    return { success: false, error: (error as Error).message };
  }
}

// ===== INVITATIONS =====

export async function sendInvitation(orgId: string, input: InviteMemberInput): Promise<B2BApiResponse<B2BInvitation>> {
  try {
    const { data, error } = await supabase.functions.invoke('b2b-teams-invite', {
      body: {
        email: input.email,
        teamId: input.teamId,
        role: input.role,
        message: input.message
      }
    });

    if (error) throw error;

    await logAudit('invitation_sent', 'member', input.email, { role: input.role, teamId: input.teamId });

    return { success: true, data: data.invitation };
  } catch (error) {
    logger.error('sendInvitation error', error as Error, LOG_TAG);
    return { success: false, error: (error as Error).message };
  }
}

export async function revokeInvitation(invitationId: string): Promise<B2BApiResponse<void>> {
  try {
    const { error } = await supabase
      .from('organization_invitations')
      .update({ status: 'revoked' })
      .eq('id', invitationId);

    if (error) throw error;

    await logAudit('invitation_revoked', 'member', invitationId, {});

    return { success: true };
  } catch (error) {
    logger.error('revokeInvitation error', error as Error, LOG_TAG);
    return { success: false, error: (error as Error).message };
  }
}

// ===== REPORTS =====

export async function fetchReports(orgId: string): Promise<B2BApiResponse<B2BReport[]>> {
  try {
    const { data, error } = await supabase
      .from('b2b_reports')
      .select('*')
      .eq('org_id', orgId)
      .order('period', { ascending: false })
      .limit(12);

    if (error) throw error;

    const reports: B2BReport[] = (data || []).map(report => ({
      id: report.id,
      period: report.period,
      title: report.title || `Rapport ${report.period}`,
      narrative: report.narrative || '',
      metrics: report.metrics || { avgWellness: 0, engagement: 0, participation: 0, alerts: 0 },
      generatedAt: report.generated_at || report.created_at,
      generatedBy: report.generated_by || 'system'
    }));

    return { success: true, data: reports };
  } catch (error) {
    logger.error('fetchReports error', error as Error, LOG_TAG);
    return { success: false, error: (error as Error).message };
  }
}

export async function exportReport(reportId: string, format: 'pdf' | 'csv'): Promise<B2BApiResponse<{ url: string }>> {
  try {
    const { data, error } = await supabase.functions.invoke('b2b-report-export', {
      body: { reportId, format }
    });

    if (error) throw error;

    return { success: true, data: { url: data.downloadUrl } };
  } catch (error) {
    logger.error('exportReport error', error as Error, LOG_TAG);
    return { success: false, error: (error as Error).message };
  }
}

// ===== AUDIT =====

async function logAudit(
  action: string,
  entityType: B2BAuditLog['entityType'],
  entityId: string,
  details: Record<string, unknown>
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('b2b_audit_logs').insert({
      action,
      entity_type: entityType,
      entity_id: entityId,
      user_id: user.id,
      user_email: user.email,
      details
    });
  } catch (error) {
    logger.warn('Audit log failed', { action, entityId, error }, LOG_TAG);
  }
}

export async function fetchAuditLogs(orgId: string, limit = 50): Promise<B2BApiResponse<B2BAuditLog[]>> {
  try {
    const { data, error } = await supabase
      .from('b2b_audit_logs')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const logs: B2BAuditLog[] = (data || []).map(log => ({
      id: log.id,
      action: log.action,
      entityType: log.entity_type,
      entityId: log.entity_id,
      userId: log.user_id,
      userEmail: log.user_email,
      details: log.details || {},
      createdAt: log.created_at
    }));

    return { success: true, data: logs };
  } catch (error) {
    logger.error('fetchAuditLogs error', error as Error, LOG_TAG);
    return { success: false, error: (error as Error).message };
  }
}

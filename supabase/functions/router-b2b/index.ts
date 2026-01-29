// @ts-nocheck
/**
 * ROUTER B2B - Super-routeur Enterprise consolidé
 * Regroupe: b2b-*, team-management, b2b-audit-*, b2b-events-*, etc.
 * 
 * Actions disponibles:
 * - aggregate: Données agrégées B2B
 * - report: Génération de rapports
 * - audit-export: Export d'audit
 * - heatmap: Données de heatmap
 * - team-invite: Invitation équipe
 * - team-accept: Accepter invitation
 * - team-role: Modifier rôle
 * - events-list: Liste événements
 * - events-create: Créer événement
 * - events-update: Modifier événement
 * - events-delete: Supprimer événement
 * - events-rsvp: Répondre à événement
 * - security-roles: Gérer rôles
 * - monthly-report: Rapport mensuel
 * - optimisation: Recommandations
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RouterRequest {
  action: string;
  payload: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return errorResponse('Authorization required', 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return errorResponse('Invalid token', 401);
    }

    // Vérifier le rôle B2B
    const { data: roleData } = await supabase
      .rpc('has_role', { _user_id: user.id, _role: 'b2b_admin' });
    
    const isB2BAdmin = roleData === true;
    
    // Vérifier aussi b2b_user pour certaines actions
    const { data: userRoleData } = await supabase
      .rpc('has_role', { _user_id: user.id, _role: 'b2b_user' });
    
    const isB2BUser = userRoleData === true;

    const body: RouterRequest = await req.json();
    const { action, payload = {} } = body;

    if (!action) {
      return errorResponse('Action is required', 400);
    }

    console.log(`[router-b2b] Action: ${action}, User: ${user.id}, Admin: ${isB2BAdmin}`);

    // Actions admin uniquement
    const adminActions = ['audit-export', 'security-roles', 'team-role', 'events-delete', 'optimisation'];
    if (adminActions.includes(action) && !isB2BAdmin) {
      return errorResponse('Admin access required', 403);
    }

    // Actions B2B user ou admin
    const b2bActions = ['aggregate', 'report', 'heatmap', 'team-invite', 'events-list', 'events-create', 'monthly-report'];
    if (b2bActions.includes(action) && !isB2BUser && !isB2BAdmin) {
      return errorResponse('B2B access required', 403);
    }

    switch (action) {
      case 'aggregate':
        return await handleAggregate(payload, user, supabase);
      
      case 'report':
        return await handleReport(payload, user, supabase);
      
      case 'audit-export':
        return await handleAuditExport(payload, user, supabase);
      
      case 'heatmap':
        return await handleHeatmap(payload, user, supabase);
      
      case 'team-invite':
        return await handleTeamInvite(payload, user, supabase);
      
      case 'team-accept':
        return await handleTeamAccept(payload, user, supabase);
      
      case 'team-role':
        return await handleTeamRole(payload, user, supabase);
      
      case 'events-list':
        return await handleEventsList(payload, user, supabase);
      
      case 'events-create':
        return await handleEventsCreate(payload, user, supabase);
      
      case 'events-update':
        return await handleEventsUpdate(payload, user, supabase);
      
      case 'events-delete':
        return await handleEventsDelete(payload, user, supabase);
      
      case 'events-rsvp':
        return await handleEventsRsvp(payload, user, supabase);
      
      case 'security-roles':
        return await handleSecurityRoles(payload, user, supabase);
      
      case 'monthly-report':
        return await handleMonthlyReport(payload, user, supabase);
      
      case 'optimisation':
        return await handleOptimisation(payload, user, supabase);

      default:
        return errorResponse(`Unknown action: ${action}`, 400);
    }

  } catch (error) {
    console.error('[router-b2b] Error:', error);
    return errorResponse(error.message ?? 'Internal error', 500);
  }
});

// ============ HANDLERS ============

async function handleAggregate(payload: any, user: any, supabase: any): Promise<Response> {
  const { orgId, period = '30d' } = payload;

  // Récupérer l'org de l'utilisateur
  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single();

  const targetOrgId = orgId || membership?.organization_id;

  if (!targetOrgId) {
    return errorResponse('Organization not found', 404);
  }

  // Agrégations
  const { data: members } = await supabase
    .from('organization_members')
    .select('user_id')
    .eq('organization_id', targetOrgId);

  const memberIds = members?.map((m: any) => m.user_id) || [];

  const { count: sessionCount } = await supabase
    .from('activity_sessions')
    .select('*', { count: 'exact', head: true })
    .in('user_id', memberIds);

  const { count: emotionCount } = await supabase
    .from('emotion_sessions')
    .select('*', { count: 'exact', head: true })
    .in('user_id', memberIds);

  return successResponse({
    orgId: targetOrgId,
    memberCount: memberIds.length,
    sessionCount: sessionCount || 0,
    emotionCount: emotionCount || 0,
    period,
  });
}

async function handleReport(payload: any, user: any, supabase: any): Promise<Response> {
  const { type = 'weekly', format = 'json' } = payload;

  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id, organizations(name)')
    .eq('user_id', user.id)
    .single();

  if (!membership) {
    return errorResponse('Organization not found', 404);
  }

  // Générer le rapport
  const report = {
    type,
    generatedAt: new Date().toISOString(),
    organization: membership.organizations?.name,
    metrics: {
      activeUsers: 0,
      totalSessions: 0,
      avgWellbeing: 0,
    },
  };

  return successResponse({ report, format });
}

async function handleAuditExport(payload: any, user: any, supabase: any): Promise<Response> {
  const { startDate, endDate } = payload;

  const { data: logs } = await supabase
    .from('admin_changelog')
    .select('*')
    .gte('created_at', startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .lte('created_at', endDate || new Date().toISOString())
    .limit(1000);

  return successResponse({ logs: logs || [], count: logs?.length || 0 });
}

async function handleHeatmap(payload: any, user: any, supabase: any): Promise<Response> {
  const { period = '7d' } = payload;

  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single();

  if (!membership) {
    return errorResponse('Organization not found', 404);
  }

  // Données de heatmap (activité par heure/jour)
  const heatmapData: any[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      heatmapData.push({
        day,
        hour,
        value: Math.floor(Math.random() * 100), // Mock data
      });
    }
  }

  return successResponse({ heatmap: heatmapData, period });
}

async function handleTeamInvite(payload: any, user: any, supabase: any): Promise<Response> {
  const { email, role = 'member' } = payload;

  if (!email) {
    return errorResponse('Email is required', 400);
  }

  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single();

  if (!membership) {
    return errorResponse('Organization not found', 404);
  }

  const { data: invitation, error } = await supabase
    .from('organization_invitations')
    .insert({
      organization_id: membership.organization_id,
      email,
      role,
      invited_by: user.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select()
    .single();

  if (error) {
    return errorResponse('Failed to create invitation', 500);
  }

  return successResponse({ invitation });
}

async function handleTeamAccept(payload: any, user: any, supabase: any): Promise<Response> {
  const { invitationId } = payload;

  if (!invitationId) {
    return errorResponse('Invitation ID is required', 400);
  }

  const { data: invitation } = await supabase
    .from('organization_invitations')
    .select('*')
    .eq('id', invitationId)
    .single();

  if (!invitation) {
    return errorResponse('Invitation not found', 404);
  }

  if (new Date(invitation.expires_at) < new Date()) {
    return errorResponse('Invitation expired', 410);
  }

  // Ajouter à l'organisation
  const { error } = await supabase
    .from('organization_members')
    .insert({
      organization_id: invitation.organization_id,
      user_id: user.id,
      role: invitation.role,
    });

  if (error) {
    return errorResponse('Failed to join organization', 500);
  }

  // Supprimer l'invitation
  await supabase
    .from('organization_invitations')
    .delete()
    .eq('id', invitationId);

  return successResponse({ joined: true });
}

async function handleTeamRole(payload: any, user: any, supabase: any): Promise<Response> {
  const { memberId, newRole } = payload;

  if (!memberId || !newRole) {
    return errorResponse('Member ID and role are required', 400);
  }

  const { error } = await supabase
    .from('organization_members')
    .update({ role: newRole })
    .eq('id', memberId);

  if (error) {
    return errorResponse('Failed to update role', 500);
  }

  return successResponse({ updated: true });
}

async function handleEventsList(payload: any, user: any, supabase: any): Promise<Response> {
  const { limit = 20, upcoming = true } = payload;

  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single();

  if (!membership) {
    return errorResponse('Organization not found', 404);
  }

  let query = supabase
    .from('organization_events')
    .select('*')
    .eq('organization_id', membership.organization_id)
    .limit(limit);

  if (upcoming) {
    query = query.gte('event_date', new Date().toISOString());
  }

  const { data: events } = await query.order('event_date', { ascending: true });

  return successResponse({ events: events || [] });
}

async function handleEventsCreate(payload: any, user: any, supabase: any): Promise<Response> {
  const { title, description, event_date, location, event_type } = payload;

  if (!title || !event_date) {
    return errorResponse('Title and date are required', 400);
  }

  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single();

  if (!membership) {
    return errorResponse('Organization not found', 404);
  }

  const { data: event, error } = await supabase
    .from('organization_events')
    .insert({
      organization_id: membership.organization_id,
      title,
      description,
      event_date,
      location,
      event_type,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return errorResponse('Failed to create event', 500);
  }

  return successResponse({ event });
}

async function handleEventsUpdate(payload: any, user: any, supabase: any): Promise<Response> {
  const { eventId, ...updates } = payload;

  if (!eventId) {
    return errorResponse('Event ID is required', 400);
  }

  const { error } = await supabase
    .from('organization_events')
    .update(updates)
    .eq('id', eventId);

  if (error) {
    return errorResponse('Failed to update event', 500);
  }

  return successResponse({ updated: true });
}

async function handleEventsDelete(payload: any, user: any, supabase: any): Promise<Response> {
  const { eventId } = payload;

  if (!eventId) {
    return errorResponse('Event ID is required', 400);
  }

  const { error } = await supabase
    .from('organization_events')
    .delete()
    .eq('id', eventId);

  if (error) {
    return errorResponse('Failed to delete event', 500);
  }

  return successResponse({ deleted: true });
}

async function handleEventsRsvp(payload: any, user: any, supabase: any): Promise<Response> {
  const { eventId, status } = payload;

  if (!eventId || !status) {
    return errorResponse('Event ID and status are required', 400);
  }

  const { error } = await supabase
    .from('event_rsvps')
    .upsert({
      event_id: eventId,
      user_id: user.id,
      status,
    }, { onConflict: 'event_id,user_id' });

  if (error) {
    return errorResponse('Failed to save RSVP', 500);
  }

  return successResponse({ rsvp: status });
}

async function handleSecurityRoles(payload: any, user: any, supabase: any): Promise<Response> {
  const { action: roleAction, userId, role } = payload;

  if (roleAction === 'list') {
    const { data: roles } = await supabase
      .from('user_roles')
      .select('*')
      .limit(100);
    return successResponse({ roles: roles || [] });
  }

  if (roleAction === 'assign') {
    if (!userId || !role) {
      return errorResponse('User ID and role are required', 400);
    }

    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role });

    if (error) {
      return errorResponse('Failed to assign role', 500);
    }

    return successResponse({ assigned: true });
  }

  return errorResponse('Invalid role action', 400);
}

async function handleMonthlyReport(payload: any, user: any, supabase: any): Promise<Response> {
  const { month, year } = payload;

  const targetMonth = month || new Date().getMonth() + 1;
  const targetYear = year || new Date().getFullYear();

  return successResponse({
    report: {
      month: targetMonth,
      year: targetYear,
      generatedAt: new Date().toISOString(),
      summary: 'Monthly report data would be here',
    },
  });
}

async function handleOptimisation(payload: any, user: any, supabase: any): Promise<Response> {
  // Recommandations d'optimisation basées sur les données
  return successResponse({
    recommendations: [
      { type: 'engagement', message: 'Augmenter la fréquence des sessions de groupe' },
      { type: 'wellbeing', message: 'Proposer plus d\'activités de méditation' },
      { type: 'adoption', message: 'Envoyer des rappels hebdomadaires' },
    ],
  });
}

// ============ HELPERS ============

function successResponse(data: any): Response {
  return new Response(JSON.stringify({ success: true, ...data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

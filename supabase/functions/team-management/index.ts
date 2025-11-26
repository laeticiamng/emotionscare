// @ts-nocheck
/**
 * team-management - Gestion des équipes (admin)
 *
 * 🔒 SÉCURISÉ: Auth admin + Rate limit 20/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function listTeams() {
  const { data, error } = await supabase.from('teams').select('*');
  if (error) throw error;
  return data;
}

async function createTeam(name: string) {
  const { data, error } = await supabase.from('teams').insert({ name }).select().single();
  if (error) throw error;
  return data;
}

async function updateTeam(id: string, fields: Record<string, any>) {
  const { data, error } = await supabase.from('teams').update(fields).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

async function deleteTeam(id: string) {
  const { error } = await supabase.from('teams').delete().eq('id', id);
  if (error) throw error;
}

async function logAction(userId: string, action: string, details: string) {
  try {
    await supabase.from('admin_logs').insert({ admin_id: userId, action, details });
  } catch (err) {
    console.error('Failed to log admin action:', err);
  }
}

serve(async (req) => {
  // 1. CORS check
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  // Vérification CORS stricte
  if (!corsResult.allowed) {
    console.warn('[team-management] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  // 2. Auth admin
  const { user, status } = await authorizeRole(req, ['b2b_admin', 'admin']);
  if (!user) {
    console.warn('[team-management] Unauthorized access attempt');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 3. 🛡️ Rate limiting
  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'team-management',
    userId: user.id,
    limit: 20,
    windowMs: 60_000,
    description: 'Team management - Admin only',
  });

  if (!rateLimit.allowed) {
    console.warn('[team-management] Rate limit exceeded', { userId: user.id });
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  console.log(`[team-management] Processing for admin: ${user.id}`);

  try {
    const { action, payload } = await req.json();

    switch (action) {
      case 'list':
        const teams = await listTeams();
        return new Response(JSON.stringify({ teams }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      case 'create':
        if (!payload?.name) throw new Error('Name required');
        const newTeam = await createTeam(payload.name);
        await logAction(user.id, 'create_team', newTeam.id);
        return new Response(JSON.stringify({ team: newTeam }), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      case 'update':
        if (!payload?.id) throw new Error('ID required');
        const updated = await updateTeam(payload.id, payload.fields || {});
        await logAction(user.id, 'update_team', payload.id);
        return new Response(JSON.stringify({ team: updated }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      case 'delete':
        if (!payload?.id) throw new Error('ID required');
        await deleteTeam(payload.id);
        await logAction(user.id, 'delete_team', payload.id);
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Server error'
    console.error('team-management error:', error)
    return new Response(JSON.stringify({ error: 'Server error', message: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

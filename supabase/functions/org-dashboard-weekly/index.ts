import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { authenticateRequest } from '../_shared/auth-middleware.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Authenticate user and check B2B role
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: authResult.status, headers: corsHeaders }
      );
    }

    // Check if user has B2B access
    const userRole = authResult.user?.user_metadata?.role || 'b2c';
    if (!['b2b_admin', 'b2b_hr'].includes(userRole)) {
      return new Response(
        JSON.stringify({ error: 'B2B access required' }),
        { status: 403, headers: corsHeaders }
      );
    }

    const { params } = await req.json();
    const {
      from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      to = new Date().toISOString().split('T')[0],
      group_by = 'team',
      min_n = 5,
      site,
      bu
    } = params;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Mock data for now - in production this would query real team data
    const mockTeams = [
      {
        team_id: 'dev-frontend',
        team_name: 'Frontend Dev',
        size_window: 8,
        eligible: true,
        days: [
          { date: '2025-08-22', bucket: 'medium' },
          { date: '2025-08-23', bucket: 'high' },
          { date: '2025-08-24', bucket: 'high' },
          { date: '2025-08-25', bucket: 'medium' },
          { date: '2025-08-26', bucket: 'low' },
          { date: '2025-08-27', bucket: 'medium' },
          { date: '2025-08-28', bucket: 'high' },
        ],
        trend: 'up'
      },
      {
        team_id: 'dev-backend',
        team_name: 'Backend Dev',
        size_window: 6,
        eligible: true,
        days: [
          { date: '2025-08-22', bucket: 'high' },
          { date: '2025-08-23', bucket: 'high' },
          { date: '2025-08-24', bucket: 'medium' },
          { date: '2025-08-25', bucket: 'medium' },
          { date: '2025-08-26', bucket: 'medium' },
          { date: '2025-08-27', bucket: 'low' },
          { date: '2025-08-28', bucket: 'low' },
        ],
        trend: 'down'
      },
      {
        team_id: 'design',
        team_name: 'Design',
        size_window: 4,
        eligible: false, // Below min_n
      },
      {
        team_id: 'product',
        team_name: 'Product',
        size_window: 7,
        eligible: true,
        days: [
          { date: '2025-08-22', bucket: 'medium' },
          { date: '2025-08-23', bucket: 'medium' },
          { date: '2025-08-24', bucket: 'medium' },
          { date: '2025-08-25', bucket: 'high' },
          { date: '2025-08-26', bucket: 'medium' },
          { date: '2025-08-27', bucket: 'medium' },
          { date: '2025-08-28', bucket: 'medium' },
        ],
        trend: 'flat'
      }
    ].filter(team => team.size_window >= min_n || !team.eligible);

    const response = {
      from,
      to,
      group_by,
      min_n,
      teams: mockTeams
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in org-dashboard-weekly:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
});
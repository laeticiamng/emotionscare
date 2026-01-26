// @ts-nocheck
/**
 * US-2: Context-Lens Patients API
 * GET /patients/search?q={query}
 * GET /patients/{id}
 * GET /patients/{id}/assessments
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-context-lens-version',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

async function validateToken(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.slice(7);
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) return null;
  return user;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    // Authentification
    const user = await validateToken(req);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'unauthorized', message: 'Valid token required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // Routing basé sur le path
    // /context-lens-patients/search?q=xxx
    // /context-lens-patients/{id}
    // /context-lens-patients/{id}/assessments
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${req.headers.get('authorization')?.slice(7)}` } }
    });

    // Search patients
    if (pathParts.includes('search') || url.searchParams.has('q')) {
      const query = url.searchParams.get('q') || '';
      const limit = parseInt(url.searchParams.get('limit') || '20');
      
      const { data: patients, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, avatar_url, created_at')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(limit);

      if (error) {
        console.error('[PATIENTS] Search error:', error);
        return new Response(
          JSON.stringify({ error: 'search_failed', message: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const responseTime = Date.now() - startTime;
      console.log(`[PATIENTS] Search completed in ${responseTime}ms, found ${patients?.length || 0} results`);

      return new Response(
        JSON.stringify({
          patients: patients?.map(p => ({
            id: p.id,
            name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Anonyme',
            email: p.email,
            avatar: p.avatar_url,
            last_visit: p.created_at,
          })) || [],
          meta: {
            query,
            count: patients?.length || 0,
            response_time_ms: responseTime,
          },
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get patient by ID ou assessments
    const patientIdIndex = pathParts.findIndex(p => 
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p)
    );
    
    if (patientIdIndex >= 0) {
      const patientId = pathParts[patientIdIndex];
      const subResource = pathParts[patientIdIndex + 1];

      // GET /patients/{id}/assessments
      if (subResource === 'assessments') {
        const { data: assessments, error } = await supabase
          .from('assessments')
          .select('id, instrument, score_json, submitted_at, created_at')
          .eq('user_id', patientId)
          .order('submitted_at', { ascending: false })
          .limit(50);

        if (error) {
          return new Response(
            JSON.stringify({ error: 'fetch_failed', message: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({
            patient_id: patientId,
            assessments: assessments?.map(a => ({
              id: a.id,
              type: a.instrument,
              scores: a.score_json,
              completed_at: a.submitted_at || a.created_at,
            })) || [],
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // GET /patients/{id}
      const { data: patient, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', patientId)
        .single();

      if (error || !patient) {
        return new Response(
          JSON.stringify({ error: 'not_found', message: 'Patient not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Récupérer les dernières stats
      const { data: stats } = await supabase
        .from('user_stats')
        .select('total_points, streak_days, level')
        .eq('user_id', patientId)
        .single();

      // Dernière émotion
      const { data: lastEmotion } = await supabase
        .from('emotion_brain_mappings')
        .select('timestamp, mappings')
        .eq('patient_id', patientId)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      return new Response(
        JSON.stringify({
          id: patient.id,
          name: `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
          email: patient.email,
          avatar: patient.avatar_url,
          created_at: patient.created_at,
          stats: stats || { total_points: 0, streak_days: 0, level: 1 },
          last_emotion: lastEmotion ? {
            timestamp: lastEmotion.timestamp,
            data: lastEmotion.mappings,
          } : null,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Route non trouvée
    return new Response(
      JSON.stringify({ error: 'not_found', message: 'Endpoint not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[PATIENTS] Error:', error);
    return new Response(
      JSON.stringify({ error: 'server_error', message: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

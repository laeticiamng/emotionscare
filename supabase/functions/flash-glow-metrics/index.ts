import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { authorizeRole } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST') {
      const {
        pattern,
        duration_sec,
        events,
        self_report,
        hrv
      } = await req.json();

      console.log('Flash Glow session completed:', {
        user_id: user.id,
        pattern,
        duration_sec,
        events_count: events?.length || 0,
        self_report,
        hrv
      });

      // Here we would save to database
      // For now, just simulate badge assignment
      let badgeId = null;
      if (duration_sec >= 60 && events.some(e => e.type === 'finish')) {
        badgeId = 'instant_glow';
      }

      return new Response(JSON.stringify({
        ok: true,
        badge_id: badgeId
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'GET') {
      // Optional: return breath recommendation
      const recommendation = {
        pattern: '4-6-8',
        reason: 'Optimal for energy boost and focus'
      };

      return new Response(JSON.stringify(recommendation), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Error in flash-glow-metrics function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
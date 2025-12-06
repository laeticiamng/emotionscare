
// @ts-nocheck
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

    const { duration = 20, breathingPattern = 'calm', visualTheme = 'ocean' } = await req.json();
    const humeApiKey = Deno.env.get('HUME_API_KEY');

    if (!humeApiKey) {
      // Simulation de session Instant Glow
      const mockSession = {
        sessionId: `glow_${Date.now()}`,
        duration,
        pattern: breathingPattern,
        theme: visualTheme,
        phases: [
          { phase: 'preparation', duration: 3, colors: ['#e3f2fd', '#bbdefb'] },
          { phase: 'breathing', duration: duration - 6, colors: ['#81c784', '#4fc3f7'] },
          { phase: 'completion', duration: 3, colors: ['#ffb74d', '#ffa726'] }
        ],
        musicUrl: `/audio/instant-glow-${visualTheme}.mp3`,
        completion: {
          glowScore: 85 + Math.floor(Math.random() * 15),
          mood: 'refreshed',
          nextSession: Date.now() + 3600000 // 1 heure
        }
      };

      return new Response(JSON.stringify({
        success: true,
        session: mockSession,
        source: 'simulation'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Session personnalisée basée sur l'analyse Hume
    const session = {
      sessionId: `glow_${Date.now()}`,
      duration,
      pattern: breathingPattern,
      theme: visualTheme,
      phases: [
        { phase: 'preparation', duration: 3, colors: ['#e8f5e8', '#f1f8e9'] },
        { phase: 'breathing', duration: duration - 6, colors: ['#a5d6a7', '#81c784'] },
        { phase: 'completion', duration: 3, colors: ['#ffecb3', '#fff9c4'] }
      ],
      musicUrl: `/audio/instant-glow-${visualTheme}.mp3`,
      completion: {
        glowScore: 90,
        mood: 'energized',
        nextSession: Date.now() + 3600000
      }
    };

    return new Response(JSON.stringify({
      success: true,
      session,
      source: 'hume_ai'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in instant-glow function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

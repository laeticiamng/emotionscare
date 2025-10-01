// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const metrics = await req.json();
    const { pattern, duration_sec, adherence, hrv, ts } = metrics;

    console.log('VR Galaxy metrics received:', {
      pattern,
      duration_sec,
      adherence: Math.round(adherence * 100) / 100, // Round to 2 decimal places
      has_hrv: !!hrv,
      timestamp: new Date(ts).toISOString()
    });

    // Validate adherence score (should be between 0 and 1)
    const validAdherence = Math.max(0, Math.min(1, adherence || 0));

    // Process HRV data if available (calculate metrics without exposing raw data)
    let hrv_summary = null;
    if (hrv?.rr_during_ms?.length > 1) {
      try {
        const rr_intervals = hrv.rr_during_ms;
        
        // Calculate RMSSD (Root Mean Square of Successive Differences)
        const differences = [];
        for (let i = 1; i < rr_intervals.length; i++) {
          differences.push(Math.pow(rr_intervals[i] - rr_intervals[i-1], 2));
        }
        const rmssd = Math.sqrt(differences.reduce((a, b) => a + b, 0) / differences.length);
        
        // Calculate SDNN (Standard Deviation of NN intervals)
        const mean = rr_intervals.reduce((a, b) => a + b, 0) / rr_intervals.length;
        const variance = rr_intervals.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / rr_intervals.length;
        const sdnn = Math.sqrt(variance);
        
        hrv_summary = {
          rmssd: Math.round(rmssd * 100) / 100,
          sdnn: Math.round(sdnn * 100) / 100,
          sample_count: rr_intervals.length,
          quality: rr_intervals.length >= 50 ? 'good' : rr_intervals.length >= 20 ? 'fair' : 'poor'
        };

        console.log('HRV metrics calculated:', hrv_summary);
      } catch (error) {
        console.error('Error processing HRV data:', error);
      }
    }

    // Determine session quality based on duration and adherence
    let session_quality = 'poor';
    if (duration_sec >= 120 && validAdherence >= 0.7) {
      session_quality = 'excellent';
    } else if (duration_sec >= 90 && validAdherence >= 0.5) {
      session_quality = 'good';
    } else if (duration_sec >= 60 && validAdherence >= 0.3) {
      session_quality = 'fair';
    }

    // Store session data in analytics
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_type: 'vr.galaxy.session.complete',
        event_data: {
          pattern,
          duration_sec,
          adherence: validAdherence,
          session_quality,
          hrv_summary,
          timestamp: ts
        }
      });

    if (error) {
      console.error('Failed to store VR session:', error);
      throw error;
    }

    console.log('VR Galaxy session stored successfully');

    return new Response(
      JSON.stringify({ 
        ok: true,
        session_id: `vr_${Date.now()}`,
        quality: session_quality,
        message: 'Session enregistrée ✨'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in vr-galaxy-metrics function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
// @ts-nocheck
/**
 * US-3 & US-4: Context-Lens Brain API
 * GET /brain/{patientId}/mesh - Mesh glTF
 * GET /brain/{patientId}/regions - Régions segmentées
 * GET /brain/{patientId}/emotions - Émotions actuelles
 * GET /brain/{patientId}/emotions/history - Historique émotions
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-context-lens-version',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

// Mapping émotions → régions cérébrales (neuroanatomie simplifiée)
const EMOTION_BRAIN_MAPPINGS = {
  anxiety: { region: 'amygdala', hemisphere: 'Bilateral', color: '#EF4444' },
  joy: { region: 'nucleus_accumbens', hemisphere: 'Bilateral', color: '#10B981' },
  sadness: { region: 'prefrontal_cortex', hemisphere: 'Left', color: '#3B82F6' },
  anger: { region: 'hypothalamus', hemisphere: 'Bilateral', color: '#F59E0B' },
  disgust: { region: 'insula', hemisphere: 'Right', color: '#8B5CF6' },
  fear: { region: 'amygdala', hemisphere: 'Right', color: '#DC2626' },
  surprise: { region: 'hippocampus', hemisphere: 'Bilateral', color: '#EC4899' },
  contempt: { region: 'orbitofrontal_cortex', hemisphere: 'Left', color: '#6366F1' },
  stress: { region: 'hypothalamus', hemisphere: 'Bilateral', color: '#F97316' },
};

async function validateToken(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  
  const token = authHeader.slice(7);
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) return null;
  return user;
}

function mapEmotionsToBrainRegions(emotions: Record<string, number>) {
  return Object.entries(emotions)
    .filter(([emotion, intensity]) => intensity > 0.2 && EMOTION_BRAIN_MAPPINGS[emotion])
    .map(([emotion, intensity]) => {
      const mapping = EMOTION_BRAIN_MAPPINGS[emotion];
      return {
        emotion,
        region: mapping.region,
        hemisphere: mapping.hemisphere,
        intensity,
        color: mapping.color,
        alpha: Math.min(1, intensity + 0.3),
      };
    })
    .sort((a, b) => b.intensity - a.intensity);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const user = await validateToken(req);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // Extraire patientId
    const patientIdIndex = pathParts.findIndex(p => 
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p)
    );
    
    if (patientIdIndex < 0) {
      return new Response(
        JSON.stringify({ error: 'invalid_request', message: 'Patient ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const patientId = pathParts[patientIdIndex];
    const subResource = pathParts[patientIdIndex + 1];
    const subSubResource = pathParts[patientIdIndex + 2];

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: req.headers.get('authorization') || '' } }
    });

    // GET /brain/{patientId}/mesh
    if (subResource === 'mesh') {
      const format = url.searchParams.get('format') || 'gltf';
      const lod = url.searchParams.get('lod') || 'medium';

      const { data: scan, error } = await supabase
        .from('brain_scans')
        .select('id, mesh_file_path, status, dimensions, voxel_size, metadata')
        .eq('patient_id', patientId)
        .eq('status', 'ready')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('[BRAIN] Mesh error:', error);
        return new Response(
          JSON.stringify({ error: 'fetch_failed', message: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!scan) {
        return new Response(
          JSON.stringify({ 
            error: 'not_found', 
            message: 'No brain scan available for this patient',
            hint: 'Upload a DICOM or NIfTI file first'
          }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Générer l'URL publique du mesh
      let meshUrl = null;
      if (scan.mesh_file_path) {
        const { data: urlData } = supabase.storage
          .from('brain-scans')
          .getPublicUrl(`${scan.mesh_file_path}_${lod}.${format}`);
        meshUrl = urlData.publicUrl;
      }

      return new Response(
        JSON.stringify({
          success: true,
          scan_id: scan.id,
          mesh_url: meshUrl,
          format,
          lod,
          dimensions: scan.dimensions,
          voxel_size: scan.voxel_size,
          regions_count: 116, // Atlas AAL
          timestamp: new Date().toISOString(),
        }),
        { 
          status: 200, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600',
          } 
        }
      );
    }

    // GET /brain/{patientId}/regions
    if (subResource === 'regions') {
      const { data: scan } = await supabase
        .from('brain_scans')
        .select('id')
        .eq('patient_id', patientId)
        .eq('status', 'ready')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!scan) {
        return new Response(
          JSON.stringify({ error: 'not_found', message: 'No scan found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: regions, error } = await supabase
        .from('brain_regions')
        .select('*')
        .eq('scan_id', scan.id)
        .order('region_code', { ascending: true });

      if (error) {
        return new Response(
          JSON.stringify({ error: 'fetch_failed', message: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          scan_id: scan.id,
          patient_id: patientId,
          regions: regions?.map(r => ({
            code: r.region_code,
            name: r.region_name,
            hemisphere: r.hemisphere,
            volume_mm3: r.volume_mm3,
            centroid: r.centroid,
            color: r.default_color,
          })) || [],
          atlas: 'AAL116',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /brain/{patientId}/emotions ou /brain/{patientId}/emotions/history
    if (subResource === 'emotions') {
      // History endpoint
      if (subSubResource === 'history') {
        const from = url.searchParams.get('from') || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const to = url.searchParams.get('to') || new Date().toISOString();
        const interval = url.searchParams.get('interval') || 'hour';
        const limit = parseInt(url.searchParams.get('limit') || '100');

        const { data: history, error } = await supabase
          .from('emotion_brain_mappings')
          .select('timestamp, mappings')
          .eq('patient_id', patientId)
          .gte('timestamp', from)
          .lte('timestamp', to)
          .order('timestamp', { ascending: false })
          .limit(limit);

        if (error) {
          return new Response(
            JSON.stringify({ error: 'fetch_failed', message: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({
            patient_id: patientId,
            from,
            to,
            interval,
            count: history?.length || 0,
            history: history?.map(h => ({
              timestamp: h.timestamp,
              emotions: h.mappings,
              brain_regions: mapEmotionsToBrainRegions(h.mappings || {}),
            })) || [],
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Current emotions
      const { data: latest, error } = await supabase
        .from('emotion_brain_mappings')
        .select('timestamp, mappings')
        .eq('patient_id', patientId)
        .order('timestamp', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        return new Response(
          JSON.stringify({ error: 'fetch_failed', message: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Default emotions if none found
      const emotions = latest?.mappings || {
        anxiety: 0,
        joy: 0,
        sadness: 0,
        anger: 0,
        disgust: 0,
        fear: 0,
        surprise: 0,
      };

      // Trouver l'émotion dominante
      const dominantEmotion = Object.entries(emotions)
        .filter(([_, v]) => typeof v === 'number')
        .sort(([, a], [, b]) => (b as number) - (a as number))[0];

      return new Response(
        JSON.stringify({
          patient_id: patientId,
          timestamp: latest?.timestamp || new Date().toISOString(),
          emotions,
          dominant: dominantEmotion ? { 
            emotion: dominantEmotion[0], 
            intensity: dominantEmotion[1] 
          } : null,
          brain_regions: mapEmotionsToBrainRegions(emotions),
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'not_found', message: 'Endpoint not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[BRAIN] Error:', error);
    return new Response(
      JSON.stringify({ error: 'server_error', message: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

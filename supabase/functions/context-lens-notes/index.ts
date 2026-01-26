// @ts-nocheck
/**
 * US-6: Context-Lens Clinical Notes API
 * POST /patients/{id}/notes - Créer une note
 * GET /patients/{id}/notes - Liste des notes
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-context-lens-version',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

async function validateToken(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  
  const token = authHeader.slice(7);
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) return null;
  return user;
}

// Sanitize HTML pour éviter XSS
function sanitizeContent(content: string): string {
  return content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .substring(0, 10000); // Limite à 10k caractères
}

interface CreateNoteRequest {
  content: string;
  source?: string;
  ar_context?: {
    view_position?: [number, number, number];
    view_rotation?: [number, number, number, number];
    emotions_snapshot?: Record<string, number>;
    highlighted_regions?: string[];
  };
  tags?: string[];
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

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: req.headers.get('authorization') || '' } }
    });

    // POST - Créer une note
    if (req.method === 'POST') {
      const body: CreateNoteRequest = await req.json();
      
      if (!body.content || body.content.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: 'invalid_request', message: 'Content is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const sanitizedContent = sanitizeContent(body.content);

      // Créer l'entrée dans journal_entries (table existante)
      const { data: note, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: patientId,
          content: sanitizedContent,
          type: 'clinical_note',
          source: body.source || 'context-lens',
          metadata: {
            created_by: user.id,
            ar_context: body.ar_context || null,
            tags: body.tags || [],
            device: req.headers.get('x-context-lens-version') || 'unknown',
          },
        })
        .select()
        .single();

      if (error) {
        console.error('[NOTES] Create error:', error);
        return new Response(
          JSON.stringify({ error: 'create_failed', message: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Mettre à jour la session Context-Lens si elle existe
      await supabase
        .from('context_lens_sessions')
        .update({
          notes_ids: supabase.rpc('array_append_unique', { 
            arr: [], 
            elem: note.id 
          }),
          metadata: {
            last_note_at: new Date().toISOString(),
          },
        })
        .eq('patient_id', patientId)
        .eq('practitioner_id', user.id)
        .is('ended_at', null);

      console.log(`[NOTES] Note created for patient ${patientId} by ${user.id}`);

      return new Response(
        JSON.stringify({
          success: true,
          note: {
            id: note.id,
            content: note.content,
            source: body.source || 'context-lens',
            created_at: note.created_at,
            has_ar_context: !!body.ar_context,
          },
        }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET - Liste des notes
    if (req.method === 'GET') {
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const offset = parseInt(url.searchParams.get('offset') || '0');
      const source = url.searchParams.get('source');

      let query = supabase
        .from('journal_entries')
        .select('id, content, type, source, metadata, created_at, updated_at')
        .eq('user_id', patientId)
        .eq('type', 'clinical_note')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (source) {
        query = query.eq('source', source);
      }

      const { data: notes, error, count } = await query;

      if (error) {
        return new Response(
          JSON.stringify({ error: 'fetch_failed', message: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          patient_id: patientId,
          notes: notes?.map(n => ({
            id: n.id,
            content: n.content,
            source: n.source,
            created_at: n.created_at,
            updated_at: n.updated_at,
            has_ar_context: !!(n.metadata as any)?.ar_context,
            tags: (n.metadata as any)?.tags || [],
          })) || [],
          pagination: {
            limit,
            offset,
            total: count || notes?.length || 0,
          },
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'method_not_allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[NOTES] Error:', error);
    return new Response(
      JSON.stringify({ error: 'server_error', message: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

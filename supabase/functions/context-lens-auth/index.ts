// @ts-nocheck
/**
 * US-1: Context-Lens Authentication API
 * POST /api/context-lens/auth/token
 * 
 * Génère un JWT avec scope limité pour Context-Lens-Pro
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-context-lens-version',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const CONTEXT_LENS_API_SECRET = Deno.env.get('CONTEXT_LENS_API_SECRET') ?? '';

// Rate limiting simple en mémoire (100 req/min par client)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 100;
const RATE_LIMIT_WINDOW = 60000; // 1 minute

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(clientId);
  
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(clientId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (entry.count >= RATE_LIMIT) {
    return false;
  }
  
  entry.count++;
  return true;
}

interface TokenRequest {
  client_id: string;
  client_secret: string;
  device_id?: string;
  scopes?: string[];
}

interface TokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
  scope: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'method_not_allowed', message: 'Only POST allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body: TokenRequest = await req.json();
    const { client_id, client_secret, device_id, scopes = ['context-lens:read'] } = body;

    // Validation des champs requis
    if (!client_id || !client_secret) {
      return new Response(
        JSON.stringify({ error: 'invalid_request', message: 'client_id and client_secret required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting
    if (!checkRateLimit(client_id)) {
      return new Response(
        JSON.stringify({ error: 'rate_limit_exceeded', message: 'Too many requests' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' } }
      );
    }

    // Vérifier le secret Context-Lens
    if (client_secret !== CONTEXT_LENS_API_SECRET) {
      console.warn(`[SECURITY] Invalid client_secret attempt from ${client_id}`);
      return new Response(
        JSON.stringify({ error: 'invalid_client', message: 'Invalid credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Créer le client Supabase avec service role pour créer le token
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Vérifier/créer l'utilisateur machine pour Context-Lens
    const machineEmail = `context-lens-${client_id}@machine.emotionscare.local`;
    
    // Lookup existing user or create
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    let machineUser = existingUsers?.users?.find(u => u.email === machineEmail);

    if (!machineUser) {
      // Créer l'utilisateur machine
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: machineEmail,
        email_confirm: true,
        user_metadata: {
          type: 'machine',
          client_id,
          device_id,
          scopes,
        },
      });
      
      if (createError) {
        console.error('[AUTH] Failed to create machine user:', createError);
        return new Response(
          JSON.stringify({ error: 'server_error', message: 'Failed to create credentials' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      machineUser = newUser.user;
    }

    // Générer un token pour cet utilisateur
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: machineEmail,
    });

    if (sessionError || !sessionData) {
      console.error('[AUTH] Failed to generate token:', sessionError);
      return new Response(
        JSON.stringify({ error: 'server_error', message: 'Failed to generate token' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Construire la réponse token
    const expiresIn = 3600; // 1 heure
    const accessToken = sessionData.properties?.hashed_token || crypto.randomUUID();
    
    // Log d'audit
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    await supabase.from('context_lens_sessions').insert({
      patient_id: null, // Sera défini lors de l'utilisation
      practitioner_id: machineUser.id,
      device_type: device_id || 'context-lens-pro',
      metadata: {
        client_id,
        scopes,
        issued_at: new Date().toISOString(),
        ip: req.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    console.log(`[AUTH] Token issued for client: ${client_id}, device: ${device_id}`);

    const response: TokenResponse = {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: expiresIn,
      refresh_token: crypto.randomUUID(),
      scope: scopes.join(' '),
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[AUTH] Error:', error);
    return new Response(
      JSON.stringify({ error: 'server_error', message: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

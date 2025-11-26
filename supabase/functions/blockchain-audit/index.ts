/**
 * blockchain-audit - Audit trail blockchain immuable
 *
 * 🔒 SÉCURISÉ: Auth admin + Rate limit 10/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

// Fonction de hash SHA-256
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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
    console.warn('[blockchain-audit] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  // 2. 🔒 SÉCURITÉ: Auth admin obligatoire
  const { user, status } = await authorizeRole(req, ['admin']);
  if (!user) {
    console.warn('[blockchain-audit] Unauthorized access attempt');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 3. 🛡️ Rate limiting
  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'blockchain-audit',
    userId: user.id,
    limit: 10,
    windowMs: 60_000,
    description: 'Blockchain audit - Admin only',
  });

  if (!rateLimit.allowed) {
    console.warn('[blockchain-audit] Rate limit exceeded', { userId: user.id });
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  console.log(`[blockchain-audit] Processing for admin: ${user.id}`);

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, data, userId } = await req.json();

    // Récupérer le dernier block de la chaîne
    const { data: lastBlock } = await supabase
      .from('blockchain_audit_trail')
      .select('*')
      .order('block_number', { ascending: false })
      .limit(1)
      .single();

    const blockNumber = lastBlock ? lastBlock.block_number + 1 : 1;
    const previousHash = lastBlock ? lastBlock.block_hash : '0'.repeat(64);

    // Créer le nouveau block
    const timestamp = new Date().toISOString();
    const blockData = {
      block_number: blockNumber,
      timestamp,
      action,
      data,
      user_id: userId,
      previous_hash: previousHash,
    };

    // Calculer le hash du block
    const blockString = JSON.stringify(blockData);
    const blockHash = await sha256(blockString);

    // Insérer dans la blockchain
    const { data: newBlock, error } = await supabase
      .from('blockchain_audit_trail')
      .insert({
        ...blockData,
        block_hash: blockHash,
      })
      .select()
      .single();

    if (error) throw error;

    // Vérifier l'intégrité de la chaîne
    const { data: allBlocks } = await supabase
      .from('blockchain_audit_trail')
      .select('*')
      .order('block_number', { ascending: true });

    let isValid = true;
    if (allBlocks && allBlocks.length > 1) {
      for (let i = 1; i < allBlocks.length; i++) {
        if (allBlocks[i].previous_hash !== allBlocks[i - 1].block_hash) {
          isValid = false;
          break;
        }
      }
    }

    console.log(`✅ Block ${blockNumber} ajouté. Intégrité: ${isValid ? 'OK' : 'COMPROMISED'}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        block: newBlock,
        chainIntegrity: isValid 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ Blockchain audit error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fonction de hash SHA-256
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

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

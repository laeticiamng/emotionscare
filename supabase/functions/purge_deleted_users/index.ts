// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('purge_deleted_users called');

  return new Response(
    JSON.stringify({ message: 'User purge placeholder' }),
    { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
});

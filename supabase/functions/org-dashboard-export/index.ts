import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { authenticateRequest } from '../_shared/auth-middleware.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Authenticate user and check B2B role
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: authResult.status, headers: corsHeaders }
      );
    }

    // Check if user has B2B access
    const userRole = authResult.user?.user_metadata?.role || 'b2c';
    if (!['b2b_admin', 'b2b_hr'].includes(userRole)) {
      return new Response(
        JSON.stringify({ error: 'B2B access required' }),
        { status: 403, headers: corsHeaders }
      );
    }

    const { range, group_by, site, bu, min_n, format } = await req.json();

    // Generate CSV content for export
    const csvHeader = 'Date,Équipe,Moral,Taille Échantillon\n';
    const csvRows = [
      '2025-08-22,Frontend Dev,Stable,8',
      '2025-08-23,Frontend Dev,Haut,8',
      '2025-08-24,Frontend Dev,Haut,8',
      '2025-08-25,Frontend Dev,Stable,8',
      '2025-08-26,Frontend Dev,Bas,8',
      '2025-08-27,Frontend Dev,Stable,8',
      '2025-08-28,Frontend Dev,Haut,8',
      '2025-08-22,Backend Dev,Haut,6',
      '2025-08-23,Backend Dev,Haut,6',
      '2025-08-24,Backend Dev,Stable,6',
      '2025-08-25,Backend Dev,Stable,6',
      '2025-08-26,Backend Dev,Stable,6',
      '2025-08-27,Backend Dev,Bas,6',
      '2025-08-28,Backend Dev,Bas,6',
      '2025-08-22,Product,Stable,7',
      '2025-08-23,Product,Stable,7',
      '2025-08-24,Product,Stable,7',
      '2025-08-25,Product,Haut,7',
      '2025-08-26,Product,Stable,7',
      '2025-08-27,Product,Stable,7',
      '2025-08-28,Product,Stable,7',
    ].join('\n');

    const csvContent = csvHeader + csvRows;

    return new Response(
      JSON.stringify({ csv_content: csvContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in org-dashboard-export:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
});
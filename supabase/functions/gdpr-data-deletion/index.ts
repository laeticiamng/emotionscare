
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { authenticateRequest, checkRateLimit, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': req.headers.get('Origin') || '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Security-Policy': "default-src 'self'",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200) {
      await logUnauthorizedAccess(req, authResult.error || 'Authentication failed');
      return new Response(
        JSON.stringify({ error: authResult.error }),
        { status: authResult.status, headers: corsHeaders }
      );
    }

    const clientId = authResult.user.id;
    if (!checkRateLimit(clientId, 1, 86400000)) { // 1 suppression par 24h
      return new Response(
        JSON.stringify({ error: 'Limite de suppressions atteinte. Veuillez patienter.' }),
        { status: 429, headers: corsHeaders }
      );
    }

    const { confirmationCode } = await req.json();
    
    if (!confirmationCode || confirmationCode !== 'DELETE_ALL_MY_DATA') {
      return new Response(
        JSON.stringify({ error: 'Code de confirmation invalide' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const userId = authResult.user.id;

    // Logger l'action avant suppression
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action: 'gdpr_data_deletion_request',
        details: { timestamp: new Date().toISOString() },
        ip_address: req.headers.get('x-forwarded-for') || 'unknown'
      });

    // Supprimer les données utilisateur dans l'ordre correct (contraintes FK)
    const deletionSteps = [
      { table: 'user_activity_logs', condition: 'user_id' },
      { table: 'user_preferences', condition: 'user_id' },
      { table: 'coach_conversations', condition: 'user_id' },
      { table: 'emotion_entries', condition: 'user_id' },
      { table: 'data_export_requests', condition: 'user_id' },
      { table: 'profiles', condition: 'id' }
    ];

    let deletedTables = [];
    
    for (const step of deletionSteps) {
      try {
        const { error } = await supabase
          .from(step.table)
          .delete()
          .eq(step.condition, userId);
        
        if (!error) {
          deletedTables.push(step.table);
        }
      } catch (err) {
        console.log(`Table ${step.table} might not exist or already empty:`, err);
      }
    }

    // Supprimer l'utilisateur du système d'authentification
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    
    if (authError) {
      console.error('Erreur suppression auth:', authError);
      // Continue même si la suppression auth échoue
    }

    // Logger la suppression réussie (dans une table séparée pour l'audit)
    await supabase
      .from('audit_logs')
      .insert({
        user_id: 'DELETED_USER',
        action: 'gdpr_data_deletion_completed',
        details: { 
          originalUserId: userId,
          deletedTables,
          timestamp: new Date().toISOString() 
        },
        ip_address: req.headers.get('x-forwarded-for') || 'unknown'
      });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Toutes vos données ont été supprimées conformément au RGPD',
        deletedTables
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur dans gdpr-data-deletion:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la suppression des données' }),
      { status: 500, headers: corsHeaders }
    );
  }
});

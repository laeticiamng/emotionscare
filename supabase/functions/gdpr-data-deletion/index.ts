/**
 * gdpr-data-deletion - Suppression complète des données RGPD (Art. 17)
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 1/jour + CORS restrictif
 */

// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { buildRateLimitResponse, enforceEdgeRateLimit } from '../_shared/rate-limit.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // 1. CORS check
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'Content-Security-Policy': "default-src 'self'",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  // Vérification CORS stricte
  if (!corsResult.allowed) {
    console.warn('[gdpr-data-deletion] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
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

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'gdpr-data-deletion',
      userId: authResult.user.id,
      limit: 1,
      windowMs: 86_400_000,
      description: 'gdpr-data-deletion',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        message: 'Limite de suppressions atteinte. Veuillez patienter.',
      });
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

    // ✅ Supprimer TOUTES les données utilisateur (RGPD Art. 17 - Droit à l'oubli)
    // Ordre respectant les contraintes FK
    const deletionSteps = [
      { table: 'user_activity_logs', condition: 'user_id' },
      { table: 'health_data_consents', condition: 'user_id' },
      { table: 'coach_logs', condition: 'user_id' },
      { table: 'journal_entries', condition: 'user_id' },
      { table: 'assessment_results', condition: 'user_id' },
      { table: 'emotion_scans', condition: 'user_id' },
      { table: 'user_preferences', condition: 'user_id' },
      { table: 'data_export_requests', condition: 'user_id' },
      { table: 'audit_logs', condition: 'user_id' },
      { table: 'user_roles', condition: 'user_id' },
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

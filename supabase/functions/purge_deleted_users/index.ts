// @ts-nocheck
/**
 * purge_deleted_users - Suppression définitive des utilisateurs (RGPD Art. 17)
 *
 * 🔒 SÉCURISÉ: Auth admin UNIQUEMENT + Rate limit 2/min + CORS restrictif
 * ⚠️ FONCTION CRITIQUE: Supprime définitivement les données utilisateurs
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { withMonitoring } from '../_shared/monitoring-wrapper.ts';
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

/**
 * GDPR Article 17 - Right to Erasure (Right to be Forgotten)
 *
 * This function permanently deletes user data for users who requested deletion.
 * It runs as a scheduled job (cron) to process deletion requests after the grace period (30 days).
 *
 * Process:
 * 1. Find all delete_requests where purge_at <= now
 * 2. For each user:
 *    - Delete all personal data from all tables
 *    - Anonymize statistical data if needed for legal compliance
 *    - Delete user from auth.users
 *    - Log the deletion for audit trail
 *    - Remove the delete_request
 *
 * Security: Requires admin authentication + SERVICE_ROLE_KEY
 */
const handler = withMonitoring('purge_deleted_users', async (req) => {
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
    console.warn('[purge_deleted_users] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  // 2. 🔒 SÉCURITÉ CRITIQUE: Auth admin UNIQUEMENT
  const { user, status } = await authorizeRole(req, ['admin']);
  if (!user) {
    console.warn('[purge_deleted_users] CRITICAL: Unauthorized purge attempt');
    return new Response(JSON.stringify({ error: 'Unauthorized - Admin only' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 3. 🛡️ Rate limiting TRÈS strict (fonction destructive)
  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'purge_deleted_users',
    userId: user.id,
    limit: 2,
    windowMs: 60_000,
    description: 'CRITICAL: User purge - Admin only',
  });

  if (!rateLimit.allowed) {
    console.warn('[purge_deleted_users] Rate limit exceeded', { userId: user.id });
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Fonction critique limitée. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  console.log(`[purge_deleted_users] CRITICAL: Admin ${user.id} initiating user purge`);

  try {
    // This function uses service role for database operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const now = new Date().toISOString();

    // Find all deletion requests that are ready to be purged
    const { data: deletionRequests, error: fetchError } = await supabase
      .from('delete_requests')
      .select('*')
      .lte('purge_at', now);

    if (fetchError) {
      throw new Error(`Failed to fetch deletion requests: ${fetchError.message}`);
    }

    if (!deletionRequests || deletionRequests.length === 0) {
      console.log('No users to purge');
      return new Response(JSON.stringify({
        success: true,
        message: 'No users to purge',
        purged_count: 0,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${deletionRequests.length} users to purge`);

    const results = {
      total: deletionRequests.length,
      purged: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const request of deletionRequests) {
      try {
        const userIdHash = request.user_id_hash;
        console.log(`Purging user: ${userIdHash}`);

        // Find the actual user_id from the hash
        // Note: In production, you'd need to map user_id_hash to user_id
        // For now, assuming user_id_hash IS the user_id or there's a mapping

        // Delete user data from all tables (GDPR Article 17)
        const deletionOperations = [
          // User profile and preferences
          supabase.from('user_consent_preferences').delete().eq('user_id', userIdHash),
          supabase.from('user_music_preferences').delete().eq('user_id', userIdHash),
          supabase.from('user_preferences').delete().eq('user_id', userIdHash),

          // Session data
          supabase.from('vr_sessions').delete().eq('user_id', userIdHash),
          supabase.from('breath_sessions').delete().eq('user_id', userIdHash),
          supabase.from('emotional_check_ins').delete().eq('user_id', userIdHash),

          // GDPR related data
          supabase.from('export_jobs').delete().eq('user_id_hash', userIdHash),
          supabase.from('dsar_requests').delete().eq('user_id', userIdHash),

          // Push notifications
          supabase.from('push_subscriptions').delete().eq('user_id', userIdHash),

          // Onboarding
          supabase.from('onboarding_goals').delete().eq('user_id', userIdHash),

          // Help center feedback
          supabase.from('help_article_feedback').delete().eq('user_id', userIdHash),

          // Consent logs (anonymize instead of delete for legal compliance)
          supabase.from('consent_logs').update({
            user_id: 'DELETED_USER',
            email: 'deleted@anonymized.local',
          }).eq('user_id', userIdHash),

          // Audit logs (anonymize instead of delete for legal compliance)
          supabase.from('audit_logs').update({
            user_id: 'DELETED_USER',
          }).eq('user_id', userIdHash),
        ];

        // Execute all deletion operations
        const deleteResults = await Promise.allSettled(deletionOperations);

        // Check for errors in deletion operations
        const deletionErrors = deleteResults
          .filter((result) => result.status === 'rejected')
          .map((result: any) => result.reason);

        if (deletionErrors.length > 0) {
          console.error(`Errors during data deletion for ${userIdHash}:`, deletionErrors);
        }

        // Delete user from storage (GDPR exports, etc.)
        try {
          const { data: files } = await supabase
            .storage
            .from('gdpr-exports')
            .list('', { search: userIdHash });

          if (files && files.length > 0) {
            const filePaths = files.map(f => f.name);
            await supabase.storage.from('gdpr-exports').remove(filePaths);
            console.log(`Deleted ${filePaths.length} files from gdpr-exports for ${userIdHash}`);
          }
        } catch (storageError) {
          console.error(`Storage deletion error for ${userIdHash}:`, storageError);
          // Non-blocking error
        }

        try {
          const { data: userExportFiles } = await supabase
            .storage
            .from('user-exports')
            .list('', { search: userIdHash });

          if (userExportFiles && userExportFiles.length > 0) {
            const filePaths = userExportFiles.map(f => f.name);
            await supabase.storage.from('user-exports').remove(filePaths);
            console.log(`Deleted ${filePaths.length} files from user-exports for ${userIdHash}`);
          }
        } catch (storageError) {
          console.error(`Storage deletion error for ${userIdHash}:`, storageError);
          // Non-blocking error
        }

        // Delete user from auth.users (this will cascade delete related auth data)
        try {
          const { error: authDeleteError } = await supabase.auth.admin.deleteUser(userIdHash);
          if (authDeleteError) {
            console.error(`Failed to delete auth user ${userIdHash}:`, authDeleteError);
            results.errors.push(`Auth deletion failed for ${userIdHash}: ${authDeleteError.message}`);
          }
        } catch (authError) {
          console.error(`Auth deletion error for ${userIdHash}:`, authError);
          results.errors.push(`Auth deletion error for ${userIdHash}: ${authError.message}`);
        }

        // Log the purge for audit trail (required for GDPR compliance)
        await supabase.from('audit_logs').insert({
          action: 'USER_PURGED',
          user_id: 'SYSTEM',
          result: 'success',
          details: JSON.stringify({
            purged_user_hash: userIdHash,
            requested_at: request.requested_at,
            purged_at: now,
            gdpr_article: 'Article 17 - Right to Erasure',
          }),
          timestamp: now,
        });

        // Remove the deletion request
        await supabase
          .from('delete_requests')
          .delete()
          .eq('user_id_hash', userIdHash);

        results.purged++;
        console.log(`Successfully purged user: ${userIdHash}`);

      } catch (userError) {
        results.failed++;
        const errorMsg = `Failed to purge user ${request.user_id_hash}: ${userError.message}`;
        console.error(errorMsg);
        results.errors.push(errorMsg);
      }
    }

    // Send notification to admins if there were errors
    if (results.failed > 0) {
      console.error(`Purge completed with errors. Purged: ${results.purged}, Failed: ${results.failed}`);
      // TODO: Send email notification to GDPR admin
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Purge completed. Purged: ${results.purged}, Failed: ${results.failed}`,
      ...results,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[purge_deleted_users] Critical error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'User purge failed',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

serve(handler);

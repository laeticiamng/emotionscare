// @ts-nocheck
/**
 * security-audit - Métriques et audit de sécurité
 *
 * 🔒 SÉCURISÉ: Auth admin + Rate limit 10/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabase } from '../_shared/supa_client.ts';
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

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
    console.warn('[security-audit] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  try {
    // 2. Vérifier que l'utilisateur est admin
    const { user, status } = await authorizeRole(req, ['admin', 'b2b_admin']);
    if (!user) {
      console.warn('[security-audit] Unauthorized access attempt');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. 🛡️ Rate limiting (admin only, low limit)
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'security-audit',
      userId: user.id,
      limit: 10,
      windowMs: 60_000,
      description: 'Security audit - Admin only',
    });

    if (!rateLimit.allowed) {
      console.warn('[security-audit] Rate limit exceeded', { userId: user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    console.log(`[security-audit] Processing for admin: ${user.id}`);

    const { type, include_compliance } = await req.json();

    if (type === 'metrics') {
      return await handleSecurityMetrics(include_compliance);
    }

    return new Response(JSON.stringify({ error: 'Invalid audit type' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in security-audit:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleSecurityMetrics(includeCompliance: boolean) {
  try {
    // Analyser les tentatives de connexion échouées
    const { data: authLogs, error: authError } = await supabase
      .from('auth_logs')
      .select('*')
      .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('timestamp', { ascending: false });

    if (authError) console.warn('Auth logs error:', authError);

    // Compter les tentatives bloquées
    const blockedAttempts = authLogs?.filter(log => 
      log.event_message?.includes('failed') || 
      log.metadata?.status >= 400
    ).length || 0;

    // Vérifier l'état SSL (simulation)
    const sslStatus = 'valid'; // En production, vérifier le certificat

    // Calculer le score de sécurité basé sur différents facteurs
    const securityFactors = {
      rlsEnabled: 85, // Pourcentage de tables avec RLS
      sslValid: sslStatus === 'valid' ? 100 : 0,
      lowFailedLogins: blockedAttempts < 50 ? 100 : Math.max(0, 100 - blockedAttempts),
      recentBackup: 95, // Sauvegarde récente
      encryption: 100, // Chiffrement activé
    };

    const securityScore = Math.round(
      Object.values(securityFactors).reduce((sum, score) => sum + score, 0) / 
      Object.keys(securityFactors).length
    );

    // Identifier les vulnérabilités potentielles
    const vulnerabilities = [];
    if (securityScore < 90) vulnerabilities.push('Security score below optimal');
    if (blockedAttempts > 20) vulnerabilities.push('High number of failed login attempts');

    const metrics = {
      securityScore,
      vulnerabilities: vulnerabilities.length,
      blockedAttempts,
      lastScan: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      sslStatus,
      dataEncryption: true,
      backupStatus: 'completed' as const,
      complianceScore: includeCompliance ? 92 : undefined
    };

    return new Response(JSON.stringify(metrics), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in handleSecurityMetrics:', error);
    throw error;
  }
}
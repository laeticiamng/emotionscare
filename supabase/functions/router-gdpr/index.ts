// @ts-nocheck
/**
 * ROUTER GDPR - Super-routeur Conformité RGPD consolidé
 * Regroupe: gdpr-*, consent-manager, data-export, data-retention, dsar-handler, etc.
 * 
 * Actions disponibles:
 * - export: Export des données utilisateur
 * - delete: Suppression des données (droit à l'oubli)
 * - consent-get: Obtenir les consentements
 * - consent-update: Mettre à jour consentement
 * - consent-history: Historique des consentements
 * - dsar-create: Créer une demande DSAR
 * - dsar-status: Statut d'une demande
 * - compliance-score: Score de conformité
 * - anonymize: Anonymiser des données
 * - retention-check: Vérifier politique de rétention
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RouterRequest {
  action: string;
  payload: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return errorResponse('Authorization required', 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return errorResponse('Invalid token', 401);
    }

    const body: RouterRequest = await req.json();
    const { action, payload = {} } = body;

    if (!action) {
      return errorResponse('Action is required', 400);
    }

    console.log(`[router-gdpr] Action: ${action}, User: ${user.id}`);

    switch (action) {
      case 'export':
        return await handleExport(user, supabase);
      
      case 'delete':
        return await handleDelete(payload, user, supabase);
      
      case 'consent-get':
        return await handleConsentGet(user, supabase);
      
      case 'consent-update':
        return await handleConsentUpdate(payload, user, supabase);
      
      case 'consent-history':
        return await handleConsentHistory(user, supabase);
      
      case 'dsar-create':
        return await handleDsarCreate(payload, user, supabase);
      
      case 'dsar-status':
        return await handleDsarStatus(payload, user, supabase);
      
      case 'compliance-score':
        return await handleComplianceScore(user, supabase);
      
      case 'anonymize':
        return await handleAnonymize(payload, user, supabase);
      
      case 'retention-check':
        return await handleRetentionCheck(user, supabase);

      default:
        return errorResponse(`Unknown action: ${action}`, 400);
    }

  } catch (error) {
    console.error('[router-gdpr] Error:', error);
    return errorResponse(error.message ?? 'Internal error', 500);
  }
});

// ============ HANDLERS ============

async function handleExport(user: any, supabase: any): Promise<Response> {
  // Collecter toutes les données de l'utilisateur
  const tables = [
    'profiles',
    'emotion_sessions',
    'activity_sessions',
    'journal_entries',
    'mood_entries',
    'meditation_sessions',
    'user_preferences',
  ];

  const exportData: Record<string, any> = {
    exportedAt: new Date().toISOString(),
    userId: user.id,
    email: user.email,
  };

  for (const table of tables) {
    try {
      const { data } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', user.id);
      exportData[table] = data || [];
    } catch (e) {
      // Table might not exist or user might not have data
      exportData[table] = [];
    }
  }

  // Log the export request
  await supabase.from('gdpr_requests').insert({
    user_id: user.id,
    request_type: 'export',
    status: 'completed',
    completed_at: new Date().toISOString(),
  }).catch(() => {});

  return successResponse({
    data: exportData,
    format: 'json',
    tablesIncluded: tables,
  });
}

async function handleDelete(payload: any, user: any, supabase: any): Promise<Response> {
  const { confirm, reason } = payload;

  if (confirm !== 'DELETE_MY_DATA') {
    return errorResponse('Confirmation required. Send confirm: "DELETE_MY_DATA"', 400);
  }

  // Créer une demande de suppression (à traiter par un admin)
  const { data: request, error } = await supabase
    .from('gdpr_requests')
    .insert({
      user_id: user.id,
      request_type: 'deletion',
      reason,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    return errorResponse('Failed to create deletion request', 500);
  }

  return successResponse({
    requestId: request.id,
    status: 'pending',
    message: 'Votre demande de suppression a été enregistrée. Elle sera traitée sous 30 jours.',
    estimatedCompletionDays: 30,
  });
}

async function handleConsentGet(user: any, supabase: any): Promise<Response> {
  const { data: consents } = await supabase
    .from('user_consents')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Grouper par type de consentement
  const consentMap: Record<string, any> = {};
  (consents || []).forEach((c: any) => {
    if (!consentMap[c.consent_type]) {
      consentMap[c.consent_type] = c;
    }
  });

  return successResponse({
    consents: consentMap,
    lastUpdated: consents?.[0]?.created_at,
  });
}

async function handleConsentUpdate(payload: any, user: any, supabase: any): Promise<Response> {
  const { consentType, granted, version = '1.0' } = payload;

  if (!consentType) {
    return errorResponse('Consent type is required', 400);
  }

  const { data, error } = await supabase
    .from('user_consents')
    .insert({
      user_id: user.id,
      consent_type: consentType,
      granted,
      version,
      ip_address: 'redacted', // Pour la conformité RGPD
    })
    .select()
    .single();

  if (error) {
    return errorResponse('Failed to update consent', 500);
  }

  return successResponse({ consent: data });
}

async function handleConsentHistory(user: any, supabase: any): Promise<Response> {
  const { data: history } = await supabase
    .from('user_consents')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  return successResponse({ history: history || [] });
}

async function handleDsarCreate(payload: any, user: any, supabase: any): Promise<Response> {
  const { type, details } = payload;

  if (!type) {
    return errorResponse('Request type is required', 400);
  }

  const validTypes = ['access', 'rectification', 'erasure', 'portability', 'restriction', 'objection'];
  if (!validTypes.includes(type)) {
    return errorResponse(`Invalid request type. Must be one of: ${validTypes.join(', ')}`, 400);
  }

  const { data: request, error } = await supabase
    .from('gdpr_requests')
    .insert({
      user_id: user.id,
      request_type: type,
      details,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    return errorResponse('Failed to create DSAR request', 500);
  }

  return successResponse({
    request,
    message: 'Votre demande a été enregistrée. Délai de traitement: 30 jours maximum.',
  });
}

async function handleDsarStatus(payload: any, user: any, supabase: any): Promise<Response> {
  const { requestId } = payload;

  if (requestId) {
    const { data: request } = await supabase
      .from('gdpr_requests')
      .select('*')
      .eq('id', requestId)
      .eq('user_id', user.id)
      .single();

    return successResponse({ request });
  }

  // Liste toutes les demandes
  const { data: requests } = await supabase
    .from('gdpr_requests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return successResponse({ requests: requests || [] });
}

async function handleComplianceScore(user: any, supabase: any): Promise<Response> {
  let score = 100;
  const issues: string[] = [];

  // Vérifier les consentements
  const { data: consents } = await supabase
    .from('user_consents')
    .select('consent_type, granted')
    .eq('user_id', user.id);

  const requiredConsents = ['privacy_policy', 'terms_of_service', 'data_processing'];
  const grantedConsents = new Set((consents || []).filter((c: any) => c.granted).map((c: any) => c.consent_type));

  requiredConsents.forEach(consent => {
    if (!grantedConsents.has(consent)) {
      score -= 15;
      issues.push(`Consentement manquant: ${consent}`);
    }
  });

  // Vérifier le profil
  const { data: profile } = await supabase
    .from('profiles')
    .select('email_verified, data_retention_acknowledged')
    .eq('id', user.id)
    .single();

  if (!profile?.email_verified) {
    score -= 10;
    issues.push('Email non vérifié');
  }

  return successResponse({
    score: Math.max(0, score),
    issues,
    compliant: score >= 80,
  });
}

async function handleAnonymize(payload: any, user: any, supabase: any): Promise<Response> {
  const { tables = ['emotion_sessions'], olderThanDays = 365 } = payload;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

  let anonymizedCount = 0;

  for (const table of tables) {
    // Cette opération devrait être faite via une fonction sécurisée côté serveur
    // Pour l'instant, on log la demande
    console.log(`[router-gdpr] Would anonymize ${table} older than ${cutoffDate.toISOString()}`);
    anonymizedCount++;
  }

  return successResponse({
    message: 'Demande d\'anonymisation enregistrée',
    tables,
    cutoffDate: cutoffDate.toISOString(),
  });
}

async function handleRetentionCheck(user: any, supabase: any): Promise<Response> {
  const retentionPolicies = {
    emotion_sessions: { days: 365, action: 'anonymize' },
    activity_sessions: { days: 730, action: 'archive' },
    journal_entries: { days: -1, action: 'keep' }, // -1 = illimité
    mood_entries: { days: 365, action: 'anonymize' },
  };

  const dataStatus: any[] = [];

  for (const [table, policy] of Object.entries(retentionPolicies)) {
    if (policy.days === -1) {
      dataStatus.push({
        table,
        policy: 'Rétention illimitée',
        action: 'keep',
      });
      continue;
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - policy.days);

    const { count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .lt('created_at', cutoffDate.toISOString());

    dataStatus.push({
      table,
      policy: `${policy.days} jours`,
      action: policy.action,
      expiredRecords: count || 0,
    });
  }

  return successResponse({
    policies: retentionPolicies,
    status: dataStatus,
  });
}

// ============ HELPERS ============

function successResponse(data: any): Response {
  return new Response(JSON.stringify({ success: true, ...data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

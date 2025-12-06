// @ts-nocheck

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { buildRateLimitResponse, enforceEdgeRateLimit } from '../_shared/rate-limit.ts';

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

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'gdpr-data-export',
      userId: authResult.user.id,
      limit: 3,
      windowMs: 3_600_000,
      description: 'gdpr-data-export',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        message: 'Limite d’exports atteinte. Veuillez patienter.',
      });
    }

    const { format = 'json' } = await req.json();
    
    if (!['json', 'csv', 'pdf'].includes(format)) {
      return new Response(
        JSON.stringify({ error: 'Format non supporté' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // ✅ Collecter TOUTES les données utilisateur (RGPD Art. 15 + 20)
    const userData = {
      profile: null,
      preferences: null,
      emotions: [],
      emotionScans: [],
      assessments: [],
      journalEntries: [],
      coachConversations: [],
      activities: [],
      healthConsents: [],
      exportDate: new Date().toISOString(),
      legalVersion: '1.0'
    };

    // Récupérer le profil
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authResult.user.id)
      .single();
    
    userData.profile = profile;

    // Récupérer les préférences
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', authResult.user.id);
    
    userData.preferences = preferences;

    // ✅ Récupérer les scans émotionnels
    const { data: emotionScans } = await supabase
      .from('emotion_scans')
      .select('*')
      .eq('user_id', authResult.user.id)
      .order('created_at', { ascending: false });
    
    userData.emotionScans = emotionScans || [];

    // ✅ Récupérer les assessments
    const { data: assessments } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('user_id', authResult.user.id)
      .order('created_at', { ascending: false });
    
    userData.assessments = assessments || [];

    // ✅ Récupérer les entrées de journal
    const { data: journalEntries } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', authResult.user.id)
      .order('created_at', { ascending: false });
    
    userData.journalEntries = journalEntries || [];

    // ✅ Récupérer les conversations coach
    const { data: coachLogs } = await supabase
      .from('coach_logs')
      .select('*')
      .eq('user_id', authResult.user.id)
      .order('created_at', { ascending: false });
    
    userData.coachConversations = coachLogs || [];

    // ✅ Récupérer les consentements santé
    const { data: healthConsents } = await supabase
      .from('health_data_consents')
      .select('*')
      .eq('user_id', authResult.user.id);
    
    userData.healthConsents = healthConsents || [];

    // Récupérer les activités (anonymisées)
    const { data: activities } = await supabase
      .from('user_activity_logs')
      .select('activity_type, timestamp, activity_details')
      .eq('user_id', authResult.user.id)
      .order('timestamp', { ascending: false });
    
    userData.activities = activities || [];

    // Créer la demande d'export
    const { data: exportRequest, error } = await supabase
      .from('data_export_requests')
      .insert({
        user_id: authResult.user.id,
        format,
        status: 'completed',
        included_data: [
          'profile', 
          'preferences', 
          'activities',
          'emotion_scans',
          'assessments',
          'journal_entries',
          'coach_conversations',
          'health_consents'
        ],
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 jours
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur création export:', error);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la création de l\'export' }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Logger l'action RGPD
    await supabase
      .from('audit_logs')
      .insert({
        user_id: authResult.user.id,
        action: 'gdpr_data_export',
        details: { format, requestId: exportRequest.id },
        ip_address: req.headers.get('x-forwarded-for') || 'unknown'
      });

    return new Response(
      JSON.stringify({
        success: true,
        data: userData,
        exportId: exportRequest.id,
        expiresAt: exportRequest.expires_at
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur dans gdpr-data-export:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de l\'export des données' }),
      { status: 500, headers: corsHeaders }
    );
  }
});

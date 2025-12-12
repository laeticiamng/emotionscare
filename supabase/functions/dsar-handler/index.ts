import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { withMonitoring } from '../_shared/monitoring-wrapper.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DSARRequest {
  id: string;
  user_id: string;
  request_type: 'access' | 'portability' | 'rectification' | 'erasure' | 'restriction';
  status: string;
  created_at: string;
  completed_at?: string;
  package_url?: string;
  storage_path?: string;
}

interface UserDataPackage {
  metadata: {
    generated_at: string;
    request_id: string;
    user_id: string;
    data_categories: string[];
    format_version: string;
  };
  profile: Record<string, unknown>;
  consents: unknown[];
  preferences: unknown[];
  activity_sessions: unknown[];
  mood_entries: unknown[];
  journal_entries: unknown[];
  breathing_sessions: unknown[];
  achievements: unknown[];
  exports_history: unknown[];
  notifications: unknown[];
  custom_data: Record<string, unknown>;
}

// Collecter toutes les données utilisateur pour GDPR
async function collectUserData(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  requestId: string
): Promise<UserDataPackage> {
  const dataPackage: UserDataPackage = {
    metadata: {
      generated_at: new Date().toISOString(),
      request_id: requestId,
      user_id: userId,
      data_categories: [],
      format_version: '1.0',
    },
    profile: {},
    consents: [],
    preferences: [],
    activity_sessions: [],
    mood_entries: [],
    journal_entries: [],
    breathing_sessions: [],
    achievements: [],
    exports_history: [],
    notifications: [],
    custom_data: {},
  };

  // Profil utilisateur
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (profile) {
    dataPackage.profile = profile;
    dataPackage.metadata.data_categories.push('profile');
  }

  // Consentements
  const { data: consents } = await supabase
    .from('user_consent_preferences')
    .select('*')
    .eq('user_id', userId);
  
  if (consents?.length) {
    dataPackage.consents = consents;
    dataPackage.metadata.data_categories.push('consents');
  }

  // Préférences utilisateur
  const { data: preferences } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId);
  
  if (preferences?.length) {
    dataPackage.preferences = preferences;
    dataPackage.metadata.data_categories.push('preferences');
  }

  // Sessions d'activité
  const { data: sessions } = await supabase
    .from('user_activity_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1000);
  
  if (sessions?.length) {
    dataPackage.activity_sessions = sessions;
    dataPackage.metadata.data_categories.push('activity_sessions');
  }

  // Entrées d'humeur
  const { data: moods } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1000);
  
  if (moods?.length) {
    dataPackage.mood_entries = moods;
    dataPackage.metadata.data_categories.push('mood_entries');
  }

  // Entrées de journal
  const { data: journals } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1000);
  
  if (journals?.length) {
    dataPackage.journal_entries = journals;
    dataPackage.metadata.data_categories.push('journal_entries');
  }

  // Sessions de respiration
  const { data: breathing } = await supabase
    .from('breathing_vr_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1000);
  
  if (breathing?.length) {
    dataPackage.breathing_sessions = breathing;
    dataPackage.metadata.data_categories.push('breathing_sessions');
  }

  // Achievements
  const { data: achievements } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', userId);
  
  if (achievements?.length) {
    dataPackage.achievements = achievements;
    dataPackage.metadata.data_categories.push('achievements');
  }

  // Historique des exports
  const { data: exports } = await supabase
    .from('export_jobs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (exports?.length) {
    dataPackage.exports_history = exports;
    dataPackage.metadata.data_categories.push('exports_history');
  }

  // Notifications
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(500);
  
  if (notifications?.length) {
    dataPackage.notifications = notifications;
    dataPackage.metadata.data_categories.push('notifications');
  }

  return dataPackage;
}

// Générer un PDF récapitulatif (optionnel)
function generateSummaryText(dataPackage: UserDataPackage): string {
  const summary = [
    '='.repeat(60),
    'DSAR - DATA SUBJECT ACCESS REQUEST',
    'EmotionsCare - Rapport de données personnelles',
    '='.repeat(60),
    '',
    `Date de génération: ${dataPackage.metadata.generated_at}`,
    `ID de demande: ${dataPackage.metadata.request_id}`,
    `Catégories de données: ${dataPackage.metadata.data_categories.join(', ')}`,
    '',
    '-'.repeat(60),
    'RÉSUMÉ DES DONNÉES',
    '-'.repeat(60),
    '',
    `Profil: ${Object.keys(dataPackage.profile).length > 0 ? 'Oui' : 'Non'}`,
    `Consentements: ${dataPackage.consents.length} enregistrements`,
    `Préférences: ${dataPackage.preferences.length} enregistrements`,
    `Sessions d'activité: ${dataPackage.activity_sessions.length} enregistrements`,
    `Entrées d'humeur: ${dataPackage.mood_entries.length} enregistrements`,
    `Entrées de journal: ${dataPackage.journal_entries.length} enregistrements`,
    `Sessions de respiration: ${dataPackage.breathing_sessions.length} enregistrements`,
    `Achievements: ${dataPackage.achievements.length} enregistrements`,
    `Historique exports: ${dataPackage.exports_history.length} enregistrements`,
    `Notifications: ${dataPackage.notifications.length} enregistrements`,
    '',
    '-'.repeat(60),
    'INFORMATIONS DE CONTACT',
    '-'.repeat(60),
    '',
    'Pour toute question concernant vos données personnelles:',
    'Email: dpo@emotionscare.com',
    'Site: https://emotionscare.com/legal/privacy',
    '',
    '='.repeat(60),
    'Fin du rapport',
    '='.repeat(60),
  ];

  return summary.join('\n');
}

const handler = withMonitoring('dsar-handler', async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization')?.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(authHeader);

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const action = pathParts[pathParts.length - 1];

    // POST /dsar-handler/create - Créer une nouvelle demande DSAR
    if (req.method === 'POST' && action === 'create') {
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { request_type, reason } = await req.json();

      // Vérifier s'il n'y a pas déjà une demande en cours
      const { data: existingRequest } = await supabase
        .from('dsar_requests')
        .select('id, status, created_at')
        .eq('user_id', user.id)
        .in('status', ['pending', 'processing'])
        .single();

      if (existingRequest) {
        return new Response(JSON.stringify({
          error: 'Une demande est déjà en cours de traitement',
          existing_request: existingRequest,
        }), {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: request, error } = await supabase
        .from('dsar_requests')
        .insert({
          user_id: user.id,
          request_type: request_type || 'access',
          reason,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      console.log(`[DSAR] New request created: ${request.id} for user ${user.id}`);

      return new Response(JSON.stringify({
        success: true,
        request,
        message: 'Votre demande a été enregistrée. Vous recevrez un email une fois le package prêt.',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /dsar-handler/generate-package - Générer le package de données
    if (req.method === 'POST' && action === 'generate-package') {
      const { requestId } = await req.json();

      const { data: request } = await supabase
        .from('dsar_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (!request) {
        return new Response(JSON.stringify({ error: 'Request not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Mettre à jour le statut
      await supabase
        .from('dsar_requests')
        .update({ status: 'processing', processing_started_at: new Date().toISOString() })
        .eq('id', requestId);

      // Collecter toutes les données utilisateur
      const dataPackage = await collectUserData(supabase, request.user_id, requestId);

      // Générer les fichiers
      const jsonContent = JSON.stringify(dataPackage, null, 2);
      const summaryContent = generateSummaryText(dataPackage);
      const timestamp = Date.now();

      // Créer le bucket s'il n'existe pas
      const { error: bucketError } = await supabase.storage.createBucket('gdpr-exports', {
        public: false,
        fileSizeLimit: 52428800, // 50MB
      });
      
      if (bucketError && !bucketError.message.includes('already exists')) {
        console.warn('[DSAR] Bucket creation warning:', bucketError.message);
      }

      // Uploader le fichier JSON
      const jsonFileName = `dsar-${request.user_id}-${requestId}-${timestamp}.json`;
      const { error: jsonUploadError } = await supabase.storage
        .from('gdpr-exports')
        .upload(jsonFileName, jsonContent, {
          contentType: 'application/json',
          cacheControl: '3600',
          upsert: false
        });

      if (jsonUploadError) {
        throw new Error(`JSON upload failed: ${jsonUploadError.message}`);
      }

      // Uploader le fichier de résumé
      const summaryFileName = `dsar-summary-${request.user_id}-${requestId}-${timestamp}.txt`;
      await supabase.storage
        .from('gdpr-exports')
        .upload(summaryFileName, summaryContent, {
          contentType: 'text/plain',
          cacheControl: '3600',
          upsert: false
        });

      // Générer des URLs signées valides 7 jours
      const { data: jsonSignedUrl, error: jsonSignedError } = await supabase.storage
        .from('gdpr-exports')
        .createSignedUrl(jsonFileName, 7 * 24 * 60 * 60);

      if (jsonSignedError) {
        throw new Error(`Signed URL generation failed: ${jsonSignedError.message}`);
      }

      const { data: summarySignedUrl } = await supabase.storage
        .from('gdpr-exports')
        .createSignedUrl(summaryFileName, 7 * 24 * 60 * 60);

      // Mettre à jour la demande
      await supabase
        .from('dsar_requests')
        .update({
          status: 'completed',
          package_url: jsonSignedUrl.signedUrl,
          summary_url: summarySignedUrl?.signedUrl,
          storage_path: jsonFileName,
          completed_at: new Date().toISOString(),
          data_categories: dataPackage.metadata.data_categories,
        })
        .eq('id', requestId);

      console.log(`[DSAR] Package generated for request ${requestId}`);

      // Notifier l'utilisateur (si le service email est configuré)
      try {
        const resendKey = Deno.env.get('RESEND_API_KEY');
        if (resendKey) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', request.user_id)
            .single();

          if (profile?.email) {
            await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: 'EmotionsCare <dpo@emotionscare.com>',
                to: [profile.email],
                subject: '📦 Vos données personnelles sont prêtes - EmotionsCare',
                html: `
                  <h2>Bonjour ${profile.full_name || ''},</h2>
                  <p>Votre demande d'accès à vos données personnelles a été traitée.</p>
                  <p>Vous pouvez télécharger vos données en vous connectant à votre compte EmotionsCare.</p>
                  <p><strong>Important:</strong> Le lien de téléchargement expire dans 7 jours.</p>
                  <p>Cordialement,<br>L'équipe EmotionsCare</p>
                `,
              }),
            });
          }
        }
      } catch (emailError) {
        console.warn('[DSAR] Email notification failed:', emailError);
      }

      return new Response(JSON.stringify({
        success: true,
        package_url: jsonSignedUrl.signedUrl,
        summary_url: summarySignedUrl?.signedUrl,
        data_categories: dataPackage.metadata.data_categories,
        expires_in_days: 7,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /dsar-handler/status - Vérifier le statut d'une demande
    if (req.method === 'GET' && action === 'status') {
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const requestId = url.searchParams.get('requestId');
      
      const query = supabase
        .from('dsar_requests')
        .select('*')
        .eq('user_id', user.id);

      if (requestId) {
        query.eq('id', requestId);
      }

      const { data: requests, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({
        requests: requests || [],
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /dsar-handler/erasure - Demande de suppression (droit à l'oubli)
    if (req.method === 'POST' && action === 'erasure') {
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { confirmation, reason } = await req.json();

      if (confirmation !== 'DELETE_MY_DATA') {
        return new Response(JSON.stringify({
          error: 'Confirmation invalide. Envoyez confirmation: "DELETE_MY_DATA"',
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Créer une demande de suppression
      const { data: request, error } = await supabase
        .from('dsar_requests')
        .insert({
          user_id: user.id,
          request_type: 'erasure',
          reason,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      console.log(`[DSAR] Erasure request created: ${request.id} for user ${user.id}`);

      return new Response(JSON.stringify({
        success: true,
        request,
        message: 'Votre demande de suppression a été enregistrée. Elle sera traitée dans les 30 jours conformément au RGPD.',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[DSAR] Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

serve(handler);

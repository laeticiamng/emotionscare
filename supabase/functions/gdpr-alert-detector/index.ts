// @ts-nocheck
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { withMonitoring } from '../_shared/monitoring-wrapper.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlertDetectionRequest {
  type: 'export' | 'deletion' | 'consent';
  userId?: string;
  metadata?: Record<string, any>;
}

interface Consent {
  consent_type: string;
  granted: boolean;
  created_at: string;
}

const handler = withMonitoring('gdpr-alert-detector', async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { type, userId, metadata }: AlertDetectionRequest = await req.json();

    console.log('[GDPR Alert Detector] Analyzing:', { type, userId });

    const alerts = [];

    if (type === 'export') {
      // Vérifier les demandes multiples d'export
      const { data: recentExports } = await supabase
        .from('data_export_requests')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (recentExports && recentExports.length > 3) {
        const alert = {
          alert_type: 'multiple_requests',
          severity: 'warning',
          title: 'Demandes d\'export multiples détectées',
          description: `L'utilisateur ${userId} a effectué ${recentExports.length} demandes d'export en 24h`,
          user_id: userId,
          metadata: {
            count: recentExports.length,
            type: 'export',
            timestamp: new Date().toISOString(),
          },
        };
        alerts.push(alert);
      }

      // Vérifier l'urgence (demande expresse)
      if (metadata?.urgent) {
        const alert = {
          alert_type: 'export_urgent',
          severity: 'critical',
          title: 'Demande d\'export urgente',
          description: `Demande urgente d'export de données pour l'utilisateur ${userId}`,
          user_id: userId,
          metadata: {
            reason: metadata.reason || 'Non spécifié',
            timestamp: new Date().toISOString(),
          },
        };
        alerts.push(alert);
      }
    }

    if (type === 'deletion') {
      // Vérifier les demandes multiples de suppression
      const { data: recentDeletions } = await supabase
        .from('audit_logs')
        .select('id')
        .eq('event', 'data_deletion_requested')
        .eq('actor_id', userId)
        .gte('occurred_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (recentDeletions && recentDeletions.length > 2) {
        const alert = {
          alert_type: 'suspicious_activity',
          severity: 'critical',
          title: 'Activité suspecte: suppressions multiples',
          description: `L'utilisateur ${userId} a effectué ${recentDeletions.length} demandes de suppression en 24h`,
          user_id: userId,
          metadata: {
            count: recentDeletions.length,
            type: 'deletion',
            timestamp: new Date().toISOString(),
          },
        };
        alerts.push(alert);
      }

      // Vérifier l'urgence
      if (metadata?.urgent) {
        const alert = {
          alert_type: 'deletion_urgent',
          severity: 'critical',
          title: 'Demande de suppression urgente',
          description: `Demande urgente de suppression de données pour l'utilisateur ${userId}`,
          user_id: userId,
          metadata: {
            reason: metadata.reason || 'Non spécifié',
            timestamp: new Date().toISOString(),
          },
        };
        alerts.push(alert);
      }
    }

    if (type === 'consent') {
      // Analyser les patterns de consentements
      const { data: userConsents } = await supabase
        .from('user_consents')
        .select('consent_type, granted, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (userConsents && userConsents.length > 5) {
        // Détecter les changements fréquents
        const changes = userConsents.slice(0, 5).filter((c: Consent, i: number) => {
          if (i === 0) return false;
          return c.granted !== userConsents[i - 1].granted;
        });

        if (changes.length >= 3) {
          const alert = {
            alert_type: 'consent_anomaly',
            severity: 'info',
            title: 'Changements fréquents de consentements',
            description: `L'utilisateur ${userId} a modifié ses consentements ${changes.length} fois récemment`,
            user_id: userId,
            metadata: {
              changes: changes.length,
              timestamp: new Date().toISOString(),
            },
          };
          alerts.push(alert);
        }
      }
    }

    // Créer les alertes dans la base de données
    if (alerts.length > 0) {
      const { data: createdAlerts, error } = await supabase
        .from('gdpr_alerts')
        .insert(alerts)
        .select();

      if (error) {
        console.error('[GDPR Alert Detector] Error creating alerts:', error);
        throw new Error(error.message || 'Failed to create alerts');
      }

      console.log('[GDPR Alert Detector] Created alerts:', createdAlerts?.length);

      return new Response(
        JSON.stringify({
          success: true,
          alertsCreated: createdAlerts?.length || 0,
          alerts: createdAlerts,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        alertsCreated: 0,
        message: 'No anomalies detected',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('[GDPR Alert Detector] Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

serve(handler);

// @ts-nocheck
/**
 * check-alert-escalation - Vérification et escalade automatique des alertes
 *
 * 🔒 SÉCURISÉ: Auth admin + Rate limit 5/min + CORS restrictif
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

interface EscalationRule {
  id: string;
  delay_hours: number;
  max_escalation_level: number;
  priority_increase: boolean;
  notification_levels: any[];
}

interface Alert {
  id: string;
  severity: string;
  title: string;
  description: string;
  escalation_level: number;
  escalation_history: any[];
  created_at: string;
}

Deno.serve(async (req) => {
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  if (!corsResult.allowed) {
    return rejectCors(corsResult);
  }

  const { user, status } = await authorizeRole(req, ['admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'check-alert-escalation',
    userId: user.id,
    limit: 5,
    windowMs: 60_000,
    description: 'Alert escalation check - Admin only',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting alert escalation check...');

    // Récupérer les règles d'escalade actives
    const { data: rules, error: rulesError } = await supabase
      .from('alert_escalation_rules')
      .select('*')
      .eq('is_active', true)
      .order('delay_hours', { ascending: true });

    if (rulesError) {
      console.error('Error fetching escalation rules:', rulesError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch escalation rules' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!rules || rules.length === 0) {
      console.log('No active escalation rules found');
      return new Response(
        JSON.stringify({ message: 'No active escalation rules', escalated: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const rule = rules[0] as EscalationRule; // Utiliser la première règle
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - rule.delay_hours * 60 * 60 * 1000);

    console.log(`Checking alerts older than ${rule.delay_hours} hours (cutoff: ${cutoffTime.toISOString()})`);

    // Récupérer les alertes non résolues et non acquittées
    const { data: alerts, error: alertsError } = await supabase
      .from('unified_alerts')
      .select('*')
      .in('status', ['open', 'new'])
      .lt('created_at', cutoffTime.toISOString())
      .lt('escalation_level', rule.max_escalation_level);

    if (alertsError) {
      console.error('Error fetching alerts:', alertsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch alerts' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${alerts?.length || 0} alerts to potentially escalate`);

    const escalated = [];

    for (const alert of alerts || []) {
      const typedAlert = alert as Alert;
      const newLevel = (typedAlert.escalation_level || 0) + 1;
      
      if (newLevel > rule.max_escalation_level) {
        console.log(`Alert ${typedAlert.id} already at max escalation level`);
        continue;
      }

      const levelConfig = rule.notification_levels.find((l: any) => l.level === newLevel);
      if (!levelConfig) {
        console.log(`No config found for escalation level ${newLevel}`);
        continue;
      }

      // Mettre à jour l'escalation history
      const escalationHistory = typedAlert.escalation_history || [];
      escalationHistory.push({
        level: newLevel,
        escalated_at: now.toISOString(),
        previous_level: typedAlert.escalation_level || 0,
        reason: `Automatic escalation after ${rule.delay_hours} hours`,
      });

      // Nouvelle sévérité si augmentation de priorité
      let newSeverity = typedAlert.severity;
      if (rule.priority_increase) {
        const severityMap: Record<string, string> = {
          low: 'medium',
          medium: 'high',
          high: 'critical',
        };
        newSeverity = severityMap[typedAlert.severity] || typedAlert.severity;
      }

      // Mettre à jour l'alerte
      const { error: updateError } = await supabase
        .from('unified_alerts')
        .update({
          escalation_level: newLevel,
          escalation_history: escalationHistory,
          severity: newSeverity,
          updated_at: now.toISOString(),
        })
        .eq('id', typedAlert.id);

      if (updateError) {
        console.error(`Error updating alert ${typedAlert.id}:`, updateError);
        continue;
      }

      console.log(`Escalated alert ${typedAlert.id} to level ${newLevel} (${newSeverity})`);

      // Envoyer des notifications selon le niveau
      try {
        const { error: notifError } = await supabase.functions.invoke('send-error-alert', {
          body: {
            alert_id: typedAlert.id,
            severity: newSeverity,
            title: `[ESCALADE NIVEAU ${newLevel}] ${typedAlert.title}`,
            description: `${typedAlert.description}\n\n⚠️ Cette alerte a été escaladée automatiquement après ${rule.delay_hours} heures sans résolution.`,
            error_type: 'escalated_alert',
            recipients: levelConfig.roles,
            priority: levelConfig.priority,
          },
        });

        if (notifError) {
          console.error(`Error sending notification for alert ${typedAlert.id}:`, notifError);
        }
      } catch (notifErr) {
        console.error(`Exception sending notification:`, notifErr);
      }

      escalated.push({
        alert_id: typedAlert.id,
        from_level: typedAlert.escalation_level || 0,
        to_level: newLevel,
        new_severity: newSeverity,
      });
    }

    console.log(`Escalation complete: ${escalated.length} alerts escalated`);

    return new Response(
      JSON.stringify({
        success: true,
        escalated: escalated.length,
        details: escalated,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in check-alert-escalation:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

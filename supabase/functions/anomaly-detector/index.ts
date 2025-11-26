// @ts-nocheck
/**
 * anomaly-detector - Détection d'anomalies d'accès RGPD
 *
 * 🔒 SÉCURISÉ: Auth admin + Rate limit 5/min + CORS restrictif
 */
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

serve(async (req) => {
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
    route: 'anomaly-detector',
    userId: user.id,
    limit: 5,
    windowMs: 60_000,
    description: 'Anomaly detection - Admin only',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const { userId, timeWindow = '1 hour', mode = 'realtime' } = await req.json().catch(() => ({}));

    console.log(`[Anomaly Detector] Starting analysis for user ${userId || 'all'}, mode: ${mode}`);

    // Fetch detection rules
    const { data: rules, error: rulesError } = await supabase
      .from('anomaly_detection_rules')
      .select('*')
      .eq('enabled', true);

    if (rulesError) throw rulesError;

    // Fetch recent access logs
    let logsQuery = supabase
      .from('data_access_logs')
      .select('*')
      .gte('timestamp', new Date(Date.now() - (mode === 'realtime' ? 3600000 : 86400000)).toISOString())
      .order('timestamp', { ascending: false })
      .limit(1000);

    if (userId) {
      logsQuery = logsQuery.eq('user_id', userId);
    }

    const { data: recentLogs, error: logsError } = await logsQuery;
    if (logsError) throw logsError;

    if (!recentLogs || recentLogs.length === 0) {
      console.log('[Anomaly Detector] No recent access logs found');
      return new Response(
        JSON.stringify({ anomaliesDetected: 0, message: 'No recent access logs' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch baseline patterns for users
    const uniqueUsers = [...new Set(recentLogs.map(log => log.user_id))];
    const { data: patterns, error: patternsError } = await supabase
      .from('access_patterns')
      .select('*')
      .in('user_id', uniqueUsers);

    if (patternsError) console.error('Error fetching patterns:', patternsError);

    // Group logs by user for analysis
    const logsByUser = recentLogs.reduce((acc, log) => {
      if (!acc[log.user_id]) acc[log.user_id] = [];
      acc[log.user_id].push(log);
      return acc;
    }, {} as Record<string, any[]>);

    const anomalies = [];

    // Apply statistical detection rules
    for (const [userId, userLogs] of Object.entries(logsByUser)) {
      const userPatterns = patterns?.filter(p => p.user_id === userId) || [];

      // Rule 1: Volume Spike Detection
      const volumeRule = rules?.find(r => r.rule_name === 'volume_spike_detection');
      if (volumeRule) {
        const hourlyPattern = userPatterns.find(p => p.pattern_type === 'hourly');
        if (hourlyPattern && hourlyPattern.avg_accesses > 0) {
          const recentHourCount = userLogs.filter(
            log => new Date(log.timestamp) > new Date(Date.now() - 3600000)
          ).length;

          const threshold = hourlyPattern.avg_accesses + 
            (volumeRule.threshold_multiplier * (hourlyPattern.std_dev || 1));

          if (recentHourCount > threshold) {
            anomalies.push({
              user_id: userId,
              accessed_by: userId,
              anomaly_type: 'volume_spike',
              severity: recentHourCount > threshold * 2 ? 'high' : 'medium',
              confidence_score: Math.min(0.95, (recentHourCount / threshold) * 0.5),
              description: `Volume d'accès anormal: ${recentHourCount} accès vs moyenne de ${hourlyPattern.avg_accesses.toFixed(1)}`,
              access_log_ids: userLogs.slice(0, 10).map(l => l.id),
              context: {
                current_count: recentHourCount,
                expected_avg: hourlyPattern.avg_accesses,
                threshold,
                std_dev: hourlyPattern.std_dev,
              },
            });
          }
        }
      }

      // Rule 2: Unusual Time Access
      const timeRule = rules?.find(r => r.rule_name === 'unusual_time_access');
      if (timeRule) {
        const hourlyPattern = userPatterns.find(p => p.pattern_type === 'hourly');
        if (hourlyPattern && hourlyPattern.typical_hours) {
          const unusualTimeLogs = userLogs.filter(log => {
            const hour = new Date(log.timestamp).getHours();
            return !hourlyPattern.typical_hours.includes(hour);
          });

          if (unusualTimeLogs.length > 5) {
            anomalies.push({
              user_id: userId,
              accessed_by: userId,
              anomaly_type: 'unusual_time',
              severity: 'medium',
              confidence_score: 0.7,
              description: `${unusualTimeLogs.length} accès à des heures inhabituelles`,
              access_log_ids: unusualTimeLogs.slice(0, 10).map(l => l.id),
              context: {
                unusual_count: unusualTimeLogs.length,
                typical_hours: hourlyPattern.typical_hours,
                detected_hours: [...new Set(unusualTimeLogs.map(l => new Date(l.timestamp).getHours()))],
              },
            });
          }
        }
      }

      // Rule 3: Velocity Check (rapid successive accesses)
      const velocityRule = rules?.find(r => r.rule_name === 'velocity_check');
      if (velocityRule) {
        const windowMs = (velocityRule.parameters.window_minutes || 5) * 60000;
        const maxAccesses = velocityRule.parameters.max_accesses_per_minute || 10;

        const sortedLogs = [...userLogs].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        for (let i = 0; i < sortedLogs.length; i++) {
          const windowStart = new Date(sortedLogs[i].timestamp).getTime();
          const windowEnd = windowStart + windowMs;
          const windowLogs = sortedLogs.filter(log => {
            const t = new Date(log.timestamp).getTime();
            return t >= windowStart && t <= windowEnd;
          });

          if (windowLogs.length > maxAccesses * (windowMs / 60000)) {
            anomalies.push({
              user_id: userId,
              accessed_by: userId,
              anomaly_type: 'velocity',
              severity: 'high',
              confidence_score: 0.85,
              description: `Vitesse d'accès anormale: ${windowLogs.length} accès en ${windowMs / 60000} minutes`,
              access_log_ids: windowLogs.map(l => l.id),
              context: {
                accesses_count: windowLogs.length,
                window_minutes: windowMs / 60000,
                max_allowed: maxAccesses * (windowMs / 60000),
              },
            });
            break; // Only report once per user
          }
        }
      }

      // Rule 4: Bulk Export Detection
      const exportRule = rules?.find(r => r.rule_name === 'bulk_export_detection');
      if (exportRule) {
        const exportLogs = userLogs.filter(log => log.action === 'export');
        const hourlyExports = exportLogs.filter(
          log => new Date(log.timestamp) > new Date(Date.now() - 3600000)
        );

        if (hourlyExports.length > (exportRule.parameters.max_exports_per_hour || 3)) {
          anomalies.push({
            user_id: userId,
            accessed_by: userId,
            anomaly_type: 'bulk_export',
            severity: 'critical',
            confidence_score: 0.9,
            description: `Exports massifs détectés: ${hourlyExports.length} exports en 1 heure`,
            access_log_ids: hourlyExports.map(l => l.id),
            context: {
              export_count: hourlyExports.length,
              max_allowed: exportRule.parameters.max_exports_per_hour,
            },
          });
        }
      }
    }

    // Use ML for advanced pattern analysis
    if (anomalies.length > 0 || mode === 'comprehensive') {
      console.log('[Anomaly Detector] Running ML analysis...');
      
      const mlPrompt = `Tu es un expert en sécurité et détection d'anomalies pour les données personnelles RGPD.

Analyse les patterns d'accès suivants et identifie les comportements potentiellement suspects:

Logs récents (${recentLogs.length} accès):
${JSON.stringify(recentLogs.slice(0, 50), null, 2)}

Patterns normaux établis:
${JSON.stringify(patterns, null, 2)}

Anomalies détectées par règles statistiques:
${JSON.stringify(anomalies, null, 2)}

Fournis une analyse avancée des risques et recommandations.`;

      try {
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: 'Tu es un expert en cybersécurité RGPD. Analyse les patterns et fournis des insights concis.',
              },
              {
                role: 'user',
                content: mlPrompt,
              },
            ],
          }),
        });

        if (aiResponse.ok) {
          const mlResult = await aiResponse.json();
          const mlInsights = mlResult.choices?.[0]?.message?.content || '';
          console.log('[Anomaly Detector] ML Analysis:', mlInsights.substring(0, 200));
          
          // Store ML insights in context
          if (anomalies.length > 0) {
            anomalies[0].context.ml_insights = mlInsights;
          }
        }
      } catch (mlError) {
        console.error('[Anomaly Detector] ML analysis failed:', mlError);
      }
    }

    // Insert detected anomalies into database
    if (anomalies.length > 0) {
      const { error: insertError } = await supabase
        .from('access_anomalies')
        .insert(anomalies);

      if (insertError) {
        console.error('[Anomaly Detector] Error inserting anomalies:', insertError);
      }

      // Create GDPR alerts for critical anomalies
      const criticalAnomalies = anomalies.filter(a => a.severity === 'critical' || a.severity === 'high');
      if (criticalAnomalies.length > 0) {
        const gdprAlerts = criticalAnomalies.map(anomaly => ({
          alert_type: 'security_breach_risk',
          severity: anomaly.severity,
          entity_type: 'access_anomaly',
          entity_id: null, // Will be set after anomaly insert
          description: `Anomalie d'accès détectée: ${anomaly.description}`,
          metadata: {
            anomaly_type: anomaly.anomaly_type,
            confidence_score: anomaly.confidence_score,
            user_id: anomaly.user_id,
          },
        }));

        await supabase.from('gdpr_alerts').insert(gdprAlerts);
      }
    }

    console.log(`[Anomaly Detector] Analysis complete: ${anomalies.length} anomalies detected`);

    return new Response(
      JSON.stringify({
        success: true,
        anomaliesDetected: anomalies.length,
        anomalies: anomalies.slice(0, 20), // Return first 20 for response
        summary: {
          total: anomalies.length,
          by_severity: {
            critical: anomalies.filter(a => a.severity === 'critical').length,
            high: anomalies.filter(a => a.severity === 'high').length,
            medium: anomalies.filter(a => a.severity === 'medium').length,
            low: anomalies.filter(a => a.severity === 'low').length,
          },
          by_type: anomalies.reduce((acc, a) => {
            acc[a.anomaly_type] = (acc[a.anomaly_type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[Anomaly Detector] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

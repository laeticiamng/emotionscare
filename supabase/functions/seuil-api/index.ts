// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SeuilThreshold {
  id: string;
  type: 'mood' | 'energy' | 'stress' | 'anxiety' | 'sleep' | 'custom';
  name: string;
  minValue: number;
  maxValue: number;
  warningThreshold: number;
  criticalThreshold: number;
  notifyOnWarning: boolean;
  notifyOnCritical: boolean;
  isActive: boolean;
}

interface SeuilRequest {
  action: 'list' | 'create' | 'update' | 'delete' | 'check' | 'history' | 'alerts';
  thresholdId?: string;
  threshold?: Partial<SeuilThreshold>;
  value?: number;
  type?: string;
  limit?: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: SeuilRequest = await req.json();
    const { action, thresholdId, threshold, value, type, limit = 50 } = body;

    console.log(`[seuil-api] Action: ${action}, User: ${user.id}`);

    let result;

    switch (action) {
      case 'list': {
        // Get user's thresholds from user_preferences or dedicated table
        const { data: prefs, error } = await supabase
          .from('user_preferences')
          .select('preferences')
          .eq('user_id', user.id)
          .single();

        const thresholds = prefs?.preferences?.seuil_thresholds || getDefaultThresholds();
        result = { thresholds };
        break;
      }

      case 'create': {
        if (!threshold) {
          return new Response(
            JSON.stringify({ error: 'threshold data is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const newThreshold: SeuilThreshold = {
          id: crypto.randomUUID(),
          type: threshold.type || 'custom',
          name: threshold.name || 'New Threshold',
          minValue: threshold.minValue ?? 0,
          maxValue: threshold.maxValue ?? 100,
          warningThreshold: threshold.warningThreshold ?? 30,
          criticalThreshold: threshold.criticalThreshold ?? 20,
          notifyOnWarning: threshold.notifyOnWarning ?? true,
          notifyOnCritical: threshold.notifyOnCritical ?? true,
          isActive: threshold.isActive ?? true,
        };

        // Get existing thresholds and add new one
        const { data: prefs } = await supabase
          .from('user_preferences')
          .select('preferences')
          .eq('user_id', user.id)
          .single();

        const existingThresholds = prefs?.preferences?.seuil_thresholds || [];
        const updatedThresholds = [...existingThresholds, newThreshold];

        await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            preferences: {
              ...(prefs?.preferences || {}),
              seuil_thresholds: updatedThresholds,
            },
            updated_at: new Date().toISOString(),
          });

        result = { threshold: newThreshold, message: 'Threshold created' };
        break;
      }

      case 'update': {
        if (!thresholdId || !threshold) {
          return new Response(
            JSON.stringify({ error: 'thresholdId and threshold data are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: prefs } = await supabase
          .from('user_preferences')
          .select('preferences')
          .eq('user_id', user.id)
          .single();

        const existingThresholds = prefs?.preferences?.seuil_thresholds || [];
        const updatedThresholds = existingThresholds.map((t: SeuilThreshold) =>
          t.id === thresholdId ? { ...t, ...threshold } : t
        );

        await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            preferences: {
              ...(prefs?.preferences || {}),
              seuil_thresholds: updatedThresholds,
            },
            updated_at: new Date().toISOString(),
          });

        result = { message: 'Threshold updated' };
        break;
      }

      case 'delete': {
        if (!thresholdId) {
          return new Response(
            JSON.stringify({ error: 'thresholdId is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: prefs } = await supabase
          .from('user_preferences')
          .select('preferences')
          .eq('user_id', user.id)
          .single();

        const existingThresholds = prefs?.preferences?.seuil_thresholds || [];
        const updatedThresholds = existingThresholds.filter(
          (t: SeuilThreshold) => t.id !== thresholdId
        );

        await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            preferences: {
              ...(prefs?.preferences || {}),
              seuil_thresholds: updatedThresholds,
            },
            updated_at: new Date().toISOString(),
          });

        result = { message: 'Threshold deleted' };
        break;
      }

      case 'check': {
        if (value === undefined || !type) {
          return new Response(
            JSON.stringify({ error: 'value and type are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: prefs } = await supabase
          .from('user_preferences')
          .select('preferences')
          .eq('user_id', user.id)
          .single();

        const thresholds = prefs?.preferences?.seuil_thresholds || getDefaultThresholds();
        const matchingThreshold = thresholds.find(
          (t: SeuilThreshold) => t.type === type && t.isActive
        );

        if (!matchingThreshold) {
          result = { status: 'ok', message: 'No threshold configured for this type' };
          break;
        }

        let status: 'ok' | 'warning' | 'critical' = 'ok';
        let message = 'Value within normal range';

        if (value <= matchingThreshold.criticalThreshold) {
          status = 'critical';
          message = `Value ${value} is below critical threshold (${matchingThreshold.criticalThreshold})`;
          
          // Log alert
          await supabase.from('unified_alerts').insert({
            user_id: user.id,
            alert_type: 'seuil_critical',
            severity: 'critical',
            message: message,
            metadata: { type, value, threshold: matchingThreshold },
            created_at: new Date().toISOString(),
          });

        } else if (value <= matchingThreshold.warningThreshold) {
          status = 'warning';
          message = `Value ${value} is below warning threshold (${matchingThreshold.warningThreshold})`;
          
          if (matchingThreshold.notifyOnWarning) {
            await supabase.from('unified_alerts').insert({
              user_id: user.id,
              alert_type: 'seuil_warning',
              severity: 'warning',
              message: message,
              metadata: { type, value, threshold: matchingThreshold },
              created_at: new Date().toISOString(),
            });
          }
        }

        result = { status, message, threshold: matchingThreshold };
        break;
      }

      case 'history': {
        // Get threshold check history from alerts
        const { data: alerts, error } = await supabase
          .from('unified_alerts')
          .select('*')
          .eq('user_id', user.id)
          .in('alert_type', ['seuil_warning', 'seuil_critical'])
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        result = { history: alerts };
        break;
      }

      case 'alerts': {
        // Get active/recent alerts
        const { data: alerts, error } = await supabase
          .from('unified_alerts')
          .select('*')
          .eq('user_id', user.id)
          .in('alert_type', ['seuil_warning', 'seuil_critical'])
          .eq('resolved', false)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        result = { alerts };
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[seuil-api] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getDefaultThresholds(): SeuilThreshold[] {
  return [
    {
      id: 'default-mood',
      type: 'mood',
      name: 'Mood Level',
      minValue: 0,
      maxValue: 100,
      warningThreshold: 40,
      criticalThreshold: 20,
      notifyOnWarning: true,
      notifyOnCritical: true,
      isActive: true,
    },
    {
      id: 'default-energy',
      type: 'energy',
      name: 'Energy Level',
      minValue: 0,
      maxValue: 100,
      warningThreshold: 30,
      criticalThreshold: 15,
      notifyOnWarning: true,
      notifyOnCritical: true,
      isActive: true,
    },
    {
      id: 'default-stress',
      type: 'stress',
      name: 'Stress Level',
      minValue: 0,
      maxValue: 100,
      warningThreshold: 70,
      criticalThreshold: 85,
      notifyOnWarning: true,
      notifyOnCritical: true,
      isActive: true,
    },
  ];
}

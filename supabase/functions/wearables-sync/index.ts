// @ts-nocheck
/**
 * Wearables Sync - Synchronisation avec les appareils connectés
 * Supporte Apple Health, Google Fit, et autres wearables
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthData {
  heartRate?: number;
  hrv?: number;
  steps?: number;
  sleepMinutes?: number;
  sleepQuality?: number;
  activeMinutes?: number;
  caloriesBurned?: number;
  stressLevel?: number;
  respiratoryRate?: number;
  bloodOxygen?: number;
  timestamp: string;
}

interface WearableConnection {
  provider: 'apple_health' | 'google_fit' | 'fitbit' | 'garmin' | 'samsung_health';
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { action } = body;

    // Lister les connexions disponibles
    if (action === 'providers') {
      const { data: connections } = await supabaseClient
        .from('wearable_connections')
        .select('provider, connected_at, last_sync')
        .eq('user_id', user.id);

      const connectedProviders = new Set((connections || []).map(c => c.provider));

      return new Response(JSON.stringify({
        providers: [
          {
            id: 'apple_health',
            name: 'Apple Health',
            icon: '🍎',
            description: 'iPhone et Apple Watch',
            connected: connectedProviders.has('apple_health'),
            capabilities: ['heart_rate', 'hrv', 'steps', 'sleep', 'activity']
          },
          {
            id: 'google_fit',
            name: 'Google Fit',
            icon: '💚',
            description: 'Android et Wear OS',
            connected: connectedProviders.has('google_fit'),
            capabilities: ['heart_rate', 'steps', 'sleep', 'activity']
          },
          {
            id: 'fitbit',
            name: 'Fitbit',
            icon: '⌚',
            description: 'Montres et bracelets Fitbit',
            connected: connectedProviders.has('fitbit'),
            capabilities: ['heart_rate', 'hrv', 'steps', 'sleep', 'stress']
          },
          {
            id: 'garmin',
            name: 'Garmin',
            icon: '🏃',
            description: 'Montres Garmin',
            connected: connectedProviders.has('garmin'),
            capabilities: ['heart_rate', 'hrv', 'steps', 'sleep', 'stress', 'body_battery']
          },
          {
            id: 'samsung_health',
            name: 'Samsung Health',
            icon: '📱',
            description: 'Appareils Samsung Galaxy',
            connected: connectedProviders.has('samsung_health'),
            capabilities: ['heart_rate', 'steps', 'sleep', 'stress']
          }
        ],
        connections: connections || []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Connecter un wearable
    if (action === 'connect') {
      const { provider, authCode }: { provider: string; authCode?: string } = body;

      // En production, échanger authCode contre tokens OAuth
      // Pour le MVP, on simule la connexion
      const { error } = await supabaseClient
        .from('wearable_connections')
        .upsert({
          user_id: user.id,
          provider,
          connected_at: new Date().toISOString(),
          is_active: true,
          // En production: stocker tokens chiffrés
          metadata: { simulated: true }
        }, { onConflict: 'user_id,provider' });

      if (error) throw error;

      return new Response(JSON.stringify({
        success: true,
        message: `Connexion à ${provider} établie!`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Déconnecter un wearable
    if (action === 'disconnect') {
      const { provider } = body;

      const { error } = await supabaseClient
        .from('wearable_connections')
        .update({ is_active: false, disconnected_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('provider', provider);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Synchroniser les données
    if (action === 'sync') {
      const { provider, data }: { provider: string; data: HealthData[] } = body;

      // Vérifier la connexion
      const { data: connection } = await supabaseClient
        .from('wearable_connections')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', provider)
        .eq('is_active', true)
        .single();

      if (!connection) {
        return new Response(JSON.stringify({ error: 'Wearable non connecté' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Insérer les données de santé
      const healthRecords = data.map(d => ({
        user_id: user.id,
        provider,
        heart_rate: d.heartRate,
        hrv: d.hrv,
        steps: d.steps,
        sleep_minutes: d.sleepMinutes,
        sleep_quality: d.sleepQuality,
        active_minutes: d.activeMinutes,
        calories_burned: d.caloriesBurned,
        stress_level: d.stressLevel,
        respiratory_rate: d.respiratoryRate,
        blood_oxygen: d.bloodOxygen,
        recorded_at: d.timestamp,
        synced_at: new Date().toISOString()
      }));

      const { error } = await supabaseClient
        .from('health_data')
        .insert(healthRecords);

      if (error) throw error;

      // Mettre à jour last_sync
      await supabaseClient
        .from('wearable_connections')
        .update({ last_sync: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('provider', provider);

      // Analyser les données pour insights
      const insights = analyzeHealthData(data);

      return new Response(JSON.stringify({
        success: true,
        synced: healthRecords.length,
        insights
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Récupérer les données de santé
    if (action === 'getData') {
      const { startDate, endDate, metrics } = body;

      let query = supabaseClient
        .from('health_data')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false });

      if (startDate) query = query.gte('recorded_at', startDate);
      if (endDate) query = query.lte('recorded_at', endDate);

      const { data: healthData, error } = await query.limit(500);

      if (error) throw error;

      // Calculer les moyennes
      const summary = calculateHealthSummary(healthData || []);

      return new Response(JSON.stringify({
        data: healthData,
        summary
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Action non reconnue' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[wearables-sync] Error:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function analyzeHealthData(data: HealthData[]): string[] {
  const insights: string[] = [];
  
  if (data.length === 0) return insights;

  const avgHr = data.filter(d => d.heartRate).reduce((sum, d) => sum + (d.heartRate || 0), 0) / data.filter(d => d.heartRate).length;
  const avgHrv = data.filter(d => d.hrv).reduce((sum, d) => sum + (d.hrv || 0), 0) / data.filter(d => d.hrv).length;
  const totalSteps = data.reduce((sum, d) => sum + (d.steps || 0), 0);

  if (avgHr > 80) {
    insights.push('💓 Votre fréquence cardiaque moyenne est élevée. Pensez à pratiquer des exercices de respiration.');
  }
  
  if (avgHrv && avgHrv < 30) {
    insights.push('📊 Votre variabilité cardiaque suggère un stress élevé. Une séance de méditation pourrait aider.');
  }

  if (totalSteps < 5000) {
    insights.push('🚶 Votre activité physique est faible. Essayez de faire une courte marche.');
  } else if (totalSteps > 10000) {
    insights.push('🎉 Excellent! Vous avez atteint plus de 10 000 pas.');
  }

  return insights;
}

function calculateHealthSummary(data: Array<{
  heart_rate?: number;
  hrv?: number;
  steps?: number;
  sleep_minutes?: number;
  stress_level?: number;
}>) {
  if (data.length === 0) return null;

  const withHr = data.filter(d => d.heart_rate);
  const withHrv = data.filter(d => d.hrv);
  const withSteps = data.filter(d => d.steps);
  const withSleep = data.filter(d => d.sleep_minutes);
  const withStress = data.filter(d => d.stress_level);

  return {
    avgHeartRate: withHr.length ? Math.round(withHr.reduce((s, d) => s + (d.heart_rate || 0), 0) / withHr.length) : null,
    avgHrv: withHrv.length ? Math.round(withHrv.reduce((s, d) => s + (d.hrv || 0), 0) / withHrv.length) : null,
    totalSteps: withSteps.reduce((s, d) => s + (d.steps || 0), 0),
    avgSleepHours: withSleep.length ? Math.round(withSleep.reduce((s, d) => s + (d.sleep_minutes || 0), 0) / withSleep.length / 60 * 10) / 10 : null,
    avgStressLevel: withStress.length ? Math.round(withStress.reduce((s, d) => s + (d.stress_level || 0), 0) / withStress.length) : null,
    dataPoints: data.length
  };
}

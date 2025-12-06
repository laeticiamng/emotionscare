// @ts-nocheck
/**
 * Scans API - Gestion complète des scans émotionnels
 *
 * Endpoints:
 * - POST   /scans           - Créer un scan
 * - GET    /scans           - Liste des scans (avec filtres)
 * - GET    /scans/:id       - Détail d'un scan
 * - DELETE /scans/:id       - Supprimer un scan
 * - GET    /scans/stats     - Statistiques globales
 * - GET    /scans/trends    - Tendances émotionnelles
 * - GET    /scans/patterns  - Patterns comportementaux
 * - GET    /scans/daily     - Scans du jour
 * - GET    /scans/weekly    - Scans de la semaine
 * - GET    /scans/monthly   - Scans du mois
 * - GET    /scans/export    - Export des données
 * - POST   /scans/batch     - Analyse batch
 *
 * @version 1.0.0
 * @created 2025-11-14
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScanData {
  scan_type: 'text' | 'voice' | 'facial' | 'emoji';
  emotions: {
    primary: string;
    secondary?: string;
    confidence: number;
    scores: Record<string, number>;
  };
  mood_score?: number;
  raw_data?: any;
  metadata?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(p => p);
    const mainPath = pathParts[pathParts.length - 1];
    const id = pathParts.length > 1 ? pathParts[pathParts.length - 1] : null;

    // POST /scans - Créer un nouveau scan
    if (req.method === 'POST' && mainPath === 'scans') {
      const scanData: ScanData = await req.json();

      const { data: scan, error } = await supabaseClient
        .from('emotion_scans')
        .insert({
          user_id: user.id,
          scan_type: scanData.scan_type,
          emotions: scanData.emotions,
          mood_score: scanData.mood_score,
          raw_data: scanData.raw_data,
          metadata: scanData.metadata,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(scan), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /scans - Liste des scans avec filtres
    if (req.method === 'GET' && mainPath === 'scans' && !id) {
      const scanType = url.searchParams.get('scan_type');
      const dateFrom = url.searchParams.get('date_from');
      const dateTo = url.searchParams.get('date_to');
      const emotion = url.searchParams.get('emotion');
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const offset = (page - 1) * limit;

      let query = supabaseClient
        .from('emotion_scans')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      if (scanType) {
        query = query.eq('scan_type', scanType);
      }
      if (dateFrom) {
        query = query.gte('created_at', dateFrom);
      }
      if (dateTo) {
        query = query.lte('created_at', dateTo);
      }
      if (emotion) {
        query = query.contains('emotions', { primary: emotion });
      }

      const { data: scans, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return new Response(
        JSON.stringify({
          scans,
          total: count || 0,
          page,
          limit,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /scans/:id - Détail d'un scan
    if (req.method === 'GET' && pathParts.length === 2 && pathParts[0] !== 'scans') {
      const scanId = pathParts[pathParts.length - 1];

      const { data: scan, error } = await supabaseClient
        .from('emotion_scans')
        .select('*')
        .eq('id', scanId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(scan), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE /scans/:id - Supprimer un scan
    if (req.method === 'DELETE' && pathParts.length === 2) {
      const scanId = pathParts[pathParts.length - 1];

      const { error } = await supabaseClient
        .from('emotion_scans')
        .delete()
        .eq('id', scanId)
        .eq('user_id', user.id);

      if (error) throw error;

      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // GET /scans/stats - Statistiques globales
    if (req.method === 'GET' && mainPath === 'stats') {
      const { data: scans, error } = await supabaseClient
        .from('emotion_scans')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const totalScans = scans.length;
      const scansByType: Record<string, number> = {};
      const emotionsDistribution: Record<string, number> = {};
      let totalMoodScore = 0;
      let moodCount = 0;

      scans.forEach((scan: any) => {
        // Compter par type
        scansByType[scan.scan_type] = (scansByType[scan.scan_type] || 0) + 1;

        // Distribution des émotions
        if (scan.emotions?.primary) {
          emotionsDistribution[scan.emotions.primary] =
            (emotionsDistribution[scan.emotions.primary] || 0) + 1;
        }

        // Mood score moyen
        if (scan.mood_score !== null && scan.mood_score !== undefined) {
          totalMoodScore += scan.mood_score;
          moodCount++;
        }
      });

      // Émotion la plus fréquente
      const mostFrequentEmotion = Object.entries(emotionsDistribution)
        .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || 'neutral';

      const averageMoodScore = moodCount > 0 ? totalMoodScore / moodCount : 0;

      return new Response(
        JSON.stringify({
          total_scans: totalScans,
          scans_by_type: scansByType,
          most_frequent_emotion: mostFrequentEmotion,
          average_mood_score: Math.round(averageMoodScore * 10) / 10,
          emotions_distribution: emotionsDistribution,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /scans/trends - Tendances émotionnelles
    if (req.method === 'GET' && mainPath === 'trends') {
      const period = url.searchParams.get('period') || 'weekly';

      let daysBack = 7;
      if (period === 'daily') daysBack = 1;
      else if (period === 'monthly') daysBack = 30;

      const dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - daysBack);

      const { data: scans, error } = await supabaseClient
        .from('emotion_scans')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', dateFrom.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Grouper par date
      const dataPoints: Array<{
        date: string;
        emotion: string;
        count: number;
        avg_mood_score: number;
      }> = [];

      const groupedByDate: Record<string, any[]> = {};
      scans.forEach((scan: any) => {
        const date = scan.created_at.split('T')[0];
        if (!groupedByDate[date]) groupedByDate[date] = [];
        groupedByDate[date].push(scan);
      });

      Object.entries(groupedByDate).forEach(([date, dayScans]) => {
        const emotionCounts: Record<string, number> = {};
        let totalMood = 0;
        let moodCount = 0;

        dayScans.forEach((scan: any) => {
          if (scan.emotions?.primary) {
            emotionCounts[scan.emotions.primary] =
              (emotionCounts[scan.emotions.primary] || 0) + 1;
          }
          if (scan.mood_score) {
            totalMood += scan.mood_score;
            moodCount++;
          }
        });

        const dominantEmotion = Object.entries(emotionCounts)
          .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || 'neutral';

        dataPoints.push({
          date,
          emotion: dominantEmotion,
          count: dayScans.length,
          avg_mood_score: moodCount > 0 ? Math.round((totalMood / moodCount) * 10) / 10 : 0,
        });
      });

      return new Response(
        JSON.stringify({
          period,
          data_points: dataPoints,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /scans/patterns - Patterns comportementaux
    if (req.method === 'GET' && mainPath === 'patterns') {
      const { data: scans, error } = await supabaseClient
        .from('emotion_scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Émotions récurrentes
      const emotionFrequency: Record<string, number> = {};
      const emotionByHour: Record<string, string[]> = {};
      const emotionByDay: Record<string, string[]> = {};

      scans.forEach((scan: any) => {
        const emotion = scan.emotions?.primary;
        if (!emotion) return;

        emotionFrequency[emotion] = (emotionFrequency[emotion] || 0) + 1;

        const date = new Date(scan.created_at);
        const hour = date.getHours();
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });

        if (!emotionByHour[hour]) emotionByHour[hour] = [];
        emotionByHour[hour].push(emotion);

        if (!emotionByDay[day]) emotionByDay[day] = [];
        emotionByDay[day].push(emotion);
      });

      const recurringEmotions = Object.entries(emotionFrequency)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([emotion, frequency]) => ({
          emotion,
          frequency,
          typical_time: 'Variable', // Could be enhanced
        }));

      // Mood patterns par jour
      const moodPatterns = Object.entries(emotionByDay).map(([day, emotions]) => {
        const avgMood = 5; // Simplified - could calculate from actual mood scores
        return { day_of_week: day, avg_mood: avgMood };
      });

      return new Response(
        JSON.stringify({
          recurring_emotions: recurringEmotions,
          mood_patterns: moodPatterns,
          triggers: [], // Could be enhanced with metadata analysis
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /scans/daily - Scans du jour
    if (req.method === 'GET' && mainPath === 'daily') {
      const targetDate = url.searchParams.get('date') || new Date().toISOString().split('T')[0];
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      const { data: scans, error } = await supabaseClient
        .from('emotion_scans')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', targetDate)
        .lt('created_at', nextDay.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify(scans), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /scans/weekly - Scans de la semaine
    if (req.method === 'GET' && mainPath === 'weekly') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data: scans, error } = await supabaseClient
        .from('emotion_scans')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', weekAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify(scans), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /scans/monthly - Scans du mois
    if (req.method === 'GET' && mainPath === 'monthly') {
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);

      const { data: scans, error } = await supabaseClient
        .from('emotion_scans')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', monthAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify(scans), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /scans/export - Export des données
    if (req.method === 'GET' && mainPath === 'export') {
      const format = url.searchParams.get('format') || 'json';

      const { data: scans, error } = await supabaseClient
        .from('emotion_scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (format === 'json') {
        return new Response(JSON.stringify(scans, null, 2), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Content-Disposition': 'attachment; filename="emotion_scans.json"',
          },
        });
      } else if (format === 'csv') {
        // Simple CSV generation
        const headers = ['ID', 'Date', 'Type', 'Émotion Principale', 'Score Mood'];
        const rows = scans.map((scan: any) => [
          scan.id,
          scan.created_at,
          scan.scan_type,
          scan.emotions?.primary || '',
          scan.mood_score || '',
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');

        return new Response(csv, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="emotion_scans.csv"',
          },
        });
      }

      throw new Error('Format non supporté. Utilisez json ou csv.');
    }

    // POST /scans/batch - Analyse batch
    if (req.method === 'POST' && mainPath === 'batch') {
      const { items } = await req.json();

      if (!Array.isArray(items)) {
        throw new Error('items doit être un tableau');
      }

      // Pour chaque item, on crée un scan simple
      const results = [];

      for (const item of items) {
        // Simple emotion mapping (devrait appeler le service d'analyse réel)
        const emotions = {
          primary: 'neutral',
          confidence: 0.7,
          scores: { neutral: 0.7 },
        };

        const { data: scan, error } = await supabaseClient
          .from('emotion_scans')
          .insert({
            user_id: user.id,
            scan_type: item.type,
            emotions,
            raw_data: { data: item.data },
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (!error) {
          results.push(scan);
        }
      }

      return new Response(JSON.stringify(results), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Route non trouvée' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('❌ Scans API Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

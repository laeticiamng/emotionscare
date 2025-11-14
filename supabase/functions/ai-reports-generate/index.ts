// Edge Function: Générer un rapport enrichi IA
// Phase 3 - Excellence

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { OpenAI } from 'https://esm.sh/openai@4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY') || '',
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user_id, type, period_start, period_end, format = 'html', options = {} } =
      await req.json();

    if (!user_id || !type || !period_start || !period_end) {
      throw new Error('Missing required parameters');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const startTime = Date.now();
    const periodStartDate = new Date(period_start);
    const periodEndDate = new Date(period_end);

    // Récupérer les données utilisateur pour la période
    const userData = await fetchUserData(supabaseClient, user_id, periodStartDate, periodEndDate);

    // Analyser avec IA
    const aiAnalysis = await analyzeWithAI(userData, type);

    // Générer les sections du rapport
    const sections = await generateReportSections(userData, aiAnalysis, type, options);

    // Créer le rapport
    const report = {
      user_id,
      type,
      title: generateReportTitle(type, periodStartDate, periodEndDate),
      summary: aiAnalysis.summary,
      period_start: periodStartDate.toISOString(),
      period_end: periodEndDate.toISOString(),
      sections,
      ai_insights: {
        overall_sentiment: aiAnalysis.sentiment,
        key_trends: aiAnalysis.trends,
        recommendations: aiAnalysis.recommendations,
        concerns: aiAnalysis.concerns,
        achievements: aiAnalysis.achievements,
        confidence_score: aiAnalysis.confidence,
      },
      metadata: {
        data_points_analyzed: userData.totalDataPoints,
        ai_model_version: 'gpt-4-turbo-preview',
        generation_time_ms: Date.now() - startTime,
        language: options.language || 'fr',
      },
      format,
      is_shared: false,
      generated_at: new Date().toISOString(),
    };

    // Sauvegarder le rapport
    const { data: savedReport, error } = await supabaseClient
      .from('ai_reports')
      .insert(report)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save report: ${error.message}`);
    }

    // Générer le fichier si nécessaire
    if (format === 'pdf') {
      const pdfUrl = await generatePDF(savedReport);
      await supabaseClient
        .from('ai_reports')
        .update({ file_url: pdfUrl })
        .eq('id', savedReport.id);
      savedReport.file_url = pdfUrl;
    }

    return new Response(
      JSON.stringify({
        success: true,
        report: savedReport,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Report generation error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function fetchUserData(
  supabase: any,
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<any> {
  const [emotions, journal, music, breathing, assessments, health] = await Promise.all([
    // Scans émotionnels
    supabase
      .from('emotion_scans')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString()),

    // Entrées de journal
    supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString()),

    // Sessions de musique
    supabase
      .from('music_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString()),

    // Sessions de respiration
    supabase
      .from('breathing_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString()),

    // Évaluations cliniques
    supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString()),

    // Métriques santé
    supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString()),
  ]);

  return {
    emotions: emotions.data || [],
    journal: journal.data || [],
    music: music.data || [],
    breathing: breathing.data || [],
    assessments: assessments.data || [],
    health: health.data || [],
    totalDataPoints:
      (emotions.data?.length || 0) +
      (journal.data?.length || 0) +
      (music.data?.length || 0) +
      (breathing.data?.length || 0) +
      (assessments.data?.length || 0) +
      (health.data?.length || 0),
  };
}

async function analyzeWithAI(userData: any, reportType: string): Promise<any> {
  const prompt = `Tu es un assistant IA spécialisé en bien-être émotionnel. Analyse les données suivantes et génère un rapport détaillé.

Type de rapport: ${reportType}
Données disponibles:
- ${userData.emotions.length} scans émotionnels
- ${userData.journal.length} entrées de journal
- ${userData.music.length} sessions de musique thérapeutique
- ${userData.breathing.length} sessions de respiration
- ${userData.assessments.length} évaluations cliniques
- ${userData.health.length} métriques de santé

Données brutes (échantillon):
${JSON.stringify(
  {
    emotions: userData.emotions.slice(0, 10),
    journal: userData.journal.slice(0, 5),
    assessments: userData.assessments.slice(0, 3),
  },
  null,
  2
)}

Génère une analyse JSON structurée avec:
1. Un résumé narratif (2-3 paragraphes)
2. Le sentiment général (positive/neutral/negative)
3. 3-5 tendances clés identifiées
4. 3-5 recommandations personnalisées
5. Préoccupations potentielles
6. Réalisations et progrès
7. Un score de confiance (0-100) basé sur la quantité et qualité des données

Format JSON attendu:
{
  "summary": "...",
  "sentiment": "positive|neutral|negative",
  "trends": ["...", "..."],
  "recommendations": ["...", "..."],
  "concerns": ["...", "..."],
  "achievements": ["...", "..."],
  "confidence": 85
}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content:
          'Tu es un expert en analyse de données de bien-être émotionnel. Réponds uniquement en JSON valide.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(completion.choices[0].message.content || '{}');
}

async function generateReportSections(
  userData: any,
  aiAnalysis: any,
  reportType: string,
  options: any
): Promise<any[]> {
  const sections: any[] = [];

  // Section 1: Résumé exécutif
  sections.push({
    title: 'Résumé Exécutif',
    type: 'summary',
    content: aiAnalysis.summary,
    order: 1,
  });

  // Section 2: Évolution émotionnelle
  if (userData.emotions.length > 0 && options.include_charts !== false) {
    const emotionData = processEmotionData(userData.emotions);
    sections.push({
      title: 'Évolution Émotionnelle',
      type: 'chart',
      content: {
        type: 'line',
        title: 'Tendance des émotions',
        data: emotionData,
      },
      order: 2,
    });
  }

  // Section 3: Insights IA
  sections.push({
    title: 'Insights & Tendances',
    type: 'insights',
    content: {
      insights: [
        ...aiAnalysis.trends.map((trend: string) => ({
          type: 'neutral',
          title: 'Tendance identifiée',
          description: trend,
          confidence: aiAnalysis.confidence,
        })),
        ...aiAnalysis.achievements.map((achievement: string) => ({
          type: 'positive',
          title: 'Progrès',
          description: achievement,
          confidence: aiAnalysis.confidence,
        })),
        ...aiAnalysis.concerns.map((concern: string) => ({
          type: 'concern',
          title: 'Point d\'attention',
          description: concern,
          confidence: aiAnalysis.confidence,
        })),
      ],
    },
    order: 3,
  });

  // Section 4: Recommandations
  sections.push({
    title: 'Recommandations Personnalisées',
    type: 'recommendations',
    content: {
      insights: aiAnalysis.recommendations.map((rec: string, i: number) => ({
        type: 'recommendation',
        title: `Recommandation ${i + 1}`,
        description: rec,
        confidence: aiAnalysis.confidence,
        actionItems: [],
      })),
    },
    order: 4,
  });

  // Section 5: Statistiques
  if (options.include_raw_data) {
    sections.push({
      title: 'Statistiques Détaillées',
      type: 'table',
      content: {
        headers: ['Métrique', 'Valeur'],
        rows: [
          ['Scans émotionnels', userData.emotions.length],
          ['Entrées de journal', userData.journal.length],
          ['Sessions de musique', userData.music.length],
          ['Sessions de respiration', userData.breathing.length],
          ['Évaluations', userData.assessments.length],
          ['Métriques santé', userData.health.length],
        ],
      },
      order: 5,
    });
  }

  return sections;
}

function processEmotionData(emotions: any[]): any {
  // Grouper par jour
  const byDay = emotions.reduce((acc: any, scan: any) => {
    const day = new Date(scan.created_at).toISOString().split('T')[0];
    if (!acc[day]) acc[day] = [];
    acc[day].push(scan);
    return acc;
  }, {});

  const labels = Object.keys(byDay).sort();
  const avgScores = labels.map((day) => {
    const scans = byDay[day];
    const total = scans.reduce((sum: number, s: any) => sum + (s.score || 50), 0);
    return total / scans.length;
  });

  return {
    labels,
    datasets: [
      {
        label: 'Score émotionnel moyen',
        data: avgScores,
        borderColor: 'rgb(75, 192, 192)',
      },
    ],
  };
}

function generateReportTitle(
  type: string,
  startDate: Date,
  endDate: Date
): string {
  const start = startDate.toLocaleDateString('fr-FR');
  const end = endDate.toLocaleDateString('fr-FR');

  const titles: Record<string, string> = {
    weekly_summary: `Résumé Hebdomadaire (${start} - ${end})`,
    monthly_summary: `Résumé Mensuel (${start} - ${end})`,
    quarterly_review: `Bilan Trimestriel (${start} - ${end})`,
    mood_analysis: `Analyse d'Humeur (${start} - ${end})`,
    progress_report: `Rapport de Progrès (${start} - ${end})`,
    health_insights: `Insights Santé (${start} - ${end})`,
  };

  return titles[type] || `Rapport (${start} - ${end})`;
}

async function generatePDF(report: any): Promise<string> {
  // TODO: Implémenter la génération PDF
  // Pour l'instant, retourner une URL placeholder
  return `https://placeholder.com/reports/${report.id}.pdf`;
}

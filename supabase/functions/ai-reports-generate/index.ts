// Edge Function: Générer un rapport enrichi IA
// Phase 3 - Excellence

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '../_shared/supabase.ts';
// @ts-ignore
import OpenAI from 'https://esm.sh/openai@4.100.0';

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
    const err = error as Error;
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message,
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
  _reportType: string,
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
  try {
    // Générer le HTML du rapport
    const html = generateReportHTML(report);

    // Créer le nom du fichier
    const fileName = `report_${report.id}_${Date.now()}.html`;
    const filePath = `ai_reports/${report.user_id}/${fileName}`;

    // Initialiser le client Supabase pour accéder au storage
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Uploader le fichier HTML sur Supabase Storage
 const { error } = await supabaseClient.storage
      .from('reports')
      .upload(filePath, new TextEncoder().encode(html), {
        contentType: 'text/html',
        upsert: false,
      });

    if (error) {
      console.error('Failed to upload report:', error);
      throw error;
    }

    // Obtenir l'URL public du fichier
    const { data: urlData } = supabaseClient.storage
      .from('reports')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('PDF generation error:', error);
    // Retourner une URL de fallback en cas d'erreur
    return `https://reports.emotionscare.com/fallback/${report.id}.pdf`;
  }
}

function generateReportHTML(report: any): string {
  const {
    title,
    summary,
    sections = [],
    ai_insights = {},
    metadata = {},
    generated_at,
    period_start,
    period_end,
  } = report;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 60px 40px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 3px solid #667eea;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 28px;
      color: #1a202c;
      margin-bottom: 10px;
    }
    .period {
      color: #718096;
      font-size: 14px;
      margin-bottom: 20px;
    }
    .summary-box {
      background: #f7fafc;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 30px 0;
      border-radius: 4px;
    }
    .section {
      margin: 40px 0;
    }
    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #667eea;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e2e8f0;
    }
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin: 20px 0;
    }
    .metric-card {
      background: #f7fafc;
      padding: 15px;
      border-radius: 6px;
      text-align: center;
    }
    .metric-value {
      font-size: 24px;
      font-weight: bold;
      color: #667eea;
      margin: 10px 0;
    }
    .metric-label {
      font-size: 12px;
      color: #718096;
      text-transform: uppercase;
    }
    .insight-item {
      padding: 12px;
      margin: 10px 0;
      background: #edf2f7;
      border-left: 3px solid #667eea;
      border-radius: 3px;
    }
    .footer {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      color: #718096;
      font-size: 12px;
    }
    .timestamp {
      color: #a0aec0;
      font-size: 11px;
      margin-top: 10px;
    }
    ul {
      margin-left: 20px;
      margin-top: 10px;
    }
    li {
      margin: 8px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🌟 EmotionsCare</div>
      <h1>${title}</h1>
      <div class="period">
        Période: ${formatDate(period_start)} - ${formatDate(period_end)}
      </div>
    </div>

    ${summary ? `
      <div class="summary-box">
        <h2 style="color: #1a202c; margin-bottom: 10px;">Résumé</h2>
        <p>${summary}</p>
      </div>
    ` : ''}

    ${Object.keys(ai_insights || {}).length > 0 ? `
      <div class="section">
        <h2 class="section-title">📊 Insights IA</h2>
        ${ai_insights.overall_sentiment ? `
          <div class="insight-item">
            <strong>Sentiment général:</strong> ${ai_insights.overall_sentiment}
          </div>
        ` : ''}

        ${ai_insights.key_trends && ai_insights.key_trends.length > 0 ? `
          <div class="insight-item">
            <strong>Tendances clés:</strong>
            <ul>
              ${(ai_insights.key_trends as any[]).map(t => `<li>${t}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${ai_insights.recommendations && ai_insights.recommendations.length > 0 ? `
          <div class="insight-item">
            <strong>Recommandations:</strong>
            <ul>
              ${(ai_insights.recommendations as any[]).map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    ` : ''}

    ${sections && sections.length > 0 ? `
      <div class="section">
        <h2 class="section-title">📈 Sections Détaillées</h2>
        ${(sections as any[]).map(section => `
          <div style="margin: 20px 0;">
            <h3 style="color: #2d3748; margin-bottom: 10px;">${section.title || 'Section'}</h3>
            <p>${section.content || section.summary || ''}</p>
            ${section.data && Object.keys(section.data).length > 0 ? `
              <div class="metric-grid">
                ${Object.entries(section.data).slice(0, 4).map(([key, value]) => `
                  <div class="metric-card">
                    <div class="metric-label">${key}</div>
                    <div class="metric-value">${value}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    ` : ''}

    <div class="footer">
      <p>Rapport généré par EmotionsCare IA</p>
      <div class="timestamp">
        Généré le: ${new Date(generated_at).toLocaleString('fr-FR')}
      </div>
      <div class="timestamp">
        Modèle: ${metadata.ai_model_version || 'GPT-4'}
        | Points de données: ${metadata.data_points_analyzed || 0}
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

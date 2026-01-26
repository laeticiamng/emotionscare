// @ts-nocheck
/**
 * US-7: Context-Lens Reports API
 * POST /brain/{patientId}/report - Lancer génération
 * GET /reports/{reportId} - Statut et téléchargement
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-context-lens-version',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

async function validateToken(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  
  const token = authHeader.slice(7);
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) return null;
  return user;
}

interface ReportRequest {
  title?: string;
  include_brain_scan?: boolean;
  include_emotions_history?: boolean;
  include_assessments?: boolean;
  include_notes?: boolean;
  ar_captures?: Array<{
    image_url: string;
    timestamp: string;
    annotations?: string;
  }>;
  date_range?: {
    from: string;
    to: string;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const user = await validateToken(req);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: req.headers.get('authorization') || '' } }
    });

    // POST /brain/{patientId}/report - Lancer génération
    if (req.method === 'POST') {
      const patientIdIndex = pathParts.findIndex(p => 
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p)
      );
      
      if (patientIdIndex < 0) {
        return new Response(
          JSON.stringify({ error: 'invalid_request', message: 'Patient ID required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const patientId = pathParts[patientIdIndex];
      const body: ReportRequest = await req.json();

      // Récupérer les informations du patient
      const { data: patient } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', patientId)
        .single();

      const patientName = patient 
        ? `${patient.first_name || ''} ${patient.last_name || ''}`.trim() 
        : 'Patient';

      // Créer l'entrée du rapport
      const reportId = crypto.randomUUID();
      const { error: insertError } = await supabase
        .from('report_history')
        .insert({
          id: reportId,
          user_id: patientId,
          report_type: 'context-lens-session',
          title: body.title || `Rapport Context-Lens - ${patientName}`,
          status: 'processing',
          metadata: {
            requested_by: user.id,
            include_brain_scan: body.include_brain_scan ?? true,
            include_emotions_history: body.include_emotions_history ?? true,
            include_assessments: body.include_assessments ?? true,
            include_notes: body.include_notes ?? true,
            ar_captures_count: body.ar_captures?.length || 0,
            date_range: body.date_range || {
              from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              to: new Date().toISOString(),
            },
          },
        });

      if (insertError) {
        console.error('[REPORTS] Insert error:', insertError);
        return new Response(
          JSON.stringify({ error: 'create_failed', message: insertError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Lancer la génération asynchrone (appel à html-to-pdf)
      const generateReport = async () => {
        try {
          // Collecter les données
          const [emotionsData, assessmentsData, notesData, scanData] = await Promise.all([
            body.include_emotions_history 
              ? supabase
                  .from('emotion_brain_mappings')
                  .select('timestamp, mappings')
                  .eq('patient_id', patientId)
                  .order('timestamp', { ascending: false })
                  .limit(100)
              : { data: [] },
            body.include_assessments
              ? supabase
                  .from('assessments')
                  .select('instrument, score_json, submitted_at')
                  .eq('user_id', patientId)
                  .order('submitted_at', { ascending: false })
                  .limit(20)
              : { data: [] },
            body.include_notes
              ? supabase
                  .from('journal_entries')
                  .select('content, created_at, metadata')
                  .eq('user_id', patientId)
                  .eq('type', 'clinical_note')
                  .order('created_at', { ascending: false })
                  .limit(50)
              : { data: [] },
            body.include_brain_scan
              ? supabase
                  .from('brain_scans')
                  .select('id, modality, scan_date, thumbnail_path')
                  .eq('patient_id', patientId)
                  .eq('status', 'ready')
                  .order('created_at', { ascending: false })
                  .limit(1)
              : { data: [] },
          ]);

          // Générer le HTML du rapport
          const htmlContent = generateReportHTML({
            patientName,
            patientId,
            emotions: emotionsData.data || [],
            assessments: assessmentsData.data || [],
            notes: notesData.data || [],
            scan: scanData.data?.[0],
            arCaptures: body.ar_captures || [],
            generatedAt: new Date().toISOString(),
          });

          // Appeler html-to-pdf pour générer le PDF
          const { data: pdfData, error: pdfError } = await supabase.functions.invoke('html-to-pdf', {
            body: { html: htmlContent, filename: `context-lens-report-${reportId}.pdf` },
          });

          if (pdfError) throw pdfError;

          // Mettre à jour le statut
          await supabase
            .from('report_history')
            .update({
              status: 'completed',
              file_path: pdfData?.filePath,
              completed_at: new Date().toISOString(),
            })
            .eq('id', reportId);

        } catch (error) {
          console.error('[REPORTS] Generation error:', error);
          await supabase
            .from('report_history')
            .update({
              status: 'failed',
              error_message: (error as Error).message,
            })
            .eq('id', reportId);
        }
      };

      // Lancer en background (non-bloquant)
      EdgeRuntime.waitUntil(generateReport());

      console.log(`[REPORTS] Report ${reportId} queued for patient ${patientId}`);

      return new Response(
        JSON.stringify({
          success: true,
          report_id: reportId,
          status: 'processing',
          message: 'Report generation started',
          estimated_time_seconds: 30,
        }),
        { status: 202, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /reports/{reportId} - Statut et téléchargement
    if (req.method === 'GET') {
      const reportIdIndex = pathParts.findIndex(p => 
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p)
      );
      
      if (reportIdIndex < 0) {
        return new Response(
          JSON.stringify({ error: 'invalid_request', message: 'Report ID required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const reportId = pathParts[reportIdIndex];

      const { data: report, error } = await supabase
        .from('report_history')
        .select('*')
        .eq('id', reportId)
        .single();

      if (error || !report) {
        return new Response(
          JSON.stringify({ error: 'not_found', message: 'Report not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Générer l'URL de téléchargement si complété
      let downloadUrl = null;
      if (report.status === 'completed' && report.file_path) {
        const { data: urlData } = supabase.storage
          .from('reports')
          .getPublicUrl(report.file_path);
        downloadUrl = urlData.publicUrl;
      }

      return new Response(
        JSON.stringify({
          id: report.id,
          status: report.status,
          title: report.title,
          created_at: report.created_at,
          completed_at: report.completed_at,
          download_url: downloadUrl,
          error_message: report.error_message,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'method_not_allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[REPORTS] Error:', error);
    return new Response(
      JSON.stringify({ error: 'server_error', message: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateReportHTML(data: {
  patientName: string;
  patientId: string;
  emotions: any[];
  assessments: any[];
  notes: any[];
  scan: any;
  arCaptures: any[];
  generatedAt: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Rapport Context-Lens - ${data.patientName}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #1f2937; }
    h1 { color: #9333ea; border-bottom: 2px solid #9333ea; padding-bottom: 10px; }
    h2 { color: #6b7280; margin-top: 30px; }
    .section { margin-bottom: 30px; padding: 20px; background: #f9fafb; border-radius: 8px; }
    .emotion-bar { height: 20px; background: #e5e7eb; border-radius: 4px; margin: 5px 0; }
    .emotion-fill { height: 100%; border-radius: 4px; }
    .note { padding: 15px; background: white; border-left: 3px solid #9333ea; margin: 10px 0; }
    .assessment { display: flex; justify-content: space-between; padding: 10px; background: white; margin: 5px 0; }
    .footer { margin-top: 50px; text-align: center; color: #9ca3af; font-size: 12px; }
    .ar-capture { max-width: 400px; margin: 10px; border: 1px solid #e5e7eb; border-radius: 8px; }
  </style>
</head>
<body>
  <h1>🧠 Rapport Context-Lens</h1>
  <p><strong>Patient:</strong> ${data.patientName} (ID: ${data.patientId.slice(0, 8)}...)</p>
  <p><strong>Généré le:</strong> ${new Date(data.generatedAt).toLocaleString('fr-FR')}</p>

  ${data.scan ? `
  <div class="section">
    <h2>📷 Imagerie Cérébrale</h2>
    <p><strong>Modalité:</strong> ${data.scan.modality}</p>
    <p><strong>Date du scan:</strong> ${data.scan.scan_date ? new Date(data.scan.scan_date).toLocaleDateString('fr-FR') : 'Non spécifiée'}</p>
  </div>
  ` : ''}

  <div class="section">
    <h2>😊 Émotions (${data.emotions.length} enregistrements)</h2>
    ${data.emotions.slice(0, 10).map(e => `
      <p><strong>${new Date(e.timestamp).toLocaleString('fr-FR')}</strong></p>
      ${Object.entries(e.mappings || {}).map(([emotion, value]) => `
        <div>
          <span>${emotion}: ${((value as number) * 100).toFixed(0)}%</span>
          <div class="emotion-bar">
            <div class="emotion-fill" style="width: ${(value as number) * 100}%; background: ${getEmotionColor(emotion)};"></div>
          </div>
        </div>
      `).join('')}
    `).join('<hr>')}
  </div>

  ${data.assessments.length > 0 ? `
  <div class="section">
    <h2>📋 Évaluations Cliniques</h2>
    ${data.assessments.map(a => `
      <div class="assessment">
        <span><strong>${a.instrument}</strong></span>
        <span>${new Date(a.submitted_at).toLocaleDateString('fr-FR')}</span>
        <span>Score: ${JSON.stringify(a.score_json).slice(0, 50)}...</span>
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${data.notes.length > 0 ? `
  <div class="section">
    <h2>📝 Notes Cliniques</h2>
    ${data.notes.map(n => `
      <div class="note">
        <p>${n.content}</p>
        <small>${new Date(n.created_at).toLocaleString('fr-FR')}</small>
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${data.arCaptures.length > 0 ? `
  <div class="section">
    <h2>📸 Captures AR</h2>
    ${data.arCaptures.map(c => `
      <div>
        <img src="${c.image_url}" alt="Capture AR" class="ar-capture" />
        <p>${c.annotations || ''}</p>
        <small>${new Date(c.timestamp).toLocaleString('fr-FR')}</small>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="footer">
    <p>Rapport généré par EmotionsCare Context-Lens API</p>
    <p>© ${new Date().getFullYear()} EmotionsCare - Confidentiel</p>
  </div>
</body>
</html>
  `;
}

function getEmotionColor(emotion: string): string {
  const colors: Record<string, string> = {
    anxiety: '#EF4444',
    joy: '#10B981',
    sadness: '#3B82F6',
    anger: '#F59E0B',
    disgust: '#8B5CF6',
    fear: '#DC2626',
    surprise: '#EC4899',
    stress: '#F97316',
  };
  return colors[emotion] || '#6B7280';
}

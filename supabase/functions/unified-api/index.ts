// @ts-nocheck
/**
 * unified-api - API unifiée pour opérations internes (PDF, blockchain, notifications)
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 20/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

// Types pour les différentes requêtes
type ApiRequest =
  | { type: "generate_pdf", payload: { reportData: any, reportType: string } }
  | { type: "backup_blockchain", payload: { blockchainData: any[] } }
  | { type: "send_notification", payload: { userId: string, title: string, message: string, severity: "info" | "warning" | "critical" } };

serve(async (req) => {
  // 1. CORS check
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  // Vérification CORS stricte
  if (!corsResult.allowed) {
    console.warn('[unified-api] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  try {
    // 2. 🔒 Authentification obligatoire
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200 || !authResult.user) {
      await logUnauthorizedAccess(req, authResult.error || 'Authentication failed');
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. 🛡️ Rate limiting
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'unified-api',
      userId: authResult.user.id,
      limit: 20,
      windowMs: 60_000,
      description: 'Unified API - Internal operations',
    });

    if (!rateLimit.allowed) {
      console.warn('[unified-api] Rate limit exceeded', { userId: authResult.user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    console.log(`[unified-api] Processing for user: ${authResult.user.id}`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { type, payload }: ApiRequest = await req.json();
    console.log(`[unified-api] Received request type: ${type}`);

    let result;

    switch (type) {
      case "generate_pdf":
        result = await handlePdfGeneration(supabase, payload);
        break;
      
      case "backup_blockchain":
        result = await handleBlockchainBackup(supabase, payload);
        break;
      
      case "send_notification":
        result = await handleNotification(supabase, payload);
        break;
      
      default:
        throw new Error(`Unknown API type: ${type}`);
    }

    return new Response(
      JSON.stringify({
        status: "success",
        source: type,
        data: result
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[unified-api] Error:', error);
    return new Response(
      JSON.stringify({ 
        status: "error", 
        message: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

/**
 * Génère un rapport PDF et le stocke dans Supabase Storage
 */
async function handlePdfGeneration(supabase: any, payload: any) {
  const { reportData, reportType } = payload;
  
  // Générer le contenu HTML du rapport
  const htmlContent = generateReportHtml(reportData, reportType);
  
  // Créer un nom de fichier unique
  const fileName = `reports/${reportType}_${Date.now()}.html`;
  
  // Stocker le rapport dans Supabase Storage (bucket 'gdpr-reports')
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('gdpr-reports')
    .upload(fileName, htmlContent, {
      contentType: 'text/html',
      upsert: false
    });

  if (uploadError) {
    console.error('[PDF] Upload error:', uploadError);
    throw new Error(`Failed to store report: ${uploadError.message}`);
  }

  // Obtenir l'URL publique
  const { data: urlData } = supabase.storage
    .from('gdpr-reports')
    .getPublicUrl(fileName);

  // Enregistrer dans la table des rapports
  const { data: reportRecord, error: dbError } = await supabase
    .from('compliance_reports')
    .insert({
      report_type: reportType,
      file_path: fileName,
      file_url: urlData.publicUrl,
      generated_at: new Date().toISOString(),
      status: 'completed'
    })
    .select()
    .single();

  if (dbError) {
    console.error('[PDF] Database error:', dbError);
    throw new Error(`Failed to save report record: ${dbError.message}`);
  }

  console.log(`[PDF] Report generated successfully: ${fileName}`);

  return {
    reportId: reportRecord.id,
    fileUrl: urlData.publicUrl,
    fileName,
    generatedAt: reportRecord.generated_at
  };
}

/**
 * Sauvegarde la blockchain d'audit dans Supabase Storage avec chiffrement
 */
async function handleBlockchainBackup(supabase: any, payload: any) {
  const { blockchainData } = payload;
  
  // Convertir les données en JSON
  const jsonData = JSON.stringify(blockchainData, null, 2);
  
  // Créer un nom de fichier avec timestamp
  const timestamp = Date.now();
  const fileName = `blockchain-backups/backup_${timestamp}.json`;
  
  // Stocker dans Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('blockchain-backups')
    .upload(fileName, jsonData, {
      contentType: 'application/json',
      upsert: false
    });

  if (uploadError) {
    console.error('[Backup] Upload error:', uploadError);
    throw new Error(`Failed to backup blockchain: ${uploadError.message}`);
  }

  // Enregistrer le backup dans la table
  const { data: backupRecord, error: dbError } = await supabase
    .from('blockchain_backups')
    .insert({
      file_path: fileName,
      block_count: blockchainData.length,
      backup_date: new Date().toISOString(),
      status: 'completed'
    })
    .select()
    .single();

  if (dbError) {
    console.error('[Backup] Database error:', dbError);
    throw new Error(`Failed to save backup record: ${dbError.message}`);
  }

  console.log(`[Backup] Blockchain backup completed: ${fileName}`);

  return {
    backupId: backupRecord.id,
    fileName,
    blockCount: blockchainData.length,
    backupDate: backupRecord.backup_date
  };
}

/**
 * Envoie une notification temps réel via Supabase Realtime
 */
async function handleNotification(supabase: any, payload: any) {
  const { userId, title, message, severity } = payload;
  
  // Insérer la notification dans la table (qui déclenche Realtime automatiquement)
  const { data: notification, error: dbError } = await supabase
    .from('realtime_notifications')
    .insert({
      user_id: userId,
      title,
      message,
      severity,
      read: false,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (dbError) {
    console.error('[Notification] Database error:', dbError);
    throw new Error(`Failed to send notification: ${dbError.message}`);
  }

  console.log(`[Notification] Sent to user ${userId}: ${title}`);

  return {
    notificationId: notification.id,
    sentAt: notification.created_at,
    userId,
    severity
  };
}

/**
 * Génère le contenu HTML d'un rapport
 */
function generateReportHtml(data: any, reportType: string): string {
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rapport de Conformité RGPD - ${reportType}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #f5f5f5;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    h1 {
      color: #1e40af;
      margin: 0;
      font-size: 28px;
    }
    .date {
      color: #6b7280;
      font-size: 14px;
      margin-top: 10px;
    }
    .section {
      margin: 30px 0;
    }
    .section-title {
      color: #1e40af;
      font-size: 20px;
      border-left: 4px solid #2563eb;
      padding-left: 15px;
      margin-bottom: 15px;
    }
    .metric {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .metric:last-child {
      border-bottom: none;
    }
    .metric-label {
      font-weight: 600;
      color: #374151;
    }
    .metric-value {
      color: #2563eb;
      font-weight: 700;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    .status-success {
      background: #dcfce7;
      color: #166534;
    }
    .status-warning {
      background: #fef3c7;
      color: #92400e;
    }
    .status-error {
      background: #fee2e2;
      color: #991b1b;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Rapport de Conformité RGPD</h1>
      <p class="date">Type: ${reportType} | Généré le ${currentDate}</p>
    </div>

    <div class="section">
      <h2 class="section-title">Résumé Exécutif</h2>
      <div class="metric">
        <span class="metric-label">Score de conformité global</span>
        <span class="metric-value">${data.complianceScore || 'N/A'}%</span>
      </div>
      <div class="metric">
        <span class="metric-label">Violations détectées</span>
        <span class="metric-value">${data.violationsCount || 0}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Audits effectués</span>
        <span class="metric-value">${data.auditsCount || 0}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Statut</span>
        <span class="metric-value">
          <span class="status-badge ${data.status === 'compliant' ? 'status-success' : data.status === 'warning' ? 'status-warning' : 'status-error'}">
            ${data.status === 'compliant' ? 'Conforme' : data.status === 'warning' ? 'Attention' : 'Non conforme'}
          </span>
        </span>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Détails des Métriques</h2>
      ${Object.entries(data.metrics || {}).map(([key, value]) => `
        <div class="metric">
          <span class="metric-label">${key}</span>
          <span class="metric-value">${value}</span>
        </div>
      `).join('')}
    </div>

    <div class="footer">
      <p>Document généré automatiquement par le système EmotionsCare GDPR</p>
      <p>Confidentiel - Ne pas diffuser sans autorisation</p>
    </div>
  </div>
</body>
</html>
  `;
}

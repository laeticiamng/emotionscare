import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WeeklyReportData {
  userName: string;
  userEmail: string;
  weekStart: string;
  weekEnd: string;
  totalSessions: number;
  emotionalScore: number;
  topEmotion: string;
  mindfulnessMinutes: number;
  achievements: string[];
  recommendedActions: string[];
}

function generateWeeklyReportHTML(data: WeeklyReportData): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre Rapport Hebdomadaire EmotionsCare</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 2px solid #e5e7eb;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #6366f1;
      margin-bottom: 8px;
    }
    .period {
      color: #6b7280;
      font-size: 14px;
    }
    .greeting {
      font-size: 20px;
      margin-bottom: 16px;
      color: #111827;
    }
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin: 24px 0;
    }
    .metric-card {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .metric-value {
      font-size: 32px;
      font-weight: bold;
      color: #6366f1;
      margin: 8px 0;
    }
    .metric-label {
      font-size: 14px;
      color: #6b7280;
    }
    .section {
      margin: 24px 0;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 12px;
      color: #111827;
    }
    .achievement {
      background: #ecfdf5;
      color: #047857;
      padding: 12px;
      border-radius: 6px;
      margin: 8px 0;
      border-left: 4px solid #10b981;
    }
    .recommendation {
      background: #eff6ff;
      color: #1e40af;
      padding: 12px;
      border-radius: 6px;
      margin: 8px 0;
      border-left: 4px solid #3b82f6;
    }
    .cta-button {
      display: inline-block;
      background: #6366f1;
      color: white;
      padding: 14px 32px;
      border-radius: 8px;
      text-decoration: none;
      margin: 24px 0;
      font-weight: 600;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
    }
    .emoji {
      font-size: 24px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">EmotionsCare 🌟</div>
      <div class="period">${data.weekStart} - ${data.weekEnd}</div>
    </div>

    <div class="greeting">
      Bonjour ${data.userName} ! 👋
    </div>

    <p>Voici votre résumé de la semaine. Vous progressez admirablement bien !</p>

    <div class="metric-grid">
      <div class="metric-card">
        <div class="metric-label">Sessions</div>
        <div class="metric-value">${data.totalSessions}</div>
        <div class="emoji">🎯</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Score émotionnel</div>
        <div class="metric-value">${data.emotionalScore}/10</div>
        <div class="emoji">💚</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Émotion dominante</div>
        <div class="metric-value">${data.topEmotion}</div>
        <div class="emoji">😊</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Minutes de pleine conscience</div>
        <div class="metric-value">${data.mindfulnessMinutes}</div>
        <div class="emoji">🧘</div>
      </div>
    </div>

    ${data.achievements.length > 0 ? `
      <div class="section">
        <div class="section-title">🏆 Réalisations de la semaine</div>
        ${data.achievements.map(achievement => `
          <div class="achievement">${achievement}</div>
        `).join('')}
      </div>
    ` : ''}

    ${data.recommendedActions.length > 0 ? `
      <div class="section">
        <div class="section-title">💡 Actions recommandées</div>
        ${data.recommendedActions.map(action => `
          <div class="recommendation">${action}</div>
        `).join('')}
      </div>
    ` : ''}

    <center>
      <a href="https://app.emotionscare.com" class="cta-button">
        Voir le rapport complet
      </a>
    </center>

    <div class="footer">
      <p>Vous recevez cet email car vous êtes inscrit à EmotionsCare.</p>
      <p>EmotionsCare - Votre compagnon de bien-être émotionnel</p>
      <p style="margin-top: 16px;">
        <a href="https://app.emotionscare.com/settings/notifications" style="color: #6366f1; text-decoration: none;">
          Gérer mes préférences d'emails
        </a>
      </p>
    </div>
  </div>

  <!-- Tracking pixel for email opens -->
  <img src="https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/track-email-open?email=${encodeURIComponent(data.userEmail)}&type=weekly_report" width="1" height="1" alt="" />
</body>
</html>
  `;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const reportData: WeeklyReportData = await req.json();

    console.log(`📧 Sending weekly report to ${reportData.userEmail}`);

    const html = generateWeeklyReportHTML(reportData);

    const { data, error } = await resend.emails.send({
      from: "EmotionsCare <rapports@emotionscare.com>",
      to: [reportData.userEmail],
      subject: `📊 Votre rapport hebdomadaire EmotionsCare (${reportData.weekStart} - ${reportData.weekEnd})`,
      html,
      headers: {
        "X-Entity-Ref-ID": `weekly-report-${Date.now()}`,
      },
      tags: [
        { name: "category", value: "weekly-report" },
        { name: "user", value: reportData.userEmail },
      ],
    });

    if (error) {
      console.error("❌ Resend error:", error);
      throw error;
    }

    console.log("✅ Email sent successfully:", data?.id);

    return new Response(
      JSON.stringify({
        success: true,
        emailId: data?.id,
        message: "Weekly report sent successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("❌ Error sending weekly report:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to send weekly report",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationData {
  userEmail: string;
  userName: string;
  notificationType: "achievement" | "reminder" | "alert" | "welcome";
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}

function generateNotificationHTML(data: NotificationData): string {
  const icons = {
    achievement: "🏆",
    reminder: "⏰",
    alert: "⚠️",
    welcome: "👋",
  };

  const colors = {
    achievement: { bg: "#ecfdf5", border: "#10b981", text: "#047857" },
    reminder: { bg: "#eff6ff", border: "#3b82f6", text: "#1e40af" },
    alert: { bg: "#fef2f2", border: "#ef4444", text: "#991b1b" },
    welcome: { bg: "#f5f3ff", border: "#8b5cf6", text: "#6d28d9" },
  };

  const style = colors[data.notificationType];

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
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
    .icon-box {
      width: 64px;
      height: 64px;
      background: ${style.bg};
      border: 2px solid ${style.border};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      margin: 0 auto 24px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      color: #111827;
      margin-bottom: 16px;
    }
    .message {
      color: #4b5563;
      text-align: center;
      margin-bottom: 24px;
      line-height: 1.8;
    }
    .cta-button {
      display: inline-block;
      background: #6366f1;
      color: white !important;
      padding: 14px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      text-align: center;
      width: 100%;
      box-sizing: border-box;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon-box">
      ${icons[data.notificationType]}
    </div>
    
    <div class="title">${data.title}</div>
    
    <div class="message">
      Bonjour ${data.userName},<br><br>
      ${data.message}
    </div>

    ${data.actionUrl ? `
      <center>
        <a href="${data.actionUrl}" class="cta-button">
          ${data.actionText || "Voir plus"}
        </a>
      </center>
    ` : ''}

    <div class="footer">
      <p>EmotionsCare - Votre compagnon de bien-être émotionnel</p>
      <p style="margin-top: 16px;">
        <a href="https://app.emotionscare.com/settings/notifications" style="color: #6366f1; text-decoration: none;">
          Gérer mes préférences d'emails
        </a>
      </p>
    </div>
  </div>

  <!-- Tracking pixel -->
  <img src="https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/track-email-open?email=${encodeURIComponent(data.userEmail)}&type=${data.notificationType}" width="1" height="1" alt="" />
</body>
</html>
  `;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const notificationData: NotificationData = await req.json();

    console.log(`📧 Sending ${notificationData.notificationType} notification to ${notificationData.userEmail}`);

    const html = generateNotificationHTML(notificationData);

    const { data, error } = await resend.emails.send({
      from: "EmotionsCare <notifications@emotionscare.com>",
      to: [notificationData.userEmail],
      subject: notificationData.title,
      html,
      headers: {
        "X-Entity-Ref-ID": `notification-${Date.now()}`,
      },
      tags: [
        { name: "category", value: notificationData.notificationType },
        { name: "user", value: notificationData.userEmail },
      ],
    });

    if (error) {
      console.error("❌ Resend error:", error);
      throw error;
    }

    console.log("✅ Notification email sent:", data?.id);

    return new Response(
      JSON.stringify({
        success: true,
        emailId: data?.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("❌ Error sending notification:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to send notification",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

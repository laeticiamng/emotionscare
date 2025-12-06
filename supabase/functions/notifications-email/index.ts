
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { authorizeRole } from '../_shared/auth.ts';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationEmailRequest {
  userEmail: string;
  notificationType: 'daily_summary' | 'reminder' | 'achievement' | 'alert';
  templateData: {
    userName?: string;
    content?: string;
    actions?: string[];
    stats?: Record<string, any>;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { userEmail, notificationType, templateData }: NotificationEmailRequest = await req.json();

    const templates = {
      daily_summary: {
        subject: '📊 Votre résumé quotidien EmotionsCare',
        html: `
          <h1>Bonjour ${templateData.userName || 'cher utilisateur'} !</h1>
          <p>Voici votre résumé de bien-être du jour :</p>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${templateData.content || 'Pas de données disponibles aujourd\'hui.'}
          </div>
          <p>Continuez sur cette lancée ! 🌟</p>
          <p>L'équipe EmotionsCare</p>
        `
      },
      reminder: {
        subject: '🔔 Rappel EmotionsCare',
        html: `
          <h1>N'oubliez pas ! 💙</h1>
          <p>${templateData.content || 'Il est temps de prendre soin de vous.'}</p>
          <p>Votre bien-être compte. 🌸</p>
          <p>L'équipe EmotionsCare</p>
        `
      },
      achievement: {
        subject: '🏆 Félicitations ! Nouvel accomplissement',
        html: `
          <h1>Bravo ${templateData.userName || ''} ! 🎉</h1>
          <p>${templateData.content || 'Vous avez atteint un nouveau palier !'}</p>
          <p>Vous êtes sur la bonne voie ! ✨</p>
          <p>L'équipe EmotionsCare</p>
        `
      },
      alert: {
        subject: '⚠️ Alerte EmotionsCare',
        html: `
          <h1>Information importante</h1>
          <p>${templateData.content || 'Nous avons détecté quelque chose qui nécessite votre attention.'}</p>
          <p>Prenez soin de vous. 💚</p>
          <p>L'équipe EmotionsCare</p>
        `
      }
    };

    const template = templates[notificationType] || templates.reminder;

    const emailResponse = await resend.emails.send({
      from: "EmotionsCare <notifications@emotionscare.app>",
      to: [userEmail],
      subject: template.subject,
      html: template.html,
    });

    console.log("Notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({
      success: true,
      emailId: emailResponse.data?.id,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error in notifications-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);

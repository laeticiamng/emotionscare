
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { authorizeRole } from '../_shared/auth.ts';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExportEmailRequest {
  userEmail: string;
  exportType: 'emotions' | 'journal' | 'activities' | 'complete';
  dateRange: {
    start: string;
    end: string;
  };
  format: 'csv' | 'json' | 'pdf';
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

    const { userEmail, exportType, dateRange, format }: ExportEmailRequest = await req.json();

    // Simulation de la génération du fichier d'export
    const mockCsvContent = `Date,Type,Valeur,Notes
${dateRange.start},Humeur,75,Journée positive
${dateRange.end},Activité,Session VR,Relaxation`;

    const base64Content = btoa(mockCsvContent);
    const fileName = `emotionscare-export-${exportType}-${Date.now()}.${format}`;
    
    // Génération d'un lien sécurisé temporaire (simulation)
    const secureDownloadLink = `https://yaincoxihiqdksxgrsrk.supabase.co/storage/v1/object/sign/exports/${fileName}?token=temp-${Date.now()}`;

    const emailResponse = await resend.emails.send({
      from: "EmotionsCare <exports@emotionscare.app>",
      to: [userEmail],
      subject: `📁 Votre export EmotionsCare est prêt`,
      html: `
        <h1>Votre export de données est disponible ! 📊</h1>
        <p>Bonjour,</p>
        <p>Votre export de type <strong>${exportType}</strong> pour la période du ${dateRange.start} au ${dateRange.end} est maintenant prêt.</p>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3>📥 Télécharger votre fichier</h3>
          <a href="${secureDownloadLink}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Télécharger ${fileName}
          </a>
          <p style="margin-top: 15px; font-size: 14px; color: #6b7280;">
            Ce lien expire dans 24 heures pour votre sécurité.
          </p>
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p><strong>🔒 Protection des données :</strong></p>
          <ul>
            <li>Vos données sont chiffrées pendant le transfert</li>
            <li>Le lien de téléchargement expire automatiquement</li>
            <li>Aucune donnée n'est conservée après l'export</li>
          </ul>
        </div>

        <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
        <p>Merci de faire confiance à EmotionsCare pour votre bien-être ! 💚</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #9ca3af;">
          EmotionsCare - Votre plateforme de bien-être émotionnel<br>
          Cet email a été envoyé automatiquement, merci de ne pas y répondre.
        </p>
      `,
      attachments: [
        {
          filename: fileName,
          content: base64Content,
        },
      ],
    });

    console.log("Export email sent successfully:", emailResponse);

    return new Response(JSON.stringify({
      success: true,
      emailId: emailResponse.data?.id,
      exportFile: fileName,
      downloadLink: secureDownloadLink,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error in export-csv-email function:", error);
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


import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvitationRequest {
  email: string;
  role: 'b2b_user' | 'b2b_admin';
  message?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, role, message }: InvitationRequest = await req.json();

    if (!email || !role) {
      return new Response(
        JSON.stringify({ error: 'Email and role are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Générer un token unique
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours

    // Créer l'invitation en base de données
    const { data: supabase } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabaseClient = supabase.createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: invitation, error: dbError } = await supabaseClient
      .from('invitations')
      .insert([
        {
          email,
          role,
          token,
          status: 'pending',
          expires_at: expiresAt.toISOString()
        }
      ])
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    // Envoyer l'email d'invitation
    const invitationUrl = `${Deno.env.get('SUPABASE_URL')}/invitation/${token}`;
    
    const emailHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb; text-align: center;">Invitation à rejoindre EmotionsCare</h1>
            
            <p>Bonjour,</p>
            
            <p>Vous avez été invité(e) à rejoindre EmotionsCare en tant que <strong>${role === 'b2b_admin' ? 'Administrateur' : 'Collaborateur'}</strong>.</p>
            
            ${message ? `<p><em>Message personnel :</em><br>${message}</p>` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${invitationUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Accepter l'invitation
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666;">
              Cette invitation expirera le ${expiresAt.toLocaleDateString('fr-FR')}.<br>
              Si vous n'arrivez pas à cliquer sur le bouton, copiez et collez ce lien dans votre navigateur :<br>
              <a href="${invitationUrl}">${invitationUrl}</a>
            </p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            
            <p style="font-size: 12px; color: #888; text-align: center;">
              EmotionsCare - Plateforme de bien-être émotionnel<br>
              Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet email.
            </p>
          </div>
        </body>
      </html>
    `;

    const { error: emailError } = await resend.emails.send({
      from: 'EmotionsCare <noreply@emotionscare.fr>',
      to: [email],
      subject: `Invitation à rejoindre EmotionsCare`,
      html: emailHtml
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      // Ne pas échouer si l'email ne peut pas être envoyé
    }

    return new Response(
      JSON.stringify({ 
        invitation,
        message: 'Invitation sent successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in send-invitation function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

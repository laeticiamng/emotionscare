import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { authorizeRole, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { buildRateLimitResponse, enforceEdgeRateLimit } from '../_shared/rate-limit.ts';

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface InvitationEmailParams {
  inviterName: string;
  organizationName: string;
  role: string;
  inviteUrl: string;
  expiresAt: string;
}

// Générer le contenu HTML de l'email d'invitation
function generateInvitationEmailHtml(params: InvitationEmailParams): string {
  const expirationDate = new Date(params.expiresAt).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitation EmotionsCare</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">✉️ EmotionsCare</h1>
        <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Plateforme de bien-être émotionnel</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Vous êtes invité(e) !</h2>
        <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
          <strong>${params.inviterName}</strong> vous invite à rejoindre <strong>${params.organizationName}</strong> 
          sur EmotionsCare en tant que <strong>${params.role}</strong>.
        </p>
        <p style="color: #4b5563; line-height: 1.6; margin: 0 0 30px 0;">
          EmotionsCare est une plateforme innovante dédiée au bien-être émotionnel, 
          offrant des outils personnalisés pour mieux gérer vos émotions au quotidien.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${params.inviteUrl}" 
             style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); 
                    color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Accepter l'invitation
          </a>
        </div>
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0; border-radius: 4px;">
          <p style="color: #92400e; margin: 0; font-size: 14px;">
            ⏰ Cette invitation expire le <strong>${expirationDate}</strong>
          </p>
        </div>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
          Si vous n'avez pas demandé cette invitation, vous pouvez ignorer cet email en toute sécurité.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px; margin: 0; text-align: center;">
          © ${new Date().getFullYear()} EmotionsCare. Tous droits réservés.<br>
          <a href="https://emotionscare.com/legal/privacy" style="color: #6366f1;">Politique de confidentialité</a> | 
          <a href="https://emotionscare.com/legal/terms" style="color: #6366f1;">Conditions d'utilisation</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Générer le contenu texte de l'email
function generateInvitationEmailText(params: InvitationEmailParams): string {
  const expirationDate = new Date(params.expiresAt).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
Vous êtes invité(e) à rejoindre EmotionsCare !

${params.inviterName} vous invite à rejoindre ${params.organizationName} sur EmotionsCare en tant que ${params.role}.

EmotionsCare est une plateforme innovante dédiée au bien-être émotionnel, offrant des outils personnalisés pour mieux gérer vos émotions au quotidien.

Pour accepter l'invitation, cliquez sur le lien suivant :
${params.inviteUrl}

⏰ Cette invitation expire le ${expirationDate}

Si vous n'avez pas demandé cette invitation, vous pouvez ignorer cet email en toute sécurité.

---
© ${new Date().getFullYear()} EmotionsCare. Tous droits réservés.
`;
}

// Envoyer un email via Resend
async function sendViaResend(
  to: string,
  subject: string,
  html: string,
  text: string,
  apiKey: string
): Promise<EmailResult> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'EmotionsCare <noreply@emotionscare.com>',
        to: [to],
        subject,
        html,
        text,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, messageId: data.id };
    }

    return { success: false, error: data.message || 'Resend API error' };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Envoyer un email via SendGrid
async function sendViaSendGrid(
  to: string,
  subject: string,
  html: string,
  text: string,
  apiKey: string
): Promise<EmailResult> {
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: 'noreply@emotionscare.com', name: 'EmotionsCare' },
        subject,
        content: [
          { type: 'text/plain', value: text },
          { type: 'text/html', value: html },
        ],
      }),
    });

    if (response.ok || response.status === 202) {
      const messageId = response.headers.get('x-message-id');
      return { success: true, messageId: messageId || `sendgrid-${Date.now()}` };
    }

    const errorText = await response.text();
    return { success: false, error: `SendGrid error: ${errorText}` };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Envoyer un email via Mailgun
async function sendViaMailgun(
  to: string,
  subject: string,
  html: string,
  text: string,
  apiKey: string,
  domain: string
): Promise<EmailResult> {
  try {
    const formData = new FormData();
    formData.append('from', `EmotionsCare <noreply@${domain}>`);
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('text', text);
    formData.append('html', html);

    const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${apiKey}`)}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, messageId: data.id };
    }

    return { success: false, error: data.message || 'Mailgun API error' };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Fonction principale d'envoi d'email avec fallback
async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<EmailResult> {
  // Essayer Resend en premier
  const resendKey = Deno.env.get('RESEND_API_KEY');
  if (resendKey) {
    const result = await sendViaResend(to, subject, html, text, resendKey);
    if (result.success) return result;
    console.warn('[Email] Resend failed, trying fallback:', result.error);
  }

  // Fallback sur SendGrid
  const sendgridKey = Deno.env.get('SENDGRID_API_KEY');
  if (sendgridKey) {
    const result = await sendViaSendGrid(to, subject, html, text, sendgridKey);
    if (result.success) return result;
    console.warn('[Email] SendGrid failed, trying fallback:', result.error);
  }

  // Fallback sur Mailgun
  const mailgunKey = Deno.env.get('MAILGUN_API_KEY');
  const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN');
  if (mailgunKey && mailgunDomain) {
    const result = await sendViaMailgun(to, subject, html, text, mailgunKey, mailgunDomain);
    if (result.success) return result;
    console.warn('[Email] Mailgun failed:', result.error);
  }

  return { success: false, error: 'No email service configured or all services failed' };
}

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': req.headers.get('Origin') || '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Security-Policy': "default-src 'self'",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Vérification de l'autorisation (seuls les admins peuvent envoyer des invitations)
    const authResult = await authorizeRole(req, ['b2b_admin', 'admin']);
    if (authResult.status !== 200) {
      await logUnauthorizedAccess(req, authResult.error || 'Authorization failed');
      return new Response(
        JSON.stringify({ error: authResult.error }),
        { status: authResult.status, headers: corsHeaders }
      );
    }

    // Rate limiting plus strict pour les invitations
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'send-invitation',
      userId: authResult.user.id,
      limit: 10,
      windowMs: 300_000, // 5 minutes
      description: 'send-invitation',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        message: "Limite d'invitations atteinte. Veuillez patienter.",
      });
    }

    const { email, role, organizationId, customMessage } = await req.json();
    
    // Validation des données
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Email invalide' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!role || !['b2b_user', 'b2b_admin', 'member', 'manager'].includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Rôle invalide' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Vérifier si l'email n'est pas déjà un utilisateur existant
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Cet utilisateur a déjà un compte. Ajoutez-le directement à l\'organisation.' }),
        { status: 409, headers: corsHeaders }
      );
    }

    // Vérifier si l'email n'est pas déjà invité
    const { data: existingInvitation } = await supabase
      .from('invitations')
      .select('id, created_at')
      .eq('email', email)
      .eq('status', 'pending')
      .single();

    if (existingInvitation) {
      // Vérifier si l'invitation est trop récente (moins de 24h)
      const invitedAt = new Date(existingInvitation.created_at);
      const hoursSinceInvite = (Date.now() - invitedAt.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceInvite < 24) {
        return new Response(
          JSON.stringify({ 
            error: 'Une invitation a déjà été envoyée à cet email récemment. Attendez 24h avant de renvoyer.',
            invitationId: existingInvitation.id 
          }),
          { status: 409, headers: corsHeaders }
        );
      }
      
      // Annuler l'ancienne invitation pour en créer une nouvelle
      await supabase
        .from('invitations')
        .update({ status: 'expired' })
        .eq('id', existingInvitation.id);
    }

    // Créer l'invitation avec un token sécurisé
    const invitationToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 jours

    const { data: invitation, error } = await supabase
      .from('invitations')
      .insert({
        email,
        role,
        organization_id: organizationId,
        invited_by: authResult.user.id,
        token: invitationToken,
        expires_at: expiresAt,
        custom_message: customMessage,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('[Invitation] Erreur création:', error);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la création de l\'invitation' }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Récupérer les informations de l'organisation et de l'inviteur
    const { data: organization } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', organizationId)
      .single();

    const { data: inviter } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', authResult.user.id)
      .single();

    // Générer l'URL d'invitation
    const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://app.emotionscare.com';
    const inviteUrl = `${frontendUrl}/accept-invitation/${invitation.id}?token=${invitationToken}`;

    // Déterminer le libellé du rôle
    const roleLabels: Record<string, string> = {
      'b2b_admin': 'Administrateur',
      'admin': 'Administrateur',
      'b2b_user': 'Utilisateur',
      'member': 'Membre',
      'manager': 'Manager',
    };

    const emailParams: InvitationEmailParams = {
      inviterName: inviter?.full_name || inviter?.email || 'Un administrateur',
      organizationName: organization?.name || 'EmotionsCare',
      role: roleLabels[role] || 'Utilisateur',
      inviteUrl,
      expiresAt,
    };

    // Générer et envoyer l'email
    const html = generateInvitationEmailHtml(emailParams);
    const text = generateInvitationEmailText(emailParams);
    const subject = `✉️ Invitation à rejoindre ${organization?.name || 'une équipe'} sur EmotionsCare`;

    const emailResult = await sendEmail(email, subject, html, text);

    if (!emailResult.success) {
      console.error(`[Invitation] Failed to send email to ${email}:`, emailResult.error);
      
      // Marquer l'invitation comme failed
      await supabase
        .from('invitations')
        .update({ 
          status: 'failed', 
          error_message: emailResult.error,
          updated_at: new Date().toISOString(),
        })
        .eq('id', invitation.id);

      return new Response(
        JSON.stringify({
          error: 'Invitation créée mais l\'email n\'a pas pu être envoyé.',
          details: emailResult.error,
          invitationId: invitation.id
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Mettre à jour l'invitation avec l'ID du message
    await supabase
      .from('invitations')
      .update({ 
        email_message_id: emailResult.messageId,
        email_sent_at: new Date().toISOString(),
      })
      .eq('id', invitation.id);

    console.log(`[Invitation] Créée et envoyée pour ${email} avec le rôle ${role}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Invitation envoyée avec succès',
        invitationId: invitation.id,
        expiresAt,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Invitation] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de l\'envoi de l\'invitation' }),
      { status: 500, headers: corsHeaders }
    );
  }
});

/**
 * Email Service - Support multiple email providers
 * Supported: Resend, SendGrid, AWS SES, SMTP
 */

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send email using configured provider
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResponse> {
  const provider = Deno.env.get('EMAIL_PROVIDER') || 'resend';

  try {
    switch (provider.toLowerCase()) {
      case 'resend':
        return await sendWithResend(options);
      case 'sendgrid':
        return await sendWithSendGrid(options);
      case 'ses':
        return await sendWithSES(options);
      default:
        console.warn(`Unknown email provider: ${provider}, falling back to Resend`);
        return await sendWithResend(options);
    }
  } catch (error) {
    console.error('[EmailService] Error sending email:', error);
    const err = error as Error;
    return {
      success: false,
      error: err.message || 'Failed to send email'
    };
  }
}

/**
 * Send email using Resend (recommended)
 * Requires: RESEND_API_KEY
 */
async function sendWithResend(options: EmailOptions): Promise<EmailResponse> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    return {
      success: false,
      error: 'RESEND_API_KEY not configured'
    };
  }

  const from = options.from || Deno.env.get('EMAIL_FROM') || 'noreply@emotionscare.com';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  const data = await response.json();
  return {
    success: true,
    messageId: data.id
  };
}

/**
 * Send email using SendGrid
 * Requires: SENDGRID_API_KEY
 */
async function sendWithSendGrid(options: EmailOptions): Promise<EmailResponse> {
  const apiKey = Deno.env.get('SENDGRID_API_KEY');
  if (!apiKey) {
    return {
      success: false,
      error: 'SENDGRID_API_KEY not configured'
    };
  }

  const from = options.from || Deno.env.get('EMAIL_FROM') || 'noreply@emotionscare.com';
  const recipients = Array.isArray(options.to) ? options.to : [options.to];

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: recipients.map(email => ({ to: [{ email }] })),
      from: { email: from },
      subject: options.subject,
      content: [
        { type: 'text/html', value: options.html },
        ...(options.text ? [{ type: 'text/plain', value: options.text }] : []),
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SendGrid API error: ${error}`);
  }

  const messageId = response.headers.get('x-message-id');
  return {
    success: true,
    messageId: messageId || undefined
  };
}

/**
 * Send email using AWS SES
 * Requires: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
 */
async function sendWithSES(_options: EmailOptions): Promise<EmailResponse> {
  const region = Deno.env.get('AWS_REGION');
  const accessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID');
  const secretAccessKey = Deno.env.get('AWS_SECRET_ACCESS_KEY');

  if (!region || !accessKeyId || !secretAccessKey) {
    return {
      success: false,
      error: 'AWS credentials not configured (AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)'
    };
  }

  // Note: This is a simplified implementation
  // For production, use AWS SDK or a proper signing mechanism
  return {
    success: false,
    error: 'AWS SES implementation pending - please use Resend or SendGrid'
  };
}

/**
 * Generate email template for audit alerts
 */
export function generateAuditAlertEmail(data: {
  auditDate: string;
  overallScore: number;
  severity: string;
  message: string;
  dashboardUrl?: string;
}): { html: string; text: string } {
  const severityColor = data.severity === 'critical' ? '#ef4444' :
                        data.severity === 'high' ? '#f97316' :
                        data.severity === 'medium' ? '#eab308' : '#3b82f6';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">🔔 Alerte Audit de Conformité</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid ${severityColor};">
      <h2 style="margin-top: 0; color: ${severityColor}; text-transform: uppercase; font-size: 14px; letter-spacing: 1px;">
        Sévérité: ${data.severity}
      </h2>
      <p style="font-size: 16px; margin: 10px 0;">
        <strong>Date de l'audit:</strong> ${new Date(data.auditDate).toLocaleDateString('fr-FR')}
      </p>
      <p style="font-size: 16px; margin: 10px 0;">
        <strong>Score global:</strong> ${data.overallScore}%
      </p>
    </div>

    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="margin-top: 0; color: #1f2937;">Message</h3>
      <p style="color: #4b5563; margin: 0;">${data.message}</p>
    </div>

    ${data.dashboardUrl ? `
    <div style="text-align: center; margin-top: 30px;">
      <a href="${data.dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">
        Voir le tableau de bord
      </a>
    </div>
    ` : ''}

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
      <p>Cet email a été envoyé automatiquement par EmotionsCare</p>
      <p>Pour modifier vos préférences de notification, connectez-vous à votre compte</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
ALERTE AUDIT DE CONFORMITÉ

Sévérité: ${data.severity.toUpperCase()}
Date de l'audit: ${new Date(data.auditDate).toLocaleDateString('fr-FR')}
Score global: ${data.overallScore}%

Message:
${data.message}

${data.dashboardUrl ? `Voir le tableau de bord: ${data.dashboardUrl}` : ''}

---
Cet email a été envoyé automatiquement par EmotionsCare.
  `.trim();

  return { html, text };
}

/**
 * Generate email template for team invitations
 */
export function generateInvitationEmail(data: {
  inviterName?: string;
  organizationName: string;
  role: string;
  inviteUrl: string;
  expiresAt?: string;
}): { html: string; text: string } {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">✉️ Invitation à rejoindre une équipe</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <p style="font-size: 16px; margin-top: 0;">
        ${data.inviterName ? `<strong>${data.inviterName}</strong> vous invite à` : 'Vous êtes invité(e) à'} rejoindre
        <strong>${data.organizationName}</strong> sur EmotionsCare.
      </p>
      <p style="font-size: 16px;">
        <strong>Rôle:</strong> ${data.role}
      </p>
      ${data.expiresAt ? `
      <p style="color: #6b7280; font-size: 14px;">
        Cette invitation expire le ${new Date(data.expiresAt).toLocaleDateString('fr-FR')}
      </p>
      ` : ''}
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.inviteUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">
        Accepter l'invitation
      </a>
    </div>

    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin-top: 20px;">
      <p style="margin: 0; color: #92400e; font-size: 14px;">
        <strong>Note de sécurité:</strong> Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet email en toute sécurité.
      </p>
    </div>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
      <p>Cet email a été envoyé par EmotionsCare</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
INVITATION À REJOINDRE UNE ÉQUIPE

${data.inviterName ? `${data.inviterName} vous invite à` : 'Vous êtes invité(e) à'} rejoindre ${data.organizationName} sur EmotionsCare.

Rôle: ${data.role}
${data.expiresAt ? `Cette invitation expire le ${new Date(data.expiresAt).toLocaleDateString('fr-FR')}` : ''}

Pour accepter l'invitation, visitez:
${data.inviteUrl}

Note de sécurité: Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet email en toute sécurité.

---
Cet email a été envoyé par EmotionsCare.
  `.trim();

  return { html, text };
}

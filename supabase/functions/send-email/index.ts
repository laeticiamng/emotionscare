// @ts-nocheck
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { z } from 'https://deno.land/x/zod@v3.22.2/mod.ts';
import { supabase } from '../_shared/supa_client.ts';
import { emailTemplates } from './templates.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'noreply@emotionscare.com';

const SendEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  template: z.enum(['alert', 'compliance', 'welcome', 'export_ready', 'delete_request']),
  data: z.record(z.any()).optional(),
  replyTo: z.string().email().optional(),
});

type EmailPayload = z.infer<typeof SendEmailSchema>;

async function logEmail(
  recipient: string,
  subject: string,
  template: string,
  status: 'pending' | 'sent' | 'failed',
  metadata: Record<string, any> = {},
  error?: string,
  messageId?: string
) {
  try {
    await supabase.from('email_logs').insert({
      recipient_email: recipient,
      subject,
      template_name: template,
      status,
      provider: 'resend',
      provider_message_id: messageId,
      error_message: error,
      metadata,
      sent_at: status === 'sent' ? new Date().toISOString() : null,
    });
  } catch (err) {
    console.error('Failed to log email:', err);
  }
}

async function sendWithResend(
  to: string,
  subject: string,
  html: string,
  replyTo?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!RESEND_API_KEY) {
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
        reply_to: replyTo,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        error: data.message || `HTTP ${response.status}` 
      };
    }

    return { 
      success: true, 
      messageId: data.id 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    // Validation du payload
    const body = await req.json();
    const payload: EmailPayload = SendEmailSchema.parse(body);

    // Log initial
    await logEmail(
      payload.to,
      payload.subject,
      payload.template,
      'pending',
      payload.data || {}
    );

    // Récupération du template
    const templateFn = emailTemplates[payload.template];
    if (!templateFn) {
      throw new Error(`Template "${payload.template}" not found`);
    }

    const html = templateFn(payload.data || {});

    // Envoi via Resend
    const result = await sendWithResend(
      payload.to,
      payload.subject,
      html,
      payload.replyTo
    );

    // Log du résultat
    await logEmail(
      payload.to,
      payload.subject,
      payload.template,
      result.success ? 'sent' : 'failed',
      payload.data || {},
      result.error,
      result.messageId
    );

    if (!result.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email', 
          details: result.error 
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: result.messageId 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('send-email error:', error);

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid payload', 
          details: error.errors 
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal error' 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
});

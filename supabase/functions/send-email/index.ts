/**
 * send-email - Envoi d'emails via Resend
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 20/min + CORS restrictif
 */

// @ts-nocheck
import { z } from 'https://deno.land/x/zod@v3.22.2/mod.ts';
import { supabase } from '../_shared/supa_client.ts';
import { emailTemplates } from './templates.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

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

Deno.serve(async (req) => {
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
    console.warn('[send-email] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  try {
    // 2. 🔒 Authentification obligatoire
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200 || !authResult.user) {
      await logUnauthorizedAccess(req, authResult.error || 'Authentication failed');
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: authResult.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. 🛡️ Rate limiting (éviter spam)
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'send-email',
      userId: authResult.user.id,
      limit: 20,
      windowMs: 60_000,
      description: 'Email sending - Resend API',
    });

    if (!rateLimit.allowed) {
      console.warn('[send-email] Rate limit exceeded', { userId: authResult.user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop d'emails. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    console.log(`[send-email] Processing for user: ${authResult.user.id}`);

    // 4. Validation du payload
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

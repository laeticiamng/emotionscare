// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import React from 'npm:react@18.3.1';
import { Resend } from 'npm:resend@4.0.0';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { ErrorAlertEmail } from './_templates/error-alert.tsx';
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

interface ErrorAlertRequest {
  errorMessage: string;
  severity: string;
  priority: string;
  category: string;
  analysis: string;
  suggestedFix: string;
  autoFixCode?: string | null;
  preventionTips?: string[];
  url?: string;
  timestamp: string;
  errorId: string;
  recipientEmail: string;
}

serve(async (req) => {
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  if (!corsResult.allowed) {
    return rejectCors(corsResult);
  }

  const { user, status } = await authorizeRole(req, ['admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'send-error-alert',
    userId: user.id,
    limit: 50,
    windowMs: 60_000,
    description: 'Error alert sending (admin)',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      error: 'Too many requests',
      retryAfter: rateLimit.retryAfter,
    });
  }

  try {
    const alertData: ErrorAlertRequest = await req.json();

    if (!alertData.recipientEmail) {
      throw new Error('Recipient email is required');
    }

    // Dashboard URL (à adapter selon votre configuration)
    const dashboardUrl = Deno.env.get('DASHBOARD_URL') || 'https://app.emotionscare.com/admin/monitoring';

    // Render React email template
    const html = await renderAsync(
      React.createElement(ErrorAlertEmail, {
        errorMessage: alertData.errorMessage,
        severity: alertData.severity,
        priority: alertData.priority,
        category: alertData.category,
        analysis: alertData.analysis,
        suggestedFix: alertData.suggestedFix,
        autoFixCode: alertData.autoFixCode,
        preventionTips: alertData.preventionTips,
        url: alertData.url,
        timestamp: alertData.timestamp,
        errorId: alertData.errorId,
        dashboardUrl,
      })
    );

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'EmotionsCare Monitoring <alerts@emotionscare.com>',
      to: [alertData.recipientEmail],
      subject: `🚨 Alerte Critique: ${alertData.category.toUpperCase()} - ${alertData.priority}`,
      html,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log('Error alert email sent successfully:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: data?.id,
        message: 'Alert email sent successfully' 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in send-error-alert function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

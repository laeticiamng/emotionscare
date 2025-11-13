// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import React from 'npm:react@18.3.1';
import { Resend } from 'npm:resend@4.0.0';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { ErrorAlertEmail } from './_templates/error-alert.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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

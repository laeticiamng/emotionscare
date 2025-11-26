// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

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
    route: 'send-weekly-monitoring-report',
    userId: user.id,
    limit: 5,
    windowMs: 60_000,
    description: 'Weekly monitoring report (admin)',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      error: 'Too many requests',
      retryAfter: rateLimit.retryAfter,
    });
  }

  try {
    console.log('Starting weekly monitoring report generation...');

    // Date range: last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    // 1. Fetch A/B test results
    const { data: abTests, error: abError } = await supabase
      .from('ab_test_configurations')
      .select('*, ab_test_results(*)')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (abError) {
      console.error('Error fetching A/B tests:', abError);
      throw abError;
    }

    // 2. Fetch auto-created tickets
    const { data: tickets, error: ticketsError } = await supabase
      .from('auto_created_tickets')
      .select('*, ticket_integrations(*), unified_alerts(*)')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (ticketsError) {
      console.error('Error fetching tickets:', ticketsError);
      throw ticketsError;
    }

    // 3. Fetch escalation performance metrics
    const { data: metrics, error: metricsError } = await supabase
      .from('escalation_performance_metrics')
      .select('*')
      .gte('metric_date', startDate.toISOString())
      .order('metric_date', { ascending: false });

    if (metricsError) {
      console.error('Error fetching metrics:', metricsError);
      throw metricsError;
    }

    // 4. Fetch active escalations summary
    const { data: activeEscalations, error: escalationsError } = await supabase
      .from('active_escalations')
      .select('*')
      .gte('started_at', startDate.toISOString());

    if (escalationsError) {
      console.error('Error fetching escalations:', escalationsError);
      throw escalationsError;
    }

    // 5. Calculate statistics
    const stats = calculateStats(abTests, tickets, metrics, activeEscalations);

    // 6. Generate HTML email
    const emailHtml = generateEmailHtml(stats, abTests, tickets, metrics);

    // 7. Get admin email from secrets or default
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@emotionscare.com';

    // 8. Send email via Resend
    console.log(`Sending report to ${adminEmail}...`);
    const emailResponse = await resend.emails.send({
      from: 'EmotionsCare Monitoring <monitoring@emotionscare.com>',
      to: [adminEmail],
      subject: `📊 Rapport Hebdomadaire Monitoring - ${formatDate(startDate)} au ${formatDate(endDate)}`,
      html: emailHtml,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Rapport hebdomadaire envoyé',
        email_id: emailResponse.id,
        stats
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in weekly report function:', error);
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

function calculateStats(abTests: any[], tickets: any[], metrics: any[], escalations: any[]) {
  const significantTests = abTests?.filter(t => 
    t.metadata?.confidence >= (t.confidence_level || 0.95)
  ).length || 0;

  const ticketsCreated = tickets?.length || 0;
  const avgMLConfidence = tickets && tickets.length > 0
    ? tickets.reduce((sum, t) => sum + (t.ml_confidence || 0), 0) / tickets.length
    : 0;

  const avgResolutionRate = metrics && metrics.length > 0
    ? metrics.reduce((sum, m) => sum + (m.escalation_accuracy || 0), 0) / metrics.length
    : 0;

  const avgResolutionTime = metrics && metrics.length > 0
    ? metrics.reduce((sum, m) => sum + (m.avg_resolution_time_minutes || 0), 0) / metrics.length
    : 0;

  const totalEscalations = escalations?.length || 0;
  const resolvedEscalations = escalations?.filter(e => e.status === 'resolved').length || 0;

  return {
    period: '7 derniers jours',
    abTests: {
      total: abTests?.length || 0,
      significant: significantTests,
      running: abTests?.filter(t => t.status === 'running').length || 0
    },
    tickets: {
      total: ticketsCreated,
      avgMLConfidence: (avgMLConfidence * 100).toFixed(1),
      byIntegration: groupTicketsByIntegration(tickets)
    },
    escalations: {
      total: totalEscalations,
      resolved: resolvedEscalations,
      resolutionRate: totalEscalations > 0 ? (resolvedEscalations / totalEscalations * 100).toFixed(1) : 0
    },
    performance: {
      avgResolutionRate: avgResolutionRate.toFixed(1),
      avgResolutionTime: Math.round(avgResolutionTime)
    }
  };
}

function groupTicketsByIntegration(tickets: any[]) {
  if (!tickets || tickets.length === 0) return {};
  
  return tickets.reduce((acc, ticket) => {
    const integrationType = ticket.ticket_integrations?.integration_type || 'unknown';
    acc[integrationType] = (acc[integrationType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
}

function generateEmailHtml(stats: any, abTests: any[], tickets: any[], metrics: any[]): string {
  const topTests = abTests?.slice(0, 5).map(test => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${test.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <span style="padding: 4px 8px; border-radius: 4px; background: ${
          test.status === 'running' ? '#3b82f6' : 
          test.status === 'completed' ? '#10b981' : '#6b7280'
        }; color: white; font-size: 12px;">${test.status}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        ${test.metadata?.current_winner || 'N/A'}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        ${test.metadata?.confidence ? (test.metadata.confidence * 100).toFixed(1) + '%' : 'N/A'}
      </td>
    </tr>
  `).join('') || '<tr><td colspan="4" style="padding: 20px; text-align: center; color: #6b7280;">Aucun test A/B cette semaine</td></tr>';

  const topTickets = tickets?.slice(0, 5).map(ticket => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${ticket.ticket_key || 'N/A'}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${ticket.assigned_to || 'Non assigné'}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        ${ticket.ml_confidence ? (ticket.ml_confidence * 100).toFixed(0) + '%' : 'N/A'}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        ${ticket.ticket_integrations?.integration_type || 'N/A'}
      </td>
    </tr>
  `).join('') || '<tr><td colspan="4" style="padding: 20px; text-align: center; color: #6b7280;">Aucun ticket créé cette semaine</td></tr>';

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rapport Hebdomadaire Monitoring</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0;">
  <div style="max-width: 800px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 8px 8px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">📊 Rapport Hebdomadaire</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">Système de Monitoring EmotionsCare</p>
      <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 14px;">${stats.period}</p>
    </div>

    <!-- Stats Cards -->
    <div style="padding: 30px; background-color: #f9fafb;">
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
        
        <!-- Tests A/B -->
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
          <div style="color: #6b7280; font-size: 14px; font-weight: 600; margin-bottom: 8px;">Tests A/B</div>
          <div style="font-size: 32px; font-weight: bold; color: #1f2937;">${stats.abTests.total}</div>
          <div style="color: #10b981; font-size: 14px; margin-top: 8px;">
            ✅ ${stats.abTests.significant} significatifs
          </div>
        </div>

        <!-- Tickets -->
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
          <div style="color: #6b7280; font-size: 14px; font-weight: 600; margin-bottom: 8px;">Tickets Créés</div>
          <div style="font-size: 32px; font-weight: bold; color: #1f2937;">${stats.tickets.total}</div>
          <div style="color: #3b82f6; font-size: 14px; margin-top: 8px;">
            🎯 ${stats.tickets.avgMLConfidence}% confiance ML moyenne
          </div>
        </div>

        <!-- Escalades -->
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
          <div style="color: #6b7280; font-size: 14px; font-weight: 600; margin-bottom: 8px;">Escalades</div>
          <div style="font-size: 32px; font-weight: bold; color: #1f2937;">${stats.escalations.total}</div>
          <div style="color: #10b981; font-size: 14px; margin-top: 8px;">
            ✅ ${stats.escalations.resolutionRate}% résolues
          </div>
        </div>

        <!-- Performance -->
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #8b5cf6;">
          <div style="color: #6b7280; font-size: 14px; font-weight: 600; margin-bottom: 8px;">Performance</div>
          <div style="font-size: 32px; font-weight: bold; color: #1f2937;">${stats.performance.avgResolutionRate}%</div>
          <div style="color: #6b7280; font-size: 14px; margin-top: 8px;">
            ⏱️ ${stats.performance.avgResolutionTime} min moyenne
          </div>
        </div>
      </div>
    </div>

    <!-- Top A/B Tests -->
    <div style="padding: 30px;">
      <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 20px 0;">🧪 Tests A/B Récents</h2>
      <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <thead>
          <tr style="background-color: #f9fafb;">
            <th style="padding: 12px; text-align: left; font-weight: 600; color: #6b7280; font-size: 12px;">NOM</th>
            <th style="padding: 12px; text-align: left; font-weight: 600; color: #6b7280; font-size: 12px;">STATUT</th>
            <th style="padding: 12px; text-align: left; font-weight: 600; color: #6b7280; font-size: 12px;">GAGNANT</th>
            <th style="padding: 12px; text-align: left; font-weight: 600; color: #6b7280; font-size: 12px;">CONFIANCE</th>
          </tr>
        </thead>
        <tbody>
          ${topTests}
        </tbody>
      </table>
    </div>

    <!-- Top Tickets -->
    <div style="padding: 30px; padding-top: 0;">
      <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 20px 0;">🎫 Tickets Créés Automatiquement</h2>
      <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <thead>
          <tr style="background-color: #f9fafb;">
            <th style="padding: 12px; text-align: left; font-weight: 600; color: #6b7280; font-size: 12px;">TICKET</th>
            <th style="padding: 12px; text-align: left; font-weight: 600; color: #6b7280; font-size: 12px;">ASSIGNÉ À</th>
            <th style="padding: 12px; text-align: left; font-weight: 600; color: #6b7280; font-size: 12px;">CONFIANCE ML</th>
            <th style="padding: 12px; text-align: left; font-weight: 600; color: #6b7280; font-size: 12px;">INTÉGRATION</th>
          </tr>
        </thead>
        <tbody>
          ${topTickets}
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div style="padding: 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
      <p style="color: #6b7280; font-size: 14px; margin: 0;">
        Ce rapport est généré automatiquement chaque semaine.
      </p>
      <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
        EmotionsCare - Système de Monitoring Intelligent
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

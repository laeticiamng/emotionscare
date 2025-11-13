import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IncidentData {
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  alertId?: string;
  escalationId?: string;
  affectedSystems?: string[];
  impactDescription?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!supabaseUrl || !supabaseServiceKey || !lovableApiKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const incidentData: IncidentData = await req.json();

    console.log('Generating incident report for:', incidentData.title);

    // Generate unique incident ID
    const incidentId = `INC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Fetch related alert data
    let alertData: any = null;
    if (incidentData.alertId) {
      const { data } = await supabase
        .from('unified_alerts')
        .select('*')
        .eq('id', incidentData.alertId)
        .single();
      alertData = data;
    }

    // Fetch related escalation data
    let escalationData: any = null;
    if (incidentData.escalationId) {
      const { data } = await supabase
        .from('active_escalations')
        .select('*')
        .eq('id', incidentData.escalationId)
        .single();
      escalationData = data;
    }

    // Fetch recent error patterns
    const { data: errorPatterns } = await supabase
      .from('error_patterns_history')
      .select('*')
      .order('occurred_at', { ascending: false })
      .limit(10);

    // Build context for ML analysis
    const analysisContext = `
Incident Analysis Context:
- Title: ${incidentData.title}
- Severity: ${incidentData.severity}
- Affected Systems: ${incidentData.affectedSystems?.join(', ') || 'Unknown'}
- Impact: ${incidentData.impactDescription || 'Not specified'}

${alertData ? `Alert Details:
- Type: ${alertData.alert_type}
- Message: ${alertData.message}
- Severity: ${alertData.severity}
- Metadata: ${JSON.stringify(alertData.metadata)}` : ''}

${escalationData ? `Escalation Details:
- Level: ${escalationData.escalation_level}
- Status: ${escalationData.status}
- Started: ${escalationData.started_at}` : ''}

Recent Error Patterns (last 10):
${errorPatterns?.map((ep: any) => `- ${ep.pattern_type}: ${ep.error_message} (${ep.frequency} occurrences)`).join('\n') || 'None'}

Analyze this incident and provide:
1. Root cause analysis with confidence level (0-100)
2. Contributing factors (3-5 items)
3. Corrective actions (3-5 immediate steps)
4. Preventive measures (3-5 long-term improvements)
5. Lessons learned (2-3 key takeaways)
`;

    // Call Lovable AI for ML-powered root cause analysis
    console.log('Calling Lovable AI for root cause analysis...');
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert incident response analyst for EmotionsCare, a B2B SaaS platform. 
Analyze incidents with technical depth and provide actionable insights. 
Format your response as JSON with these fields:
{
  "root_cause": "Detailed root cause explanation",
  "confidence": 85,
  "contributing_factors": ["factor1", "factor2", "factor3"],
  "corrective_actions": ["action1", "action2", "action3"],
  "preventive_measures": ["measure1", "measure2", "measure3"],
  "lessons_learned": ["lesson1", "lesson2"]
}`
          },
          {
            role: 'user',
            content: analysisContext
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'analyze_incident',
              description: 'Analyze incident and provide structured root cause analysis',
              parameters: {
                type: 'object',
                properties: {
                  root_cause: { type: 'string', description: 'Detailed root cause analysis' },
                  confidence: { type: 'number', description: 'Confidence level 0-100' },
                  contributing_factors: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Contributing factors to the incident'
                  },
                  corrective_actions: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Immediate corrective actions'
                  },
                  preventive_measures: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Long-term preventive measures'
                  },
                  lessons_learned: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Key lessons learned'
                  }
                },
                required: ['root_cause', 'confidence', 'contributing_factors', 'corrective_actions', 'preventive_measures', 'lessons_learned'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'analyze_incident' } }
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Lovable AI error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (aiResponse.status === 402) {
        throw new Error('Insufficient credits. Please add funds to your Lovable AI workspace.');
      }
      throw new Error(`AI analysis failed: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI analysis complete');

    // Extract analysis from tool call
    let analysis: any = {
      root_cause: 'Analysis in progress',
      confidence: 50,
      contributing_factors: ['Multiple factors identified', 'Investigation ongoing'],
      corrective_actions: ['Monitor situation', 'Escalate if needed'],
      preventive_measures: ['Review system configuration', 'Update monitoring'],
      lessons_learned: ['Incident documented', 'Process improvement needed']
    };

    if (aiData.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments) {
      try {
        analysis = JSON.parse(aiData.choices[0].message.tool_calls[0].function.arguments);
      } catch (e) {
        console.error('Failed to parse AI response:', e);
      }
    }

    // Generate post-mortem template
    const postMortemTemplate = `# Post-Mortem: ${incidentData.title}

## Incident Summary
- **Incident ID**: ${incidentId}
- **Date**: ${new Date().toISOString()}
- **Severity**: ${incidentData.severity.toUpperCase()}
- **Status**: Open
- **Affected Systems**: ${incidentData.affectedSystems?.join(', ') || 'N/A'}

## Impact
${incidentData.impactDescription || 'Impact assessment pending'}

## Root Cause Analysis
**Confidence Level**: ${analysis.confidence}%

${analysis.root_cause}

### Contributing Factors
${analysis.contributing_factors.map((f: string, i: number) => `${i + 1}. ${f}`).join('\n')}

## Timeline of Events
- **[${new Date().toISOString()}]** Incident detected and report generated

## Corrective Actions Taken
${analysis.corrective_actions.map((a: string, i: number) => `${i + 1}. [ ] ${a}`).join('\n')}

## Preventive Measures
${analysis.preventive_measures.map((m: string, i: number) => `${i + 1}. [ ] ${m}`).join('\n')}

## Lessons Learned
${analysis.lessons_learned.map((l: string, i: number) => `${i + 1}. ${l}`).join('\n')}

## Next Steps
1. Complete investigation
2. Implement corrective actions
3. Deploy preventive measures
4. Schedule follow-up review

## Sign-off
- **Incident Manager**: _________________
- **Date**: _________________
`;

    // Create timeline entry
    const timeline = [{
      timestamp: new Date().toISOString(),
      event: 'Incident detected',
      description: `${incidentData.severity} severity incident: ${incidentData.title}`,
      actor: 'system'
    }, {
      timestamp: new Date().toISOString(),
      event: 'ML analysis completed',
      description: `Root cause analysis generated with ${analysis.confidence}% confidence`,
      actor: 'ml-analyzer'
    }];

    // Insert incident report into database
    const { data: incidentReport, error: insertError } = await supabase
      .from('incident_reports')
      .insert({
        incident_id: incidentId,
        title: incidentData.title,
        severity: incidentData.severity,
        status: 'open',
        started_at: new Date().toISOString(),
        affected_systems: incidentData.affectedSystems || [],
        impact_description: incidentData.impactDescription,
        timeline,
        root_cause_analysis: analysis.root_cause,
        root_cause_confidence: analysis.confidence,
        contributing_factors: analysis.contributing_factors,
        corrective_actions: analysis.corrective_actions,
        preventive_measures: analysis.preventive_measures,
        post_mortem_template: postMortemTemplate,
        lessons_learned: analysis.lessons_learned,
        related_alert_ids: incidentData.alertId ? [incidentData.alertId] : [],
        related_escalation_ids: incidentData.escalationId ? [incidentData.escalationId] : []
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw insertError;
    }

    console.log('Incident report created:', incidentId);

    // Send notification about new incident
    try {
      await supabase.functions.invoke('send-notification', {
        body: {
          title: `🚨 Nouvel Incident: ${incidentData.title}`,
          message: `Incident ${incidentId} créé avec analyse ML (confiance: ${analysis.confidence}%)`,
          type: 'incident',
          severity: incidentData.severity,
          metadata: {
            incidentId,
            reportUrl: `/admin/incidents/${incidentReport.id}`
          }
        }
      });
    } catch (notifError) {
      console.error('Notification error:', notifError);
      // Don't fail the whole operation if notification fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        incidentId,
        report: incidentReport,
        analysis
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error generating incident report:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

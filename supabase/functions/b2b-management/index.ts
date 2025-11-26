/**
 * b2b-management - API de gestion B2B (organisations, équipes, rapports)
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 30/min + CORS restrictif
 */

// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

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
    console.warn('[b2b-management] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  try {
    // 2. 🔒 Authentification obligatoire
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200 || !authResult.user) {
      await logUnauthorizedAccess(req, authResult.error || 'Authentication failed');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const user = authResult.user;

    // 3. 🛡️ Rate limiting
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'b2b-management',
      userId: user.id,
      limit: 30,
      windowMs: 60_000,
      description: 'B2B management API',
    });

    if (!rateLimit.allowed) {
      console.warn('[b2b-management] Rate limit exceeded', { userId: user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    console.log(`[b2b-management] Processing for user: ${user.id}`);

    const { action, orgId, teamData, period } = await req.json();

    switch (action) {
      case 'getOrgOverview': {
        // Récupérer les infos de l'organisation
        const { data: org } = await supabaseClient
          .from('organizations')
          .select('*')
          .eq('id', orgId)
          .single();

        // Compter les membres
        const { count: memberCount } = await supabaseClient
          .from('org_memberships')
          .select('*', { count: 'exact', head: true })
          .eq('org_id', orgId);

        // Métriques de bien-être agrégées (simulées)
        const wellnessMetrics = {
          avgMoodScore: 7.2 + Math.random() * 1.5,
          avgStressLevel: 4.1 + Math.random() * 1.2,
          engagementRate: 0.72 + Math.random() * 0.15,
          activeUsers: Math.floor((memberCount || 10) * (0.7 + Math.random() * 0.2)),
        };

        // Tendances sur la période
        const trends = {
          moodTrend: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            avgMood: 6.5 + Math.random() * 2,
            activeUsers: Math.floor((memberCount || 10) * (0.6 + Math.random() * 0.3)),
          })),
          topEmotions: [
            { emotion: 'calm', percentage: 35 + Math.random() * 10 },
            { emotion: 'focused', percentage: 25 + Math.random() * 10 },
            { emotion: 'happy', percentage: 20 + Math.random() * 10 },
            { emotion: 'stressed', percentage: 15 + Math.random() * 5 },
          ],
        };

        return new Response(
          JSON.stringify({
            organization: org,
            memberCount,
            wellnessMetrics,
            trends,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'getTeamAnalytics': {
        // Analytics par équipe
        const { data: teams } = await supabaseClient
          .from('org_memberships')
          .select('team_name, user_id')
          .eq('org_id', orgId)
          .not('team_name', 'is', null);

        const teamStats: Record<string, any> = {};
        
        for (const team of (teams || [])) {
          if (!teamStats[team.team_name]) {
            teamStats[team.team_name] = {
              teamName: team.team_name,
              memberCount: 0,
              avgWellness: 6.5 + Math.random() * 2,
              engagementRate: 0.65 + Math.random() * 0.25,
              topActivities: ['breathing', 'meditation', 'journaling'],
            };
          }
          teamStats[team.team_name].memberCount++;
        }

        return new Response(
          JSON.stringify({ teams: Object.values(teamStats) }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'generateReport': {
        const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
        if (!LOVABLE_API_KEY) {
          throw new Error('LOVABLE_API_KEY not configured');
        }

        // Récupérer les données de l'organisation
        const { data: org } = await supabaseClient
          .from('organizations')
          .select('*')
          .eq('id', orgId)
          .single();

        const { count: memberCount } = await supabaseClient
          .from('org_memberships')
          .select('*', { count: 'exact', head: true })
          .eq('org_id', orgId);

        const prompt = `En tant qu'expert en bien-être organisationnel, génère un rapport détaillé pour l'organisation "${org?.name || 'Organisation'}" avec ${memberCount || 0} membres.

Période d'analyse: ${period || 'dernière semaine'}

Génère un rapport structuré comprenant:
1. Vue d'ensemble du bien-être organisationnel
2. Tendances et insights clés
3. Recommandations stratégiques pour améliorer le bien-être des équipes
4. Indicateurs de performance RH (engagement, rétention, satisfaction)
5. Actions prioritaires pour les managers

Format: JSON avec sections { overview, keyInsights, recommendations, hrMetrics, priorityActions }`;

        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: 'Tu es un expert en psychologie organisationnelle et bien-être au travail. Réponds uniquement en JSON valide.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
          }),
        });

        if (!aiResponse.ok) {
          throw new Error(`AI Gateway error: ${aiResponse.status}`);
        }

        const aiData = await aiResponse.json();
        const reportContent = aiData.choices[0].message.content;

        // Sauvegarder le rapport
        const { data: report } = await supabaseClient
          .from('b2b_reports')
          .insert({
            org_id: orgId,
            period,
            report_type: 'wellness_overview',
            content: reportContent,
            generated_by: user.id,
          })
          .select()
          .single();

        console.log('✅ B2B Report generated:', report?.id);

        return new Response(
          JSON.stringify({ report }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('❌ B2B Management error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

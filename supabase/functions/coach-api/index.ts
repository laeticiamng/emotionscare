// @ts-nocheck
/**
 * Coach API - Coaching IA émotionnel
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 30/min + CORS restrictif
 *
 * Endpoints:
 * Sessions:
 *   - POST   /sessions            - Créer une session
 *   - GET    /sessions            - Liste des sessions
 *   - GET    /sessions/:id        - Détail d'une session
 *   - PATCH  /sessions/:id        - Modifier une session
 *   - POST   /sessions/:id/close  - Terminer une session
 *   - DELETE /sessions/:id        - Supprimer une session
 *   - GET    /sessions/:id/summary - Résumé d'une session
 *
 * Messages & Chat:
 *   - POST   /messages            - Envoyer un message
 *   - GET    /messages            - Liste des messages
 *   - GET    /sessions/:id/messages - Messages d'une session
 *   - DELETE /messages/:id        - Supprimer un message
 *   - POST   /chat                - Chat direct (legacy)
 *
 * Programmes:
 *   - GET    /programs            - Liste des programmes
 *   - GET    /programs/:id        - Détail d'un programme
 *   - POST   /programs/:id/enroll - S'inscrire à un programme
 *   - GET    /programs/:id/progress - Progression dans un programme
 *
 * Insights & Recommandations:
 *   - GET    /insights            - Insights personnalisés
 *   - GET    /recommendations     - Recommandations
 *   - POST   /feedback            - Envoyer un feedback
 *
 * Analytics:
 *   - GET    /analytics           - Statistiques de coaching
 *
 * @version 1.0.0
 * @created 2025-11-14
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

serve(async (req) => {
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
    console.warn('[coach-api] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  try {
    // 2. Auth via Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      console.warn('[coach-api] Unauthorized access attempt');
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. 🛡️ Rate limiting
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'coach-api',
      userId: user.id,
      limit: 30,
      windowMs: 60_000,
      description: 'Coach API - Coaching sessions and messages',
    });

    if (!rateLimit.allowed) {
      console.warn('[coach-api] Rate limit exceeded', { userId: user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    console.log(`[coach-api] Processing for user: ${user.id}`);

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(p => p);
    const resource = pathParts[pathParts.length - 2] || pathParts[pathParts.length - 1];
    const action = pathParts[pathParts.length - 1];
    const id = pathParts.length > 1 && action !== resource ? action : null;

    // ═══════════════════════════════════════════════════════════════
    // SESSIONS DE COACHING
    // ═══════════════════════════════════════════════════════════════

    // POST /sessions - Créer une session
    if (req.method === 'POST' && resource === 'sessions' && !id) {
      const body = await req.json();

      const { data: session, error } = await supabaseClient
        .from('coach_sessions')
        .insert({
          user_id: user.id,
          topic: body.topic,
          emotions_addressed: body.emotions_addressed || [],
          mood_before: body.mood_before,
          metadata: body.metadata,
          started_at: new Date().toISOString(),
          message_count: 0,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(session), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /sessions - Liste des sessions
    if (req.method === 'GET' && resource === 'sessions' && !id) {
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const dateFrom = url.searchParams.get('date_from');
      const dateTo = url.searchParams.get('date_to');
      const offset = (page - 1) * limit;

      let query = supabaseClient
        .from('coach_sessions')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      if (dateFrom) query = query.gte('started_at', dateFrom);
      if (dateTo) query = query.lte('started_at', dateTo);

      const { data: sessions, error, count } = await query
        .order('started_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return new Response(
        JSON.stringify({ sessions, total: count || 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /sessions/:id - Détail d'une session
    if (req.method === 'GET' && resource === 'sessions' && id && !['close', 'summary', 'messages'].includes(action)) {
      const { data: session, error } = await supabaseClient
        .from('coach_sessions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(session), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PATCH /sessions/:id - Modifier une session
    if (req.method === 'PATCH' && resource === 'sessions' && id) {
      const body = await req.json();

      const { data: session, error } = await supabaseClient
        .from('coach_sessions')
        .update({
          emotions_addressed: body.emotions_addressed,
          mood_after: body.mood_after,
          metadata: body.metadata,
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(session), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /sessions/:id/close - Terminer une session
    if (req.method === 'POST' && resource === 'sessions' && action === 'close') {
      const sessionId = pathParts[pathParts.length - 2];
      const body = await req.json();

      // Calculate duration
      const { data: currentSession } = await supabaseClient
        .from('coach_sessions')
        .select('started_at')
        .eq('id', sessionId)
        .single();

      const durationMinutes = currentSession
        ? Math.round((new Date().getTime() - new Date(currentSession.started_at).getTime()) / 60000)
        : 0;

      const { data: session, error } = await supabaseClient
        .from('coach_sessions')
        .update({
          ended_at: new Date().toISOString(),
          duration_minutes: durationMinutes,
          mood_after: body.mood_after,
          satisfaction_score: body.satisfaction_score,
          summary: body.summary,
        })
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(session), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE /sessions/:id - Supprimer une session
    if (req.method === 'DELETE' && resource === 'sessions' && id) {
      const { error } = await supabaseClient
        .from('coach_sessions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // GET /sessions/:id/summary - Résumé d'une session
    if (req.method === 'GET' && action === 'summary') {
      const sessionId = pathParts[pathParts.length - 2];

      const { data: session, error } = await supabaseClient
        .from('coach_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      // Get messages for key points
      const { data: messages } = await supabaseClient
        .from('coach_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });

      const keyPoints = messages
        ?.filter(m => m.role === 'assistant')
        .slice(0, 3)
        .map(m => m.content.substring(0, 100)) || [];

      return new Response(
        JSON.stringify({
          session,
          key_points: keyPoints,
          emotions_worked_on: session.emotions_addressed || [],
          progress_made: 'Évolution positive observée',
          next_steps: ['Continuer les exercices de respiration', 'Pratiquer la gratitude quotidienne'],
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ═══════════════════════════════════════════════════════════════
    // MESSAGES & CHAT
    // ═══════════════════════════════════════════════════════════════

    // POST /messages - Envoyer un message
    if (req.method === 'POST' && resource === 'messages') {
      const body = await req.json();

      // User message
      const { data: userMessage, error: userError } = await supabaseClient
        .from('coach_messages')
        .insert({
          session_id: body.session_id,
          role: 'user',
          content: body.message,
          timestamp: new Date().toISOString(),
        })
        .select()
        .single();

      if (userError) throw userError;

      // Get conversation history for context
      const { data: historyMessages } = await supabaseClient
        .from('coach_messages')
        .select('role, content')
        .eq('session_id', body.session_id)
        .order('timestamp', { ascending: true })
        .limit(10);

      // Generate AI response using OpenAI
      let aiResponse: string;
      let emotionDetected: string = 'neutral';
      let suggestions: string[] = [];

      try {
        // Call ai-coach-response Edge Function for real AI response
        const coachApiUrl = Deno.env.get('SUPABASE_URL') || '';
        const authToken = req.headers.get('Authorization');

        const aiCoachResponse = await fetch(`${coachApiUrl}/functions/v1/ai-coach-response`, {
          method: 'POST',
          headers: {
            'Authorization': authToken || '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: body.message,
            conversationHistory: historyMessages || [],
            userEmotion: body.context?.emotion || 'neutral',
            coachPersonality: 'empathetic',
            context: body.context?.situation || '',
          }),
        });

        if (aiCoachResponse.ok) {
          const aiResult = await aiCoachResponse.json();
          aiResponse = aiResult.response || 'Je comprends ce que vous ressentez. Parlons-en davantage...';
          emotionDetected = aiResult.emotion || 'supportive';
          suggestions = aiResult.techniques?.slice(0, 3) || [];
        } else {
          throw new Error('AI Coach service unavailable');
        }
      } catch (error) {
        console.warn('⚠️ AI Coach failed, using fallback:', error);
        aiResponse = 'Je comprends ce que vous ressentez. Parlons-en davantage. Comment puis-je mieux vous accompagner ?';
        suggestions = ['Prenez une pause', 'Respirez profondément', 'Parlez de ce qui vous préoccupe'];
      }

      const { data: assistantMessage, error: assistantError } = await supabaseClient
        .from('coach_messages')
        .insert({
          session_id: body.session_id,
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date().toISOString(),
          emotion_detected: emotionDetected,
          suggestions: suggestions,
        })
        .select()
        .single();

      if (assistantError) throw assistantError;

      // Update session message count
      if (body.session_id) {
        const { data: currentSession } = await supabaseClient
          .from('coach_sessions')
          .select('message_count')
          .eq('id', body.session_id)
          .single();

        if (currentSession) {
          await supabaseClient
            .from('coach_sessions')
            .update({ message_count: (currentSession.message_count || 0) + 2 })
            .eq('id', body.session_id);
        }
      }

      return new Response(JSON.stringify(assistantMessage), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /messages - Liste des messages
    if (req.method === 'GET' && resource === 'messages' && !id) {
      const sessionId = url.searchParams.get('session_id');
      const limit = parseInt(url.searchParams.get('limit') || '100');

      let query = supabaseClient
        .from('coach_messages')
        .select('*');

      if (sessionId) {
        query = query.eq('session_id', sessionId);
      }

      const { data: messages, error } = await query
        .order('timestamp', { ascending: true })
        .limit(limit);

      if (error) throw error;

      return new Response(JSON.stringify(messages), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /sessions/:id/messages - Messages d'une session
    if (req.method === 'GET' && action === 'messages') {
      const sessionId = pathParts[pathParts.length - 2];

      const { data: messages, error } = await supabaseClient
        .from('coach_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });

      if (error) throw error;

      return new Response(JSON.stringify(messages), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE /messages/:id - Supprimer un message
    if (req.method === 'DELETE' && resource === 'messages' && id) {
      const { error } = await supabaseClient
        .from('coach_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // POST /chat - Chat direct (legacy support)
    if (req.method === 'POST' && resource === 'chat') {
      const body = await req.json();

      // Simulate AI chat response
      const response = {
        response: 'Je suis là pour vous écouter et vous accompagner.',
        emotion_detected: 'neutral',
        suggestions: ['Explorez vos émotions', 'Pratiquez la pleine conscience'],
      };

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // PROGRAMMES
    // ═══════════════════════════════════════════════════════════════

    // GET /programs - Liste des programmes
    if (req.method === 'GET' && resource === 'programs' && !id) {
      const difficulty = url.searchParams.get('difficulty');
      const topic = url.searchParams.get('topic');
      const isPremium = url.searchParams.get('is_premium');

      let query = supabaseClient
        .from('coach_programs')
        .select('*');

      if (difficulty) query = query.eq('difficulty', difficulty);
      if (topic) query = query.contains('topics', [topic]);
      if (isPremium !== null) query = query.eq('is_premium', isPremium === 'true');

      const { data: programs, error } = await query.order('title', { ascending: true });

      if (error) throw error;

      return new Response(JSON.stringify(programs), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /programs/:id - Détail d'un programme
    if (req.method === 'GET' && resource === 'programs' && id && !['enroll', 'progress'].includes(action)) {
      const { data: program, error } = await supabaseClient
        .from('coach_programs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(program), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /programs/:id/enroll - S'inscrire à un programme
    if (req.method === 'POST' && action === 'enroll') {
      const programId = pathParts[pathParts.length - 2];

      const { data: enrollment, error } = await supabaseClient
        .from('coach_enrollments')
        .insert({
          user_id: user.id,
          program_id: programId,
          enrolled_at: new Date().toISOString(),
          completed_sessions: 0,
          progress_percentage: 0,
          current_week: 1,
          is_completed: false,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(enrollment), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /programs/:id/progress - Progression dans un programme
    if (req.method === 'GET' && action === 'progress') {
      const programId = pathParts[pathParts.length - 2];

      const { data: enrollment, error } = await supabaseClient
        .from('coach_enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('program_id', programId)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(enrollment), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // INSIGHTS & ANALYTICS
    // ═══════════════════════════════════════════════════════════════

    // GET /insights - Insights personnalisés
    if (req.method === 'GET' && resource === 'insights') {
      const type = url.searchParams.get('type');
      const isRead = url.searchParams.get('is_read');
      const limit = parseInt(url.searchParams.get('limit') || '20');

      let query = supabaseClient
        .from('coach_insights')
        .select('*')
        .eq('user_id', user.id);

      if (type) query = query.eq('type', type);
      if (isRead !== null) query = query.eq('is_read', isRead === 'true');

      const { data: insights, error } = await query
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return new Response(JSON.stringify(insights), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /recommendations - Recommandations
    if (req.method === 'GET' && resource === 'recommendations') {
      const recommendations = {
        next_session_topic: 'Gestion du stress',
        suggested_techniques: ['Respiration profonde', 'Méditation guidée', 'Journaling'],
        resources: [
          {
            title: 'Guide de la respiration consciente',
            type: 'article',
            url: '/resources/breathing-guide',
          },
          {
            title: 'Méditation pour débutants',
            type: 'video',
            url: '/resources/meditation-intro',
          },
        ],
        goals_to_set: [
          'Pratiquer 10 minutes de méditation quotidienne',
          'Tenir un journal émotionnel',
        ],
      };

      return new Response(JSON.stringify(recommendations), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /feedback - Envoyer un feedback
    if (req.method === 'POST' && resource === 'feedback') {
      const body = await req.json();

      const { data: feedback, error } = await supabaseClient
        .from('coach_feedback')
        .insert({
          user_id: user.id,
          session_id: body.session_id,
          message_id: body.message_id,
          rating: body.rating,
          comment: body.comment,
          feedback_type: body.feedback_type,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(feedback), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /analytics - Statistiques de coaching
    if (req.method === 'GET' && resource === 'analytics') {
      const { data: sessions } = await supabaseClient
        .from('coach_sessions')
        .select('*')
        .eq('user_id', user.id);

      const { data: messages } = await supabaseClient
        .from('coach_messages')
        .select('*')
        .eq('role', 'user');

      const { data: enrollments } = await supabaseClient
        .from('coach_enrollments')
        .select('*')
        .eq('user_id', user.id);

      const totalSessions = sessions?.length || 0;
      const totalMessages = messages?.length || 0;
      const avgDuration = sessions?.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / totalSessions || 0;

      // Calculate mood improvement
      const sessionsWithMood = sessions?.filter(s => s.mood_before && s.mood_after) || [];
      const moodImprovement = sessionsWithMood.reduce(
        (sum, s) => sum + (s.mood_after - s.mood_before),
        0
      ) / sessionsWithMood.length || 0;

      return new Response(
        JSON.stringify({
          total_sessions: totalSessions,
          total_messages: totalMessages,
          average_session_duration: Math.round(avgDuration),
          most_addressed_emotions: [],
          mood_improvement_avg: Math.round(moodImprovement * 10) / 10,
          satisfaction_avg: 0,
          programs_enrolled: enrollments?.length || 0,
          programs_completed: enrollments?.filter(e => e.is_completed).length || 0,
          insights_generated: 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ error: 'Route non trouvée' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('❌ Coach API Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

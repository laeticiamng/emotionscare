// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, ...params } = await req.json();

    // Start breathing session
    if (action === 'start-session') {
      const { pattern, duration, difficulty } = params;

      const session = {
        id: crypto.randomUUID(),
        user_id: user.id,
        pattern,
        duration,
        difficulty,
        started_at: new Date().toISOString(),
        status: 'active',
        guidance: generateGuidance(pattern, difficulty),
        visualization_config: {
          type: '3d-orb',
          colors: getPatternColors(pattern),
          animation_speed: difficulty === 'beginner' ? 0.8 : difficulty === 'intermediate' ? 1.0 : 1.2,
          particle_count: 50,
          glow_intensity: 0.7
        }
      };

      // Save to Supabase
      const { error: insertError } = await supabaseClient
        .from('breathing_vr_sessions')
        .insert({
          user_id: user.id,
          pattern,
          duration_seconds: duration * 60,
          vr_mode: false,
          started_at: session.started_at
        });

      if (insertError) {
        console.error('Error saving session:', insertError);
      }

      return new Response(JSON.stringify({ session }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Complete breathing session with analytics
    if (action === 'complete-session') {
      const { sessionId, cycles_completed, avg_heart_rate, mood_before, mood_after, adherence_score } = params;

      // Update session in DB
      const { error: updateError } = await supabaseClient
        .from('breathing_vr_sessions')
        .update({
          completed_at: new Date().toISOString(),
          cycles_completed,
          mood_before,
          mood_after,
          average_pace: avg_heart_rate
        })
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(1);

      if (updateError) {
        console.error('Error updating session:', updateError);
      }

      // Generate AI insights using Lovable AI
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      let insights = {
        performance: 'Bonne séance de respiration',
        improvements: ['Maintenez ce rythme', 'Essayez des patterns plus avancés'],
        next_pattern: 'box-breathing',
        mood_impact: mood_after > mood_before ? 'positive' : 'stable',
        heart_rate_analysis: avg_heart_rate < 70 ? 'Excellente relaxation' : 'Bon effort',
        achievements: []
      };

      if (LOVABLE_API_KEY) {
        try {
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
                  content: 'Tu es un expert en techniques de respiration thérapeutique. Analyse la session et donne des conseils personnalisés en français. Réponds en JSON avec: performance (string), improvements (array), next_pattern (string), mood_impact (string), heart_rate_analysis (string), achievements (array).'
                },
                {
                  role: 'user',
                  content: `Analyse cette session de respiration:
- Cycles complétés: ${cycles_completed}
- Rythme cardiaque moyen: ${avg_heart_rate} bpm
- Humeur avant: ${mood_before}/10
- Humeur après: ${mood_after}/10
- Score d'adhérence: ${adherence_score}%

Donne des insights détaillés.`
                }
              ],
              tools: [{
                type: 'function',
                function: {
                  name: 'provide_insights',
                  description: 'Fournir les insights de la session',
                  parameters: {
                    type: 'object',
                    properties: {
                      performance: { type: 'string' },
                      improvements: { type: 'array', items: { type: 'string' } },
                      next_pattern: { type: 'string' },
                      mood_impact: { type: 'string' },
                      heart_rate_analysis: { type: 'string' },
                      achievements: { type: 'array', items: { type: 'string' } }
                    },
                    required: ['performance', 'improvements', 'next_pattern', 'mood_impact', 'heart_rate_analysis', 'achievements']
                  }
                }
              }],
              tool_choice: { type: 'function', function: { name: 'provide_insights' } }
            }),
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
            if (toolCall?.function?.arguments) {
              const parsedInsights = JSON.parse(toolCall.function.arguments);
              insights = { ...insights, ...parsedInsights };
            }
          }
        } catch (error) {
          console.error('AI insights error:', error);
        }
      }

      return new Response(JSON.stringify({ insights }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user's breathing history and stats
    if (action === 'get-history') {
      const { limit = 10 } = params;

      const { data: sessions, error } = await supabaseClient
        .from('breathing_vr_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      // Calculate stats
      const stats = {
        total_sessions: sessions?.length || 0,
        total_duration: sessions?.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) || 0,
        avg_cycles: sessions?.reduce((sum, s) => sum + (s.cycles_completed || 0), 0) / (sessions?.length || 1),
        mood_improvement: sessions?.filter(s => s.mood_after > s.mood_before).length || 0,
        favorite_pattern: getMostFrequentPattern(sessions || []),
        streak_days: calculateStreak(sessions || [])
      };

      return new Response(JSON.stringify({ sessions, stats }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get personalized pattern recommendations
    if (action === 'get-recommendations') {
      const { data: recentSessions } = await supabaseClient
        .from('breathing_vr_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(5);

      const recommendations = generateRecommendations(recentSessions || []);

      return new Response(JSON.stringify({ recommendations }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Action non reconnue' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in immersive-breathing function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper functions
function generateGuidance(pattern: string, difficulty: string) {
  const guides = {
    'box-breathing': {
      beginner: { inhale: 4, hold: 4, exhale: 4, rest: 4, instructions: 'Respiration carrée pour la relaxation' },
      intermediate: { inhale: 5, hold: 5, exhale: 5, rest: 5, instructions: 'Respiration carrée avancée' },
      advanced: { inhale: 6, hold: 6, exhale: 6, rest: 6, instructions: 'Respiration carrée experte' }
    },
    '4-7-8': {
      beginner: { inhale: 4, hold: 7, exhale: 8, rest: 2, instructions: 'Respiration 4-7-8 pour le sommeil' },
      intermediate: { inhale: 5, hold: 8, exhale: 10, rest: 3, instructions: '4-7-8 intermédiaire' },
      advanced: { inhale: 6, hold: 10, exhale: 12, rest: 4, instructions: '4-7-8 avancé' }
    },
    'wim-hof': {
      beginner: { cycles: 3, breaths_per_cycle: 20, retention: 30, instructions: 'Méthode Wim Hof débutant' },
      intermediate: { cycles: 4, breaths_per_cycle: 30, retention: 60, instructions: 'Wim Hof intermédiaire' },
      advanced: { cycles: 5, breaths_per_cycle: 40, retention: 90, instructions: 'Wim Hof avancé' }
    },
    'coherence': {
      beginner: { inhale: 5, exhale: 5, duration: 300, instructions: 'Cohérence cardiaque 5-5' },
      intermediate: { inhale: 6, exhale: 6, duration: 600, instructions: 'Cohérence cardiaque longue' },
      advanced: { inhale: 5, exhale: 5, duration: 900, instructions: 'Cohérence cardiaque experte' }
    }
  };

  return guides[pattern]?.[difficulty] || guides['box-breathing']['beginner'];
}

function getPatternColors(pattern: string) {
  const colors = {
    'box-breathing': { primary: '#3B82F6', secondary: '#60A5FA', accent: '#93C5FD' },
    '4-7-8': { primary: '#8B5CF6', secondary: '#A78BFA', accent: '#C4B5FD' },
    'wim-hof': { primary: '#EF4444', secondary: '#F87171', accent: '#FCA5A5' },
    'coherence': { primary: '#10B981', secondary: '#34D399', accent: '#6EE7B7' },
    'oceanic': { primary: '#06B6D4', secondary: '#22D3EE', accent: '#67E8F9' }
  };

  return colors[pattern] || colors['box-breathing'];
}

function getMostFrequentPattern(sessions: any[]) {
  if (!sessions.length) return 'box-breathing';
  const counts = sessions.reduce((acc, s) => {
    acc[s.pattern] = (acc[s.pattern] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}

function calculateStreak(sessions: any[]) {
  if (!sessions.length) return 0;
  let streak = 1;
  const sortedDates = sessions.map(s => new Date(s.started_at).toDateString()).sort().reverse();
  for (let i = 1; i < sortedDates.length; i++) {
    const diff = Math.abs(new Date(sortedDates[i-1]).getTime() - new Date(sortedDates[i]).getTime());
    const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (daysDiff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function generateRecommendations(sessions: any[]) {
  const recommendations = [];

  if (!sessions.length) {
    recommendations.push({
      pattern: 'box-breathing',
      difficulty: 'beginner',
      reason: 'Idéal pour commencer votre pratique',
      duration: 5
    });
  } else {
    const avgMoodImprovement = sessions.reduce((sum, s) => sum + ((s.mood_after || 5) - (s.mood_before || 5)), 0) / sessions.length;
    
    if (avgMoodImprovement < 1) {
      recommendations.push({
        pattern: 'coherence',
        difficulty: 'beginner',
        reason: 'Améliorer votre bien-être émotionnel',
        duration: 10
      });
    }

    const lastPattern = sessions[0]?.pattern;
    if (lastPattern === 'box-breathing') {
      recommendations.push({
        pattern: '4-7-8',
        difficulty: 'intermediate',
        reason: 'Progresser vers des techniques avancées',
        duration: 8
      });
    }
  }

  return recommendations;
}

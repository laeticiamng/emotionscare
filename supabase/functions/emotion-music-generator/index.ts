import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Get user from token
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'Authorization': authHeader,
        'apikey': supabaseKey,
      }
    });

    if (!userResponse.ok) {
      return new Response(JSON.stringify({ error: 'Utilisateur non authentifié' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const user = await userResponse.json();

    const { emotion, intensity, mood, action } = await req.json();

    // Generate playlist with AI
    if (action === 'generate' && lovableApiKey) {
      const prompt = `En tant qu'expert en musicothérapie, génère une playlist personnalisée pour quelqu'un qui ressent l'émotion "${emotion}" avec une intensité de ${intensity}/10.
      
État d'esprit actuel: ${mood || 'neutre'}

Crée une liste de 8-10 morceaux qui:
1. Correspondent à l'état émotionnel actuel
2. Aident à réguler cette émotion de manière saine
3. Incluent des genres variés (ambient, classique, lo-fi, nature sounds)

Format de réponse JSON:
{
  "playlist": {
    "name": "Nom évocateur de la playlist",
    "description": "Description thérapeutique de la playlist",
    "emotion_match": "Pourquoi cette playlist correspond à l'émotion",
    "tracks": [
      {
        "title": "Titre du morceau",
        "artist": "Artiste",
        "genre": "Genre musical",
        "duration": "Durée en minutes",
        "therapeutic_effect": "Effet thérapeutique attendu",
        "bpm": "Tempo approximatif"
      }
    ]
  },
  "recommendations": {
    "listening_tips": "Conseils d'écoute",
    "best_time": "Meilleur moment pour écouter",
    "complementary_activities": ["Activité 1", "Activité 2"]
  }
}`;

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
              content: 'Tu es un expert en musicothérapie et en bien-être émotionnel. Tu génères des playlists thérapeutiques personnalisées basées sur les émotions des utilisateurs. Réponds toujours en JSON valide.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
        }),
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error('AI API error:', aiResponse.status, errorText);
        throw new Error(`AI API error: ${aiResponse.status}`);
      }

      const aiData = await aiResponse.json();
      const content = aiData.choices[0].message.content;
      
      // Parse JSON from AI response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const playlistData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

      if (!playlistData) {
        throw new Error('Invalid AI response format');
      }

      // Save to database
      const saveResponse = await fetch(`${supabaseUrl}/rest/v1/emotion_music_playlists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          user_id: user.id,
          emotion: emotion,
          intensity: intensity,
          mood: mood,
          playlist_data: playlistData.playlist,
          recommendations: playlistData.recommendations,
        })
      });

      let savedPlaylist = null;
      if (saveResponse.ok) {
        const saved = await saveResponse.json();
        savedPlaylist = Array.isArray(saved) ? saved[0] : saved;
      } else {
        console.error('Error saving playlist:', await saveResponse.text());
      }

      // Log analytics
      await fetch(`${supabaseUrl}/rest/v1/emotion_music_analytics`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          emotion: emotion,
          intensity: intensity,
          action: 'generate',
          playlist_id: savedPlaylist?.id,
        })
      });

      return new Response(
        JSON.stringify({
          success: true,
          playlist: playlistData.playlist,
          recommendations: playlistData.recommendations,
          playlistId: savedPlaylist?.id,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get user's playlists history
    if (action === 'history') {
      const playlistsResponse = await fetch(
        `${supabaseUrl}/rest/v1/emotion_music_playlists?user_id=eq.${user.id}&order=created_at.desc&limit=20`,
        {
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
          }
        }
      );

      if (!playlistsResponse.ok) {
        throw new Error('Failed to fetch playlists');
      }

      const playlists = await playlistsResponse.json();

      return new Response(
        JSON.stringify({ success: true, playlists }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get analytics
    if (action === 'analytics') {
      const analyticsResponse = await fetch(
        `${supabaseUrl}/rest/v1/emotion_music_analytics?user_id=eq.${user.id}&order=created_at.desc&limit=100`,
        {
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
          }
        }
      );

      if (!analyticsResponse.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const analytics = await analyticsResponse.json();

      // Calculate stats
      const emotionCounts: Record<string, number> = {};
      const totalSessions = analytics.length;
      
      analytics.forEach((entry: any) => {
        emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
      });

      const mostFrequentEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];
      const avgIntensity = analytics.reduce((sum: number, a: any) => sum + (a.intensity || 0), 0) / totalSessions || 0;

      return new Response(
        JSON.stringify({
          success: true,
          stats: {
            totalSessions,
            emotionDistribution: emotionCounts,
            mostFrequentEmotion: mostFrequentEmotion?.[0] || 'calme',
            averageIntensity: Math.round(avgIntensity * 10) / 10,
          },
          recentSessions: analytics.slice(0, 10),
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Action non reconnue' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in emotion-music-generator:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

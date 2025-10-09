// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, preferences } = await req.json();

    console.log('🔔 Smart Notifications request:', { user_id: user.id, action });

    if (action === 'generate_suggestions') {
      // Récupérer les données utilisateur pour contexte
      const { data: recentScans } = await supabase
        .from('emotion_scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: userPrefs } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Appeler Lovable AI pour suggestions intelligentes
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      if (!LOVABLE_API_KEY) {
        throw new Error('LOVABLE_API_KEY non configurée');
      }

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
              content: `Tu es un assistant de bien-être psychologique qui génère des notifications et rappels personnalisés. 
              Analyse les données émotionnelles de l'utilisateur et propose des notifications pertinentes, bienveillantes et motivantes.
              Réponds UNIQUEMENT en JSON avec ce format:
              {
                "notifications": [
                  {
                    "title": "string",
                    "message": "string",
                    "type": "reminder|insight|encouragement|alert",
                    "priority": "low|medium|high",
                    "suggested_time": "morning|afternoon|evening|night",
                    "action": "breathe|journal|scan|music|coach"
                  }
                ]
              }`
            },
            {
              role: 'user',
              content: `Données récentes: ${JSON.stringify(recentScans?.slice(0, 5) || [])}
              Préférences: ${JSON.stringify(userPrefs || {})}
              
              Génère 5 notifications intelligentes et personnalisées basées sur les patterns émotionnels de l'utilisateur.`
            }
          ],
        }),
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error('❌ AI Gateway error:', errorText);
        throw new Error('Erreur AI Gateway');
      }

      const aiData = await aiResponse.json();
      const aiContent = aiData.choices[0].message.content;
      
      let suggestions;
      try {
        const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
        suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : { notifications: [] };
      } catch (e) {
        console.error('❌ JSON parsing error:', e);
        suggestions = { notifications: [] };
      }

      // Enregistrer les suggestions
      const { data: savedNotifications, error: insertError } = await supabase
        .from('smart_notifications')
        .insert(
          suggestions.notifications.map((notif: any) => ({
            user_id: user.id,
            title: notif.title,
            message: notif.message,
            type: notif.type,
            priority: notif.priority,
            suggested_time: notif.suggested_time,
            action: notif.action,
            status: 'pending',
            metadata: { ai_generated: true }
          }))
        )
        .select();

      if (insertError) {
        console.error('❌ Insert error:', insertError);
        throw insertError;
      }

      console.log('✅ Generated notifications:', savedNotifications?.length);

      return new Response(
        JSON.stringify({
          notifications: savedNotifications,
          message: 'Notifications générées avec succès'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (action === 'get_notifications') {
      const { data: notifications, error } = await supabase
        .from('smart_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return new Response(
        JSON.stringify({ notifications }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (action === 'mark_read') {
      const { notificationId } = await req.json();
      
      const { error } = await supabase
        .from('smart_notifications')
        .update({ status: 'read', read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (action === 'update_preferences') {
      const { data: updated, error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ preferences: updated }),
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

  } catch (error: any) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Erreur interne' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

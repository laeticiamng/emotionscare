// @ts-nocheck
/**
 * User Preferences API - Centralized user settings management
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'getProfile': {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        return new Response(JSON.stringify({ profile: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'updateProfile': {
        const { displayName, avatarUrl, bio, preferences } = body;
        
        const updateData: Record<string, unknown> = {
          updated_at: new Date().toISOString(),
        };
        if (displayName !== undefined) updateData.display_name = displayName;
        if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;
        if (bio !== undefined) updateData.bio = bio;
        if (preferences !== undefined) updateData.preferences = preferences;

        const { data, error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id)
          .select()
          .single();

        if (error) throw error;

        console.log('[user-preferences-api] Profile updated:', user.id);
        return new Response(JSON.stringify({ profile: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'getSettings': {
        const { data, error } = await supabase
          .from('user_settings')
          .select('key, value')
          .eq('user_id', user.id);

        if (error) throw error;

        const settings: Record<string, unknown> = {};
        (data || []).forEach(s => {
          settings[s.key] = s.value;
        });

        return new Response(JSON.stringify({ settings }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'setSetting': {
        const { key, value } = body;
        
        const { error } = await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            key,
            value,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,key'
          });

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'getConsents': {
        const { data, error } = await supabase
          .from('consent_records')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        return new Response(JSON.stringify({ consents: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'updateConsents': {
        const { audio, video, emotionAnalysis, dataSharing } = body;
        
        const { data, error } = await supabase
          .from('consent_records')
          .insert({
            user_id: user.id,
            audio_consent: audio ?? false,
            video_consent: video ?? false,
            emotion_analysis_consent: emotionAnalysis ?? false,
            data_sharing_consent: dataSharing ?? false,
            consent_version: '2.0',
          })
          .select()
          .single();

        if (error) throw error;

        console.log('[user-preferences-api] Consents updated:', user.id);
        return new Response(JSON.stringify({ consents: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'getNotificationPreferences': {
        const { data, error } = await supabase
          .from('user_notification_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        return new Response(JSON.stringify({ preferences: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'updateNotificationPreferences': {
        const { email, push, sms, inApp, quietHours } = body;
        
        const { data, error } = await supabase
          .from('user_notification_settings')
          .upsert({
            user_id: user.id,
            email_enabled: email ?? true,
            push_enabled: push ?? true,
            sms_enabled: sms ?? false,
            in_app_enabled: inApp ?? true,
            quiet_hours_start: quietHours?.start || null,
            quiet_hours_end: quietHours?.end || null,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id'
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ preferences: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'getAccessibility': {
        const { data } = await supabase
          .from('user_settings')
          .select('key, value')
          .eq('user_id', user.id)
          .in('key', ['reduced_motion', 'high_contrast', 'font_size', 'screen_reader']);

        const accessibility: Record<string, unknown> = {};
        (data || []).forEach(s => {
          accessibility[s.key] = s.value;
        });

        return new Response(JSON.stringify({ accessibility }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'updateAccessibility': {
        const { reducedMotion, highContrast, fontSize, screenReader } = body;
        
        const updates = [];
        if (reducedMotion !== undefined) updates.push({ key: 'reduced_motion', value: reducedMotion });
        if (highContrast !== undefined) updates.push({ key: 'high_contrast', value: highContrast });
        if (fontSize !== undefined) updates.push({ key: 'font_size', value: fontSize });
        if (screenReader !== undefined) updates.push({ key: 'screen_reader', value: screenReader });

        for (const { key, value } of updates) {
          await supabase
            .from('user_settings')
            .upsert({
              user_id: user.id,
              key,
              value,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'user_id,key'
            });
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('[user-preferences-api] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

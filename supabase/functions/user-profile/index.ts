// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { action, profileData, preferences } = await req.json();

    switch (action) {
      case 'getProfile': {
        // Récupérer le profil complet
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // Récupérer l'aura actuelle
        const { data: aura } = await supabaseClient
          .from('user_auras')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // Récupérer les statistiques d'activité
        const { count: scanCount } = await supabaseClient
          .from('scans')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        const { count: breathingCount } = await supabaseClient
          .from('breathing_vr_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        const { count: journalCount } = await supabaseClient
          .from('journal_text_entries')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Calculer le streak
        const { data: recentActivity } = await supabaseClient
          .from('scans')
          .select('created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(30);

        let currentStreak = 0;
        if (recentActivity && recentActivity.length > 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          for (let i = 0; i < recentActivity.length; i++) {
            const activityDate = new Date(recentActivity[i].created_at);
            activityDate.setHours(0, 0, 0, 0);
            
            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - i);
            
            if (activityDate.getTime() === expectedDate.getTime()) {
              currentStreak++;
            } else {
              break;
            }
          }
        }

        return new Response(
          JSON.stringify({
            profile,
            aura,
            stats: {
              scanCount: scanCount || 0,
              breathingCount: breathingCount || 0,
              journalCount: journalCount || 0,
              currentStreak,
              totalActivities: (scanCount || 0) + (breathingCount || 0) + (journalCount || 0),
            },
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'updateProfile': {
        const { data: updatedProfile, error } = await supabaseClient
          .from('profiles')
          .update({
            full_name: profileData.fullName,
            avatar_url: profileData.avatarUrl,
            bio: profileData.bio,
            location: profileData.location,
            timezone: profileData.timezone,
            language: profileData.language,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)
          .select()
          .single();

        if (error) throw error;

        console.log('✅ Profile updated for user:', user.id);

        return new Response(
          JSON.stringify({ profile: updatedProfile }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'updatePreferences': {
        // Mettre à jour les préférences dans user_settings
        const { data: settings, error } = await supabaseClient
          .from('user_settings')
          .upsert({
            user_id: user.id,
            theme: preferences.theme,
            notifications_enabled: preferences.notificationsEnabled,
            email_notifications: preferences.emailNotifications,
            sound_enabled: preferences.soundEnabled,
            language: preferences.language,
            privacy_mode: preferences.privacyMode,
            data_sharing: preferences.dataSharing,
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;

        console.log('✅ Preferences updated for user:', user.id);

        return new Response(
          JSON.stringify({ settings }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'getActivityHistory': {
        // Récupérer l'historique d'activité des 30 derniers jours
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: scans } = await supabaseClient
          .from('scans')
          .select('id, created_at, emotion_result')
          .eq('user_id', user.id)
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: false });

        const { data: breathing } = await supabaseClient
          .from('breathing_vr_sessions')
          .select('id, created_at, pattern, duration_seconds')
          .eq('user_id', user.id)
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: false });

        const { data: journals } = await supabaseClient
          .from('journal_text_entries')
          .select('id, created_at, mood')
          .eq('user_id', user.id)
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: false });

        // Agréger par jour
        const activityByDay: Record<string, any> = {};
        
        const addActivity = (date: string, type: string) => {
          const day = date.split('T')[0];
          if (!activityByDay[day]) {
            activityByDay[day] = { date: day, scans: 0, breathing: 0, journals: 0, total: 0 };
          }
          activityByDay[day][type]++;
          activityByDay[day].total++;
        };

        scans?.forEach((s: any) => addActivity(s.created_at, 'scans'));
        breathing?.forEach((b: any) => addActivity(b.created_at, 'breathing'));
        journals?.forEach((j: any) => addActivity(j.created_at, 'journals'));

        const history = Object.values(activityByDay).sort((a: any, b: any) => 
          b.date.localeCompare(a.date)
        );

        return new Response(
          JSON.stringify({ history }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'exportData': {
        // Exporter toutes les données de l'utilisateur (RGPD)
        const { data: scans } = await supabaseClient
          .from('scans')
          .select('*')
          .eq('user_id', user.id);

        const { data: journals } = await supabaseClient
          .from('journal_text_entries')
          .select('*')
          .eq('user_id', user.id);

        const { data: breathing } = await supabaseClient
          .from('breathing_vr_sessions')
          .select('*')
          .eq('user_id', user.id);

        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        const exportData = {
          exportDate: new Date().toISOString(),
          userId: user.id,
          profile,
          scans,
          journals,
          breathingSessions: breathing,
        };

        console.log('✅ Data exported for user:', user.id);

        return new Response(
          JSON.stringify(exportData),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('❌ User Profile error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

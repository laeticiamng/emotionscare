// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GritEvent {
  t: number;
  type: 'start' | 'pause' | 'resume' | 'abort' | 'finish';
  reason?: string;
}

interface HumeSummary {
  frustration_index?: number;
  focus_index?: number;
  samples?: Array<{ t: number; emo: string; conf: number }>;
}

interface CompleteRequest {
  quest_id: string;
  success: boolean;
  events: GritEvent[];
  hume?: HumeSummary;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quest_id, success, events, hume }: CompleteRequest = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      userId = user?.id || null;
    }

    // Calculate XP based on performance
    let xpGain = 25; // Base XP
    
    if (success) {
      xpGain += 50; // Completion bonus
      
      // Bonus for no pauses
      const pauseCount = events.filter(e => e.type === 'pause').length;
      if (pauseCount === 0) {
        xpGain += 25; // No pause bonus
      }
      
      // Bonus for focus (from Hume analysis)
      if (hume?.focus_index && hume.focus_index > 0.7) {
        xpGain += 30; // High focus bonus
      }
      
      // Penalty for frustration
      if (hume?.frustration_index && hume.frustration_index > 0.5) {
        xpGain = Math.max(25, xpGain - 15);
      }
    } else {
      // Partial XP for attempting
      xpGain = 10;
    }

    // Determine badge
    const badgeId = determineBadge(success, events, hume);
    
    // Generate personalized message
    const message = generateMessage(success, xpGain, badgeId);

    // Log activity
    if (userId) {
      await supabase.from('activity_logs').insert({
        user_id: userId,
        route: '/boss-level-grit',
        page_key: 'grit_quest_completed',
        context: {
          quest_id,
          success,
          xp_gain: xpGain,
          badge_id: badgeId,
          pause_count: events.filter(e => e.type === 'pause').length,
          hume_summary: hume || null
        }
      });

      // Update user stats (if gamification table exists)
      try {
        const { data: existingStats } = await supabase
          .from('user_game_stats')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (existingStats) {
          await supabase.from('user_game_stats').update({
            total_xp: existingStats.total_xp + xpGain,
            grit_quests_completed: (existingStats.grit_quests_completed || 0) + (success ? 1 : 0),
            last_activity: new Date().toISOString()
          }).eq('user_id', userId);
        }
      } catch (e) {
        // Stats table might not exist, that's ok
        console.log('Stats update skipped:', e);
      }
    }

    return new Response(JSON.stringify({
      quest_id,
      badge_id: badgeId,
      xp_gain: xpGain,
      message,
      success
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in complete-grit-challenge:', error);
    
    return new Response(JSON.stringify({
      badge_id: 'participant',
      xp_gain: 10,
      message: "Merci d'avoir participé ! Chaque effort compte.",
      success: false,
      error: error.message
    }), {
      status: 200, // Return 200 to not break the flow
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function determineBadge(success: boolean, events: GritEvent[], hume?: HumeSummary): string {
  if (!success) return 'participant';
  
  const pauseCount = events.filter(e => e.type === 'pause').length;
  const focusLevel = hume?.focus_index || 0.5;
  const frustrationLevel = hume?.frustration_index || 0;
  
  // Perfect run: no pause, high focus, low frustration
  if (pauseCount === 0 && focusLevel > 0.8 && frustrationLevel < 0.2) {
    return 'legendary_grit';
  }
  
  // Epic run: success with high focus
  if (focusLevel > 0.7 && frustrationLevel < 0.4) {
    return 'epic_warrior';
  }
  
  // Strong run: success with no pauses
  if (pauseCount === 0) {
    return 'steady_champion';
  }
  
  // Resilient: success despite challenges
  if (frustrationLevel > 0.5 && success) {
    return 'resilient_spirit';
  }
  
  return 'grit_achiever';
}

function generateMessage(success: boolean, xpGain: number, badgeId: string): string {
  if (!success) {
    return "L'important n'est pas de ne jamais tomber, mais de toujours se relever. Tu as montré du courage !";
  }
  
  const messages: Record<string, string> = {
    'legendary_grit': `🏆 LÉGENDAIRE ! Tu as accompli un run parfait ! +${xpGain} XP mérités !`,
    'epic_warrior': `⚔️ Performance épique ! Ta concentration était impressionnante. +${xpGain} XP !`,
    'steady_champion': `💪 Champion sans faille ! Tu n'as jamais flanché. +${xpGain} XP !`,
    'resilient_spirit': `🔥 Esprit résilient ! Tu as surmonté les obstacles avec brio. +${xpGain} XP !`,
    'grit_achiever': `✨ Bravo ! Tu as prouvé ta détermination. +${xpGain} XP !`
  };
  
  return messages[badgeId] || `Excellent travail ! +${xpGain} XP !`;
}

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CATEGORY_XP_MULTIPLIER: Record<string, number> = {
  physical: 1.2,
  mental: 1.1,
  emotional: 1.0,
  social: 1.15,
  creative: 1.05,
  professional: 1.1,
};

const DIFFICULTY_XP_MULTIPLIER: Record<string, number> = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.0,
  extreme: 3.0,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, challengeId, attemptId, userId, ...data } = await req.json();

    switch (action) {
      case "list_public": {
        const { data: challenges, error } = await supabase
          .from("boss_grit_challenges")
          .select("*")
          .eq("is_public", true)
          .order("completions_count", { ascending: false })
          .limit(50);
        
        if (error) throw error;
        return new Response(JSON.stringify({ challenges }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get_my_challenges": {
        const { data: challenges, error } = await supabase
          .from("boss_grit_challenges")
          .select("*")
          .eq("creator_id", userId)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        return new Response(JSON.stringify({ challenges }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "create_challenge": {
        const { title, description, category, difficulty, durationMinutes, requirements, successCriteria, tips, isPublic, tags } = data;
        
        const baseXp = 50;
        const categoryMult = CATEGORY_XP_MULTIPLIER[category] || 1.0;
        const difficultyMult = DIFFICULTY_XP_MULTIPLIER[difficulty] || 1.0;
        const durationBonus = Math.floor(durationMinutes / 15) * 10;
        const xpReward = Math.round((baseXp + durationBonus) * categoryMult * difficultyMult);

        const { data: challenge, error } = await supabase
          .from("boss_grit_challenges")
          .insert({
            creator_id: userId,
            title,
            description,
            category,
            difficulty,
            duration_minutes: durationMinutes,
            xp_reward: xpReward,
            requirements: requirements || [],
            success_criteria: successCriteria,
            tips: tips || [],
            is_public: isPublic ?? false,
            tags: tags || [],
          })
          .select()
          .single();

        if (error) throw error;
        
        return new Response(JSON.stringify({ challenge }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "start_challenge": {
        // Check for active challenge
        const { data: active } = await supabase
          .from("boss_grit_attempts")
          .select("id")
          .eq("user_id", userId)
          .is("completed_at", null)
          .single();

        if (active) {
          return new Response(JSON.stringify({ error: "You have an active challenge" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { data: attempt, error } = await supabase
          .from("boss_grit_attempts")
          .insert({
            challenge_id: challengeId,
            user_id: userId,
          })
          .select()
          .single();

        if (error) throw error;
        
        return new Response(JSON.stringify({ attempt }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "complete_challenge": {
        const { success, notes, rating } = data;
        
        // Get challenge XP
        const { data: attempt } = await supabase
          .from("boss_grit_attempts")
          .select("challenge_id")
          .eq("id", attemptId)
          .single();

        let xpEarned = 0;
        if (success && attempt) {
          const { data: challenge } = await supabase
            .from("boss_grit_challenges")
            .select("xp_reward, completions_count")
            .eq("id", attempt.challenge_id)
            .single();

          if (challenge) {
            xpEarned = challenge.xp_reward;
            
            // Update completions count
            await supabase
              .from("boss_grit_challenges")
              .update({ completions_count: challenge.completions_count + 1 })
              .eq("id", attempt.challenge_id);
          }
        }

        const { error } = await supabase
          .from("boss_grit_attempts")
          .update({
            completed_at: new Date().toISOString(),
            success,
            notes: notes || "",
            rating,
            xp_earned: xpEarned,
          })
          .eq("id", attemptId);

        if (error) throw error;
        
        return new Response(JSON.stringify({ success: true, xpEarned }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "abandon_challenge": {
        const { error } = await supabase
          .from("boss_grit_attempts")
          .update({
            completed_at: new Date().toISOString(),
            success: false,
            notes: "Abandonné",
          })
          .eq("id", attemptId);

        if (error) throw error;
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get_my_attempts": {
        const { data: attempts, error } = await supabase
          .from("boss_grit_attempts")
          .select("*")
          .eq("user_id", userId)
          .order("started_at", { ascending: false })
          .limit(50);

        if (error) throw error;
        
        return new Response(JSON.stringify({ attempts }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "search": {
        const { query, category, difficulty } = data;
        
        let queryBuilder = supabase
          .from("boss_grit_challenges")
          .select("*")
          .eq("is_public", true)
          .ilike("title", `%${query}%`);

        if (category) {
          queryBuilder = queryBuilder.eq("category", category);
        }
        if (difficulty) {
          queryBuilder = queryBuilder.eq("difficulty", difficulty);
        }

        const { data: challenges, error } = await queryBuilder
          .order("completions_count", { ascending: false })
          .limit(20);

        if (error) throw error;
        
        return new Response(JSON.stringify({ challenges }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("boss-grit-challenges error:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

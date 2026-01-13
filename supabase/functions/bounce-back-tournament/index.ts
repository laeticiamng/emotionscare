import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, tournamentId, playerId, roundId, ...data } = await req.json();

    switch (action) {
      case "list_tournaments": {
        const { data: tournaments, error } = await supabase
          .from("bounce_back_tournaments")
          .select("*")
          .in("phase", ["registration", "warmup", "active"])
          .order("starts_at", { ascending: true });
        
        if (error) throw error;
        return new Response(JSON.stringify({ tournaments }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get_tournament": {
        const { data: tournament, error: tError } = await supabase
          .from("bounce_back_tournaments")
          .select("*")
          .eq("id", tournamentId)
          .single();
        
        if (tError) throw tError;

        const { data: players } = await supabase
          .from("bounce_back_players")
          .select("*")
          .eq("tournament_id", tournamentId)
          .order("resilience_score", { ascending: false });

        const { data: rounds } = await supabase
          .from("bounce_back_rounds")
          .select("*")
          .eq("tournament_id", tournamentId)
          .order("round_number", { ascending: true });

        return new Response(JSON.stringify({ tournament, players, rounds }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "join": {
        const { userId, displayName, avatarEmoji } = data;
        
        // Check if already joined
        const { data: existing } = await supabase
          .from("bounce_back_players")
          .select("id")
          .eq("tournament_id", tournamentId)
          .eq("user_id", userId)
          .single();

        if (existing) {
          return new Response(JSON.stringify({ error: "Already joined" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { data: player, error } = await supabase
          .from("bounce_back_players")
          .insert({
            tournament_id: tournamentId,
            user_id: userId,
            display_name: displayName,
            avatar_emoji: avatarEmoji || "😊",
          })
          .select()
          .single();

        if (error) throw error;
        
        return new Response(JSON.stringify({ player }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "submit_response": {
        const { response, timeTaken } = data;
        
        // Calculate score
        const baseScore = 100;
        const timeBonus = Math.max(0, (120 - timeTaken) * 0.5);
        const lengthBonus = Math.min(50, response.length * 0.1);
        const score = Math.round(baseScore + timeBonus + lengthBonus);

        const { data: submission, error } = await supabase
          .from("bounce_back_submissions")
          .insert({
            round_id: roundId,
            player_id: playerId,
            response,
            score,
            time_taken_seconds: timeTaken,
          })
          .select()
          .single();

        if (error) throw error;

        // Update player score
        await supabase
          .from("bounce_back_players")
          .update({ 
            resilience_score: supabase.rpc('increment_resilience', { player_id: playerId, points: score })
          })
          .eq("id", playerId);

        return new Response(JSON.stringify({ submission, score }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "start_round": {
        const { roundNumber, challengeType, challengePrompt, timeLimit } = data;
        
        const { data: round, error } = await supabase
          .from("bounce_back_rounds")
          .insert({
            tournament_id: tournamentId,
            round_number: roundNumber,
            challenge_type: challengeType,
            challenge_prompt: challengePrompt,
            time_limit_seconds: timeLimit || 120,
            started_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;

        // Update tournament current round
        await supabase
          .from("bounce_back_tournaments")
          .update({ current_round: roundNumber })
          .eq("id", tournamentId);

        return new Response(JSON.stringify({ round }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "end_round": {
        const { error } = await supabase
          .from("bounce_back_rounds")
          .update({ ended_at: new Date().toISOString() })
          .eq("id", roundId);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get_leaderboard": {
        const { data: players, error } = await supabase
          .from("bounce_back_players")
          .select("*")
          .eq("tournament_id", tournamentId)
          .eq("is_eliminated", false)
          .order("resilience_score", { ascending: false })
          .limit(20);

        if (error) throw error;

        return new Response(JSON.stringify({ leaderboard: players }), {
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
    console.error("bounce-back-tournament error:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

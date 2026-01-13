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

    const { action, tournamentId, ...data } = await req.json();

    switch (action) {
      case "list_tournaments": {
        const { data: tournaments, error } = await supabase
          .from("tournaments")
          .select("*")
          .in("status", ["registration", "in_progress"])
          .order("starts_at", { ascending: true });
        
        if (error) throw error;
        return new Response(JSON.stringify({ tournaments }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get_tournament": {
        const { data: tournament, error: tError } = await supabase
          .from("tournaments")
          .select("*")
          .eq("id", tournamentId)
          .single();
        
        if (tError) throw tError;

        const { data: participants } = await supabase
          .from("tournament_participants")
          .select("*")
          .eq("tournament_id", tournamentId)
          .order("seed", { ascending: true });

        const { data: matches } = await supabase
          .from("tournament_matches")
          .select("*")
          .eq("tournament_id", tournamentId)
          .order("round", { ascending: true })
          .order("match_number", { ascending: true });

        return new Response(JSON.stringify({ tournament, participants, matches }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "register": {
        const { userId, displayName, avatarEmoji } = data;
        
        // Check if already registered
        const { data: existing } = await supabase
          .from("tournament_participants")
          .select("id")
          .eq("tournament_id", tournamentId)
          .eq("user_id", userId)
          .single();

        if (existing) {
          return new Response(JSON.stringify({ error: "Already registered" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Get current participant count
        const { data: tournament } = await supabase
          .from("tournaments")
          .select("current_participants, max_participants")
          .eq("id", tournamentId)
          .single();

        if (tournament && tournament.current_participants >= tournament.max_participants) {
          return new Response(JSON.stringify({ error: "Tournament is full" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const seed = (tournament?.current_participants || 0) + 1;

        const { data: participant, error } = await supabase
          .from("tournament_participants")
          .insert({
            tournament_id: tournamentId,
            user_id: userId,
            display_name: displayName,
            avatar_emoji: avatarEmoji || "🎮",
            seed,
          })
          .select()
          .single();

        if (error) throw error;

        // Update participant count
        await supabase
          .from("tournaments")
          .update({ current_participants: seed })
          .eq("id", tournamentId);

        return new Response(JSON.stringify({ participant }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "generate_brackets": {
        // Get all participants
        const { data: participants } = await supabase
          .from("tournament_participants")
          .select("*")
          .eq("tournament_id", tournamentId)
          .order("seed", { ascending: true });

        if (!participants || participants.length < 2) {
          return new Response(JSON.stringify({ error: "Not enough participants" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Calculate rounds needed
        const numParticipants = participants.length;
        const totalRounds = Math.ceil(Math.log2(numParticipants));
        const firstRoundMatches = Math.pow(2, totalRounds - 1);

        const matches: any[] = [];
        let matchNumber = 1;

        // Generate first round matches
        for (let i = 0; i < firstRoundMatches; i++) {
          const p1Index = i * 2;
          const p2Index = i * 2 + 1;
          
          matches.push({
            tournament_id: tournamentId,
            round: 1,
            match_number: matchNumber++,
            participant_1_id: participants[p1Index]?.id || null,
            participant_2_id: p2Index < numParticipants ? participants[p2Index]?.id : null,
            status: p2Index >= numParticipants ? "bye" : "pending",
            winner_id: p2Index >= numParticipants ? participants[p1Index]?.id : null,
          });
        }

        // Generate subsequent rounds
        for (let round = 2; round <= totalRounds; round++) {
          const matchesInRound = Math.pow(2, totalRounds - round);
          for (let i = 0; i < matchesInRound; i++) {
            matches.push({
              tournament_id: tournamentId,
              round,
              match_number: matchNumber++,
              participant_1_id: null,
              participant_2_id: null,
              status: "pending",
            });
          }
        }

        // Insert all matches
        const { error } = await supabase
          .from("tournament_matches")
          .insert(matches);

        if (error) throw error;

        // Update tournament status
        await supabase
          .from("tournaments")
          .update({ status: "in_progress" })
          .eq("id", tournamentId);

        return new Response(JSON.stringify({ 
          success: true, 
          matchesCreated: matches.length,
          totalRounds 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "submit_score": {
        const { matchId, participantId, score } = data;
        
        const { data: match } = await supabase
          .from("tournament_matches")
          .select("*")
          .eq("id", matchId)
          .single();

        if (!match) {
          return new Response(JSON.stringify({ error: "Match not found" }), {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const isP1 = match.participant_1_id === participantId;
        const isP2 = match.participant_2_id === participantId;

        if (!isP1 && !isP2) {
          return new Response(JSON.stringify({ error: "Not a participant in this match" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const updateField = isP1 ? "participant_1_score" : "participant_2_score";
        
        const { error } = await supabase
          .from("tournament_matches")
          .update({ [updateField]: score })
          .eq("id", matchId);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "complete_match": {
        const { matchId, winnerId } = data;
        
        const { error } = await supabase
          .from("tournament_matches")
          .update({ 
            winner_id: winnerId,
            status: "completed",
            completed_at: new Date().toISOString(),
          })
          .eq("id", matchId);

        if (error) throw error;

        // Mark loser as eliminated
        const { data: match } = await supabase
          .from("tournament_matches")
          .select("participant_1_id, participant_2_id")
          .eq("id", matchId)
          .single();

        if (match) {
          const loserId = match.participant_1_id === winnerId 
            ? match.participant_2_id 
            : match.participant_1_id;

          if (loserId) {
            await supabase
              .from("tournament_participants")
              .update({ is_eliminated: true })
              .eq("id", loserId);

            await supabase
              .from("tournament_participants")
              .update({ wins: supabase.rpc('increment', { row_id: winnerId }) })
              .eq("id", winnerId);
          }
        }

        return new Response(JSON.stringify({ success: true }), {
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
    console.error("tournament-brackets error:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

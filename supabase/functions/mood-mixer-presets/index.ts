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

    const { action, presetId, userId, ...data } = await req.json();

    switch (action) {
      case "list_community": {
        const { data: presets, error } = await supabase
          .from("mood_mixer_presets")
          .select("*")
          .eq("is_public", true)
          .order("likes_count", { ascending: false })
          .limit(50);
        
        if (error) throw error;

        const featured = (presets || []).filter((p: any) => p.is_featured).slice(0, 6);
        
        return new Response(JSON.stringify({ presets, featured }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get_my_presets": {
        const { data: presets, error } = await supabase
          .from("mood_mixer_presets")
          .select("*")
          .eq("creator_id", userId)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        return new Response(JSON.stringify({ presets }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "create_preset": {
        const { name, description, sliders, creatorName, creatorAvatar, tags, isPublic } = data;
        
        const { data: preset, error } = await supabase
          .from("mood_mixer_presets")
          .insert({
            name,
            description: description || "",
            sliders,
            creator_id: userId,
            creator_name: creatorName || "Anonyme",
            creator_avatar: creatorAvatar || "🎵",
            tags: tags || [],
            is_public: isPublic ?? false,
          })
          .select()
          .single();

        if (error) throw error;
        
        return new Response(JSON.stringify({ preset }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "like_preset": {
        // Check if already liked
        const { data: existing } = await supabase
          .from("mood_mixer_preset_likes")
          .select("id")
          .eq("preset_id", presetId)
          .eq("user_id", userId)
          .single();

        if (existing) {
          // Unlike
          await supabase
            .from("mood_mixer_preset_likes")
            .delete()
            .eq("id", existing.id);

          await supabase.rpc("decrement_preset_likes", { p_preset_id: presetId });
          
          return new Response(JSON.stringify({ liked: false }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else {
          // Like
          await supabase
            .from("mood_mixer_preset_likes")
            .insert({ preset_id: presetId, user_id: userId });

          await supabase.rpc("increment_preset_likes", { p_preset_id: presetId });
          
          return new Response(JSON.stringify({ liked: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }

      case "use_preset": {
        await supabase.rpc("increment_preset_uses", { p_preset_id: presetId });
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "delete_preset": {
        const { error } = await supabase
          .from("mood_mixer_presets")
          .delete()
          .eq("id", presetId)
          .eq("creator_id", userId);

        if (error) throw error;
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "search": {
        const { query, tags } = data;
        
        let queryBuilder = supabase
          .from("mood_mixer_presets")
          .select("*")
          .eq("is_public", true)
          .ilike("name", `%${query}%`);

        if (tags && tags.length > 0) {
          queryBuilder = queryBuilder.contains("tags", tags);
        }

        const { data: presets, error } = await queryBuilder
          .order("likes_count", { ascending: false })
          .limit(20);

        if (error) throw error;
        
        return new Response(JSON.stringify({ presets }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get_my_likes": {
        const { data: likes, error } = await supabase
          .from("mood_mixer_preset_likes")
          .select("preset_id")
          .eq("user_id", userId);

        if (error) throw error;
        
        return new Response(JSON.stringify({ 
          likedIds: (likes || []).map((l: any) => l.preset_id) 
        }), {
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
    console.error("mood-mixer-presets error:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

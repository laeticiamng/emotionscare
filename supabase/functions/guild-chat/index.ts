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

    const { action, guildId, memberId, ...data } = await req.json();

    switch (action) {
      case "list_guilds": {
        const { data: guilds, error } = await supabase
          .from("guilds")
          .select("*")
          .eq("is_public", true)
          .order("total_xp", { ascending: false })
          .limit(50);
        
        if (error) throw error;
        return new Response(JSON.stringify({ guilds }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get_guild": {
        const { data: guild, error: gError } = await supabase
          .from("guilds")
          .select("*")
          .eq("id", guildId)
          .single();
        
        if (gError) throw gError;

        const { data: members } = await supabase
          .from("guild_members")
          .select("*")
          .eq("guild_id", guildId)
          .order("role", { ascending: true });

        const { data: messages } = await supabase
          .from("guild_messages")
          .select("*")
          .eq("guild_id", guildId)
          .order("created_at", { ascending: false })
          .limit(100);

        return new Response(JSON.stringify({ 
          guild, 
          members, 
          messages: (messages || []).reverse() 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "create_guild": {
        const { name, description, bannerEmoji, leaderId, isPublic, tags } = data;
        
        const { data: guild, error } = await supabase
          .from("guilds")
          .insert({
            name,
            description,
            banner_emoji: bannerEmoji || "⚔️",
            leader_id: leaderId,
            is_public: isPublic ?? true,
            tags: tags || [],
          })
          .select()
          .single();

        if (error) throw error;

        // Add leader as first member
        await supabase
          .from("guild_members")
          .insert({
            guild_id: guild.id,
            user_id: leaderId,
            display_name: data.leaderName || "Leader",
            avatar_emoji: data.leaderAvatar || "👑",
            role: "leader",
            is_online: true,
          });

        return new Response(JSON.stringify({ guild }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "join_guild": {
        const { userId, displayName, avatarEmoji } = data;
        
        // Check capacity
        const { data: guild } = await supabase
          .from("guilds")
          .select("member_count, max_members")
          .eq("id", guildId)
          .single();

        if (guild && guild.member_count >= guild.max_members) {
          return new Response(JSON.stringify({ error: "Guild is full" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { data: member, error } = await supabase
          .from("guild_members")
          .insert({
            guild_id: guildId,
            user_id: userId,
            display_name: displayName,
            avatar_emoji: avatarEmoji || "😊",
            role: "member",
            is_online: true,
          })
          .select()
          .single();

        if (error) throw error;

        // Update member count
        await supabase
          .from("guilds")
          .update({ member_count: (guild?.member_count || 0) + 1 })
          .eq("id", guildId);

        // System message
        await supabase
          .from("guild_messages")
          .insert({
            guild_id: guildId,
            sender_id: member.id,
            sender_name: "Système",
            sender_avatar: "🎉",
            content: `${displayName} a rejoint la guilde !`,
            message_type: "system",
          });

        return new Response(JSON.stringify({ member }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "send_message": {
        const { senderId, senderName, senderAvatar, content, messageType } = data;
        
        const { data: message, error } = await supabase
          .from("guild_messages")
          .insert({
            guild_id: guildId,
            sender_id: senderId,
            sender_name: senderName,
            sender_avatar: senderAvatar || "😊",
            content,
            message_type: messageType || "text",
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "pin_message": {
        const { messageId } = data;
        
        const { error } = await supabase
          .from("guild_messages")
          .update({ is_pinned: true })
          .eq("id", messageId);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "update_online_status": {
        const { isOnline } = data;
        
        const { error } = await supabase
          .from("guild_members")
          .update({ 
            is_online: isOnline,
            last_active_at: new Date().toISOString(),
          })
          .eq("id", memberId);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "leave_guild": {
        const { userId } = data;
        
        const { error } = await supabase
          .from("guild_members")
          .delete()
          .eq("guild_id", guildId)
          .eq("user_id", userId);

        if (error) throw error;

        // Update member count
        const { data: guild } = await supabase
          .from("guilds")
          .select("member_count")
          .eq("id", guildId)
          .single();

        if (guild) {
          await supabase
            .from("guilds")
            .update({ member_count: Math.max(0, guild.member_count - 1) })
            .eq("id", guildId);
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
    console.error("guild-chat error:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// @ts-nocheck
/**
 * Community Groups - Gestion des groupes de soutien
 * Permet la création et gestion de groupes thématiques
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const ALLOWED_ORIGINS = [
  'https://emotionscare.com',
  'https://www.emotionscare.com',
  'https://emotions-care.lovable.app',
  'http://localhost:5173',
];

function getCorsHeaders(req) {
  const origin = req.headers.get('origin') ?? '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

// Groupes prédéfinis par thématique
const DEFAULT_GROUPS = [
  { id: 'anxiety', name: 'Gestion de l\'anxiété', emoji: '😰', description: 'Partage et soutien pour gérer l\'anxiété au quotidien', category: 'mental_health' },
  { id: 'stress', name: 'Stress au travail', emoji: '💼', description: 'Équilibre vie pro/perso et gestion du stress professionnel', category: 'work' },
  { id: 'grief', name: 'Traverser le deuil', emoji: '💙', description: 'Accompagnement et écoute dans les moments difficiles', category: 'life_events' },
  { id: 'positivity', name: 'Cultiver la joie', emoji: '☀️', description: 'Partage de moments positifs et gratitude', category: 'wellbeing' },
  { id: 'sleep', name: 'Mieux dormir', emoji: '🌙', description: 'Conseils et soutien pour améliorer son sommeil', category: 'health' },
  { id: 'parents', name: 'Parentalité sereine', emoji: '👨‍👩‍👧', description: 'Soutien entre parents pour gérer le stress familial', category: 'family' }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { action } = body;

    // Lister les groupes disponibles
    if (action === 'list') {
      const { data: memberships } = await supabaseClient
        .from('community_memberships')
        .select('group_id')
        .eq('user_id', user.id);

      const joinedGroups = new Set((memberships || []).map(m => m.group_id));

      const { data: groups } = await supabaseClient
        .from('community_groups')
        .select('*, community_memberships(count)')
        .order('created_at', { ascending: false });

      // Combiner avec les groupes par défaut
      const allGroups = groups || DEFAULT_GROUPS.map(g => ({
        ...g,
        member_count: 0,
        is_default: true
      }));

      return new Response(JSON.stringify({
        groups: allGroups.map(g => ({
          ...g,
          is_member: joinedGroups.has(g.id)
        })),
        categories: [
          { id: 'mental_health', name: 'Santé mentale', icon: '🧠' },
          { id: 'work', name: 'Travail', icon: '💼' },
          { id: 'life_events', name: 'Événements de vie', icon: '🌱' },
          { id: 'wellbeing', name: 'Bien-être', icon: '✨' },
          { id: 'health', name: 'Santé', icon: '💚' },
          { id: 'family', name: 'Famille', icon: '👨‍👩‍👧' }
        ]
      }), {
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // Rejoindre un groupe
    if (action === 'join') {
      const { groupId } = body;
      
      const { error } = await supabaseClient
        .from('community_memberships')
        .upsert({
          user_id: user.id,
          group_id: groupId,
          joined_at: new Date().toISOString(),
          role: 'member'
        }, { onConflict: 'user_id,group_id' });

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, message: 'Vous avez rejoint le groupe!' }), {
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // Quitter un groupe
    if (action === 'leave') {
      const { groupId } = body;
      
      const { error } = await supabaseClient
        .from('community_memberships')
        .delete()
        .eq('user_id', user.id)
        .eq('group_id', groupId);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // Récupérer les messages d'un groupe
    if (action === 'messages') {
      const { groupId, limit = 50 } = body;

      // Vérifier que l'utilisateur est membre
      const { data: membership } = await supabaseClient
        .from('community_memberships')
        .select('id')
        .eq('user_id', user.id)
        .eq('group_id', groupId)
        .single();

      if (!membership) {
        return new Response(JSON.stringify({ error: 'Vous devez être membre pour voir les messages' }), {
          status: 403,
          headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        });
      }

      const { data: messages } = await supabaseClient
        .from('community_messages')
        .select('*, profiles:user_id(display_name, avatar_url)')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false })
        .limit(limit);

      return new Response(JSON.stringify({ messages: messages || [] }), {
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // Poster un message
    if (action === 'post') {
      const { groupId, content, isAnonymous = false } = body;

      // Vérifier membership
      const { data: membership } = await supabaseClient
        .from('community_memberships')
        .select('id')
        .eq('user_id', user.id)
        .eq('group_id', groupId)
        .single();

      if (!membership) {
        return new Response(JSON.stringify({ error: 'Vous devez être membre pour poster' }), {
          status: 403,
          headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        });
      }

      // Modération basique du contenu
      if (content.length > 2000) {
        return new Response(JSON.stringify({ error: 'Message trop long (max 2000 caractères)' }), {
          status: 400,
          headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        });
      }

      const { data: message, error } = await supabaseClient
        .from('community_messages')
        .insert({
          group_id: groupId,
          user_id: user.id,
          content: content.trim(),
          is_anonymous: isAnonymous,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, message }), {
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // Réagir à un message
    if (action === 'react') {
      const { messageId, emoji } = body;
      const allowedEmojis = ['❤️', '👍', '🤗', '💪', '🙏'];

      if (!allowedEmojis.includes(emoji)) {
        return new Response(JSON.stringify({ error: 'Emoji non autorisé' }), {
          status: 400,
          headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        });
      }

      const { error } = await supabaseClient
        .from('community_reactions')
        .upsert({
          message_id: messageId,
          user_id: user.id,
          emoji,
          created_at: new Date().toISOString()
        }, { onConflict: 'message_id,user_id,emoji' });

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Action non reconnue' }), {
      status: 400,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[community-groups] Error:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  }
});

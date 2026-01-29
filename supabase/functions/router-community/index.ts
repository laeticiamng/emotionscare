// @ts-nocheck
/**
 * ROUTER COMMUNITY - Super-routeur Communauté consolidé
 * Regroupe: community, community-hub, community-groups, gamification, etc.
 * 
 * Actions disponibles:
 * - groups-list: Liste des groupes
 * - groups-create: Créer un groupe
 * - groups-join: Rejoindre un groupe
 * - groups-leave: Quitter un groupe
 * - posts-create: Créer un post
 * - posts-list: Liste des posts
 * - posts-react: Réagir à un post
 * - leaderboard: Classement
 * - badges-list: Badges disponibles
 * - badges-earn: Obtenir un badge
 * - challenges-list: Défis
 * - challenges-join: Rejoindre un défi
 * - challenges-complete: Terminer un défi
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RouterRequest {
  action: string;
  payload: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return errorResponse('Authorization required', 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return errorResponse('Invalid token', 401);
    }

    const body: RouterRequest = await req.json();
    const { action, payload = {} } = body;

    if (!action) {
      return errorResponse('Action is required', 400);
    }

    console.log(`[router-community] Action: ${action}, User: ${user.id}`);

    switch (action) {
      case 'groups-list':
        return await handleGroupsList(payload, user, supabase);
      
      case 'groups-create':
        return await handleGroupsCreate(payload, user, supabase);
      
      case 'groups-join':
        return await handleGroupsJoin(payload, user, supabase);
      
      case 'groups-leave':
        return await handleGroupsLeave(payload, user, supabase);
      
      case 'posts-create':
        return await handlePostsCreate(payload, user, supabase);
      
      case 'posts-list':
        return await handlePostsList(payload, user, supabase);
      
      case 'posts-react':
        return await handlePostsReact(payload, user, supabase);
      
      case 'leaderboard':
        return await handleLeaderboard(payload, supabase);
      
      case 'badges-list':
        return await handleBadgesList(payload, user, supabase);
      
      case 'badges-earn':
        return await handleBadgesEarn(payload, user, supabase);
      
      case 'challenges-list':
        return await handleChallengesList(payload, user, supabase);
      
      case 'challenges-join':
        return await handleChallengesJoin(payload, user, supabase);
      
      case 'challenges-complete':
        return await handleChallengesComplete(payload, user, supabase);

      default:
        return errorResponse(`Unknown action: ${action}`, 400);
    }

  } catch (error) {
    console.error('[router-community] Error:', error);
    return errorResponse(error.message ?? 'Internal error', 500);
  }
});

// ============ HANDLERS ============

async function handleGroupsList(payload: any, user: any, supabase: any): Promise<Response> {
  const { limit = 20, myGroups = false } = payload;

  let query = supabase
    .from('community_groups')
    .select('*, member_count:community_group_members(count)')
    .eq('is_active', true)
    .limit(limit);

  if (myGroups) {
    const { data: memberships } = await supabase
      .from('community_group_members')
      .select('group_id')
      .eq('user_id', user.id);

    const groupIds = (memberships || []).map((m: any) => m.group_id);
    if (groupIds.length > 0) {
      query = query.in('id', groupIds);
    } else {
      return successResponse({ groups: [] });
    }
  }

  const { data: groups, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return errorResponse('Failed to fetch groups', 500);
  }

  return successResponse({ groups: groups || [] });
}

async function handleGroupsCreate(payload: any, user: any, supabase: any): Promise<Response> {
  const { name, description, category, isPrivate = false } = payload;

  if (!name) {
    return errorResponse('Group name is required', 400);
  }

  const { data: group, error } = await supabase
    .from('community_groups')
    .insert({
      name,
      description,
      category,
      is_private: isPrivate,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return errorResponse('Failed to create group', 500);
  }

  // Ajouter le créateur comme admin
  await supabase.from('community_group_members').insert({
    group_id: group.id,
    user_id: user.id,
    role: 'admin',
  });

  return successResponse({ group });
}

async function handleGroupsJoin(payload: any, user: any, supabase: any): Promise<Response> {
  const { groupId } = payload;

  if (!groupId) {
    return errorResponse('Group ID is required', 400);
  }

  const { error } = await supabase.from('community_group_members').insert({
    group_id: groupId,
    user_id: user.id,
    role: 'member',
  });

  if (error) {
    if (error.code === '23505') {
      return errorResponse('Already a member', 409);
    }
    return errorResponse('Failed to join group', 500);
  }

  return successResponse({ joined: true });
}

async function handleGroupsLeave(payload: any, user: any, supabase: any): Promise<Response> {
  const { groupId } = payload;

  if (!groupId) {
    return errorResponse('Group ID is required', 400);
  }

  const { error } = await supabase
    .from('community_group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', user.id);

  if (error) {
    return errorResponse('Failed to leave group', 500);
  }

  return successResponse({ left: true });
}

async function handlePostsCreate(payload: any, user: any, supabase: any): Promise<Response> {
  const { groupId, content, type = 'text', tags = [] } = payload;

  if (!content) {
    return errorResponse('Content is required', 400);
  }

  const { data: post, error } = await supabase
    .from('community_posts')
    .insert({
      group_id: groupId,
      user_id: user.id,
      content,
      post_type: type,
      tags,
    })
    .select()
    .single();

  if (error) {
    return errorResponse('Failed to create post', 500);
  }

  // Award XP for posting
  await addXp(user.id, 10, 'community_post', supabase);

  return successResponse({ post });
}

async function handlePostsList(payload: any, user: any, supabase: any): Promise<Response> {
  const { groupId, limit = 20, offset = 0 } = payload;

  let query = supabase
    .from('community_posts')
    .select('*, profiles(display_name, avatar_url), reactions:community_post_reactions(count)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (groupId) {
    query = query.eq('group_id', groupId);
  }

  const { data: posts, error } = await query;

  if (error) {
    return errorResponse('Failed to fetch posts', 500);
  }

  return successResponse({ posts: posts || [] });
}

async function handlePostsReact(payload: any, user: any, supabase: any): Promise<Response> {
  const { postId, reaction } = payload;

  if (!postId || !reaction) {
    return errorResponse('Post ID and reaction are required', 400);
  }

  const { error } = await supabase
    .from('community_post_reactions')
    .upsert({
      post_id: postId,
      user_id: user.id,
      reaction,
    }, { onConflict: 'post_id,user_id' });

  if (error) {
    return errorResponse('Failed to react', 500);
  }

  return successResponse({ reacted: true });
}

async function handleLeaderboard(payload: any, supabase: any): Promise<Response> {
  const { period = 'week', limit = 10 } = payload;

  const { data: leaders } = await supabase
    .from('user_gamification')
    .select('user_id, xp_total, level, profiles(display_name, avatar_url)')
    .order('xp_total', { ascending: false })
    .limit(limit);

  return successResponse({ leaders: leaders || [], period });
}

async function handleBadgesList(payload: any, user: any, supabase: any): Promise<Response> {
  const { earnedOnly = false } = payload;

  const { data: allBadges } = await supabase
    .from('activity_badges')
    .select('*');

  const { data: earnedBadges } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', user.id);

  const earnedIds = new Set((earnedBadges || []).map((b: any) => b.badge_id));

  const badges = (allBadges || []).map((badge: any) => ({
    ...badge,
    earned: earnedIds.has(badge.id),
  }));

  if (earnedOnly) {
    return successResponse({ badges: badges.filter((b: any) => b.earned) });
  }

  return successResponse({ badges });
}

async function handleBadgesEarn(payload: any, user: any, supabase: any): Promise<Response> {
  const { badgeId } = payload;

  if (!badgeId) {
    return errorResponse('Badge ID is required', 400);
  }

  const { error } = await supabase.from('user_badges').insert({
    user_id: user.id,
    badge_id: badgeId,
  });

  if (error) {
    if (error.code === '23505') {
      return successResponse({ earned: true, alreadyHad: true });
    }
    return errorResponse('Failed to earn badge', 500);
  }

  // Award XP
  const { data: badge } = await supabase
    .from('activity_badges')
    .select('xp_reward')
    .eq('id', badgeId)
    .single();

  if (badge?.xp_reward) {
    await addXp(user.id, badge.xp_reward, 'badge_earned', supabase);
  }

  return successResponse({ earned: true });
}

async function handleChallengesList(payload: any, user: any, supabase: any): Promise<Response> {
  const { active = true } = payload;

  let query = supabase
    .from('community_challenges')
    .select('*')
    .order('created_at', { ascending: false });

  if (active) {
    query = query.eq('is_active', true);
  }

  const { data: challenges, error } = await query;

  if (error) {
    return errorResponse('Failed to fetch challenges', 500);
  }

  // Check user participation
  const { data: participations } = await supabase
    .from('challenge_participants')
    .select('challenge_id, status')
    .eq('user_id', user.id);

  const participationMap = new Map((participations || []).map((p: any) => [p.challenge_id, p.status]));

  const enrichedChallenges = (challenges || []).map((c: any) => ({
    ...c,
    userStatus: participationMap.get(c.id) || 'not_joined',
  }));

  return successResponse({ challenges: enrichedChallenges });
}

async function handleChallengesJoin(payload: any, user: any, supabase: any): Promise<Response> {
  const { challengeId } = payload;

  if (!challengeId) {
    return errorResponse('Challenge ID is required', 400);
  }

  const { error } = await supabase.from('challenge_participants').insert({
    challenge_id: challengeId,
    user_id: user.id,
    status: 'active',
  });

  if (error) {
    if (error.code === '23505') {
      return errorResponse('Already joined', 409);
    }
    return errorResponse('Failed to join challenge', 500);
  }

  return successResponse({ joined: true });
}

async function handleChallengesComplete(payload: any, user: any, supabase: any): Promise<Response> {
  const { challengeId, proof } = payload;

  if (!challengeId) {
    return errorResponse('Challenge ID is required', 400);
  }

  const { error } = await supabase
    .from('challenge_participants')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      proof,
    })
    .eq('challenge_id', challengeId)
    .eq('user_id', user.id);

  if (error) {
    return errorResponse('Failed to complete challenge', 500);
  }

  // Award XP
  const { data: challenge } = await supabase
    .from('community_challenges')
    .select('xp_reward')
    .eq('id', challengeId)
    .single();

  if (challenge?.xp_reward) {
    await addXp(user.id, challenge.xp_reward, 'challenge_completed', supabase);
  }

  return successResponse({ completed: true });
}

// ============ HELPERS ============

async function addXp(userId: string, amount: number, source: string, supabase: any): Promise<void> {
  try {
    await supabase.rpc('add_user_xp', {
      p_user_id: userId,
      p_amount: amount,
      p_source: source,
    });
  } catch (error) {
    console.error('[router-community] XP add error:', error);
  }
}

function successResponse(data: any): Response {
  return new Response(JSON.stringify({ success: true, ...data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

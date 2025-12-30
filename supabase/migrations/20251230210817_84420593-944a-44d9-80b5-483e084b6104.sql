-- ========================================================================
-- COMMUNITY MODULE - Tables et fonctions complémentaires
-- ========================================================================

-- 1. Table des réactions aux posts (si n'existe pas)
CREATE TABLE IF NOT EXISTS public.post_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'love', 'laugh', 'wow', 'care')),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(post_id, user_id, reaction_type),
    CHECK ((post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL))
);

-- 2. Table des follows entre utilisateurs
CREATE TABLE IF NOT EXISTS public.user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL,
    following_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- 3. Table des signalements communautaires
CREATE TABLE IF NOT EXISTS public.community_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL,
    reported_user_id UUID,
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
    resolved_by UUID,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Table des posts sauvegardés/favoris
CREATE TABLE IF NOT EXISTS public.community_saved_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, post_id)
);

-- 5. Table d'adhésion aux groupes (si n'existe pas)
CREATE TABLE IF NOT EXISTS public.community_group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
    status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'banned', 'left')),
    joined_at TIMESTAMPTZ DEFAULT now(),
    last_activity_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(group_id, user_id)
);

-- 6. Table des mentions dans les posts
CREATE TABLE IF NOT EXISTS public.community_mentions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE,
    mentioned_user_id UUID NOT NULL,
    mentioned_by UUID NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Table des tendances / hashtags
CREATE TABLE IF NOT EXISTS public.community_trending_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag TEXT NOT NULL UNIQUE,
    usage_count INTEGER DEFAULT 1,
    last_used_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ========================================================================
-- FONCTIONS RPC pour les compteurs
-- ========================================================================

-- Incrémenter likes d'un post
CREATE OR REPLACE FUNCTION increment_post_likes(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE community_posts SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = post_id;
END;
$$;

-- Décrémenter likes d'un post
CREATE OR REPLACE FUNCTION decrement_post_likes(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE community_posts SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0) WHERE id = post_id;
END;
$$;

-- Incrémenter commentaires d'un post
CREATE OR REPLACE FUNCTION increment_post_comments(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE community_posts SET comments_count = COALESCE(comments_count, 0) + 1 WHERE id = post_id;
END;
$$;

-- Décrémenter commentaires d'un post
CREATE OR REPLACE FUNCTION decrement_post_comments(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE community_posts SET comments_count = GREATEST(COALESCE(comments_count, 0) - 1, 0) WHERE id = post_id;
END;
$$;

-- Incrémenter likes d'un commentaire
CREATE OR REPLACE FUNCTION increment_comment_likes(comment_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE community_comments SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = comment_id;
END;
$$;

-- Incrémenter membres d'un groupe
CREATE OR REPLACE FUNCTION increment_group_members(group_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE community_groups SET member_count = COALESCE(member_count, 0) + 1 WHERE id = group_id;
END;
$$;

-- Décrémenter membres d'un groupe
CREATE OR REPLACE FUNCTION decrement_group_members(group_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE community_groups SET member_count = GREATEST(COALESCE(member_count, 0) - 1, 0) WHERE id = group_id;
END;
$$;

-- ========================================================================
-- RLS Policies
-- ========================================================================

-- post_reactions
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all reactions" ON public.post_reactions
FOR SELECT USING (true);

CREATE POLICY "Users can manage their own reactions" ON public.post_reactions
FOR ALL USING (auth.uid() = user_id);

-- user_follows
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view follows" ON public.user_follows
FOR SELECT USING (true);

CREATE POLICY "Users can manage their own follows" ON public.user_follows
FOR ALL USING (auth.uid() = follower_id);

-- community_reports
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports" ON public.community_reports
FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports" ON public.community_reports
FOR SELECT USING (auth.uid() = reporter_id);

-- community_saved_posts
ALTER TABLE public.community_saved_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their saved posts" ON public.community_saved_posts
FOR ALL USING (auth.uid() = user_id);

-- community_group_members
ALTER TABLE public.community_group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view group members" ON public.community_group_members
FOR SELECT USING (true);

CREATE POLICY "Users can manage their own membership" ON public.community_group_members
FOR ALL USING (auth.uid() = user_id);

-- community_mentions
ALTER TABLE public.community_mentions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view mentions they made or received" ON public.community_mentions
FOR SELECT USING (auth.uid() = mentioned_user_id OR auth.uid() = mentioned_by);

CREATE POLICY "Users can create mentions" ON public.community_mentions
FOR INSERT WITH CHECK (auth.uid() = mentioned_by);

CREATE POLICY "Users can update their received mentions" ON public.community_mentions
FOR UPDATE USING (auth.uid() = mentioned_user_id);

-- community_trending_tags
ALTER TABLE public.community_trending_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view trending tags" ON public.community_trending_tags
FOR SELECT USING (true);

-- ========================================================================
-- Indexes pour performance
-- ========================================================================
CREATE INDEX IF NOT EXISTS idx_post_reactions_post ON public.post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_user ON public.post_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON public.user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON public.user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_community_reports_status ON public.community_reports(status);
CREATE INDEX IF NOT EXISTS idx_community_saved_posts_user ON public.community_saved_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_group_members_group ON public.community_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_community_mentions_user ON public.community_mentions(mentioned_user_id);
CREATE INDEX IF NOT EXISTS idx_community_trending_tags_count ON public.community_trending_tags(usage_count DESC);
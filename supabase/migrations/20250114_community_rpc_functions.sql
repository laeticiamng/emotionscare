-- RPC Functions pour la gestion des compteurs de la communauté

-- Fonction pour incrémenter le nombre de likes d'un post
CREATE OR REPLACE FUNCTION increment_post_likes(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE community_posts
  SET likes_count = likes_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour décrémenter le nombre de likes d'un post
CREATE OR REPLACE FUNCTION decrement_post_likes(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE community_posts
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour incrémenter le nombre de commentaires d'un post
CREATE OR REPLACE FUNCTION increment_post_comments(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE community_posts
  SET comments_count = comments_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour décrémenter le nombre de commentaires d'un post
CREATE OR REPLACE FUNCTION decrement_post_comments(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE community_posts
  SET comments_count = GREATEST(comments_count - 1, 0)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour incrémenter le nombre de likes d'un commentaire
CREATE OR REPLACE FUNCTION increment_comment_likes(comment_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE post_comments
  SET likes_count = likes_count + 1
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour décrémenter le nombre de likes d'un commentaire
CREATE OR REPLACE FUNCTION decrement_comment_likes(comment_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE post_comments
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour incrémenter le nombre de membres d'un groupe
CREATE OR REPLACE FUNCTION increment_group_members(group_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE support_groups
  SET current_members = current_members + 1
  WHERE id = group_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour décrémenter le nombre de membres d'un groupe
CREATE OR REPLACE FUNCTION decrement_group_members(group_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE support_groups
  SET current_members = GREATEST(current_members - 1, 0)
  WHERE id = group_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour incrémenter le nombre de partages d'un post
CREATE OR REPLACE FUNCTION increment_post_shares(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE community_posts
  SET shares_count = COALESCE(shares_count, 0) + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour incrémenter le nombre de vues d'un post
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE community_posts
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour récupérer les posts tendance (trending)
CREATE OR REPLACE FUNCTION get_trending_posts(days_ago INTEGER DEFAULT 7, result_limit INTEGER DEFAULT 20)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  content TEXT,
  category TEXT,
  tags TEXT[],
  mood TEXT,
  is_anonymous BOOLEAN,
  is_featured BOOLEAN,
  moderation_status TEXT,
  likes_count INTEGER,
  comments_count INTEGER,
  shares_count INTEGER,
  views_count INTEGER,
  engagement_score NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.user_id,
    p.content,
    p.category,
    p.tags,
    p.mood,
    p.is_anonymous,
    p.is_featured,
    p.moderation_status,
    p.likes_count,
    p.comments_count,
    p.shares_count,
    p.views_count,
    -- Engagement score: weighted sum of likes (1x), comments (2x), shares (3x)
    (p.likes_count * 1.0 + p.comments_count * 2.0 + COALESCE(p.shares_count, 0) * 3.0) AS engagement_score,
    p.created_at,
    p.updated_at
  FROM community_posts p
  WHERE
    p.moderation_status = 'approved'
    AND p.created_at >= NOW() - INTERVAL '1 day' * days_ago
  ORDER BY engagement_score DESC, p.created_at DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour extraire et notifier les mentions dans un post
CREATE OR REPLACE FUNCTION extract_and_notify_mentions(post_id UUID, content TEXT, author_id UUID)
RETURNS VOID AS $$
DECLARE
  mention TEXT;
  mentioned_user_id UUID;
  author_name TEXT;
BEGIN
  -- Get author name
  SELECT full_name INTO author_name
  FROM profiles
  WHERE id = author_id;

  -- Extract all mentions (@username)
  FOR mention IN
    SELECT regexp_matches(content, '@(\w+)', 'g')
  LOOP
    -- Find user by name
    SELECT id INTO mentioned_user_id
    FROM profiles
    WHERE full_name ILIKE mention
    LIMIT 1;

    -- Create notification if user found and not self-mention
    IF mentioned_user_id IS NOT NULL AND mentioned_user_id != author_id THEN
      INSERT INTO notifications (user_id, type, title, message, action_url, is_read, metadata)
      VALUES (
        mentioned_user_id,
        'mention',
        'Nouvelle mention',
        author_name || ' vous a mentionné dans un post',
        '/community/post/' || post_id,
        FALSE,
        jsonb_build_object('post_id', post_id, 'author_id', author_id)
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour calculer la compatibilité entre deux utilisateurs
CREATE OR REPLACE FUNCTION calculate_buddy_compatibility(user_a_id UUID, user_b_id UUID)
RETURNS INTEGER AS $$
DECLARE
  compatibility_score INTEGER := 0;
  shared_interests INTEGER;
  interaction_strength INTEGER;
BEGIN
  -- Calculate based on aura connections
  SELECT connection_strength INTO interaction_strength
  FROM aura_connections
  WHERE (user_id_a = user_a_id AND user_id_b = user_b_id)
     OR (user_id_a = user_b_id AND user_id_b = user_a_id);

  IF interaction_strength IS NOT NULL THEN
    compatibility_score := compatibility_score + LEAST(interaction_strength * 10, 50);
  END IF;

  -- Could add more factors here (shared groups, similar posts, etc.)

  RETURN LEAST(compatibility_score, 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Commentaires sur les fonctions
COMMENT ON FUNCTION increment_post_likes IS 'Incrémente le compteur de likes d''un post';
COMMENT ON FUNCTION decrement_post_likes IS 'Décrémente le compteur de likes d''un post';
COMMENT ON FUNCTION increment_post_comments IS 'Incrémente le compteur de commentaires d''un post';
COMMENT ON FUNCTION decrement_post_comments IS 'Décrémente le compteur de commentaires d''un post';
COMMENT ON FUNCTION increment_comment_likes IS 'Incrémente le compteur de likes d''un commentaire';
COMMENT ON FUNCTION decrement_comment_likes IS 'Décrémente le compteur de likes d''un commentaire';
COMMENT ON FUNCTION increment_group_members IS 'Incrémente le compteur de membres d''un groupe';
COMMENT ON FUNCTION decrement_group_members IS 'Décrémente le compteur de membres d''un groupe';
COMMENT ON FUNCTION increment_post_shares IS 'Incrémente le compteur de partages d''un post';
COMMENT ON FUNCTION increment_post_views IS 'Incrémente le compteur de vues d''un post';
COMMENT ON FUNCTION get_trending_posts IS 'Récupère les posts tendance basés sur l''engagement';
COMMENT ON FUNCTION extract_and_notify_mentions IS 'Extrait les mentions d''un post et crée des notifications';
COMMENT ON FUNCTION calculate_buddy_compatibility IS 'Calcule le score de compatibilité entre deux utilisateurs';

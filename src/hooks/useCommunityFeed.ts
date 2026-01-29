/**
 * useCommunityFeed - Hook pour le flux communautaire
 * Corrige: community_posts: 1 seul post existant
 */

import { useCallback, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface CommunityPost {
  id: string;
  user_id: string;
  content: string;
  type: 'text' | 'achievement' | 'milestone' | 'question';
  tags?: string[];
  reactions_count: number;
  comments_count: number;
  created_at: string;
  author?: {
    display_name: string;
    avatar_url?: string;
  };
  user_reaction?: string;
}

export interface PostInput {
  content: string;
  type?: CommunityPost['type'];
  tags?: string[];
}

export function useCommunityFeed() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch posts
  const fetchPosts = useCallback(async (offset = 0, limit = 20) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          id,
          user_id,
          content,
          type,
          tags,
          reactions_count,
          comments_count,
          created_at,
          profiles:user_id (display_name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const formattedPosts: CommunityPost[] = (data || []).map(post => ({
        id: post.id,
        user_id: post.user_id,
        content: post.content,
        type: post.type || 'text',
        tags: post.tags || [],
        reactions_count: post.reactions_count || 0,
        comments_count: post.comments_count || 0,
        created_at: post.created_at,
        author: post.profiles ? {
          display_name: (post.profiles as any).display_name || 'Utilisateur',
          avatar_url: (post.profiles as any).avatar_url,
        } : undefined,
      }));

      if (offset === 0) {
        setPosts(formattedPosts);
      } else {
        setPosts(prev => [...prev, ...formattedPosts]);
      }

      setHasMore(formattedPosts.length === limit);
    } catch (err) {
      logger.error(`Failed to fetch posts: ${err}`, 'COMMUNITY');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create new post
  const createPost = useCallback(async (input: PostInput): Promise<CommunityPost | null> => {
    if (!isAuthenticated || !user?.id) {
      toast({ title: 'Erreur', description: 'Vous devez être connecté', variant: 'destructive' });
      return null;
    }

    if (!input.content.trim()) {
      toast({ title: 'Erreur', description: 'Le contenu ne peut pas être vide', variant: 'destructive' });
      return null;
    }

    try {
      const postData = {
        user_id: user.id,
        content: input.content.trim(),
        type: input.type || 'text',
        tags: input.tags || [],
        reactions_count: 0,
        comments_count: 0,
      };

      const { data, error } = await supabase
        .from('community_posts')
        .insert(postData)
        .select()
        .single();

      if (error) throw error;

      const newPost: CommunityPost = {
        ...data,
        author: {
          display_name: user.user_metadata?.display_name || 'Vous',
          avatar_url: user.user_metadata?.avatar_url,
        },
      };

      setPosts(prev => [newPost, ...prev]);
      toast({ title: '✅ Post publié !' });
      logger.info(`Created community post: ${data.id}`, 'COMMUNITY');
      return newPost;
    } catch (err) {
      logger.error(`Failed to create post: ${err}`, 'COMMUNITY');
      toast({ title: 'Erreur', description: 'Impossible de publier', variant: 'destructive' });
      return null;
    }
  }, [isAuthenticated, user, toast]);

  // React to post
  const reactToPost = useCallback(async (
    postId: string,
    reaction: 'like' | 'support' | 'celebrate'
  ): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) return false;

    try {
      // Insert reaction
      const { error: reactionError } = await supabase
        .from('community_reactions')
        .upsert({
          post_id: postId,
          user_id: user.id,
          reaction_type: reaction,
        }, { onConflict: 'post_id,user_id' });

      if (reactionError) throw reactionError;

      // Update count
      await supabase.rpc('increment_reaction_count', { p_post_id: postId });

      // Update local state
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, reactions_count: p.reactions_count + 1, user_reaction: reaction }
          : p
      ));

      return true;
    } catch (err) {
      logger.error(`Failed to react to post: ${err}`, 'COMMUNITY');
      return false;
    }
  }, [isAuthenticated, user?.id]);

  // Delete post
  const deletePost = useCallback(async (postId: string): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) return false;

    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) throw error;

      setPosts(prev => prev.filter(p => p.id !== postId));
      toast({ title: 'Post supprimé' });
      return true;
    } catch (err) {
      logger.error(`Failed to delete post: ${err}`, 'COMMUNITY');
      return false;
    }
  }, [isAuthenticated, user?.id, toast]);

  // Load more posts
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchPosts(posts.length);
    }
  }, [isLoading, hasMore, posts.length, fetchPosts]);

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('community_posts_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'community_posts' },
        (payload) => {
          if (payload.new.user_id !== user?.id) {
            // New post from another user
            fetchPosts(0);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchPosts]);

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    isLoading,
    hasMore,
    createPost,
    reactToPost,
    deletePost,
    loadMore,
    refetch: () => fetchPosts(0),
  };
}

export default useCommunityFeed;

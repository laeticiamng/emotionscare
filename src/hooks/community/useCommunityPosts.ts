import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

export interface CommunityPost {
  id: string;
  group_id?: string;
  author_id: string;
  title: string;
  content: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at?: string;
  mood_halo?: string;
  is_anonymous?: boolean;
  author?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface UseCommunityPostsOptions {
  filter?: 'all' | 'trending' | 'following' | 'featured';
  pageSize?: number;
  autoLoad?: boolean;
  groupId?: string;
}

export interface UseCommunityPostsReturn {
  posts: CommunityPost[];
  loading: boolean;
  error: Error | null;
  page: number;
  hasMore: boolean;
  totalCount: number;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  createPost: (postData: {
    content: string;
    mood?: string;
    category?: string;
    tags?: string[];
    isAnonymous?: boolean;
    groupId?: string;
  }) => Promise<void>;
  updatePost: (postId: string, updates: {
    content?: string;
    title?: string;
  }) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  toggleReaction: (postId: string, reactionType: 'like' | 'love' | 'laugh' | 'wow' | 'care') => Promise<void>;
}

export function useCommunityPosts(options: UseCommunityPostsOptions = {}): UseCommunityPostsReturn {
  const {
    filter = 'all',
    pageSize = 20,
    autoLoad = true,
    groupId
  } = options;

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const loadPosts = useCallback(async (pageNum: number, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const offset = (pageNum - 1) * pageSize;

      let query = supabase
        .from('community_posts')
        .select('*, profiles!community_posts_author_id_fkey(full_name, avatar_url)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

      // Filtres
      if (groupId) {
        query = query.eq('group_id', groupId);
      } else {
        query = query.is('group_id', null); // Posts généraux sans groupe
      }

      if (filter === 'trending') {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 7);
        query = query
          .gte('created_at', yesterday.toISOString())
          .order('likes_count', { ascending: false });
      }

      const { data, error: queryError, count } = await query;

      if (queryError) throw queryError;

      const formattedPosts: CommunityPost[] = (data || []).map(post => ({
        ...post,
        author: post.profiles
      }));

      if (append) {
        setPosts(prev => [...prev, ...formattedPosts]);
      } else {
        setPosts(formattedPosts);
      }

      setHasMore(offset + pageSize < (count || 0));
      setTotalCount(count || 0);
    } catch (err) {
      const error = err as Error;
      setError(error);
      logger.error('Failed to load posts', err, 'COMMUNITY');
    } finally {
      setLoading(false);
    }
  }, [filter, pageSize, groupId]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await loadPosts(nextPage, true);
  }, [hasMore, loading, page, loadPosts]);

  const refresh = useCallback(async () => {
    setPage(1);
    await loadPosts(1, false);
  }, [loadPosts]);

  const createPost = useCallback(async (postData: {
    content: string;
    mood?: string;
    category?: string;
    tags?: string[];
    isAnonymous?: boolean;
    groupId?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          author_id: user.id,
          title: 'Post',
          content: postData.content,
          group_id: postData.groupId || null,
          mood_halo: postData.mood,
          likes_count: 0,
          comments_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Post publié',
        description: 'Votre post a été publié avec succès'
      });

      // Ajouter au début de la liste
      setPosts(prev => [{
        ...data,
        is_anonymous: postData.isAnonymous
      }, ...prev]);
    } catch (err) {
      logger.error('Failed to create post', err, 'COMMUNITY');
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le post',
        variant: 'destructive'
      });
      throw err;
    }
  }, [toast]);

  const updatePost = useCallback(async (postId: string, updates: {
    content?: string;
    title?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;

      setPosts(prev => prev.map(post =>
        post.id === postId ? { ...post, ...data } : post
      ));

      toast({
        title: 'Post mis à jour',
        description: 'Votre post a été modifié avec succès'
      });
    } catch (err) {
      logger.error('Failed to update post', err, 'COMMUNITY');
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le post',
        variant: 'destructive'
      });
      throw err;
    }
  }, [toast]);

  const deletePost = useCallback(async (postId: string) => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setPosts(prev => prev.filter(post => post.id !== postId));

      toast({
        title: 'Post supprimé',
        description: 'Votre post a été supprimé avec succès'
      });
    } catch (err) {
      logger.error('Failed to delete post', err, 'COMMUNITY');
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le post',
        variant: 'destructive'
      });
      throw err;
    }
  }, [toast]);

  const toggleReaction = useCallback(async (postId: string, reactionType: 'like' | 'love' | 'laugh' | 'wow' | 'care') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Vérifier si la réaction existe déjà
      const { data: existing } = await supabase
        .from('post_reactions')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .eq('reaction_type', reactionType)
        .maybeSingle();

      if (existing) {
        // Supprimer la réaction
        await supabase
          .from('post_reactions')
          .delete()
          .eq('id', existing.id);

        await supabase.rpc('decrement_post_likes', { post_id: postId });

        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return { ...post, likes_count: Math.max(0, post.likes_count - 1) };
          }
          return post;
        }));
      } else {
        // Ajouter la réaction
        await supabase
          .from('post_reactions')
          .insert({
            post_id: postId,
            user_id: user.id,
            reaction_type: reactionType
          });

        await supabase.rpc('increment_post_likes', { post_id: postId });

        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return { ...post, likes_count: post.likes_count + 1 };
          }
          return post;
        }));
      }
    } catch (err) {
      logger.error('Failed to toggle reaction', err, 'COMMUNITY');
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter la réaction',
        variant: 'destructive'
      });
    }
  }, [toast]);

  // Auto-load on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      loadPosts(1, false);
    }
  }, [autoLoad, filter, groupId]);

  return {
    posts,
    loading,
    error,
    page,
    hasMore,
    totalCount,
    loadMore,
    refresh,
    createPost,
    updatePost,
    deletePost,
    toggleReaction
  };
}

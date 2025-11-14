import { useState, useEffect, useCallback } from 'react';
import { CommunityService, Post } from '@/modules/community/communityService';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

export interface UseCommunityPostsOptions {
  filter?: 'all' | 'trending' | 'following' | 'featured';
  pageSize?: number;
  autoLoad?: boolean;
}

export interface UseCommunityPostsReturn {
  posts: Post[];
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
    mediaUrls?: string[];
    location?: string;
  }) => Promise<void>;
  updatePost: (postId: string, updates: {
    content?: string;
    tags?: string[];
    mood?: string;
    category?: string;
  }) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  toggleReaction: (postId: string, reactionType: 'like' | 'love' | 'laugh' | 'wow' | 'care') => Promise<void>;
}

export function useCommunityPosts(options: UseCommunityPostsOptions = {}): UseCommunityPostsReturn {
  const {
    filter = 'all',
    pageSize = 20,
    autoLoad = true
  } = options;

  const [posts, setPosts] = useState<Post[]>([]);
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

      const { data: { user } } = await supabase.auth.getUser();
      const result = await CommunityService.fetchPosts(filter, pageNum, pageSize, user?.id);

      if (append) {
        setPosts(prev => [...prev, ...result.posts]);
      } else {
        setPosts(result.posts);
      }

      setHasMore(result.hasMore);
      setTotalCount(result.totalCount);
    } catch (err) {
      const error = err as Error;
      setError(error);
      logger.error('Failed to load posts', err, 'COMMUNITY');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les posts',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [filter, pageSize, toast]);

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
    mediaUrls?: string[];
    location?: string;
  }) => {
    try {
      await CommunityService.createPost(postData);

      toast({
        title: 'Post publié',
        description: 'Votre post a été publié avec succès'
      });

      // Refresh to show new post (after moderation it will appear)
      await refresh();
    } catch (err) {
      logger.error('Failed to create post', err, 'COMMUNITY');
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le post',
        variant: 'destructive'
      });
      throw err;
    }
  }, [toast, refresh]);

  const updatePost = useCallback(async (postId: string, updates: {
    content?: string;
    tags?: string[];
    mood?: string;
    category?: string;
  }) => {
    try {
      const updatedPost = await CommunityService.updatePost(postId, updates);

      // Update local state
      setPosts(prev => prev.map(post =>
        post.id === postId ? { ...post, ...updatedPost } : post
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
      await CommunityService.deletePost(postId);

      // Remove from local state
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
      const result = await CommunityService.toggleReaction(postId, 'post', reactionType);

      // Update local state optimistically
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes_count: result.added ? post.likes_count + 1 : Math.max(0, post.likes_count - 1)
          };
        }
        return post;
      }));
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
  }, [autoLoad, filter]); // Reload when filter changes

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

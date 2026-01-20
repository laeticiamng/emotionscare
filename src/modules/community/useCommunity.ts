/**
 * Hook useCommunity
 * Gestion des interactions communautaires avec React Query
 */

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { CommunityService, type Post, type Comment, type AuraConnection } from './communityService';
import type { CommunityStats } from './types';

// ============================================================================
// TYPES
// ============================================================================

export interface UseCommunityReturn {
  // Data
  posts: Post[];
  connections: AuraConnection[];
  stats: CommunityStats | null;
  
  // Feed state
  feedFilter: 'all' | 'trending' | 'following' | 'featured';
  setFeedFilter: (filter: 'all' | 'trending' | 'following' | 'featured') => void;
  hasMorePosts: boolean;
  
  // Loading states
  isLoading: boolean;
  isLoadingMore: boolean;
  isPosting: boolean;
  
  // Actions
  createPost: (content: string, options?: {
    mood?: string;
    category?: string;
    tags?: string[];
    isAnonymous?: boolean;
  }) => Promise<Post>;
  deletePost: (postId: string) => Promise<void>;
  toggleReaction: (postId: string, reactionType: 'like' | 'love' | 'laugh' | 'wow' | 'care') => Promise<void>;
  addComment: (postId: string, content: string, isAnonymous?: boolean) => Promise<Comment>;
  loadMorePosts: () => Promise<void>;
  refreshFeed: () => Promise<void>;
  searchPosts: (query: string) => Promise<Post[]>;
}

// ============================================================================
// QUERY KEYS
// ============================================================================

const QUERY_KEYS = {
  posts: (filter: string) => ['community', 'posts', filter],
  connections: (userId: string) => ['community', 'connections', userId],
  stats: (userId: string) => ['community', 'stats', userId],
  comments: (postId: string) => ['community', 'comments', postId],
};

// ============================================================================
// HOOK
// ============================================================================

export function useCommunity(): UseCommunityReturn {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id || '';

  // Local state
  const [feedFilter, setFeedFilter] = useState<'all' | 'trending' | 'following' | 'featured'>('all');

  // Fetch posts with infinite query
  const {
    data: postsData,
    isLoading: isLoadingPosts,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: QUERY_KEYS.posts(feedFilter),
    queryFn: ({ pageParam = 1 }) => CommunityService.fetchPosts(feedFilter, pageParam, 20, userId),
    getNextPageParam: (lastPage, pages) => lastPage.hasMore ? pages.length + 1 : undefined,
    initialPageParam: 1,
    enabled: true,
    staleTime: 1000 * 60 * 2,
  });

  // Flatten posts from pages
  const posts = postsData?.pages.flatMap(page => page.posts) || [];

  // Fetch connections
  const { data: connections = [], isLoading: isLoadingConnections } = useQuery({
    queryKey: QUERY_KEYS.connections(userId),
    queryFn: () => CommunityService.fetchConnections(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 10,
  });

  // Calculate stats from data
  const stats: CommunityStats | null = userId ? {
    totalPosts: posts.length,
    totalComments: 0, // Would need separate query
    totalLikes: posts.reduce((sum, p) => sum + p.likes_count, 0),
    myPosts: posts.filter(p => p.user_id === userId).length,
    myComments: 0, // Would need separate query
  } : null;

  // Create post mutation
  const createMutation = useMutation({
    mutationFn: (postData: {
      content: string;
      mood?: string;
      category?: string;
      tags?: string[];
      isAnonymous?: boolean;
    }) => CommunityService.createPost(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts(feedFilter) });
    },
  });

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: (postId: string) => CommunityService.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts(feedFilter) });
    },
  });

  // Toggle reaction mutation
  const reactionMutation = useMutation({
    mutationFn: ({ postId, reactionType }: { postId: string; reactionType: 'like' | 'love' | 'laugh' | 'wow' | 'care' }) =>
      CommunityService.toggleReaction(postId, 'post', reactionType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts(feedFilter) });
    },
  });

  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: ({ postId, content, isAnonymous }: { postId: string; content: string; isAnonymous?: boolean }) =>
      CommunityService.createComment({ postId, content, isAnonymous }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments(variables.postId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts(feedFilter) });
    },
  });

  // Actions
  const createPost = useCallback(async (content: string, options?: {
    mood?: string;
    category?: string;
    tags?: string[];
    isAnonymous?: boolean;
  }): Promise<Post> => {
    return createMutation.mutateAsync({ content, ...options });
  }, [createMutation]);

  const deletePost = useCallback(async (postId: string): Promise<void> => {
    await deleteMutation.mutateAsync(postId);
  }, [deleteMutation]);

  const toggleReaction = useCallback(async (postId: string, reactionType: 'like' | 'love' | 'laugh' | 'wow' | 'care'): Promise<void> => {
    await reactionMutation.mutateAsync({ postId, reactionType });
  }, [reactionMutation]);

  const addComment = useCallback(async (postId: string, content: string, isAnonymous?: boolean): Promise<Comment> => {
    return commentMutation.mutateAsync({ postId, content, isAnonymous }) as Promise<Comment>;
  }, [commentMutation]);

  const loadMorePosts = useCallback(async (): Promise<void> => {
    if (hasNextPage) {
      await fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  const refreshFeed = useCallback(async (): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts(feedFilter) });
  }, [queryClient, feedFilter]);

  const searchPosts = useCallback(async (query: string): Promise<Post[]> => {
    return CommunityService.searchPosts(query);
  }, []);

  // Combined loading state
  const isLoading = isLoadingPosts || isLoadingConnections;

  return {
    posts,
    connections,
    stats,
    feedFilter,
    setFeedFilter,
    hasMorePosts: hasNextPage || false,
    isLoading,
    isLoadingMore: isFetchingNextPage,
    isPosting: createMutation.isPending,
    createPost,
    deletePost,
    toggleReaction,
    addComment,
    loadMorePosts,
    refreshFeed,
    searchPosts,
  };
}

export default useCommunity;

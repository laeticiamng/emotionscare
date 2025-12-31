/**
 * Hook pour la recherche dans la communauté
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface SearchResult {
  id: string;
  type: 'post' | 'user' | 'group';
  title: string;
  content?: string;
  avatar?: string;
  metadata?: Record<string, unknown>;
}

export interface UseCommunitySearchReturn {
  results: SearchResult[];
  loading: boolean;
  error: Error | null;
  search: (query: string, types?: ('post' | 'user' | 'group')[]) => Promise<void>;
  clear: () => void;
}

export function useCommunitySearch(): UseCommunitySearchReturn {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (
    query: string,
    types: ('post' | 'user' | 'group')[] = ['post', 'user', 'group']
  ) => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const allResults: SearchResult[] = [];

      // Search posts
      if (types.includes('post')) {
        const { data: posts, error: postsError } = await supabase
          .from('community_posts')
          .select('id, title, content, created_at')
          .ilike('content', `%${query}%`)
          .limit(10);

        if (postsError) throw postsError;

        allResults.push(...(posts || []).map(post => ({
          id: post.id,
          type: 'post' as const,
          title: post.title || post.content.slice(0, 50) + '...',
          content: post.content.slice(0, 100),
          metadata: { createdAt: post.created_at }
        })));
      }

      // Search users
      if (types.includes('user')) {
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .ilike('full_name', `%${query}%`)
          .limit(10);

        if (usersError) throw usersError;

        allResults.push(...(users || []).map(user => ({
          id: user.id,
          type: 'user' as const,
          title: user.full_name || 'Utilisateur',
          avatar: user.avatar_url,
          metadata: {}
        })));
      }

      // Search groups
      if (types.includes('group')) {
        const { data: groups, error: groupsError } = await supabase
          .from('community_groups')
          .select('id, name, description, icon, member_count')
          .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
          .limit(10);

        if (groupsError) throw groupsError;

        allResults.push(...(groups || []).map(group => ({
          id: group.id,
          type: 'group' as const,
          title: group.name,
          content: group.description,
          avatar: group.icon,
          metadata: { memberCount: group.member_count }
        })));
      }

      setResults(allResults);
    } catch (err) {
      setError(err as Error);
      logger.error('Community search failed', err, 'SEARCH');
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clear
  };
}

// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export interface SavedBookmark {
  postId: string;
  savedAt: string;
}

export interface UserReaction {
  postId: string;
  reaction: string;
  timestamp: string;
}

const SETTINGS_KEY_BOOKMARKS = 'community_bookmarks';
const SETTINGS_KEY_REACTIONS = 'community_reactions';

export const useCommunityEnhancements = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<SavedBookmark[]>([]);
  const [reactions, setReactions] = useState<UserReaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger depuis Supabase ou localStorage
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        if (user) {
          // Charger depuis Supabase
          const { data: settings } = await supabase
            .from('user_settings')
            .select('key, value')
            .eq('user_id', user.id)
            .in('key', [SETTINGS_KEY_BOOKMARKS, SETTINGS_KEY_REACTIONS]);

          if (settings) {
            const bookmarksData = settings.find(s => s.key === SETTINGS_KEY_BOOKMARKS);
            const reactionsData = settings.find(s => s.key === SETTINGS_KEY_REACTIONS);

            if (bookmarksData?.value) {
              const parsed = typeof bookmarksData.value === 'string' 
                ? JSON.parse(bookmarksData.value) 
                : bookmarksData.value;
              setBookmarks(Array.isArray(parsed) ? parsed : []);
            }

            if (reactionsData?.value) {
              const parsed = typeof reactionsData.value === 'string'
                ? JSON.parse(reactionsData.value)
                : reactionsData.value;
              setReactions(Array.isArray(parsed) ? parsed : []);
            }
          }

          // Migrer depuis localStorage si présent
          const localBookmarks = localStorage.getItem('community_bookmarks');
          const localReactions = localStorage.getItem('community_reactions');

          if (localBookmarks) {
            const parsed = JSON.parse(localBookmarks);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const mapped = parsed.map(id => typeof id === 'string' 
                ? { postId: id, savedAt: new Date().toISOString() }
                : id
              );
              setBookmarks(prev => {
                const merged = [...prev, ...mapped.filter(m => !prev.some(p => p.postId === m.postId))];
                saveToSupabase(SETTINGS_KEY_BOOKMARKS, merged, user.id);
                return merged;
              });
              localStorage.removeItem('community_bookmarks');
            }
          }

          if (localReactions) {
            const parsed = JSON.parse(localReactions);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setReactions(prev => {
                const merged = [...prev, ...parsed.filter(r => !prev.some(p => p.postId === r.postId && p.reaction === r.reaction))];
                saveToSupabase(SETTINGS_KEY_REACTIONS, merged, user.id);
                return merged;
              });
              localStorage.removeItem('community_reactions');
            }
          }
        } else {
          // Fallback localStorage pour utilisateurs non connectés
          const localBookmarks = localStorage.getItem('community_bookmarks');
          const localReactions = localStorage.getItem('community_reactions');

          if (localBookmarks) {
            const parsed = JSON.parse(localBookmarks);
            setBookmarks(Array.isArray(parsed) 
              ? parsed.map(id => typeof id === 'string' ? { postId: id, savedAt: new Date().toISOString() } : id)
              : []
            );
          }

          if (localReactions) {
            const parsed = JSON.parse(localReactions);
            setReactions(Array.isArray(parsed) ? parsed : []);
          }
        }
      } catch (error) {
        logger.error('Error loading community enhancements:', error, 'HOOK');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  const saveToSupabase = async (key: string, value: unknown, userId: string) => {
    try {
      await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          key,
          value: JSON.stringify(value),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,key'
        });
    } catch (error) {
      logger.error(`Error saving ${key} to Supabase:`, error, 'HOOK');
    }
  };

  const toggleBookmark = useCallback(async (postId: string) => {
    const exists = bookmarks.some(b => b.postId === postId);
    let newBookmarks: SavedBookmark[];

    if (exists) {
      newBookmarks = bookmarks.filter(b => b.postId !== postId);
    } else {
      newBookmarks = [...bookmarks, {
        postId,
        savedAt: new Date().toISOString(),
      }];
    }

    setBookmarks(newBookmarks);

    if (user) {
      await saveToSupabase(SETTINGS_KEY_BOOKMARKS, newBookmarks, user.id);
    } else {
      localStorage.setItem('community_bookmarks', JSON.stringify(newBookmarks.map(b => b.postId)));
    }
  }, [bookmarks, user]);

  const isBookmarked = useCallback((postId: string) => {
    return bookmarks.some(b => b.postId === postId);
  }, [bookmarks]);

  const addReaction = useCallback(async (postId: string, reaction: string) => {
    const newReaction: UserReaction = {
      postId,
      reaction,
      timestamp: new Date().toISOString(),
    };

    const newReactions = [...reactions, newReaction];
    setReactions(newReactions);

    if (user) {
      await saveToSupabase(SETTINGS_KEY_REACTIONS, newReactions, user.id);
    } else {
      localStorage.setItem('community_reactions', JSON.stringify(newReactions));
    }
  }, [reactions, user]);

  const getReactionsForPost = useCallback((postId: string) => {
    return reactions.filter(r => r.postId === postId);
  }, [reactions]);

  const getUserReactionCounts = useCallback(() => {
    const counts: Record<string, number> = {};
    reactions.forEach(r => {
      counts[r.postId] = (counts[r.postId] || 0) + 1;
    });
    return counts;
  }, [reactions]);

  const clearBookmarks = useCallback(async () => {
    setBookmarks([]);
    if (user) {
      await saveToSupabase(SETTINGS_KEY_BOOKMARKS, [], user.id);
    } else {
      localStorage.removeItem('community_bookmarks');
    }
  }, [user]);

  const clearReactions = useCallback(async () => {
    setReactions([]);
    if (user) {
      await saveToSupabase(SETTINGS_KEY_REACTIONS, [], user.id);
    } else {
      localStorage.removeItem('community_reactions');
    }
  }, [user]);

  return {
    bookmarks,
    toggleBookmark,
    isBookmarked,
    clearBookmarks,
    reactions,
    addReaction,
    getReactionsForPost,
    getUserReactionCounts,
    clearReactions,
    isLoading,
  };
};

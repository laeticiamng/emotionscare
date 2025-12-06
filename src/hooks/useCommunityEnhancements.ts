import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

const BOOKMARKS_KEY = 'community_bookmarks';
const REACTIONS_KEY = 'community_reactions';

export interface SavedBookmark {
  postId: string;
  savedAt: string;
}

export interface UserReaction {
  postId: string;
  reaction: string;
  timestamp: string;
}

export const useCommunityEnhancements = () => {
  const [bookmarks, setBookmarks] = useState<SavedBookmark[]>([]);
  const [reactions, setReactions] = useState<UserReaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load bookmarks and reactions from localStorage
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem(BOOKMARKS_KEY);
      const savedReactions = localStorage.getItem(REACTIONS_KEY);

      if (savedBookmarks) {
        const parsed = JSON.parse(savedBookmarks);
        if (Array.isArray(parsed)) {
          setBookmarks(parsed.map(id => ({
            postId: id,
            savedAt: new Date().toLocaleDateString('fr-FR'),
          })));
        }
      }

      if (savedReactions) {
        const parsed = JSON.parse(savedReactions);
        if (Array.isArray(parsed)) {
          setReactions(parsed);
        }
      }
    } catch (error) {
      logger.error('Error loading community enhancements:', error, 'HOOK');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleBookmark = useCallback((postId: string) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.postId === postId);
      let newBookmarks;

      if (exists) {
        newBookmarks = prev.filter(b => b.postId !== postId);
      } else {
        newBookmarks = [...prev, {
          postId,
          savedAt: new Date().toLocaleDateString('fr-FR'),
        }];
      }

      // Persist to localStorage
      localStorage.setItem(
        BOOKMARKS_KEY,
        JSON.stringify(newBookmarks.map(b => b.postId))
      );

      return newBookmarks;
    });
  }, []);

  const isBookmarked = useCallback((postId: string) => {
    return bookmarks.some(b => b.postId === postId);
  }, [bookmarks]);

  const addReaction = useCallback((postId: string, reaction: string) => {
    setReactions(prev => {
      const newReactions = [...prev, {
        postId,
        reaction,
        timestamp: new Date().toISOString(),
      }];

      localStorage.setItem(REACTIONS_KEY, JSON.stringify(newReactions));
      return newReactions;
    });
  }, []);

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

  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
    localStorage.removeItem(BOOKMARKS_KEY);
  }, []);

  const clearReactions = useCallback(() => {
    setReactions([]);
    localStorage.removeItem(REACTIONS_KEY);
  }, []);

  return {
    // Bookmarks
    bookmarks,
    toggleBookmark,
    isBookmarked,
    clearBookmarks,

    // Reactions
    reactions,
    addReaction,
    getReactionsForPost,
    getUserReactionCounts,
    clearReactions,

    // State
    isLoading,
  };
};

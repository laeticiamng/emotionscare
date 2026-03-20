import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { SocialPost, SocialComment, Reaction, SocialNotification } from '@/types/social';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

interface SocialCoconContextType {
  posts: SocialPost[];
  addPost: (content: string, userId: string) => void;
  likePost: (postId: string, userId: string) => void;
  addComment: (postId: string, content: string, userId: string) => void;
  getNotifications: (userId: string) => SocialNotification[];
}

const SocialCoconContext = createContext<SocialCoconContextType>({
  posts: [],
  addPost: () => {},
  likePost: () => {},
  addComment: () => {},
  getNotifications: () => []
});

export const SocialCoconProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [notifications, setNotifications] = useState<SocialNotification[]>([]);
  const { user } = useAuth();

  // Load posts from Supabase
  useEffect(() => {
    if (!user) return;

    const loadPosts = async () => {
      try {
        const { data: postsData, error } = await supabase
          .from('social_posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;

        // Load reactions and comments for each post
        const postIds = (postsData || []).map(p => p.id);
        
        const [reactionsRes, commentsRes] = await Promise.all([
          postIds.length > 0 
            ? supabase.from('social_post_reactions').select('*').in('post_id', postIds)
            : { data: [], error: null },
          postIds.length > 0
            ? supabase.from('social_post_comments').select('*').in('post_id', postIds)
            : { data: [], error: null }
        ]);

        const reactions = reactionsRes.data || [];
        const comments = commentsRes.data || [];

        const enrichedPosts: SocialPost[] = (postsData || []).map(p => ({
          id: p.id,
          userId: p.user_id,
          content: p.content,
          createdAt: p.created_at,
          reactions: reactions
            .filter(r => r.post_id === p.id)
            .map(r => ({ id: r.id, postId: r.post_id, userId: r.user_id, type: r.type })),
          comments: comments
            .filter(c => c.post_id === p.id)
            .map(c => ({ id: c.id, postId: c.post_id, userId: c.user_id, content: c.content, createdAt: c.created_at }))
        }));

        setPosts(enrichedPosts);
      } catch (err) {
        logger.error('Failed to load social posts', err as Error, 'SOCIAL');
        // Fallback: try localStorage migration
        const stored = localStorage.getItem('ec_social_posts');
        if (stored) {
          try {
            setPosts(JSON.parse(stored));
          } catch {}
        }
      }
    };

    loadPosts();
  }, [user?.id]);

  const addPost = useCallback(async (content: string, userId: string) => {
    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const newPost: SocialPost = {
      id: tempId,
      userId,
      content,
      createdAt: new Date().toISOString(),
      comments: [],
      reactions: []
    };
    setPosts(prev => [newPost, ...prev]);

    try {
      const { data, error } = await supabase
        .from('social_posts')
        .insert({ content, user_id: userId })
        .select()
        .single();

      if (error) throw error;

      // Replace temp with real
      setPosts(prev => prev.map(p => p.id === tempId ? { ...newPost, id: data.id } : p));
    } catch (err) {
      logger.error('Failed to save post', err as Error, 'SOCIAL');
    }
  }, []);

  const likePost = useCallback(async (postId: string, userId: string) => {
    // Optimistic update
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const existing = p.reactions.find(r => r.userId === userId);
      if (existing) return p;
      const reaction: Reaction = { id: `temp-${Date.now()}`, postId, userId, type: 'like' };
      return { ...p, reactions: [...p.reactions, reaction] };
    }));

    try {
      await supabase
        .from('social_post_reactions')
        .insert({ post_id: postId, user_id: userId, type: 'like' });
    } catch (err) {
      logger.error('Failed to save reaction', err as Error, 'SOCIAL');
    }
  }, []);

  const addComment = useCallback(async (postId: string, content: string, userId: string) => {
    const tempComment: SocialComment = {
      id: `temp-${Date.now()}`,
      postId,
      userId,
      content,
      createdAt: new Date().toISOString()
    };

    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, tempComment] } : p));

    try {
      const { data, error } = await supabase
        .from('social_post_comments')
        .insert({ post_id: postId, user_id: userId, content })
        .select()
        .single();

      if (error) throw error;

      setPosts(prev => prev.map(p => p.id === postId
        ? { ...p, comments: p.comments.map(c => c.id === tempComment.id ? { ...c, id: data.id } : c) }
        : p
      ));
    } catch (err) {
      logger.error('Failed to save comment', err as Error, 'SOCIAL');
    }
  }, []);

  const getNotifications = (userId: string) => notifications.filter(n => n.userId === userId);

  return (
    <SocialCoconContext.Provider value={{ posts, addPost, likePost, addComment, getNotifications }}>
      {children}
    </SocialCoconContext.Provider>
  );
};

export const useSocialCocon = () => useContext(SocialCoconContext);

export default SocialCoconContext;

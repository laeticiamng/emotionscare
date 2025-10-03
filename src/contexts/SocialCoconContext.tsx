import React, { createContext, useContext, useEffect, useState } from 'react';
import { SocialPost, SocialComment, Reaction, SocialNotification } from '@/types/social';

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

  useEffect(() => {
    const stored = localStorage.getItem('ec_social_posts');
    if (stored) setPosts(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('ec_social_posts', JSON.stringify(posts));
  }, [posts]);

  const addPost = (content: string, userId: string) => {
    const newPost: SocialPost = {
      id: Date.now().toString(),
      userId,
      content,
      createdAt: new Date().toISOString(),
      comments: [],
      reactions: []
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const likePost = (postId: string, userId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const existing = p.reactions.find(r => r.userId === userId);
      if (existing) return p;
      const reaction: Reaction = {
        id: Date.now().toString(),
        postId,
        userId,
        type: 'like'
      };
      return { ...p, reactions: [...p.reactions, reaction] };
    }));
    setNotifications(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        userId: posts.find(p => p.id === postId)?.userId || '',
        type: 'like',
        read: false,
        createdAt: new Date().toISOString(),
        data: { postId, from: userId }
      }
    ]);
  };

  const addComment = (postId: string, content: string, userId: string) => {
    const comment: SocialComment = {
      id: Date.now().toString(),
      postId,
      userId,
      content,
      createdAt: new Date().toISOString()
    };
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p));
    setNotifications(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        userId: posts.find(p => p.id === postId)?.userId || '',
        type: 'comment',
        read: false,
        createdAt: new Date().toISOString(),
        data: { postId, from: userId }
      }
    ]);
  };

  const getNotifications = (userId: string) => notifications.filter(n => n.userId === userId);

  return (
    <SocialCoconContext.Provider value={{ posts, addPost, likePost, addComment, getNotifications }}>
      {children}
    </SocialCoconContext.Provider>
  );
};

export const useSocialCocon = () => useContext(SocialCoconContext);

export default SocialCoconContext;

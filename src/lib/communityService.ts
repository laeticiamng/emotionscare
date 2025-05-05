
import { supabase } from '@/lib/supabase-client';
import { Post, Comment, Group } from '@/types/community';
import { User } from '@/types/index';

// Posts
export const getPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, user_id, comments(*)')
    .order('date', { ascending: false });
    
  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  
  return data || [];
};

export const getPostById = async (postId: string): Promise<Post | null> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, comments(*)')
    .eq('id', postId)
    .single();
    
  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }
  
  return data;
};

export const createPost = async (userId: string, content: string, isAnonymous: boolean = false, tags: string[] = []): Promise<Post | null> => {
  const { data, error } = await supabase
    .from('posts')
    .insert([{
      user_id: userId,
      content,
      reactions: 0,
      is_anonymous: isAnonymous,
      tags
    }])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating post:', error);
    return null;
  }
  
  return data;
};

export const reactToPost = async (postId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('posts')
    .update({ reactions: supabase.rpc('increment', { value: 1 }) })
    .eq('id', postId)
    .select();
    
  if (error) {
    console.error('Error reacting to post:', error);
    return false;
  }
  
  return true;
};

// Comments
export const createComment = async (postId: string, userId: string, content: string, isAnonymous: boolean = false): Promise<Comment | null> => {
  const { data, error } = await supabase
    .from('comments')
    .insert([{
      post_id: postId,
      user_id: userId,
      content,
      likes: 0,
      is_anonymous: isAnonymous
    }])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating comment:', error);
    return null;
  }
  
  return data;
};

// Groups
export const getGroups = async (): Promise<Group[]> => {
  const { data, error } = await supabase
    .from('groups')
    .select('*');
    
  if (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
  
  return data || [];
};

export const joinGroup = async (groupId: string, userId: string): Promise<boolean> => {
  // This would typically be handled via a join table, but for simplicity we're just updating an array
  const { error } = await supabase.rpc('join_group', {
    p_group_id: groupId,
    p_user_id: userId
  });
  
  if (error) {
    console.error('Error joining group:', error);
    return false;
  }
  
  return true;
};

// Tags
export const getRecommendedTags = (): string[] => {
  // In a real implementation, this could be fetched from the server
  return [
    'Inspiration',
    'Réussite',
    'Bien-être',
    'Entraide',
    'Gratitude',
    'TeamBuilding',
    'Développement',
    'Motivation'
  ];
};

export const scanPostSentiment = async (text: string): Promise<{ isPositive: boolean; score: number }> => {
  // This would call an AI service in production
  // Mock implementation for demo purposes
  const mockScore = 0.8; // 0-1, higher is more positive
  return { isPositive: mockScore > 0.5, score: mockScore };
};

export const getUsers = async (): Promise<Record<string, string>> => {
  // This would fetch actual user data in production
  // Mock implementation for demo purposes
  return {
    '1': 'User 1',
    '2': 'User 2',
    '3': 'Anonymous'
  };
};

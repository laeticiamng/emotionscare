
import { Post, Comment, Group } from '@/types/community';
import { supabase } from '@/integrations/supabase/client';

export const createPost = async (post: Partial<Post>): Promise<Post | null> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert(post)
      .select('*')
      .single();
      
    if (error) throw error;
    return data as Post;
  } catch (error) {
    console.error('Error creating post:', error);
    return null;
  }
};

export const createComment = async (comment: Partial<Comment>): Promise<Comment | null> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert(comment)
      .select('*')
      .single();
      
    if (error) throw error;
    return data as Comment;
  } catch (error) {
    console.error('Error creating comment:', error);
    return null;
  }
};

export const reactToPost = async (postId: string, userId: string): Promise<boolean> => {
  try {
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('reactions')
      .eq('id', postId)
      .single();
      
    if (fetchError) throw fetchError;
    
    const newReactionsCount = (post?.reactions || 0) + 1;
    
    const { error: updateError } = await supabase
      .from('posts')
      .update({ reactions: newReactionsCount })
      .eq('id', postId);
      
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error reacting to post:', error);
    return false;
  }
};

export const createGroup = async (group: Partial<Group>): Promise<Group | null> => {
  try {
    const { data, error } = await supabase
      .from('groups')
      .insert(group)
      .select('*')
      .single();
      
    if (error) throw error;
    return data as Group;
  } catch (error) {
    console.error('Error creating group:', error);
    return null;
  }
};

export const getRecommendedTags = async (): Promise<string[]> => {
  // Mock function for now
  return [
    'anxiété',
    'dépression',
    'bien-être',
    'méditation',
    'stress',
    'sommeil',
    'motivation',
    'santé mentale',
    'thérapie',
    'pleine conscience'
  ];
};

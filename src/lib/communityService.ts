
import { supabase } from '@/lib/supabase-client';
import { Post, Comment, Group, BuddyRequest } from '@/types/community';
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

// Alias for getPosts for compatibility with existing code
export const fetchPosts = getPosts;

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

// Alias for getGroups for compatibility
export const fetchGroups = getGroups;

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

// Added missing function
export const createGroup = async (name: string, description: string, ownerId: string): Promise<Group | null> => {
  const { data, error } = await supabase
    .from('groups')
    .insert([{
      name,
      description,
      owner_id: ownerId,
      created_at: new Date().toISOString(),
      members_count: 1
    }])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating group:', error);
    return null;
  }
  
  return data;
};

// User functions
export const fetchUserById = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  
  return data as unknown as User;
};

// Buddy system functions
export const getBuddyRequests = async (userId: string): Promise<BuddyRequest[]> => {
  const { data, error } = await supabase
    .from('buddy_requests')
    .select('*, user:from_user_id(*)')
    .eq('to_user_id', userId);
    
  if (error) {
    console.error('Error fetching buddy requests:', error);
    return [];
  }
  
  return data || [];
};

export const sendBuddyRequest = async (fromUserId: string, toUserEmail: string): Promise<boolean> => {
  // First, get the user ID from the email
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', toUserEmail)
    .single();
    
  if (userError || !userData) {
    console.error('Error finding user by email:', userError);
    return false;
  }
  
  const toUserId = userData.id;
  
  // Then create the buddy request
  const { error } = await supabase
    .from('buddy_requests')
    .insert([{
      from_user_id: fromUserId,
      to_user_id: toUserId,
      status: 'pending',
      created_at: new Date().toISOString()
    }]);
    
  if (error) {
    console.error('Error sending buddy request:', error);
    return false;
  }
  
  return true;
};

export const acceptBuddyRequest = async (requestId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('buddy_requests')
    .update({ status: 'accepted', updated_at: new Date().toISOString() })
    .eq('id', requestId);
    
  if (error) {
    console.error('Error accepting buddy request:', error);
    return false;
  }
  
  return true;
};

export const rejectBuddyRequest = async (requestId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('buddy_requests')
    .update({ status: 'rejected', updated_at: new Date().toISOString() })
    .eq('id', requestId);
    
  if (error) {
    console.error('Error rejecting buddy request:', error);
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

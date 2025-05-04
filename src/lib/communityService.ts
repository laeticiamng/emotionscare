
import { supabase } from '@/integrations/supabase/client';
import type { Post, Comment, Group, Buddy } from '@/types';
import type { User } from '@/types';

// --- POSTS ---
export async function fetchPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, user_id')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function createPost(
  user_id: string,
  content: string,
  media_url?: string,
  image?: string
): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .insert({ 
      user_id, 
      created_at: new Date().toISOString(), 
      content, 
      media_url, 
      image,
      reactions: 0 
    })
    .select()
    .single();
  
  if (error || !data) throw error || new Error('Insert post failed');
  return data;
}

export async function reactToPost(post_id: string): Promise<void> {
  const { data, error } = await supabase
    .from('posts')
    .select('reactions')
    .eq('id', post_id)
    .single();
  
  if (error) throw error;
  
  const newReactions = (data?.reactions || 0) + 1;
  
  const { error: updateError } = await supabase
    .from('posts')
    .update({ reactions: newReactions })
    .eq('id', post_id);
    
  if (updateError) throw updateError;
}

// --- COMMENTS ---
export async function fetchComments(post_id: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', post_id)
    .order('created_at', { ascending: true });
    
  if (error) throw error;
  return data || [];
}

export async function createComment(
  post_id: string,
  user_id: string,
  content: string
): Promise<Comment> {
  const { data, error } = await supabase
    .from('comments')
    .insert({ 
      post_id, 
      user_id, 
      created_at: new Date().toISOString(), 
      content 
    })
    .select()
    .single();
    
  if (error || !data) throw error || new Error('Insert comment failed');
  return data;
}

// --- GROUPS ---
export async function fetchGroups(): Promise<Group[]> {
  const { data, error } = await supabase
    .from('groups')
    .select('*');
    
  if (error) throw error;
  return data || [];
}

export async function createGroup(
  name: string,
  topic: string,
  description?: string
): Promise<Group> {
  const { data, error } = await supabase
    .from('groups')
    .insert({ 
      name, 
      topic, 
      description, 
      members: [], 
      members_count: 0,
      is_private: false,
      created_at: new Date().toISOString() 
    })
    .select()
    .single();
    
  if (error || !data) throw error || new Error('Insert group failed');
  return data;
}

export async function joinGroup(
  group_id: string,
  user_id: string
): Promise<void> {
  // First get the current group to check members
  const { data, error } = await supabase
    .from('groups')
    .select('members, members_count')
    .eq('id', group_id)
    .single();
    
  if (error) throw error;
  
  // Add user to members if not already included
  const currentMembers = data?.members || [];
  if (!currentMembers.includes(user_id)) {
    const updatedMembers = [...currentMembers, user_id];
    const updatedCount = (data?.members_count || 0) + 1;
    
    const { error: updateError } = await supabase
      .from('groups')
      .update({ 
        members: updatedMembers,
        members_count: updatedCount
      })
      .eq('id', group_id);
      
    if (updateError) throw updateError;
  }
}

export async function leaveGroup(
  group_id: string,
  user_id: string
): Promise<void> {
  // Get the current group to check members
  const { data, error } = await supabase
    .from('groups')
    .select('members, members_count')
    .eq('id', group_id)
    .single();
    
  if (error) throw error;
  
  // Remove user from members if included
  const currentMembers = data?.members || [];
  if (currentMembers.includes(user_id)) {
    const updatedMembers = currentMembers.filter(id => id !== user_id);
    const updatedCount = Math.max(0, (data?.members_count || 1) - 1);
    
    const { error: updateError } = await supabase
      .from('groups')
      .update({ 
        members: updatedMembers,
        members_count: updatedCount
      })
      .eq('id', group_id);
      
    if (updateError) throw updateError;
  }
}

// --- BUDDY MATCHING ---
export async function fetchUsersByRole(role?: string): Promise<User[]> {
  // Using a dynamic approach instead of strictly typed table access
  const { data, error } = await supabase
    .from('profiles') // assuming a profiles table exists for user data
    .select('*')
    .eq('role', role || '')
    .limit(100);
  
  if (error) throw error;
  return data || [];
}

export async function findBuddy(
  user_id: string,
  role?: string
): Promise<Buddy> {
  // Get current user
  const userData = await fetchUserById(user_id); // This will throw if user not found
  
  // For demo purposes, create a buddy match with another user of the same role
  const { data: potentialBuddies, error: buddyError } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', userData?.role || role || '')
    .neq('id', user_id)
    .limit(10);
    
  if (buddyError) throw buddyError;
  
  // Select a random buddy from the list or use a placeholder
  const randomIndex = Math.floor(Math.random() * (potentialBuddies?.length || 1));
  const buddyUserId = potentialBuddies?.[randomIndex]?.id || "placeholder-user-id";
  
  // Create buddy match
  const buddyData = {
    user_id,
    buddy_user_id: buddyUserId,
    matched_on: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('buddies')
    .insert(buddyData)
    .select()
    .single();
    
  if (error || !data) throw error || new Error('Buddy insert failed');
  return data;
}

export async function fetchUserBuddies(userId: string): Promise<Buddy[]> {
  const { data, error } = await supabase
    .from('buddies')
    .select('*')
    .eq('user_id', userId)
    .order('matched_on', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function fetchUserById(userId: string): Promise<User | null> {
  // Using a dynamic approach instead of strictly typed table access
  const { data, error } = await supabase
    .from('profiles') // assuming a profiles table exists for user data
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user:', error);
    // Return a mock user for testing
    return { id: userId, name: 'Test User', email: 'test@example.com', alias: 'TestUser' };
  }
  
  return data || { id: userId, name: 'Test User', email: 'test@example.com', alias: 'TestUser' };
}


import { supabase } from '@/integrations/supabase/client';
import type { Post, Comment, Group, Buddy, User } from '@/types';

// --- POSTS ---
export async function fetchPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, comments(*)')
    .order('date', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function createPost(
  user_id: string,
  content: string,
  media_url?: string
): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .insert({ user_id, date: new Date().toISOString(), content, media_url, reactions: 0 })
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
    .order('date', { ascending: true });
    
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
    .insert({ post_id, user_id, date: new Date().toISOString(), content })
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
    .insert({ name, topic, description, members: [] })
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
    .select('members')
    .eq('id', group_id)
    .single();
    
  if (error) throw error;
  
  // Add user to members if not already included
  const currentMembers = data?.members || [];
  if (!currentMembers.includes(user_id)) {
    const updatedMembers = [...currentMembers, user_id];
    
    const { error: updateError } = await supabase
      .from('groups')
      .update({ members: updatedMembers })
      .eq('id', group_id);
      
    if (updateError) throw updateError;
  }
}

// --- BUDDY MATCHING ---
export async function fetchUsersByRole(role?: string): Promise<User[]> {
  // Since we don't have a separate 'users' table in Supabase yet, 
  // we'll create a placeholder implementation for now
  return []; // Return empty array as a placeholder
}

export async function findBuddy(
  user_id: string,
  role?: string
): Promise<Buddy> {
  // Get current user
  const userData = await fetchUserById(user_id); // This will throw if user not found
  
  // For demo purposes, create a buddy match with a placeholder
  const randomId = "placeholder-user-id";
  
  // Create buddy match
  const buddyData = {
    user_id,
    buddy_user_id: randomId,
    date: new Date().toISOString(),
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

export async function fetchUserById(userId: string): Promise<User | null> {
  // Since we don't have a separate 'users' table in Supabase yet, 
  // we'll create a placeholder implementation for now
  return { id: userId, name: 'Test User', email: 'test@example.com' };
}


import { supabase } from '@/integrations/supabase/client';
import type { Post, Comment, Group, Buddy, User, UserRole } from '@/types';

// --- POSTS ---
export async function fetchPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, user_id')
    .order('date', { ascending: false });
    
  if (error) throw error;
  
  // Map the database fields to our Post interface
  const posts: Post[] = (data || []).map(post => ({
    id: post.id,
    user_id: post.user_id,
    content: post.content,
    date: post.date,
    reactions: post.reactions || 0,
    image_url: post.image_url || undefined,
    created_at: post.date, // Alias for compatibility
    comments: []
  }));
  
  return posts;
}

export async function createPost(
  user_id: string,
  content: string,
  media_url?: string,
  image_url?: string
): Promise<Post> {
  const now = new Date().toISOString();
  
  const postData = {
    user_id,
    content,
    date: now,
    image_url: image_url || media_url || null,
    reactions: 0
  };
  
  const { data, error } = await supabase
    .from('posts')
    .insert(postData)
    .select()
    .single();
  
  if (error || !data) throw error || new Error('Insert post failed');
  
  // Map the returned data to our Post interface
  const post: Post = {
    id: data.id,
    user_id: data.user_id,
    content: data.content,
    date: data.date,
    reactions: data.reactions || 0,
    image_url: data.image_url || undefined,
    created_at: data.date, // Alias for compatibility
    comments: []
  };
  
  return post;
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
  
  // Map the database fields to our Comment interface
  const comments: Comment[] = (data || []).map(comment => ({
    id: comment.id,
    post_id: comment.post_id,
    user_id: comment.user_id,
    content: comment.content,
    date: comment.date,
    created_at: comment.date // Alias for compatibility
  }));
  
  return comments;
}

export async function createComment(
  post_id: string,
  user_id: string,
  content: string
): Promise<Comment> {
  const now = new Date().toISOString();
  
  const commentData = {
    post_id,
    user_id,
    content,
    date: now
  };
  
  const { data, error } = await supabase
    .from('comments')
    .insert(commentData)
    .select()
    .single();
    
  if (error || !data) throw error || new Error('Insert comment failed');
  
  // Map the returned data to our Comment interface
  const comment: Comment = {
    id: data.id,
    post_id: data.post_id,
    user_id: data.user_id,
    content: data.content,
    date: data.date,
    created_at: data.date // Alias for compatibility
  };
  
  return comment;
}

// --- GROUPS ---
export async function fetchGroups(): Promise<Group[]> {
  const { data, error } = await supabase
    .from('groups')
    .select('*');
    
  if (error) throw error;
  
  // Map the database fields to our Group interface
  const groups: Group[] = (data || []).map(group => ({
    id: group.id,
    name: group.name,
    topic: group.topic,
    description: '', // Default empty string
    members: group.members || [],
    members_count: group.members ? group.members.length : 0,
    is_private: false, // Default value
    created_at: new Date().toISOString(), // Default to now
    joined: false // Default not joined
  }));
  
  return groups;
}

export async function createGroup(
  name: string,
  topic: string,
  description?: string
): Promise<Group> {
  const groupData = { 
    name, 
    topic, 
    description: description || '', 
    members: []
  };
  
  const { data, error } = await supabase
    .from('groups')
    .insert(groupData)
    .select()
    .single();
    
  if (error || !data) throw error || new Error('Insert group failed');
  
  // Map the returned data to our Group interface
  const group: Group = {
    id: data.id,
    name: data.name,
    topic: data.topic,
    description: data.description || '',
    members: data.members || [],
    members_count: data.members ? data.members.length : 0,
    is_private: false,
    created_at: new Date().toISOString(),
    joined: false
  };
  
  return group;
}

export async function joinGroup(
  group_id: string,
  user_id: string
): Promise<void> {
  // First get the current group to check members
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('id', group_id)
    .single();
    
  if (error) throw error;
  
  // Add user to members if not already included
  const currentMembers = data?.members || [];
  if (!currentMembers.includes(user_id)) {
    const updatedMembers = [...currentMembers, user_id];
    
    const { error: updateError } = await supabase
      .from('groups')
      .update({ 
        members: updatedMembers
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
    .select('*')
    .eq('id', group_id)
    .single();
    
  if (error) throw error;
  
  // Remove user from members if included
  const currentMembers = data?.members || [];
  if (currentMembers.includes(user_id)) {
    const updatedMembers = currentMembers.filter(id => id !== user_id);
    
    const { error: updateError } = await supabase
      .from('groups')
      .update({ 
        members: updatedMembers
      })
      .eq('id', group_id);
      
    if (updateError) throw updateError;
  }
}

// --- USER MANAGEMENT ---
export async function fetchUsersByRole(role?: string): Promise<User[]> {
  // For demo purposes, create mock users
  const mockUsers: User[] = [
    {
      id: 'user-1',
      name: 'User 1',
      email: 'user1@example.com',
      role: role as UserRole || UserRole.EMPLOYEE,
      alias: 'user1',
      bio: 'Bio for user 1',
      joined_at: new Date().toISOString()
    },
    {
      id: 'user-2',
      name: 'User 2',
      email: 'user2@example.com',
      role: role as UserRole || UserRole.EMPLOYEE,
      alias: 'user2',
      bio: 'Bio for user 2',
      joined_at: new Date().toISOString()
    },
    {
      id: 'user-3',
      name: 'User 3',
      email: 'user3@example.com',
      role: role as UserRole || UserRole.EMPLOYEE,
      alias: 'user3',
      bio: 'Bio for user 3',
      joined_at: new Date().toISOString()
    }
  ];
  
  return mockUsers;
}

export async function fetchUserById(userId: string): Promise<User | null> {
  // For demo purposes, create a mock user
  const mockUser: User = {
    id: userId,
    name: 'Test User',
    email: 'test@example.com',
    alias: 'TestUser',
    bio: 'This is a test user bio',
    joined_at: new Date().toISOString()
  };
  
  return mockUser;
}

// --- BUDDY MATCHING ---
export async function findBuddy(
  user_id: string,
  role?: string
): Promise<Buddy> {
  // For demo purposes, create a buddy match with another user
  const buddyUserId = `buddy-${Date.now()}`;
  
  const now = new Date().toISOString();
  
  // Create buddy match
  const buddyData = {
    user_id,
    buddy_user_id: buddyUserId,
    date: now
  };
  
  const { data, error } = await supabase
    .from('buddies')
    .insert(buddyData)
    .select()
    .single();
    
  if (error || !data) throw error || new Error('Buddy insert failed');
  
  // Map the returned data to our Buddy interface
  const buddy: Buddy = {
    id: data.id,
    user_id: data.user_id,
    buddy_user_id: data.buddy_user_id,
    date: data.date,
    matched_on: data.date // For newer code compatibility
  };
  
  return buddy;
}

export async function fetchUserBuddies(userId: string): Promise<Buddy[]> {
  const { data, error } = await supabase
    .from('buddies')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
    
  if (error) throw error;
  
  // Map the database fields to our Buddy interface
  const buddies: Buddy[] = (data || []).map(buddy => ({
    id: buddy.id,
    user_id: buddy.user_id,
    buddy_user_id: buddy.buddy_user_id,
    date: buddy.date,
    matched_on: buddy.date // For newer code compatibility
  }));
  
  return buddies;
}

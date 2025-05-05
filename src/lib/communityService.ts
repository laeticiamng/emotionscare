
import { supabase } from '@/integrations/supabase/client';
import type { Post, Comment, Group, Buddy, BuddyRequest } from '@/types/community';
import { User, UserRole } from '@/types';
import { mockUsers } from '@/data/mockUsers';

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
    likes: 0, // Set default likes value
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
    likes: 0, // Set default likes value
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
    likes: 0, // Set default likes value
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
    likes: 0, // Set default likes value
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
    description: '', // Default empty string for compatibility
    members: group.members || [], // This will be string[] from database
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
    description: '', // Default empty string for compatibility
    members: data.members || [], // This will be string[] initially
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

// --- BUDDY SYSTEM ---
export async function getBuddyRequests(userId: string): Promise<BuddyRequest[]> {
  // For demo purposes, create mock buddy requests
  const mockRequests: BuddyRequest[] = [
    {
      id: 'request-1',
      user_id: 'user-request-1',
      buddy_id: userId,
      status: 'pending',
      user: {
        id: 'user-request-1',
        name: 'Maria Lopez',
        email: 'maria@example.com',
        role: UserRole.INFIRMIER,
        avatar: 'https://i.pravatar.cc/150?img=5',
      }
    },
    {
      id: 'request-2',
      user_id: 'user-request-2',
      buddy_id: userId,
      status: 'accepted',
      user: {
        id: 'user-request-2',
        name: 'Alex Dubois',
        email: 'alex@example.com',
        role: UserRole.MEDECIN,
        avatar: 'https://i.pravatar.cc/150?img=8',
      }
    }
  ];
  
  return mockRequests;
}

export async function sendBuddyRequest(
  userId: string,
  buddyEmail: string
): Promise<Buddy> {
  // In a real implementation, this would verify the email exists and create a record
  console.log(`Sending buddy request from ${userId} to ${buddyEmail}`);
  
  const mockBuddy: Buddy = {
    id: `request-${Date.now()}`,
    user_id: userId,
    buddy_id: `buddy-${Date.now()}`,
    status: 'pending',
    date: new Date().toISOString()
  };
  
  return mockBuddy;
}

export async function acceptBuddyRequest(requestId: string): Promise<Buddy> {
  // In a real implementation, this would update the status in the database
  console.log(`Accepting buddy request ${requestId}`);
  
  const mockBuddy: Buddy = {
    id: requestId,
    user_id: 'user-request-1',
    buddy_id: 'current-user',
    status: 'accepted',
    date: new Date().toISOString()
  };
  
  return mockBuddy;
}

export async function rejectBuddyRequest(requestId: string): Promise<Buddy> {
  // In a real implementation, this would update the status in the database
  console.log(`Rejecting buddy request ${requestId}`);
  
  const mockBuddy: Buddy = {
    id: requestId,
    user_id: 'user-request-1',
    buddy_id: 'current-user',
    status: 'rejected',
    date: new Date().toISOString()
  };
  
  return mockBuddy;
}

// --- USER MANAGEMENT ---
export async function fetchUsersByRole(role?: UserRole): Promise<User[]> {
  // For demo purposes, create mock users
  const mockUsersList: User[] = [
    {
      id: 'user-1',
      name: 'User 1',
      email: 'user1@example.com',
      role: role || UserRole.EMPLOYEE,
      avatar: 'https://i.pravatar.cc/150?img=1',
      alias: 'user1',
      bio: 'Bio for user 1',
      joined_at: new Date().toISOString()
    },
    {
      id: 'user-2',
      name: 'User 2',
      email: 'user2@example.com',
      role: role || UserRole.EMPLOYEE,
      avatar: 'https://i.pravatar.cc/150?img=2',
      alias: 'user2',
      bio: 'Bio for user 2',
      joined_at: new Date().toISOString()
    },
    {
      id: 'user-3',
      name: 'User 3',
      email: 'user3@example.com',
      role: role || UserRole.EMPLOYEE,
      avatar: 'https://i.pravatar.cc/150?img=3',
      alias: 'user3',
      bio: 'Bio for user 3',
      joined_at: new Date().toISOString()
    }
  ];
  
  return mockUsersList;
}

export async function fetchUserById(userId: string): Promise<User | null> {
  // For demo purposes, create a mock user
  const mockUser: User = {
    id: userId,
    name: 'Test User',
    email: 'test@example.com',
    role: UserRole.EMPLOYEE, // Set a default role
    avatar: 'https://i.pravatar.cc/150?img=4',
    alias: 'TestUser',
    bio: 'This is a test user bio',
    joined_at: new Date().toISOString()
  };
  
  return mockUser;
}

// --- BUDDY MATCHING ---
export async function findBuddy(
  user_id: string,
  role?: UserRole
): Promise<Buddy> {
  // For demo purposes, create a buddy match with another user
  const buddyUserId = `buddy-${Date.now()}`;
  
  const now = new Date().toISOString();
  
  const buddy: Buddy = {
    id: `buddy-match-${Date.now()}`,
    user_id: user_id,
    buddy_user_id: buddyUserId,
    buddy_id: buddyUserId, // Adding the required property
    status: 'pending', // Adding the required property
    date: now, // Using date for backward compatibility
    matched_on: now // For newer code compatibility
  };
  
  return buddy;
}

export async function fetchUserBuddies(userId: string): Promise<Buddy[]> {
  // For demo purposes, return a mock buddy
  const now = new Date().toISOString();
  
  const buddies: Buddy[] = [
    {
      id: `buddy-match-demo`,
      user_id: userId,
      buddy_user_id: 'buddy-demo-1',
      buddy_id: 'buddy-demo-1', // Adding the required property
      status: 'accepted', // Adding the required property
      date: now,
      matched_on: now
    }
  ];
  
  return buddies;
}

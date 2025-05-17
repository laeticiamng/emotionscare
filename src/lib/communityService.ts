
import { User } from '@/types/other';
import { v4 as uuid } from 'uuid';

// Fonction simulée pour récupérer les détails d'un utilisateur
export async function fetchUserById(userId: string): Promise<User> {
  console.log(`Fetching user details for ID: ${userId}`);
  
  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Retourner des données simulées
  return {
    id: userId,
    name: `Utilisateur ${userId}`,
    email: `user${userId}@example.com`,
    role: 'b2c',
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 jours avant
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
    preferences: {
      theme: 'system',
      language: 'fr',
      notifications: true,
      emailUpdates: false
    }
  };
}

// Fonction simulée pour récupérer une liste d'utilisateurs
export async function fetchUsers(limit: number = 10): Promise<User[]> {
  console.log(`Fetching ${limit} users`);
  
  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Retourner une liste d'utilisateurs simulés
  return Array.from({ length: limit }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `Utilisateur ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 3 === 0 ? 'b2b_admin' : 'b2c',
    created_at: new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(), // Chaque utilisateur s'est inscrit il y a un nombre différent de semaines
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
  }));
}

// Fonction simulée pour mettre à jour un utilisateur
export async function updateUser(userId: string, data: Partial<User>): Promise<User> {
  console.log(`Updating user ${userId} with data:`, data);
  
  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Retourner l'utilisateur mis à jour
  return {
    id: userId,
    name: data.name || `Utilisateur ${userId}`,
    email: data.email || `user${userId}@example.com`,
    role: data.role || 'b2c',
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    avatar_url: data.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
    preferences: {
      ...(data.preferences || {})
    }
  };
}

// Add missing functions for community features
export async function createComment(data: any) {
  console.log(`Creating comment:`, data);
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    id: uuid(),
    content: data.content,
    postId: data.postId,
    userId: data.userId,
    createdAt: new Date().toISOString()
  };
}

export async function createGroup(data: any) {
  console.log(`Creating group:`, data);
  await new Promise(resolve => setTimeout(resolve, 400));
  return {
    id: uuid(),
    name: data.name,
    description: data.description,
    createdBy: data.userId,
    createdAt: new Date().toISOString(),
    members: [data.userId],
    tags: data.tags || []
  };
}

export async function createPost(data: any) {
  console.log(`Creating post:`, data);
  await new Promise(resolve => setTimeout(resolve, 350));
  return {
    id: uuid(),
    title: data.title,
    content: data.content,
    userId: data.userId,
    groupId: data.groupId,
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: 0,
    tags: data.tags || []
  };
}

export async function reactToPost(postId: string, userId: string, reaction: 'like' | 'dislike') {
  console.log(`${reaction === 'like' ? 'Liking' : 'Disliking'} post ${postId} by user ${userId}`);
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    success: true,
    postId,
    userId,
    reaction
  };
}

export async function getRecommendedTags(input: string): Promise<string[]> {
  console.log(`Getting recommended tags for input: ${input}`);
  await new Promise(resolve => setTimeout(resolve, 250));
  
  const allTags = [
    'bien-être', 'méditation', 'sport', 'nutrition', 'sommeil', 
    'stress', 'équilibre', 'santé mentale', 'pleine conscience', 
    'exercice', 'relaxation', 'productivité', 'développement personnel'
  ];
  
  if (!input) {
    return allTags.slice(0, 5);
  }
  
  const filteredTags = allTags.filter(tag => 
    tag.toLowerCase().includes(input.toLowerCase())
  );
  
  return filteredTags.length > 0 ? filteredTags : allTags.slice(0, 3);
}


import { User } from '@/types/other';

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


import { User, UserRole } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sophie Martin',
    email: 'sophie@example.com',
    role: UserRole.USER,
    anonymity_code: 'SM472931',
    emotional_score: 82,
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Thomas Dubois',
    email: 'thomas@example.com',
    role: UserRole.USER,
    anonymity_code: 'TD659812',
    emotional_score: 65,
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Emma Petit',
    email: 'emma@example.com',
    role: UserRole.USER,
    anonymity_code: 'EP847103',
    emotional_score: 78,
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    name: 'Admin Direction',
    email: 'admin@example.com',
    role: 'admin',  // Role admin pour l'accès direction
    anonymity_code: 'AD123456',
    emotional_score: 95,
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
];

// Current user state (simulating auth)
export let currentUser: User | null = null;

// Auth functions
export const loginUser = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Pour l'utilisateur Sophie, accepter le mot de passe "sophie" ou pas de mot de passe
      if (email === 'sophie@example.com' && (!password || password === 'sophie')) {
        const sophieUser = mockUsers.find(u => u.email === 'sophie@example.com');
        if (sophieUser) {
          currentUser = sophieUser;
          resolve(sophieUser);
          return;
        }
      }
      
      // Pour la démo, accepter "admin" comme mot de passe pour l'utilisateur admin@example.com
      if (email === 'admin@example.com' && password === 'admin') {
        const adminUser = mockUsers.find(u => u.email === 'admin@example.com');
        if (adminUser) {
          currentUser = adminUser;
          resolve(adminUser);
          return;
        }
      }
      
      const user = mockUsers.find(u => u.email === email);
      if (user) {
        // Dans une vraie application, on vérifierait le mot de passe ici
        currentUser = user;
        resolve(user);
      } else {
        reject(new Error('Email ou mot de passe invalide'));
      }
    }, 800); // Simuler un délai réseau
  });
};

export const logoutUser = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentUser = null;
      resolve();
    }, 300);
  });
};

export const updateUser = (userData: Partial<User>): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!currentUser) {
        reject(new Error('User not logged in'));
        return;
      }
      
      const updatedUser = { ...currentUser, ...userData };
      currentUser = updatedUser;
      
      // Update the mock users array too
      const index = mockUsers.findIndex(u => u.id === currentUser?.id);
      if (index !== -1) {
        mockUsers[index] = updatedUser;
      }
      
      resolve(updatedUser);
    }, 800);
  });
};

export const getCurrentUser = (): User | null => {
  return currentUser;
};

// Generate random anonymity code
export const generateAnonymityCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

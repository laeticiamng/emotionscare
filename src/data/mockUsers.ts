
import { User } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sophie Martin',
    email: 'sophie@example.com',
    role: 'Infirmier',
    anonymity_code: 'SM472931',
    emotional_score: 82,
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Thomas Dubois',
    email: 'thomas@example.com',
    role: 'Médecin',
    anonymity_code: 'TD659812',
    emotional_score: 65,
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Emma Petit',
    email: 'emma@example.com',
    role: 'Aide-soignant',
    anonymity_code: 'EP847103',
    emotional_score: 78,
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
];

// Current user state (simulating auth)
export let currentUser: User | null = null;

// Auth functions
export const loginUser = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email);
      if (user) {
        // In a real app, we would check the password here
        currentUser = user;
        resolve(user);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 800); // Simulate network delay
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

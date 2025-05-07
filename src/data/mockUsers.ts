
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
    onboarded: true,
  },
  {
    id: '2',
    name: 'Thomas Dubois',
    email: 'thomas@example.com',
    role: UserRole.USER,
    anonymity_code: 'TD659812',
    emotional_score: 65,
    avatar: 'https://i.pravatar.cc/150?img=2',
    onboarded: true,
  },
  {
    id: '3',
    name: 'Emma Petit',
    email: 'emma@example.com',
    role: UserRole.USER,
    anonymity_code: 'EP847103',
    emotional_score: 78,
    avatar: 'https://i.pravatar.cc/150?img=3',
    onboarded: true,
  },
  {
    id: '4',
    name: 'Admin Direction',
    email: 'admin@example.com',
    role: 'admin',  // Role admin pour l'accès direction
    anonymity_code: 'AD123456',
    emotional_score: 95,
    avatar: 'https://i.pravatar.cc/150?img=12',
    onboarded: true,
  },
];

// Current user state (simulating auth)
export let currentUser: User | null = null;

// Auth functions
export const loginUser = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`MockUsers - Attempting login with email: ${email} and password: ${password ? "provided" : "empty"}`);
      
      // For Sophie user
      if (email === 'sophie@example.com' && password === 'sophie') {
        const user = mockUsers.find(u => u.email === 'sophie@example.com');
        if (user) {
          console.log("MockUsers - Login successful for Sophie:", user);
          currentUser = user;
          resolve(user);
          return;
        }
      }
      
      // For Admin user
      if (email === 'admin@example.com' && password === 'admin') {
        const user = mockUsers.find(u => u.email === 'admin@example.com');
        if (user) {
          console.log("MockUsers - Login successful for Admin:", user);
          currentUser = user;
          resolve(user);
          return;
        }
      }
      
      // For other users - require password match
      const user = mockUsers.find(u => u.email === email);
      if (user) {
        // Simple password check - in a real app this would be hashed
        if (password) {
          console.log("MockUsers - Login successful for user:", user);
          currentUser = user;
          resolve(user);
          return;
        }
      }
      
      console.log("MockUsers - Login failed: Invalid email or password");
      reject(new Error('Email ou mot de passe invalide'));
    }, 800); // Simulate network delay
  });
};

export const logoutUser = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("MockUsers - Logging out user:", currentUser?.email);
      currentUser = null;
      resolve();
    }, 300);
  });
};

export const updateUser = (userData: Partial<User>): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!currentUser) {
        console.error("MockUsers - Cannot update user: No user is logged in");
        reject(new Error('User not logged in'));
        return;
      }
      
      const updatedUser = { ...currentUser, ...userData };
      currentUser = updatedUser;
      
      // Update the mock users array too
      const index = mockUsers.findIndex(u => u.id === currentUser?.id);
      if (index !== -1) {
        mockUsers[index] = updatedUser;
        console.log("MockUsers - User updated:", updatedUser);
      }
      
      resolve(updatedUser);
    }, 800);
  });
};

export const getCurrentUser = (): User | null => {
  console.log("MockUsers - Getting current user:", currentUser);
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

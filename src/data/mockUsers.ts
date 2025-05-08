
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from '../types';

// Mock Users
export const users: Record<string, User> = {
  // Admin User
  "admin@example.com": {
    id: "1",
    name: "Admin",
    email: "admin@example.com",
    role: UserRole.ADMIN,
    created_at: new Date().toISOString(),
    anonymity_code: "A1",
    emotional_score: 85,
    avatar: "https://i.pravatar.cc/300?img=68",
    onboarded: true,
  },
  
  // Sophie - Primary user
  "sophie@example.com": {
    id: "2",
    name: "Sophie",
    email: "sophie@example.com",
    role: UserRole.USER,
    created_at: new Date().toISOString(),
    anonymity_code: "S1",
    emotional_score: 78,
    avatar: "https://i.pravatar.cc/300?img=48",
    onboarded: true,
  },
  
  // Marc - User with low emotional score
  "marc@example.com": {
    id: "3",
    name: "Marc",
    email: "marc@example.com",
    role: UserRole.USER,
    created_at: new Date().toISOString(),
    anonymity_code: "M1",
    emotional_score: 45,
    avatar: "https://i.pravatar.cc/300?img=57",
    onboarded: true,
  },
  
  // Emma - Manager
  "emma@example.com": {
    id: "4",
    name: "Emma",
    email: "emma@example.com",
    role: "manager",
    created_at: new Date().toISOString(),
    anonymity_code: "E1",
    emotional_score: 72,
    avatar: "https://i.pravatar.cc/300?img=45",
    onboarded: true,
  },
};

// Export mockUsers with the array version to match what's expected in imports
export const mockUsers = Object.values(users);

// Current user state (simulating auth)
export let currentUser: User | null = null;

// Auth functions
export const loginUser = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`MockUsers - Attempting login with email: ${email} and password: ${password ? "provided" : "empty"}`);
      
      // For Sophie user
      if (email === 'sophie@example.com' && password === 'sophie') {
        const user = users["sophie@example.com"];
        if (user) {
          console.log("MockUsers - Login successful for Sophie:", user);
          currentUser = user;
          resolve(user);
          return;
        }
      }
      
      // For Admin user
      if (email === 'admin@example.com' && password === 'admin') {
        const user = users["admin@example.com"];
        if (user) {
          console.log("MockUsers - Login successful for Admin:", user);
          currentUser = user;
          resolve(user);
          return;
        }
      }
      
      // For other users - require password match
      const user = users[email];
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
      const index = Object.keys(users).findIndex(u => u === currentUser?.email);
      if (index !== -1) {
        users[currentUser?.email] = updatedUser;
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

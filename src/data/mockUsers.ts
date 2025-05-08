import { User, UserRole } from '@/types';

// Mock user data for development and testing
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'user', // Using string literal instead of enum
    emotional_score: 75,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    team_id: 'team-1',
    team_name: 'Marketing',
    anonymity_code: 'JD123',
    last_active: '2023-03-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: UserRole.USER,
    emotional_score: 60,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    team_id: 'team-2',
    team_name: 'Sales',
    anonymity_code: 'JS456',
    last_active: '2023-03-14T16:45:00Z'
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    role: UserRole.ADMIN,
    emotional_score: 90,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    team_id: 'team-3',
    team_name: 'IT',
    anonymity_code: 'AJ789',
    last_active: '2023-03-16T09:15:00Z'
  },
  {
    id: '4',
    name: 'Emma Dupont',
    email: 'emma.d@example.com',
    role: UserRole.MANAGER, // Use the enum value instead of string literal
    emotional_score: 82,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    team_id: 'team-1',
    team_name: 'Direction',
    anonymity_code: 'EM89',
    last_active: '2023-03-10T14:22:00Z'
  },
  {
    id: '5',
    name: 'Luc Martin',
    email: 'luc.m@example.com',
    role: UserRole.USER,
    emotional_score: 55,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luc',
    team_id: 'team-2',
    team_name: 'RH',
    anonymity_code: 'LM234',
    last_active: '2023-03-12T11:58:00Z'
  },
  {
    id: '6',
    name: 'Chloé Bernard',
    email: 'chloe.b@example.com',
    role: UserRole.USER,
    emotional_score: 68,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chloe',
    team_id: 'team-3',
    team_name: 'Comptabilité',
    anonymity_code: 'CB567',
    last_active: '2023-03-13T08:05:00Z'
  },
  {
    id: '7',
    name: 'Gabriel Dubois',
    email: 'gabriel.d@example.com',
    role: UserRole.USER,
    emotional_score: 79,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gabriel',
    team_id: 'team-1',
    team_name: 'Juridique',
    anonymity_code: 'GD890',
    last_active: '2023-03-11T17:33:00Z'
  }
];

// Added missing exported functions needed by mockData.ts
export const currentUser: User | null = null;

export const loginUser = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      resolve(user);
    } else {
      reject(new Error('Invalid credentials'));
    }
  });
};

export const logoutUser = (): Promise<void> => {
  return Promise.resolve();
};

export const updateUser = (userId: string, data: Partial<User>): Promise<User> => {
  return new Promise((resolve, reject) => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex >= 0) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
      resolve(mockUsers[userIndex]);
    } else {
      reject(new Error('User not found'));
    }
  });
};

export const getCurrentUser = (): Promise<User | null> => {
  return Promise.resolve(null);
};

export const generateAnonymityCode = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Function to generate a random user
export const generateRandomUser = (): User => {
  const id = Math.random().toString(36).substring(2, 15);
  const name = `Random User ${id}`;
  const email = `random${id}@example.com`;
  
  // Map UserRole enum values to string literals
  const roleOptions: ('user' | 'admin' | 'manager' | 'employee' | 'analyst' | 'wellbeing_manager')[] = [
    'user', 'admin', 'manager', 'employee', 'analyst', 'wellbeing_manager'
  ];
  
  const role = roleOptions[Math.floor(Math.random() * roleOptions.length)];
  const emotional_score = Math.floor(Math.random() * 100);
  const anonymity_code = Math.random().toString(36).substring(2, 10).toUpperCase();

  return {
    id,
    name,
    email,
    role,
    emotional_score,
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
    anonymity_code,
    last_active: new Date().toISOString()
  };
};

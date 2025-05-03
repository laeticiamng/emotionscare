
import { 
  User, Badge, Emotion, JournalEntry, VRSessionTemplate, 
  VRSession, Post, Comment, Group, LibraryItem, Ritual, Report 
} from '../types';

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

// Mock Badges
export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Premier pas',
    description: 'Première session de VR complétée',
    image_url: '/badges/first-step.svg',
    awarded_at: '2023-04-15T14:30:00Z',
    user_id: '1',
  },
  {
    id: '2',
    name: 'Journal assidu',
    description: '5 entrées de journal consécutives',
    image_url: '/badges/journal-master.svg',
    awarded_at: '2023-04-18T09:15:00Z',
    user_id: '1',
  },
];

// Mock Emotions
export const mockEmotions: Emotion[] = [
  {
    id: '1',
    user_id: '1',
    date: '2023-04-14T10:20:00Z',
    emojis: '😊😌',
    text: 'Je me sens bien aujourd\'hui, journée productive',
    ai_feedback: 'Votre humeur semble positive. Continuez à cultiver cette énergie positive!',
    score: 82,
  },
  {
    id: '2',
    user_id: '1',
    date: '2023-04-13T11:30:00Z',
    emojis: '😓😔',
    text: 'Journée difficile, beaucoup de stress',
    ai_feedback: 'Vous semblez ressentir du stress. Une pause VR de 5 minutes pourrait vous aider.',
    score: 45,
  },
];

// Mock Reports
export const mockReports: Report[] = [
  {
    id: '1',
    metric: 'absenteeism',
    period_start: '2023-04-01T00:00:00Z',
    period_end: '2023-04-07T00:00:00Z',
    value: 3.5,
    change_pct: -2.1,
  },
  {
    id: '2',
    metric: 'absenteeism',
    period_start: '2023-04-08T00:00:00Z',
    period_end: '2023-04-14T00:00:00Z',
    value: 3.2,
    change_pct: -8.6,
  },
  {
    id: '3',
    metric: 'productivity',
    period_start: '2023-04-01T00:00:00Z',
    period_end: '2023-04-07T00:00:00Z',
    value: 87.3,
    change_pct: 1.5,
  },
  {
    id: '4',
    metric: 'productivity',
    period_start: '2023-04-08T00:00:00Z',
    period_end: '2023-04-14T00:00:00Z',
    value: 89.7,
    change_pct: 2.7,
  },
];

// Mock VR Session Templates
export const mockVRTemplates: VRSessionTemplate[] = [
  {
    template_id: '1',
    theme: 'Forêt apaisante',
    duration: 5,
    preview_url: 'https://www.youtube.com/embed/BHACKCNDMW8',
  },
  {
    template_id: '2',
    theme: 'Plage relaxante',
    duration: 7,
    preview_url: 'https://www.youtube.com/embed/LTZqYzu3jQo',
  },
  {
    template_id: '3',
    theme: 'Méditation guidée',
    duration: 10,
    preview_url: 'https://www.youtube.com/embed/O-6f5wQXSu8',
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

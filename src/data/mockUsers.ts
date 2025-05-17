import { User, UserRole } from '@/types/user';
import { v4 as uuidv4 } from 'uuid';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/images/avatars/avatar-1.png',
    avatarUrl: '/images/avatars/avatar-1.png',
    role: 'b2b_admin',
    teams: ['dev', 'product'],
    department: 'Engineering',
    position: 'Senior Developer',
    location: 'Paris',
    status: 'active',
    emotional_score: 85,
    emotionalScore: 85,
    joined_at: '2023-01-15T12:00:00Z',
    created_at: '2023-01-15T12:00:00Z',
    preferences: {
      theme: 'system',
      fontSize: 'medium',
      fontFamily: 'system',
      reduceMotion: false,
      colorBlindMode: false,
      autoplayMedia: true,
      soundEnabled: true,
      language: 'fr',
      dashboardLayout: 'default',
      onboardingCompleted: true,
      notifications: {
        enabled: true,
        emailEnabled: true,
        pushEnabled: true,
        inAppEnabled: true,
        email: true,
        push: true,
        inApp: true,
        types: {
          system: true,
          emotion: true,
          coach: true,
          journal: true
        },
        frequency: 'daily',
        tone: 'friendly'
      },
      privacy: {
        shareData: true,
        anonymizeReports: false,
        profileVisibility: 'team'
      }
    }
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: '/images/avatars/avatar-2.png',
    avatarUrl: '/images/avatars/avatar-2.png',
    role: 'b2b_user',
    teams: ['marketing'],
    department: 'Marketing',
    position: 'Marketing Manager',
    location: 'Lyon',
    status: 'active',
    emotional_score: 78,
    emotionalScore: 78,
    joined_at: '2023-02-20T12:00:00Z',
    created_at: '2023-02-20T12:00:00Z',
    preferences: {
      theme: 'dark',
      fontSize: 'large',
      fontFamily: 'sans',
      reduceMotion: true,
      colorBlindMode: false,
      autoplayMedia: false,
      soundEnabled: true,
      language: 'en',
      dashboardLayout: 'focused',
      onboardingCompleted: true,
      notifications: {
        enabled: true,
        emailEnabled: false,
        pushEnabled: true,
        inAppEnabled: true,
        email: false,
        push: true,
        inApp: true,
        types: {
          system: true,
          emotion: true,
          coach: false,
          journal: true
        },
        frequency: 'weekly',
        tone: 'formal'
      },
      privacy: {
        shareData: false,
        anonymizeReports: true,
        profileVisibility: 'private'
      }
    }
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    avatar: '/images/avatars/avatar-3.png',
    avatarUrl: '/images/avatars/avatar-3.png',
    role: 'b2c',
    teams: [],
    department: '',
    position: '',
    location: 'Marseille',
    status: 'active',
    emotional_score: 92,
    emotionalScore: 92,
    joined_at: '2023-03-10T12:00:00Z',
    created_at: '2023-03-10T12:00:00Z',
    preferences: {
      theme: 'light',
      fontSize: 'medium',
      fontFamily: 'serif',
      reduceMotion: false,
      colorBlindMode: true,
      autoplayMedia: true,
      soundEnabled: false,
      language: 'fr',
      dashboardLayout: 'expanded',
      onboardingCompleted: true,
      notifications: {
        enabled: true,
        emailEnabled: true,
        pushEnabled: true,
        inAppEnabled: true,
        email: true,
        push: true,
        inApp: true,
        types: {
          system: true,
          emotion: true,
          coach: true,
          journal: true
        },
        frequency: 'immediate',
        tone: 'casual'
      },
      privacy: {
        shareData: true,
        anonymizeReports: false,
        profileVisibility: 'public'
      }
    }
  }
];

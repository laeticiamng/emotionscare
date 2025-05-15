
import { User, UserRole } from '@/types/user';

// Create some mock users for testing purposes
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice Martin',
    email: 'alice.martin@example.com',
    role: 'admin' as UserRole,
    avatar_url: '/images/avatars/alice.jpg',
    created_at: '2023-01-15T09:00:00Z',
    emotional_score: 82,
    department: 'Marketing',
    position: 'Marketing Director',
    preferences: {
      dashboardLayout: 'standard',
      onboardingCompleted: true,
      theme: 'system',
      fontSize: 'medium',
      language: 'fr',
      fontFamily: 'system',
      sound: true,
      reduceMotion: false,
      colorBlindMode: false,
      autoplayMedia: true,
      notifications: {
        enabled: true,
        emailEnabled: true,
        pushEnabled: true,
        frequency: 'daily',
        types: {
          system: true,
          emotion: true,
          journal: true,
          coach: true,
          community: true,
          achievement: true
        },
        tone: 'friendly',
        quietHours: {
          enabled: true,
          start: '22:00',
          end: '07:00'
        }
      }
    }
  },
  {
    id: '2',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'user' as UserRole,
    avatar_url: '/images/avatars/bob.jpg',
    created_at: '2023-02-20T14:30:00Z',
    emotional_score: 65,
    department: 'Engineering',
    position: 'Senior Developer',
    preferences: {
      dashboardLayout: 'focused',
      onboardingCompleted: true,
      theme: 'dark',
      fontSize: 'large',
      language: 'fr',
      fontFamily: 'sans-serif',
      sound: false,
      reduceMotion: true,
      colorBlindMode: false,
      autoplayMedia: false,
      notifications: {
        enabled: true,
        emailEnabled: false,
        pushEnabled: true,
        frequency: 'immediate',
        types: {
          system: true,
          emotion: true,
          journal: false,
          coach: true,
          community: false,
          achievement: true
        },
        tone: 'direct',
        quietHours: {
          enabled: false,
          start: '23:00',
          end: '06:00'
        }
      }
    }
  },
  {
    id: '3',
    name: 'Carol Williams',
    email: 'carol.williams@example.com',
    role: 'manager' as UserRole,
    avatar_url: '/images/avatars/carol.jpg',
    created_at: '2023-03-10T11:15:00Z',
    emotional_score: 78,
    department: 'Human Resources',
    position: 'HR Manager',
    preferences: {
      dashboardLayout: 'compact',
      onboardingCompleted: false,
      theme: 'light',
      fontSize: 'small',
      language: 'fr',
      fontFamily: 'serif',
      sound: true,
      reduceMotion: false,
      colorBlindMode: true,
      autoplayMedia: true,
      notifications: {
        enabled: false,
        emailEnabled: false,
        pushEnabled: false,
        frequency: 'weekly',
        types: {
          system: true,
          emotion: true,
          journal: true,
          coach: true,
          community: true,
          achievement: true
        },
        tone: 'professional',
        quietHours: {
          enabled: true,
          start: '21:00',
          end: '08:00'
        }
      }
    }
  },
  {
    id: '4',
    name: 'David Brown',
    email: 'david.brown@example.com',
    role: 'coach' as UserRole,
    avatar_url: '/images/avatars/david.jpg',
    created_at: '2023-04-05T16:45:00Z',
    emotional_score: 90,
    department: 'Coaching',
    position: 'Senior Well-being Coach',
    preferences: {
      dashboardLayout: 'standard',
      onboardingCompleted: true,
      theme: 'system',
      fontSize: 'medium',
      language: 'fr',
      fontFamily: 'monospace',
      sound: true,
      reduceMotion: false,
      colorBlindMode: false,
      autoplayMedia: true,
      notifications: {
        enabled: true,
        emailEnabled: true,
        pushEnabled: true,
        frequency: 'daily',
        types: {
          system: true,
          emotion: true,
          journal: true,
          coach: true,
          community: true,
          achievement: true
        },
        tone: 'motivational',
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '07:00'
        }
      }
    }
  }
];

export default mockUsers;

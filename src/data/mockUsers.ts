
import { User, UserRole } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    role: 'user' as UserRole,
    avatar_url: '/avatars/john-doe.png',
    created_at: '2023-04-15T10:30:00Z',
    preferences: {
      dashboardLayout: 'standard',
      onboardingCompleted: true,
      theme: 'system',
      fontSize: 'medium',
      language: 'en',
      fontFamily: 'system',
      sound: true,
      notifications: {
        enabled: true,
        emailEnabled: true,
        pushEnabled: true,
        frequency: 'daily',
        tone: 'supportive',
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '07:00'
        }
      }
    }
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    role: 'manager' as UserRole,
    avatar_url: '/avatars/jane-smith.png',
    created_at: '2023-05-20T14:45:00Z',
    preferences: {
      dashboardLayout: 'compact',
      onboardingCompleted: true,
      theme: 'dark',
      fontSize: 'large',
      language: 'en',
      fontFamily: 'sans-serif',
      sound: false,
      notifications: {
        enabled: true,
        emailEnabled: false,
        pushEnabled: true,
        frequency: 'immediate',
        tone: 'direct',
        quietHours: {
          enabled: true,
          start: '23:00',
          end: '06:00'
        }
      }
    }
  },
  {
    id: '3',
    email: 'alice.johnson@example.com',
    name: 'Alice Johnson',
    role: 'user' as UserRole,
    avatar_url: '/avatars/alice-johnson.png',
    created_at: '2023-06-10T09:15:00Z',
    preferences: {
      dashboardLayout: 'focused',
      onboardingCompleted: false,
      theme: 'light',
      fontSize: 'small',
      language: 'en',
      fontFamily: 'serif',
      sound: true,
      notifications: {
        enabled: false,
        emailEnabled: false,
        pushEnabled: false,
        frequency: 'weekly',
        tone: 'gentle',
        quietHours: {
          enabled: false,
          start: '21:00',
          end: '08:00'
        }
      }
    }
  },
  {
    id: '4',
    email: 'robert.williams@example.com',
    name: 'Robert Williams',
    role: 'user' as UserRole,
    avatar_url: '/avatars/robert-williams.png',
    created_at: '2023-07-05T16:20:00Z',
    preferences: {
      dashboardLayout: 'standard',
      onboardingCompleted: true,
      theme: 'system',
      fontSize: 'medium',
      language: 'en',
      fontFamily: 'monospace',
      sound: true,
      notifications: {
        enabled: true,
        emailEnabled: true,
        pushEnabled: true,
        frequency: 'daily',
        tone: 'motivational',
        quietHours: {
          enabled: true,
          start: '22:00',
          end: '06:30'
        }
      }
    }
  }
];

export default mockUsers;

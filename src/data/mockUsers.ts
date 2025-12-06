// @ts-nocheck
import { User, UserRole } from '@/types/user';
import { PrivacyPreferences } from '@/types/preferences';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'johndoe@example.com',
    name: 'John Doe',
    role: 'b2c',
    created_at: '2023-09-01T10:00:00Z',
    emotional_score: 75,
    avatar_url: '/avatars/avatar-01.png',
    preferences: {
      theme: 'system',
      language: 'fr',
      notifications_enabled: true,
      email_notifications: false,
      fontSize: 'medium',
      fontFamily: 'system',
      reduceMotion: false,
      colorBlindMode: false,
      soundEnabled: true,
      dashboardLayout: {
        kpis: ['emotions', 'activities', 'streak'],
        widgets: ['journal', 'music', 'social']
      },
      notifications: {
        enabled: true,
        emailEnabled: false,
        pushEnabled: true,
        inAppEnabled: true,
        types: {
          system: true,
          emotion: true,
          coach: true,
          journal: true,
          community: true,
          achievement: true
        },
        frequency: 'daily',
        email: false,
        push: true,
        sms: false
      },
      privacy: {
        dataSharing: true,
        analytics: true,
        thirdParty: true,
        shareData: true,
        anonymizeReports: false,
        profileVisibility: 'public'
      } as PrivacyPreferences
    }
  },
  {
    id: '2',
    email: 'alice@example.com',
    name: 'Alice Smith',
    role: 'b2b_user',
    created_at: '2023-08-15T14:30:00Z',
    emotional_score: 82,
    department: 'Marketing',
    job_title: 'Content Manager',
    avatar_url: '/avatars/avatar-02.png',
    preferences: {
      theme: 'light',
      language: 'en',
      notifications_enabled: true,
      email_notifications: true,
      fontSize: 'large',
      fontFamily: 'sans',
      reduceMotion: true,
      colorBlindMode: false,
      soundEnabled: false,
      dashboardLayout: {
        kpis: ['emotions', 'team', 'activities'],
        widgets: ['journal', 'goals', 'music']
      },
      notifications: {
        enabled: true,
        emailEnabled: true,
        pushEnabled: true,
        inAppEnabled: true,
        types: {
          system: true,
          emotion: true,
          coach: true,
          journal: true,
          community: true,
          achievement: true
        },
        frequency: 'weekly',
        email: true,
        push: true,
        sms: false
      },
      privacy: {
        shareData: false,
        anonymizeReports: true,
        profileVisibility: 'connections'
      }
    }
  },
  {
    id: '3',
    email: 'robert@example.com',
    name: 'Robert Johnson',
    role: 'b2b_admin',
    created_at: '2023-07-20T09:15:00Z',
    emotional_score: 68,
    department: 'Human Resources',
    job_title: 'HR Director',
    avatar_url: '/avatars/avatar-03.png',
    preferences: {
      theme: 'dark',
      language: 'fr',
      notifications_enabled: true,
      email_notifications: true,
      fontSize: 'medium',
      fontFamily: 'serif',
      reduceMotion: false,
      colorBlindMode: false,
      soundEnabled: true,
      dashboardLayout: {
        kpis: ['team_health', 'alerts', 'productivity'],
        widgets: ['reports', 'team_overview', 'schedule']
      },
      notifications: {
        enabled: true,
        emailEnabled: true,
        pushEnabled: false,
        inAppEnabled: true,
        types: {
          system: true,
          emotion: true,
          coach: false,
          journal: false,
          community: true,
          achievement: true
        },
        frequency: 'daily',
        email: true,
        push: false,
        sms: false
      },
      privacy: {
        shareData: true,
        anonymizeReports: false,
        profileVisibility: 'team'
      }
    }
  },
  {
    id: '4',
    email: 'emma@example.com',
    name: 'Emma Wilson',
    role: 'admin',
    created_at: '2023-06-05T11:45:00Z',
    emotional_score: 90,
    avatar_url: '/avatars/avatar-04.png',
    preferences: {
      theme: 'system',
      language: 'fr',
      notifications_enabled: true,
      email_notifications: true,
      fontSize: 'small',
      fontFamily: 'system',
      reduceMotion: false,
      colorBlindMode: true,
      soundEnabled: true,
      dashboardLayout: {
        kpis: ['users', 'activity', 'content'],
        widgets: ['admin_tools', 'analytics', 'logs']
      },
      notifications: {
        enabled: true,
        emailEnabled: true,
        pushEnabled: true,
        inAppEnabled: true,
        types: {
          system: true,
          emotion: true,
          coach: true,
          journal: true,
          community: true,
          achievement: true
        },
        frequency: 'immediate',
        email: true,
        push: true,
        sms: true
      },
      privacy: {
        shareData: true,
        anonymizeReports: false,
        profileVisibility: 'private'
      }
    }
  }
];

export default mockUsers;

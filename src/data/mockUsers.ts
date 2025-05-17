
import { User, UserPreferences } from '@/types/types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'sarah.martin@example.com',
    name: 'Sarah Martin',
    language: 'fr',
    role: 'b2c',
    createdAt: '2023-09-01T10:00:00Z',
    lastLoginAt: '2023-09-15T14:30:00Z',
    subscriptionTier: 'premium',
    status: 'active',
    preferences: {
      theme: 'light',
      fontSize: 'medium',
      fontFamily: 'system',
      reduceMotion: false,
      colorBlindMode: false,
      autoplayMedia: true,
      soundEnabled: true,
      onboardingCompleted: true,
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
          achievement: true,
          badge: true,
          challenge: true,
          reminder: true,
          info: true,
          warning: true,
          error: true,
          success: true,
          streak: true,
          urgent: true
        },
        frequency: 'immediate'
      },
      privacy: {
        shareData: true,
        anonymizeReports: false,
        profileVisibility: 'public'
      }
    },
    stats: {
      emotionalScansCompleted: 47,
      journalEntriesCount: 32,
      sessionsCount: 28,
      consecutiveDays: 14,
      totalPointsEarned: 1250,
      challengesCompleted: 8,
      badgesEarned: 6,
      accountAgeInDays: 130
    }
  },
  {
    id: 'user-2',
    email: 'thomas.dubois@example.com',
    name: 'Thomas Dubois',
    language: 'fr',
    role: 'b2c',
    createdAt: '2023-08-15T10:00:00Z',
    lastLoginAt: '2023-09-14T18:20:00Z',
    subscriptionTier: 'free',
    status: 'active',
    preferences: {
      theme: 'dark',
      fontSize: 'large',
      fontFamily: 'sans',
      reduceMotion: true,
      colorBlindMode: false,
      autoplayMedia: false,
      soundEnabled: true,
      onboardingCompleted: true,
      notifications: {
        enabled: true,
        emailEnabled: true,
        pushEnabled: false,
        inAppEnabled: true,
        types: {
          system: true,
          emotion: true,
          coach: false,
          journal: true,
          community: true,
          achievement: true,
          badge: true,
          challenge: true,
          reminder: true,
          info: true,
          warning: true,
          error: true,
          success: true,
          streak: true,
          urgent: true
        },
        frequency: 'daily'
      },
      privacy: {
        shareData: false,
        anonymizeReports: true,
        profileVisibility: 'private'
      }
    },
    stats: {
      emotionalScansCompleted: 28,
      journalEntriesCount: 14,
      sessionsCount: 23,
      consecutiveDays: 5,
      totalPointsEarned: 720,
      challengesCompleted: 4,
      badgesEarned: 3,
      accountAgeInDays: 147
    }
  },
  {
    id: 'user-3',
    email: 'emma.lefebvre@company.com',
    name: 'Emma Lefebvre',
    language: 'fr',
    role: 'b2b',
    createdAt: '2023-07-20T10:00:00Z',
    lastLoginAt: '2023-09-15T09:45:00Z',
    companyId: 'company-1',
    department: 'Marketing',
    position: 'Chef de projet',
    subscriptionTier: 'enterprise',
    status: 'active',
    preferences: {
      theme: 'system',
      fontSize: 'medium',
      fontFamily: 'serif',
      reduceMotion: false,
      colorBlindMode: false,
      autoplayMedia: true,
      soundEnabled: true,
      onboardingCompleted: true,
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
          achievement: true,
          badge: true,
          challenge: true,
          reminder: true,
          info: true,
          warning: true,
          error: true,
          success: true,
          streak: true,
          urgent: true
        },
        frequency: 'immediate'
      },
      privacy: {
        shareData: true,
        anonymizeReports: true,
        profileVisibility: 'team'
      }
    },
    stats: {
      emotionalScansCompleted: 65,
      journalEntriesCount: 42,
      sessionsCount: 38,
      consecutiveDays: 21,
      totalPointsEarned: 1780,
      challengesCompleted: 12,
      badgesEarned: 9,
      accountAgeInDays: 173
    },
    teamData: {
      teamId: 'team-1',
      teamName: 'Équipe Marketing',
      role: 'member',
      teamSize: 8,
      teamHealthScore: 78
    }
  }
];

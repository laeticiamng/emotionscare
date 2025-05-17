
import { User } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: "u1",
    email: "thomas.martin@example.com",
    name: "Thomas Martin",
    firstName: "Thomas",
    lastName: "Martin",
    displayName: "Thomas M.",
    avatar: "/avatars/thomas.jpg",
    avatarUrl: "/avatars/thomas.jpg",
    avatar_url: "/avatars/thomas.jpg",
    role: "user",
    createdAt: "2023-03-15T09:00:00Z",
    joined_at: "2023-03-15T09:00:00Z",
    company: "TechSolutions",
    department: "Engineering",
    preferences: {
      theme: "light",
      fontSize: "medium",
      fontFamily: "system",
      notifications: {
        email: true,
        push: true,
        inApp: true,
        enabled: true,
        emailEnabled: true,
        pushEnabled: true,
        inAppEnabled: true,
        frequency: "daily"
      },
      soundEnabled: true,
      reduceMotion: false,
      language: "fr",
      dashboardLayout: "default",
      onboardingCompleted: true,
      privacy: {
        shareData: true,
        anonymizeReports: false,
        profileVisibility: "public"
      }
    },
    emotional_score: 78,
    emotionalScore: 78
  },
  {
    id: "u2",
    email: "alice.dubois@example.com",
    name: "Alice Dubois",
    firstName: "Alice",
    lastName: "Dubois",
    displayName: "Alice D.",
    avatar: "/avatars/alice.jpg",
    avatarUrl: "/avatars/alice.jpg",
    avatar_url: "/avatars/alice.jpg",
    role: "admin",
    createdAt: "2023-01-10T14:30:00Z", 
    joined_at: "2023-01-10T14:30:00Z",
    company: "TechSolutions",
    department: "Human Resources",
    preferences: {
      theme: "dark",
      fontSize: "large",
      fontFamily: "system",
      notifications: {
        email: true,
        push: false,
        inApp: true,
        enabled: true,
        emailEnabled: true,
        pushEnabled: false,
        inAppEnabled: true,
        frequency: "weekly"
      },
      soundEnabled: false,
      reduceMotion: true,
      language: "fr",
      dashboardLayout: "compact",
      onboardingCompleted: true,
      privacy: {
        shareData: true,
        anonymizeReports: false,
        profileVisibility: "public"
      }
    },
    emotional_score: 85,
    emotionalScore: 85
  },
  {
    id: "u3",
    email: "jean.petit@example.com",
    name: "Jean Petit",
    firstName: "Jean",
    lastName: "Petit",
    displayName: "Jean P.",
    avatar: "/avatars/jean.jpg",
    avatarUrl: "/avatars/jean.jpg",
    avatar_url: "/avatars/jean.jpg",
    role: "user",
    createdAt: "2023-05-22T11:15:00Z",
    joined_at: "2023-05-22T11:15:00Z",
    company: "TechSolutions",
    department: "Marketing",
    preferences: {
      theme: "system",
      fontSize: "small",
      fontFamily: "system",
      notifications: {
        email: false,
        push: true,
        inApp: true,
        enabled: true,
        emailEnabled: false,
        pushEnabled: true,
        inAppEnabled: true,
        frequency: "daily"
      },
      soundEnabled: true,
      reduceMotion: false,
      language: "fr",
      dashboardLayout: "expanded",
      onboardingCompleted: false,
      privacy: {
        shareData: true,
        anonymizeReports: false,
        profileVisibility: "public"
      }
    },
    emotional_score: 62,
    emotionalScore: 62
  }
];

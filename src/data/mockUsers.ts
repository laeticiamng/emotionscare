import { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Emma Martin",
    email: "emma.martin@example.com",
    role: "admin",
    avatar_url: "/avatars/emma.jpg",
    emotional_score: 87,
    department: "Management",
    position: "CEO",
    preferences: {
      dashboardLayout: "standard",
      onboardingCompleted: true,
      theme: "light",
      fontSize: "medium",
      fontFamily: "system",
      language: "fr",
      notifications: {
        enabled: true,
        emailEnabled: true,
        pushEnabled: true,
        frequency: "daily",
        types: {
          emotions: true,
          coach: true,
          journal: true
        },
        tone: "professional"
      },
      sound: true,
      notifications_enabled: true,
      profileVisibility: "private",
      autoplayVideos: false,
      dataCollection: true,
      aiSuggestions: true,
      emotionalCamouflage: false
    }
  },
  {
    id: "2",
    name: "Liam Johnson",
    email: "liam.johnson@example.com",
    role: "manager",
    avatar_url: "/avatars/liam.jpg",
    emotional_score: 76,
    department: "HR",
    position: "HR Manager",
    preferences: {
      dashboardLayout: "compact",
      onboardingCompleted: true,
      theme: "dark",
      fontSize: "large",
      fontFamily: "sans-serif",
      language: "en",
      notifications: {
        enabled: false,
        emailEnabled: false,
        pushEnabled: false,
        frequency: "weekly",
        types: {
          emotions: false,
          coach: false,
          journal: false
        },
        tone: "friendly"
      },
      sound: false,
      notifications_enabled: false,
      profileVisibility: "team",
      autoplayVideos: true,
      dataCollection: false,
      aiSuggestions: false,
      emotionalCamouflage: true
    }
  },
  {
    id: "3",
    name: "Olivia Smith",
    email: "olivia.smith@example.com",
    role: "employee",
    avatar_url: "/avatars/olivia.jpg",
    emotional_score: 92,
    department: "Marketing",
    position: "Marketing Specialist",
    preferences: {
      dashboardLayout: "focused",
      onboardingCompleted: false,
      theme: "system",
      fontSize: "small",
      fontFamily: "serif",
      language: "es",
      notifications: {
        enabled: true,
        emailEnabled: true,
        pushEnabled: false,
        frequency: "immediate",
        types: {
          emotions: true,
          coach: false,
          journal: true
        },
        tone: "motivational"
      },
      sound: true,
      notifications_enabled: true,
      profileVisibility: "public",
      autoplayVideos: true,
      dataCollection: true,
      aiSuggestions: true,
      emotionalCamouflage: true
    }
  },
  {
    id: "4",
    name: "Noah Brown",
    email: "noah.brown@example.com",
    role: "coach",
    avatar_url: "/avatars/noah.jpg",
    emotional_score: 68,
    department: "Coaching",
    position: "Wellbeing Coach",
    preferences: {
      dashboardLayout: "standard",
      onboardingCompleted: true,
      theme: "pastel",
      fontSize: "medium",
      fontFamily: "monospace",
      language: "de",
      notifications: {
        enabled: true,
        emailEnabled: false,
        pushEnabled: true,
        frequency: "daily",
        types: {
          emotions: false,
          coach: true,
          journal: false
        },
        tone: "direct"
      },
      sound: false,
      notifications_enabled: true,
      profileVisibility: "team",
      autoplayVideos: false,
      dataCollection: false,
      aiSuggestions: true,
      emotionalCamouflage: false
    }
  },
  {
    id: "5",
    name: "Isabella Garcia",
    email: "isabella.garcia@example.com",
    role: "b2b_admin",
    avatar_url: "/avatars/isabella.jpg",
    emotional_score: 79,
    department: "Administration",
    position: "Office Manager",
    preferences: {
      dashboardLayout: "compact",
      onboardingCompleted: false,
      theme: "light",
      fontSize: "large",
      fontFamily: "rounded",
      language: "it",
      notifications: {
        enabled: false,
        emailEnabled: true,
        pushEnabled: false,
        frequency: "weekly",
        types: {
          emotions: false,
          coach: false,
          journal: true
        },
        tone: "calm"
      },
      sound: true,
      notifications_enabled: false,
      profileVisibility: "private",
      autoplayVideos: true,
      dataCollection: true,
      aiSuggestions: false,
      emotionalCamouflage: true
    }
  }
];

export default mockUsers;

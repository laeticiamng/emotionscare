// @ts-nocheck

// Mock data for Social Cocoon section
export const socialCocoonData = {
  totalPosts: 248,
  moderationRate: 3.2,
  topHashtags: [
    { tag: '#bienetre', count: 42 },
    { tag: '#entraide', count: 36 },
    { tag: '#motivation', count: 31 },
    { tag: '#teamspirit', count: 28 },
    { tag: '#pausecafe', count: 22 }
  ]
};

// Mock data for gamification section
export const gamificationData = {
  activeUsersPercent: 68,
  totalBadges: 24,
  badgeLevels: [
    { level: 'Bronze', count: 14 },
    { level: 'Argent', count: 7 },
    { level: 'Or', count: 3 }
  ],
  topChallenges: [
    { name: 'Check-in quotidien', completions: 156 },
    { name: 'Partage d\'expérience', completions: 87 },
    { name: 'Lecture bien-être', completions: 63 }
  ]
};

// Mock RH action suggestions
export const rhSuggestions = [
  {
    title: "Atelier Respiration",
    description: "Session de 30 minutes sur techniques de respiration anti-stress.",
    icon: "🧘"
  },
  {
    title: "Pause café virtuelle",
    description: "Encourager les échanges entre services via breaks virtuels.",
    icon: "☕"
  },
  {
    title: "Challenge bien-être",
    description: "Lancer un défi quotidien de micro-pauses actives.",
    icon: "🏆"
  }
];

// Mock events data
export const eventsData = [
  { date: '2025-05-10', title: 'Atelier Méditation', status: 'confirmed', attendees: 12 },
  { date: '2025-05-15', title: 'Webinar Gestion du Stress', status: 'pending', attendees: 25 },
  { date: '2025-05-20', title: 'Rétrospective Mensuelle', status: 'confirmed', attendees: 18 }
];

// Mock compliance data
export const complianceData = {
  mfaEnabled: 92,
  lastKeyRotation: '2025-04-15',
  lastPentest: '2025-03-20',
  gdprCompliance: 'Complet',
  dataRetention: 'Conforme',
  certifications: ['ISO 27001', 'RGPD', 'HDS']
};

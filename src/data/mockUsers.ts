import { User, UserRole } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Dubois',
    email: 'alex@example.com',
    role: UserRole.USER,
    avatar: '/avatars/avatar-1.jpg',
    createdAt: '2023-01-15T09:23:45Z',
    created_at: '2023-01-15T09:23:45Z', // Added for compatibility
    emotional_score: 72,
    onboarded: true,
    team_id: 'team-1'
  },
  {
    id: '2',
    name: 'Sophie Lemaire',
    email: 'sophie@example.com',
    role: UserRole.EMPLOYEE,
    avatar: '/avatars/avatar-2.jpg',
    createdAt: '2023-02-28T11:12:30Z',
    created_at: '2023-02-28T11:12:30Z', // Added for compatibility
    emotional_score: 60,
    onboarded: true,
    team_id: 'team-1'
  },
  {
    id: '3',
    name: 'Pierre Garnier',
    email: 'pierre@example.com',
    role: UserRole.ANALYST,
    avatar: '/avatars/avatar-3.jpg',
    createdAt: '2023-03-05T16:55:00Z',
    created_at: '2023-03-05T16:55:00Z', // Added for compatibility
    emotional_score: 55,
    onboarded: true,
    team_id: 'team-2'
  },
  {
    id: '4',
    name: 'Léa Martin',
    email: 'lea@example.com',
    role: UserRole.MANAGER,
    avatar: '/avatars/avatar-4.jpg',
    createdAt: '2023-03-12T14:45:10Z',
    created_at: '2023-03-12T14:45:10Z', // Added for compatibility
    emotional_score: 88,
    onboarded: true,
    team_id: 'team-2'
  },
  {
    id: '5',
    name: 'Gabriel Rossi',
    email: 'gabriel@example.com',
    role: UserRole.WELLBEING_MANAGER,
    avatar: '/avatars/avatar-5.jpg',
    createdAt: '2023-04-01T08:00:00Z',
    created_at: '2023-04-01T08:00:00Z', // Added for compatibility
    emotional_score: 92,
    onboarded: true,
    team_id: 'team-3'
  },
  {
    id: '6',
    name: 'Manon Leclerc',
    email: 'manon@example.com',
    role: UserRole.USER,
    avatar: '/avatars/avatar-6.jpg',
    createdAt: '2023-04-18T19:30:00Z',
    created_at: '2023-04-18T19:30:00Z', // Added for compatibility
    emotional_score: 48,
    onboarded: true,
    team_id: 'team-3'
  },
  {
    id: '7',
    name: 'Hugo Bernard',
    email: 'hugo@example.com',
    role: UserRole.EMPLOYEE,
    avatar: '/avatars/avatar-7.jpg',
    createdAt: '2023-05-03T12:20:00Z',
    created_at: '2023-05-03T12:20:00Z', // Added for compatibility
    emotional_score: 78,
    onboarded: true,
    team_id: 'team-1'
  },
  {
    id: '8',
    name: 'Chloé Fournier',
    email: 'chloe@example.com',
    role: UserRole.ANALYST,
    avatar: '/avatars/avatar-8.jpg',
    createdAt: '2023-05-22T21:05:00Z',
    created_at: '2023-05-22T21:05:00Z', // Added for compatibility
    emotional_score: 63,
    onboarded: true,
    team_id: 'team-2'
  },
  {
    id: '9',
    name: 'Adam Girard',
    email: 'adam@example.com',
    role: UserRole.MANAGER,
    avatar: '/avatars/avatar-9.jpg',
    createdAt: '2023-06-10T07:40:00Z',
    created_at: '2023-06-10T07:40:00Z', // Added for compatibility
    emotional_score: 81,
    onboarded: true,
    team_id: 'team-3'
  },
  {
    id: '10',
    name: 'Océane Roux',
    email: 'oceane@example.com',
    role: UserRole.WELLBEING_MANAGER,
    avatar: '/avatars/avatar-10.jpg',
    createdAt: '2023-06-28T13:50:00Z',
    created_at: '2023-06-28T13:50:00Z', // Added for compatibility
    emotional_score: 95,
    onboarded: true,
    team_id: 'team-1'
  },
  {
    id: '11',
    name: 'Lucas Meunier',
    email: 'lucas@example.com',
    role: UserRole.USER,
    avatar: '/avatars/avatar-11.jpg',
    createdAt: '2023-07-15T17:15:00Z',
    created_at: '2023-07-15T17:15:00Z', // Added for compatibility
    emotional_score: 58,
    onboarded: true,
    team_id: 'team-2'
  },
  {
    id: '12',
    name: 'Emma Schneider',
    email: 'emma@example.com',
    role: UserRole.EMPLOYEE,
    avatar: '/avatars/avatar-12.jpg',
    createdAt: '2023-08-02T06:30:00Z',
    created_at: '2023-08-02T06:30:00Z', // Added for compatibility
    emotional_score: 70,
    onboarded: true,
    team_id: 'team-3'
  },
  {
    id: '13',
    name: 'Nathan Moreau',
    email: 'nathan@example.com',
    role: UserRole.ANALYST,
    avatar: '/avatars/avatar-13.jpg',
    createdAt: '2023-08-20T20:00:00Z',
    created_at: '2023-08-20T20:00:00Z', // Added for compatibility
    emotional_score: 66,
    onboarded: true,
    team_id: 'team-1'
  },
  {
    id: '14',
    name: 'Clara Garcia',
    email: 'clara@example.com',
    role: UserRole.MANAGER,
    avatar: '/avatars/avatar-14.jpg',
    createdAt: '2023-09-07T10:45:00Z',
    created_at: '2023-09-07T10:45:00Z', // Added for compatibility
    emotional_score: 84,
    onboarded: true,
    team_id: 'team-2'
  },
  {
    id: '15',
    name: 'Théo Chevalier',
    email: 'theo@example.com',
    role: UserRole.WELLBEING_MANAGER,
    avatar: '/avatars/avatar-15.jpg',
    createdAt: '2023-09-25T15:20:00Z',
    created_at: '2023-09-25T15:20:00Z', // Added for compatibility
    emotional_score: 90,
    onboarded: true,
    team_id: 'team-3'
  }
];

// Fix generateMockUsers function to use the UserRole enum
export const generateMockUsers = (count: number): User[] => {
  const mockAvatarUrls = [
    '/avatars/avatar-1.jpg',
    '/avatars/avatar-2.jpg',
    '/avatars/avatar-3.jpg',
    '/avatars/avatar-4.jpg',
    '/avatars/avatar-5.jpg',
    '/avatars/avatar-6.jpg',
    '/avatars/avatar-7.jpg',
    '/avatars/avatar-8.jpg',
    '/avatars/avatar-9.jpg',
    '/avatars/avatar-10.jpg',
    '/avatars/avatar-11.jpg',
    '/avatars/avatar-12.jpg',
    '/avatars/avatar-13.jpg',
    '/avatars/avatar-14.jpg',
    '/avatars/avatar-15.jpg',
  ];

  return Array.from({ length: count }, (_, i) => {
    const id = String(i + 16);
    const name = `Utilisateur ${i + 16}`;
    const email = `user${i + 16}@example.com`;
    const roles = [
      UserRole.ADMIN,
      UserRole.USER,
      UserRole.EMPLOYEE,
      UserRole.ANALYST,
      UserRole.WELLBEING_MANAGER,
      UserRole.MANAGER
    ];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const avatar = mockAvatarUrls[i % mockAvatarUrls.length];
    const createdAt = new Date().toISOString();
    const created_at = createdAt; // Added for compatibility
    const emotional_score = Math.floor(Math.random() * 101);
    const onboarded = Math.random() < 0.8;
    const team_id = `team-${(i % 3) + 1}`;

    return {
      id,
      name,
      email,
      role: randomRole,
      avatar,
      createdAt,
      created_at,
      emotional_score,
      onboarded,
      team_id
    };
  });
};

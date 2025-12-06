// @ts-nocheck

import { v4 as uuidv4 } from 'uuid';

const generatePastDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const mockUsers = [
  { id: "user1", name: "Sophie Martin", avatar: "/images/avatars/avatar1.jpg" },
  { id: "user2", name: "Thomas Bernard", avatar: "/images/avatars/avatar2.jpg" },
  { id: "user3", name: "Emma Dubois", avatar: "/images/avatars/avatar3.jpg" },
  { id: "user4", name: "Lucas Moreau", avatar: "/images/avatars/avatar4.jpg" },
];

const mockPosts = [
  {
    id: uuidv4(),
    user_id: "user1",
    user: mockUsers[0],
    content: "J'ai essayé une nouvelle technique de méditation aujourd'hui qui a vraiment amélioré mon humeur !",
    created_at: generatePastDate(1),
    likes: 15,
    comments_count: 3,
    tags: ["méditation", "bien-être"],
    emotion: "happy"
  },
  {
    id: uuidv4(),
    user_id: "user2",
    user: mockUsers[1],
    content: "Quelqu'un a-t-il des conseils pour gérer le stress au travail ? J'ai du mal ces derniers temps.",
    created_at: generatePastDate(2),
    likes: 7,
    comments_count: 5,
    tags: ["stress", "travail", "conseils"],
    emotion: "stressed"
  },
  {
    id: uuidv4(),
    user_id: "user3",
    user: mockUsers[2],
    content: "Je viens de terminer ma première session de réalité virtuelle thérapeutique. C'était incroyable !",
    created_at: generatePastDate(3),
    likes: 23,
    comments_count: 8,
    tags: ["VR", "thérapie"],
    emotion: "excited"
  },
  {
    id: uuidv4(),
    user_id: "user4",
    user: mockUsers[3],
    content: "J'ai atteint mon objectif de 30 jours de pratique de pleine conscience. Je me sens tellement plus centré et calme.",
    created_at: generatePastDate(5),
    likes: 19,
    comments_count: 4,
    tags: ["pleine conscience", "objectifs", "réussite"],
    emotion: "calm"
  },
  {
    id: uuidv4(),
    user_id: "user1",
    user: mockUsers[0],
    content: "Je traverse une période difficile après un changement majeur dans ma vie. Comment avez-vous géré des situations similaires ?",
    created_at: generatePastDate(7),
    likes: 12,
    comments_count: 9,
    tags: ["changement", "adaptation", "soutien"],
    emotion: "sad"
  }
];

export default mockPosts;

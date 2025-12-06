// @ts-nocheck

import { v4 as uuidv4 } from 'uuid';

const generatePastDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const mockJournalEntries = [
  {
    id: uuidv4(),
    title: "Journée productive",
    content: "Aujourd'hui a été une journée très productive. J'ai terminé plusieurs tâches importantes et je me sens satisfait de mes progrès.",
    emotion: "happy",
    emotion_score: 0.8,
    date: generatePastDate(1),
    tags: ["travail", "productivité", "satisfaction"],
    user_id: "mock-user-1"
  },
  {
    id: uuidv4(),
    title: "Difficultés avec le projet",
    content: "Je suis confronté à des défis importants dans mon projet actuel. Les solutions ne sont pas évidentes et cela me stresse.",
    emotion: "stressed",
    emotion_score: 0.6,
    date: generatePastDate(3),
    tags: ["travail", "stress", "problèmes"],
    user_id: "mock-user-1"
  },
  {
    id: uuidv4(),
    title: "Weekend relaxant",
    content: "J'ai passé un excellent weekend à me reposer et à profiter de mes proches. Je me sens rechargé pour la semaine à venir.",
    emotion: "calm",
    emotion_score: 0.9,
    date: generatePastDate(5),
    tags: ["weekend", "détente", "famille"],
    user_id: "mock-user-1"
  },
  {
    id: uuidv4(),
    title: "Déception professionnelle",
    content: "J'ai reçu une mauvaise nouvelle au travail aujourd'hui. Je suis déçu mais je dois rester positif.",
    emotion: "sad",
    emotion_score: 0.4,
    date: generatePastDate(7),
    tags: ["travail", "déception"],
    user_id: "mock-user-1"
  },
  {
    id: uuidv4(),
    title: "Nouvelle opportunité",
    content: "Une nouvelle opportunité s'est présentée. Je suis enthousiaste mais aussi un peu anxieux face à ce changement potentiel.",
    emotion: "excited",
    emotion_score: 0.7,
    date: generatePastDate(10),
    tags: ["opportunité", "changement", "carrière"],
    user_id: "mock-user-1"
  }
];

export default mockJournalEntries;

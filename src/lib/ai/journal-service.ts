// @ts-nocheck
import { EmotionRecommendation } from '@/types/emotion';
import { logger } from '@/lib/logger';

// Mock function to simulate fetching journal entries from a database
const mockJournalEntries = [
  {
    id: '1',
    userId: 'user123',
    date: '2024-07-25',
    content: 'Aujourd\'hui, je me suis senti particulièrement joyeux après avoir terminé un projet difficile. J\'ai passé du temps avec mes amis et nous avons bien ri.',
    emotion: 'joy',
    tags: ['travail', 'amis', 'joie']
  },
  {
    id: '2',
    userId: 'user123',
    date: '2024-07-24',
    content: 'J\'étais un peu triste aujourd\'hui car j\'ai manqué un appel important. J\'ai essayé de me remonter le moral en regardant un film.',
    emotion: 'sadness',
    tags: ['travail', 'déception', 'film']
  },
  {
    id: '3',
    userId: 'user123',
    date: '2024-07-23',
    content: 'J\'étais en colère à cause d\'un malentendu avec un collègue. J\'ai pris une longue marche pour me calmer.',
    emotion: 'anger',
    tags: ['travail', 'colère', 'marche']
  },
  {
    id: '4',
    userId: 'user123',
    date: '2024-07-22',
    content: 'J\'ai ressenti de l\'anxiété à propos d\'une présentation à venir. J\'ai pratiqué ma présentation plusieurs fois pour me sentir plus préparé.',
    emotion: 'anxiety',
    tags: ['travail', 'anxiété', 'préparation']
  },
  {
    id: '5',
    userId: 'user123',
    date: '2024-07-21',
    content: 'J\'ai été surpris par une visite inattendue d\'un vieil ami. Nous avons passé des heures à discuter et à nous remémorer le passé.',
    emotion: 'surprise',
    tags: ['amis', 'surprise', 'retrouvailles']
  }
];

// Function to fetch journal entries for a specific user
export const getJournalEntriesForUser = (userId: string) => {
  return mockJournalEntries.filter(entry => entry.userId === userId);
};

// Function to fetch a specific journal entry by ID
export const getJournalEntryById = (id: string) => {
  return mockJournalEntries.find(entry => entry.id === id);
};

// Function to simulate saving a journal entry
export const saveJournalEntry = (entry: any) => {
  // In a real application, this would save the entry to a database
  logger.info('Saving journal entry', { id: entry.id }, 'API');
  return { ...entry, id: Math.random().toString(36).substring(7) }; // Simulate ID generation
};

// Function to simulate deleting a journal entry
export const deleteJournalEntry = (id: string) => {
  // In a real application, this would delete the entry from a database
  logger.info('Deleting journal entry with ID', { id }, 'API');
  return true;
};

// Function to get emotion recommendations based on the detected emotion
const getRecommendationsForEmotion = (emotion: string): EmotionRecommendation[] => {
  switch (emotion.toLowerCase()) {
    case 'joy':
    case 'happy':
    case 'happiness':
      return [
        { id: '1', type: 'activity', title: 'Partager votre joie', description: 'Partagez ce qui vous rend heureux avec un proche.' },
        { id: '2', type: 'activity', title: 'Créer un souvenir', description: 'Prenez une photo ou écrivez ce moment pour vous en souvenir plus tard.' },
        { id: '3', type: 'activity', title: 'Exprimer votre gratitude', description: 'Faites une liste de 3 choses qui vous font vous sentir reconnaissant aujourd\'hui.' }
      ];
    case 'sad':
    case 'sadness':
      return [
        { id: '4', type: 'reflection', title: 'Accepter l\'émotion', description: 'Donnez-vous la permission de ressentir cette tristesse sans jugement.' },
        { id: '5', type: 'activity', title: 'Pratiquer l\'auto-compassion', description: 'Parlez-vous comme vous parleriez à un ami qui traverse une période difficile.' },
        { id: '6', type: 'activity', title: 'Contacter un proche', description: 'Partagez ce que vous ressentez avec quelqu\'un en qui vous avez confiance.' }
      ];
    case 'angry':
    case 'anger':
      return [
        { id: '7', type: 'activity', title: 'Respiration profonde', description: 'Prenez 5 respirations lentes et profondes en vous concentrant uniquement sur votre souffle.' },
        { id: '8', type: 'reflection', title: 'Explorer les causes', description: 'Qu\'est-ce qui a déclenché cette colère? Est-ce que cette réaction est proportionnée?' },
        { id: '9', type: 'activity', title: 'Exercice physique', description: 'Faites une courte marche ou quelques étirements pour libérer la tension.' }
      ];
    case 'fear':
    case 'anxious':
    case 'anxiety':
      return [
        { id: '10', type: 'activity', title: 'Ancrage dans le présent', description: 'Nommez 5 choses que vous pouvez voir, 4 que vous pouvez toucher, 3 que vous pouvez entendre, 2 que vous pouvez sentir, 1 que vous pouvez goûter.' },
        { id: '11', type: 'reflection', title: 'Challenger vos pensées', description: 'Identifiez une pensée anxieuse et demandez-vous si elle est basée sur des faits.' },
        { id: '12', type: 'activity', title: 'Méditation guidée', description: 'Essayez une courte méditation de pleine conscience de 5 minutes.' }
      ];
    case 'surprise':
    case 'surprised':
      return [
        { id: '13', type: 'reflection', title: 'Explorer la nouveauté', description: 'Qu\'est-ce qui vous a surpris et qu\'avez-vous appris de cette expérience?' },
        { id: '14', type: 'activity', title: 'Rester ouvert', description: 'Prenez un moment pour apprécier l\'inattendu et l\'imprévisibilité de la vie.' },
        { id: '15', type: 'activity', title: 'Partager votre expérience', description: 'Racontez cette surprise à quelqu\'un d\'autre pour voir sa perspective.' }
      ];
    default:
      return [
        { id: '16', type: 'reflection', title: 'Explorer vos émotions', description: 'Prenez un moment pour identifier ce que vous ressentez exactement.' },
        { id: '17', type: 'activity', title: 'Journal émotionnel', description: 'Écrivez librement pendant 5 minutes sur ce que vous ressentez actuellement.' },
        { id: '18', type: 'activity', title: 'Respiration consciente', description: 'Concentrez-vous sur votre respiration pendant quelques minutes pour vous recentrer.' }
      ];
  }
};

// Function to fetch recommendations for a specific emotion
export const getEmotionRecommendations = (emotion: string): EmotionRecommendation[] => {
  return getRecommendationsForEmotion(emotion);
};

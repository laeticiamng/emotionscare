import { CommunityEvent } from '@/types/community';

export const fetchCommunityEvents = async (): Promise<CommunityEvent[]> => {
  // In a real implementation, this would fetch events from an API or database
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    {
      id: 'event-1',
      title: 'Défi méditation collective',
      description: '10 minutes de méditation guidée ensemble',
      date: new Date().toISOString(),
      location: 'En ligne',
      participants: 42
    },
    {
      id: 'event-2',
      title: 'Challenge activité physique',
      description: 'Bougez 5 000 pas avec la communauté',
      date: new Date(Date.now() + 86400000).toISOString(),
      location: 'Partout',
      participants: 58
    },
    {
      id: 'event-3',
      title: 'Live questions bien-être',
      description: 'Session de questions/réponses avec un expert',
      date: new Date(Date.now() + 172800000).toISOString(),
      location: 'En ligne',
      participants: 33
    }
  ];
};

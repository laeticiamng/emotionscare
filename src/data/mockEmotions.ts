
import { Emotion } from '@/types';

// Mock emotions data
export const mockEmotions: Emotion[] = [
  {
    id: 'emotion-1',
    user_id: 'user-1',
    date: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    emotion: 'calm',
    name: 'calm',
    sentiment: 8,
    anxiety: 2,
    energy: 5,
    text: "J'ai passé une bonne journée aujourd'hui, je me sens assez détendu.",
    score: 8,
    intensity: 0.6
  },
  {
    id: 'emotion-2',
    user_id: 'user-1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    emotion: 'focused',
    name: 'focused',
    sentiment: 7,
    anxiety: 3,
    energy: 7,
    text: "J'ai été très productif aujourd'hui et j'ai atteint la plupart de mes objectifs.",
    score: 7,
    intensity: 0.8
  },
  {
    id: 'emotion-3',
    user_id: 'user-1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    emotion: 'stressed',
    name: 'stressed',
    sentiment: 4,
    anxiety: 8,
    energy: 6,
    text: "Journée difficile avec beaucoup de pression et de délais serrés.",
    score: 4,
    intensity: 0.9
  },
  {
    id: 'emotion-4',
    user_id: 'user-1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    emotion: 'happy',
    name: 'happy',
    sentiment: 9,
    anxiety: 1,
    energy: 8,
    text: "J'ai reçu de très bonnes nouvelles aujourd'hui et je me sens plein d'espoir.",
    score: 9,
    intensity: 0.9
  },
  {
    id: 'emotion-5',
    user_id: 'user-1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    emotion: 'tired',
    name: 'tired',
    sentiment: 5,
    anxiety: 4,
    energy: 3,
    text: "Je me sens épuisé après une semaine intense.",
    score: 5,
    intensity: 0.7
  },
  {
    id: 'emotion-6',
    user_id: 'user-2',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    emotion: 'anxious',
    name: 'anxious',
    sentiment: 3,
    anxiety: 9,
    energy: 7,
    text: "Je m'inquiète pour la présentation de demain.",
    score: 3,
    intensity: 0.8
  },
  {
    id: 'emotion-7',
    user_id: 'user-2',
    date: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
    emotion: 'excited',
    name: 'excited',
    sentiment: 9,
    anxiety: 3,
    energy: 9,
    text: "J'ai hâte de commencer ce nouveau projet!",
    score: 9,
    intensity: 0.9
  },
  {
    id: 'emotion-8',
    user_id: 'user-2',
    date: new Date(Date.now() - 1000 * 60 * 60 * 49).toISOString(),
    emotion: 'frustrated',
    name: 'frustrated',
    sentiment: 3,
    anxiety: 7,
    energy: 6,
    text: "Les choses ne se passent pas comme prévu sur ce projet.",
    score: 3,
    intensity: 0.7
  },
  {
    id: 'emotion-9',
    user_id: 'user-3',
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    emotion: 'grateful',
    name: 'grateful',
    sentiment: 8,
    anxiety: 2,
    energy: 6,
    text: "Je me sens reconnaissant pour le soutien de mon équipe aujourd'hui.",
    score: 8,
    intensity: 0.6
  },
  {
    id: 'emotion-10',
    user_id: 'user-3',
    date: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    emotion: 'confident',
    name: 'confident',
    sentiment: 8,
    anxiety: 2,
    energy: 7,
    text: "Je me sens prêt à affronter les défis de cette semaine.",
    score: 8,
    intensity: 0.7
  }
];

export default mockEmotions;

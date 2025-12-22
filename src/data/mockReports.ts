
import { Report } from '../types/report';

// Mock reports data
export const mockReports: Report[] = [
  {
    id: 'report-1',
    title: 'Rapport hebdomadaire bien-être',
    type: 'weekly',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    period: 'week',
    data: {
      emotionScores: [
        { day: 'Lundi', score: 65 },
        { day: 'Mardi', score: 70 },
        { day: 'Mercredi', score: 75 },
        { day: 'Jeudi', score: 68 },
        { day: 'Vendredi', score: 80 }
      ]
    },
    metrics: [
      { name: 'Score moyen', value: 71.6, change: 3.5 },
      { name: 'Pic émotionnel', value: 80, change: 5 },
      { name: 'Variations', value: 15, change: -2 }
    ],
    description: 'Analyse hebdomadaire de votre bien-être émotionnel',
    user_id: 'user-1',
    summary: 'Votre semaine a montré une tendance positive avec une amélioration notable le vendredi.'
  },
  {
    id: 'report-2',
    title: 'Rapport mensuel bien-être',
    type: 'monthly',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    period: 'month',
    data: {
      weeklyScores: [
        { week: 'Semaine 1', score: 68 },
        { week: 'Semaine 2', score: 72 },
        { week: 'Semaine 3', score: 75 },
        { week: 'Semaine 4', score: 79 }
      ]
    },
    metrics: [
      { name: 'Score moyen', value: 73.5, change: 5.2 },
      { name: 'Tendance', value: 11, change: 7 },
      { name: 'Jours difficiles', value: 3, change: -2 }
    ],
    description: 'Analyse mensuelle détaillée de votre bien-être',
    user_id: 'user-1',
    summary: 'Vous avez connu une amélioration constante de votre bien-être tout au long du mois.'
  }
];

export default mockReports;

import { MoodData, Report } from '../types';

// Mock report data for development and testing
export const mockReports: Report[] = [
  {
    id: '1',
    date: '2023-04-07T00:00:00Z',
    title: 'Rapport hebdomadaire',
    data: {
      metrics: {
        absenteeism: 3.5,
        changePct: -2.1,
      }
    },
    type: 'weekly',
    user_id: '1',
    summary: 'Résumé des indicateurs de performance',
    mood_score: 75,
    categories: ['travail', 'stress'],
    recommendations: ['Prendre des pauses régulières'],
    metric: 'absenteeism',
    period_start: '2023-04-01T00:00:00Z',
    period_end: '2023-04-07T00:00:00Z',
    value: 3.5,
    change_pct: -2.1,
  },
  {
    id: '2',
    date: '2023-04-14T00:00:00Z',
    title: 'Rapport hebdomadaire',
    data: {
      metrics: {
        absenteeism: 3.2,
        changePct: -8.6,
      }
    },
    type: 'weekly',
    user_id: '1',
    summary: 'Résumé des indicateurs de performance',
    mood_score: 82,
    categories: ['travail', 'productivité'],
    recommendations: ['Continuer les sessions VR'],
    metric: 'absenteeism',
    period_start: '2023-04-08T00:00:00Z',
    period_end: '2023-04-14T00:00:00Z',
    value: 3.2,
    change_pct: -8.6,
  },
  {
    id: '3',
    date: '2023-04-07T00:00:00Z',
    title: 'Rapport de productivité',
    data: {
      metrics: {
        productivity: 87.3,
        changePct: 1.5,
      }
    },
    type: 'productivity',
    user_id: '1',
    summary: 'Analyse de votre productivité',
    mood_score: 70,
    categories: ['travail', 'productivité'],
    recommendations: ['Essayer la technique Pomodoro'],
    metric: 'productivity',
    period_start: '2023-04-01T00:00:00Z',
    period_end: '2023-04-07T00:00:00Z',
    value: 87.3,
    change_pct: 1.5,
  },
  {
    id: '4',
    date: '2023-04-14T00:00:00Z',
    title: 'Rapport de productivité',
    data: {
      metrics: {
        productivity: 89.7,
        changePct: 2.7,
      }
    },
    type: 'productivity',
    user_id: '1',
    summary: 'Analyse de votre productivité',
    mood_score: 85,
    categories: ['travail', 'bien-être'],
    recommendations: ['Maintenir les habitudes actuelles'],
    metric: 'productivity',
    period_start: '2023-04-08T00:00:00Z',
    period_end: '2023-04-14T00:00:00Z',
    value: 89.7,
    change_pct: 2.7,
  },
];

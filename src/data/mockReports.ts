
import { Report } from '../types';

// Mock report data for development and testing
export const mockReports: Report[] = [
  {
    id: '1',
    date: '2023-04-07T00:00:00Z',
    created_at: '2023-04-07T00:00:00Z',
    title: 'Rapport hebdomadaire',
    type: 'weekly',
    period: 'weekly',
    data: {},
    metrics: [
      {
        name: 'absenteeism',
        value: 3.5,
        change: -2.1,
      }
    ],
    description: 'Rapport hebdomadaire sur l\'absentéisme',
    // Additional fields used in code
    user_id: '1',
    summary: 'Résumé des indicateurs de performance',
    mood_score: 75,
    categories: ['travail', 'stress'],
    recommendations: ['Prendre des pauses régulières'],
    metric: 'absenteeism',
    period_start: '2023-04-01T00:00:00Z',
    period_end: '2023-04-07T00:00:00Z',
    value: 3.5,
    change_pct: -2.1
  },
  {
    id: '2',
    date: '2023-04-14T00:00:00Z',
    created_at: '2023-04-14T00:00:00Z',
    title: 'Rapport hebdomadaire',
    type: 'weekly',
    period: 'weekly',
    data: {},
    metrics: [
      {
        name: 'absenteeism',
        value: 3.2,
        change: -8.6,
      }
    ],
    description: 'Rapport hebdomadaire sur l\'absentéisme',
    // Additional fields used in code
    user_id: '1',
    summary: 'Résumé des indicateurs de performance',
    mood_score: 82,
    categories: ['travail', 'productivité'],
    recommendations: ['Continuer les sessions VR'],
    metric: 'absenteeism',
    period_start: '2023-04-08T00:00:00Z',
    period_end: '2023-04-14T00:00:00Z',
    value: 3.2,
    change_pct: -8.6
  },
  {
    id: '3',
    date: '2023-04-07T00:00:00Z',
    created_at: '2023-04-07T00:00:00Z',
    title: 'Rapport de productivité',
    type: 'productivity',
    period: 'weekly',
    data: {},
    metrics: [
      {
        name: 'productivity',
        value: 87.3,
        change: 1.5,
      }
    ],
    description: 'Rapport sur la productivité',
    // Additional fields used in code
    user_id: '1',
    summary: 'Analyse de votre productivité',
    mood_score: 70,
    categories: ['travail', 'productivité'],
    recommendations: ['Essayer la technique Pomodoro'],
    metric: 'productivity',
    period_start: '2023-04-01T00:00:00Z',
    period_end: '2023-04-07T00:00:00Z',
    value: 87.3,
    change_pct: 1.5
  },
  {
    id: '4',
    date: '2023-04-14T00:00:00Z',
    created_at: '2023-04-14T00:00:00Z',
    title: 'Rapport de productivité',
    type: 'productivity',
    period: 'weekly',
    data: {},
    metrics: [
      {
        name: 'productivity',
        value: 89.7,
        change: 2.7,
      }
    ],
    description: 'Rapport sur la productivité',
    // Additional fields used in code
    user_id: '1',
    summary: 'Analyse de votre productivité',
    mood_score: 85,
    categories: ['travail', 'bien-être'],
    recommendations: ['Maintenir les habitudes actuelles'],
    metric: 'productivity',
    period_start: '2023-04-08T00:00:00Z',
    period_end: '2023-04-14T00:00:00Z',
    value: 89.7,
    change_pct: 2.7
  },
];

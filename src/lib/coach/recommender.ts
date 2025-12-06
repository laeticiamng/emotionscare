// @ts-nocheck

import { EmotionalData } from '@/types/emotional-data';

// Type pour une recommandation
export interface Recommendation {
  type: 'activity' | 'music' | 'meditation' | 'journal' | 'social' | 'physical';
  title: string;
  description: string;
  duration?: number; // durée en minutes
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  imageUrl?: string;
}

// Générer une recommandation basée sur les données émotionnelles
export const generateRecommendation = (emotionalData: EmotionalData): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  const emotion = emotionalData.emotion.toLowerCase();
  const intensity = emotionalData.intensity;
  
  // Recommandations basées sur l'émotion
  switch(emotion) {
    case 'stressed':
    case 'anxious':
    case 'overwhelmed':
      recommendations.push({
        type: 'meditation',
        title: 'Méditation de pleine conscience',
        description: 'Une session de 5 minutes pour vous aider à vous recentrer et réduire l\'anxiété.',
        duration: 5,
        difficulty: 'easy',
        tags: ['mindfulness', 'calm', 'focus']
      });
      recommendations.push({
        type: 'music',
        title: 'Playlist relaxante',
        description: 'Musique douce pour apaiser votre esprit et réduire le stress.',
        tags: ['calm', 'instrumental', 'nature']
      });
      break;
      
    case 'sad':
    case 'depressed':
    case 'low':
      recommendations.push({
        type: 'social',
        title: 'Connectez-vous avec un ami',
        description: 'Prendre contact avec quelqu\'un qui vous fait vous sentir bien peut améliorer votre humeur.',
        tags: ['connection', 'support']
      });
      recommendations.push({
        type: 'physical',
        title: 'Petite marche en plein air',
        description: 'Une marche de 10 minutes peut libérer des endorphines et améliorer votre humeur.',
        duration: 10,
        difficulty: 'easy',
        tags: ['nature', 'movement', 'energy']
      });
      break;
      
    case 'angry':
    case 'frustrated':
    case 'irritated':
      recommendations.push({
        type: 'physical',
        title: 'Exercice d\'exutoire',
        description: 'Un exercice physique court mais intense pour libérer votre énergie négative.',
        duration: 15,
        difficulty: 'medium',
        tags: ['energy', 'release', 'focus']
      });
      recommendations.push({
        type: 'journal',
        title: 'Journal de gratitude',
        description: 'Prenez un moment pour noter trois choses pour lesquelles vous êtes reconnaissant.',
        duration: 5,
        tags: ['reflection', 'perspective', 'calm']
      });
      break;
      
    case 'happy':
    case 'excited':
    case 'joyful':
      recommendations.push({
        type: 'social',
        title: 'Partagez votre joie',
        description: 'C\'est un bon moment pour partager votre énergie positive avec votre communauté.',
        tags: ['sharing', 'connection', 'community']
      });
      recommendations.push({
        type: 'journal',
        title: 'Capturez ce moment',
        description: 'Notez ce qui vous rend heureux aujourd\'hui pour vous en souvenir plus tard.',
        tags: ['reflection', 'memory', 'positive']
      });
      break;
      
    case 'tired':
    case 'exhausted':
    case 'fatigued':
      recommendations.push({
        type: 'meditation',
        title: 'Pause régénératrice',
        description: 'Une courte méditation pour vous aider à récupérer de l\'énergie.',
        duration: 7,
        difficulty: 'easy',
        tags: ['energy', 'rest', 'rejuvenation']
      });
      recommendations.push({
        type: 'music',
        title: 'Sons apaisants',
        description: 'Musique douce pour vous aider à vous détendre et récupérer.',
        tags: ['rest', 'calm', 'sleep']
      });
      break;
      
    case 'calm':
    case 'content':
    case 'peaceful':
    default:
      recommendations.push({
        type: 'meditation',
        title: 'Maintien de l\'équilibre',
        description: 'Une méditation pour maintenir votre état d\'équilibre actuel.',
        duration: 10,
        tags: ['balance', 'mindfulness', 'presence']
      });
      recommendations.push({
        type: 'journal',
        title: 'Réflexions équilibrées',
        description: 'Un moment pour réfléchir sur ce qui contribue à votre état d\'équilibre actuel.',
        tags: ['reflection', 'awareness', 'balance']
      });
  }
  
  // Adaptation des recommandations en fonction de l'intensité
  if (intensity > 7) {
    recommendations.push({
      type: 'activity',
      title: 'Exercice de régulation émotionnelle',
      description: 'Une technique pour vous aider à réguler l\'intensité de vos émotions.',
      duration: 5,
      difficulty: 'medium',
      tags: ['regulation', 'balance', 'technique']
    });
  }
  
  return recommendations;
};

export default generateRecommendation;

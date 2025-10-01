// @ts-nocheck

import { v4 as uuid } from 'uuid';

interface EmotionAnalysisResult {
  emotion: string;
  score: number;
}

// Mock function to analyze text emotions
export async function analyzeTextEmotion(text: string): Promise<EmotionAnalysisResult[]> {
  // Simulate analysis delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Define keywords for basic emotion detection
  const emotionKeywords: Record<string, string[]> = {
    'happy': ['happy', 'good', 'great', 'excellent', 'joy', 'content', 'pleased', 'heureux', 'joyeux', 'content'],
    'sad': ['sad', 'unhappy', 'depressed', 'down', 'low', 'upset', 'triste', 'déprimé', 'malheureux'],
    'angry': ['angry', 'frustrated', 'annoyed', 'irritated', 'upset', 'en colère', 'frustré', 'irrité', 'énervé'],
    'fearful': ['afraid', 'scared', 'fearful', 'nervous', 'worried', 'anxious', 'peur', 'effrayé', 'inquiet', 'anxieux'],
    'surprised': ['surprised', 'amazed', 'astonished', 'shocked', 'surprise', 'étonné', 'stupéfait'],
    'disgusted': ['disgusted', 'repulsed', 'revolted', 'dégoûté', 'répugnant'],
    'neutral': ['okay', 'fine', 'neutral', 'normal', 'ok', 'bien', 'neutre', 'normal', 'correct'],
    'calm': ['calm', 'relaxed', 'peaceful', 'tranquil', 'serene', 'calme', 'détendu', 'paisible', 'serein'],
    'tired': ['tired', 'exhausted', 'sleepy', 'fatigué', 'épuisé', 'fatigué'],
    'excited': ['excited', 'enthusiastic', 'eager', 'thrilled', 'excité', 'enthousiaste'],
    'bored': ['bored', 'boring', 'uninterested', 'dull', 's\'ennuie', 'ennuyeux'],
    'stressed': ['stressed', 'overwhelmed', 'pressured', 'stressé', 'dépassé', 'sous pression']
  };

  // Convert text to lowercase for matching
  const lowerText = text.toLowerCase();
  
  // Calculate scores for each emotion based on keyword matches
  const scores: Record<string, number> = {};
  
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    const matchCount = keywords.reduce((count, keyword) => {
      // Count occurrences of this keyword in the text
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowerText.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
    
    // Set a base score even if no matches
    scores[emotion] = matchCount > 0 ? 0.3 + (matchCount * 0.1) : 0.1;
  });
  
  // Randomize slightly for more natural results
  Object.keys(scores).forEach(emotion => {
    scores[emotion] += Math.random() * 0.3;
    // Cap at 1.0
    if (scores[emotion] > 1) scores[emotion] = 1;
  });
  
  // If no clear emotion is detected, strengthen 'neutral' 
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore < 0.3) {
    scores['neutral'] = 0.5 + (Math.random() * 0.3);
  }
  
  // Sort emotions by score and return
  return Object.entries(scores)
    .map(([emotion, score]) => ({ emotion, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Return top 3 emotions
}

// Mock function to analyze facial emotions
export async function analyzeFacialEmotion(imageData: string): Promise<EmotionAnalysisResult[]> {
  // Simulate analysis delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Return random emotions
  const emotions = ['happy', 'sad', 'angry', 'fearful', 'surprised', 'disgusted', 'neutral', 'calm'];
  
  // Generate 3 random emotions with scores
  const mainEmotionIndex = Math.floor(Math.random() * emotions.length);
  const mainEmotion = emotions[mainEmotionIndex];
  const mainScore = 0.6 + (Math.random() * 0.4); // Between 0.6 and 1.0
  
  const results: EmotionAnalysisResult[] = [
    { emotion: mainEmotion, score: mainScore }
  ];
  
  // Add some secondary emotions
  emotions.splice(mainEmotionIndex, 1); // Remove main emotion
  for (let i = 0; i < 2; i++) {
    if (emotions.length === 0) break;
    
    const index = Math.floor(Math.random() * emotions.length);
    const emotion = emotions[index];
    // Secondary emotions have lower scores
    const score = Math.random() * 0.6; 
    
    results.push({ emotion, score });
    emotions.splice(index, 1);
  }
  
  return results.sort((a, b) => b.score - a.score);
}

export async function createEmotionReport(emotionData: any) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: uuid(),
    date: new Date().toISOString(),
    dominantEmotion: emotionData.emotion || 'neutral',
    intensity: emotionData.score ? emotionData.score / 100 : 0.5,
    feedback: `Vous semblez être dans un état ${emotionData.emotion || 'neutre'}. ${
      generateFeedbackForEmotion(emotionData.emotion || 'neutral')
    }`,
    recommendations: generateRecommendationsForEmotion(emotionData.emotion || 'neutral')
  };
}

function generateFeedbackForEmotion(emotion: string): string {
  const feedbacks: Record<string, string[]> = {
    'happy': [
      'Votre bonne humeur est une ressource précieuse. Profitez-en pour accomplir des tâches créatives.',
      'Ce sentiment positif peut être partagé avec votre équipe pour créer un environnement de travail dynamique.'
    ],
    'sad': [
      'Il est normal de se sentir triste parfois. Prenez un moment pour identifier la source de cette émotion.',
      'Une courte pause pourrait vous aider à retrouver un meilleur équilibre émotionnel.'
    ],
    'angry': [
      'La colère peut être canalisée de façon constructive. Essayez de prendre du recul avant d\'agir.',
      'Quelques respirations profondes pourraient vous aider à diminuer l\'intensité de cette émotion.'
    ],
    'calm': [
      'Cet état d\'esprit est idéal pour la concentration. C\'est le moment parfait pour les tâches qui demandent de la précision.',
      'Votre calme est précieux. Utilisez-le pour résoudre des problèmes complexes.'
    ],
    'stressed': [
      'Le stress est un signal qu\'il ne faut pas ignorer. Une courte pause pourrait vous aider.',
      'Essayez de décomposer vos tâches en étapes plus petites pour réduire la sensation d\'être dépassé.'
    ],
    'neutral': [
      'Votre état émotionnel équilibré est idéal pour prendre des décisions réfléchies.',
      'C\'est un bon moment pour planifier votre journée ou votre semaine.'
    ]
  };
  
  // Get feedback for this emotion or default to neutral
  const emotionFeedbacks = feedbacks[emotion.toLowerCase()] || feedbacks['neutral'];
  
  // Return a random feedback from the list
  return emotionFeedbacks[Math.floor(Math.random() * emotionFeedbacks.length)];
}

function generateRecommendationsForEmotion(emotion: string): string[] {
  const recommendations: Record<string, string[]> = {
    'happy': [
      'Partagez votre énergie positive avec vos collègues',
      'Profitez de cette dynamique pour avancer sur des projets créatifs',
      'Écoutez une playlist énergique pour maintenir cet élan'
    ],
    'sad': [
      'Prenez une courte pause de 5 minutes pour vous recentrer',
      'Parlez à un collègue ou ami de confiance',
      'Essayez notre exercice de respiration guidée'
    ],
    'angry': [
      'Faites une courte marche pour vous changer les idées',
      'Essayez notre session de respiration profonde de 3 minutes',
      'Reportez les décisions importantes à plus tard si possible'
    ],
    'calm': [
      'C\'est le moment idéal pour les tâches demandant de la concentration',
      'Envisagez de bloquer ce temps pour avancer sur un projet important',
      'Notre playlist "Focus" pourrait vous aider à maintenir cet état'
    ],
    'stressed': [
      'Essayez notre session de micro-méditation de 2 minutes',
      'Réorganisez votre liste de tâches par priorité',
      'Une courte pause en extérieur pourrait vous aider à vous ressourcer'
    ],
    'neutral': [
      'C\'est un bon moment pour planifier votre journée',
      'Essayez une session de brainstorming sur un projet en cours',
      'Notre playlist "Inspiration douce" pourrait stimuler légèrement votre créativité'
    ]
  };
  
  // Get recommendations for this emotion or default to neutral
  const emotionRecs = recommendations[emotion.toLowerCase()] || recommendations['neutral'];
  
  // Return all recommendations for this emotion
  return emotionRecs;
}

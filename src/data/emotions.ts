
export interface EmotionData {
  name: string;
  intensity?: number;
  color: string;
  icon?: string;
  description?: string;
  recommendations?: string[];
}

export const emotionsList: EmotionData[] = [
  { 
    name: 'joie', 
    color: '#FFD700',
    description: 'Sentiment de bonheur et de contentement',
    recommendations: ['Partagez ce moment avec vos proches', 'Notez ce qui vous rend heureux']
  },
  { 
    name: 'tristesse', 
    color: '#6495ED',
    description: 'Sentiment de chagrin ou de mélancolie',
    recommendations: ['Prenez du temps pour vous', 'Parlez à quelqu\'un de confiance']
  },
  { 
    name: 'colère', 
    color: '#FF4500',
    description: 'Sentiment d\'irritation ou de frustration',
    recommendations: ['Respirez profondément', 'Exprimez votre ressenti calmement']
  },
  { 
    name: 'peur', 
    color: '#800080',
    description: 'Sentiment d\'anxiété ou d\'appréhension',
    recommendations: ['Pratiquez la pleine conscience', 'Identifiez la source de votre peur']
  },
  { 
    name: 'surprise', 
    color: '#FF69B4',
    description: 'Sentiment d\'étonnement ou de stupéfaction',
    recommendations: ['Prenez le temps d\'assimiler l\'information', 'Notez votre ressenti']
  },
  { 
    name: 'dégoût', 
    color: '#32CD32',
    description: 'Sentiment d\'aversion ou de répulsion',
    recommendations: ['Éloignez-vous de la source du dégoût', 'Concentrez-vous sur des pensées positives']
  },
  { 
    name: 'neutre', 
    color: '#A9A9A9',
    description: 'Absence d\'émotion particulière',
    recommendations: ['Faites un bilan de votre journée', 'Essayez une nouvelle activité']
  },
  { 
    name: 'calme', 
    color: '#87CEEB',
    description: 'Sentiment de sérénité et de tranquillité',
    recommendations: ['Profitez de cet état pour méditer', 'Faites une activité relaxante']
  }
];

export const intensityLevels = [
  { value: 1, label: 'Très faible' },
  { value: 2, label: 'Faible' },
  { value: 3, label: 'Modéré' },
  { value: 4, label: 'Élevé' },
  { value: 5, label: 'Très élevé' }
];

export function getEmotionByName(name: string): EmotionData | undefined {
  return emotionsList.find(emotion => 
    emotion.name.toLowerCase() === name.toLowerCase()
  );
}

export function getEmotionColor(name: string): string {
  const emotion = getEmotionByName(name);
  return emotion?.color || '#A9A9A9'; // Default gray if not found
}

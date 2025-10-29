// @ts-nocheck

export const primaryEmotions = [
  // Positives haute énergie
  { name: 'joy', label: 'Joie', emoji: '😊', color: '#FFD700' },
  { name: 'excitation', label: 'Excitation', emoji: '🤩', color: '#FF6B35' },
  { name: 'amusement', label: 'Amusement', emoji: '😄', color: '#FFA500' },
  { name: 'fierté', label: 'Fierté', emoji: '😌', color: '#DAA520' },
  { name: 'admiration', label: 'Admiration', emoji: '🤗', color: '#FFB347' },
  { name: 'détermination', label: 'Détermination', emoji: '💪', color: '#FF8C00' },
  
  // Positives basse énergie
  { name: 'calm', label: 'Calme', emoji: '😌', color: '#87CEEB' },
  { name: 'sérénité', label: 'Sérénité', emoji: '🧘', color: '#B0E0E6' },
  { name: 'satisfaction', label: 'Satisfaction', emoji: '😊', color: '#98D8C8' },
  { name: 'contentement', label: 'Contentement', emoji: '☺️', color: '#90EE90' },
  
  // Négatives haute énergie
  { name: 'anger', label: 'Colère', emoji: '😠', color: '#FF4500' },
  { name: 'fear', label: 'Peur', emoji: '😨', color: '#8A2BE2' },
  { name: 'anxiété', label: 'Anxiété', emoji: '😰', color: '#9370DB' },
  { name: 'stress', label: 'Stress', emoji: '😣', color: '#DC143C' },
  { name: 'frustration', label: 'Frustration', emoji: '😤', color: '#CD5C5C' },
  
  // Négatives basse énergie
  { name: 'sadness', label: 'Tristesse', emoji: '😢', color: '#6495ED' },
  { name: 'ennui', label: 'Ennui', emoji: '😑', color: '#778899' },
  { name: 'fatigue', label: 'Fatigue', emoji: '😴', color: '#708090' },
  { name: 'honte', label: 'Honte', emoji: '😳', color: '#BC8F8F' },
  
  // Mixtes
  { name: 'surprise', label: 'Surprise', emoji: '😲', color: '#FF69B4' },
  { name: 'disgust', label: 'Dégoût', emoji: '🤢', color: '#32CD32' },
  { name: 'confusion', label: 'Confusion', emoji: '😕', color: '#B8860B' },
  { name: 'concentration', label: 'Concentration', emoji: '🤔', color: '#4682B4' },
  { name: 'nostalgie', label: 'Nostalgie', emoji: '🥲', color: '#6A5ACD' },
  
  // Neutre
  { name: 'neutral', label: 'Neutre', emoji: '😐', color: '#A9A9A9' }
];

export const getEmotionColor = (emotion: string | undefined): string => {
  if (!emotion) return '#A9A9A9'; // Default gray for undefined
  
  const found = primaryEmotions.find(e => 
    e.name.toLowerCase() === emotion.toLowerCase() || 
    e.label.toLowerCase() === emotion.toLowerCase()
  );
  
  return found?.color || '#A9A9A9';
};

export const emotionColors = {
  // Positives haute énergie
  joy: '#FFD700',
  happiness: '#FFD700',
  excitation: '#FF6B35',
  amusement: '#FFA500',
  fierté: '#DAA520',
  admiration: '#FFB347',
  détermination: '#FF8C00',
  
  // Positives basse énergie
  calm: '#87CEEB',
  sérénité: '#B0E0E6',
  satisfaction: '#98D8C8',
  contentement: '#90EE90',
  
  // Négatives haute énergie
  anger: '#FF4500',
  fear: '#8A2BE2',
  anxiété: '#9370DB',
  anxiety: '#9370DB',
  stress: '#DC143C',
  frustration: '#CD5C5C',
  
  // Négatives basse énergie
  sadness: '#6495ED',
  ennui: '#778899',
  fatigue: '#708090',
  exhaustion: '#708090',
  honte: '#BC8F8F',
  
  // Mixtes
  surprise: '#FF69B4',
  disgust: '#32CD32',
  confusion: '#B8860B',
  concentration: '#4682B4',
  nostalgie: '#6A5ACD',
  
  // Neutre
  neutral: '#A9A9A9',
  
  // Autres
  motivation: '#FFA500',
  hope: '#00CED1',
  gratitude: '#00FA9A'
};

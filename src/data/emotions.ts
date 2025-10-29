// @ts-nocheck

export const primaryEmotions = [
  // Positives haute énergie
  { name: 'joy', label: 'Joie', emoji: '😊', color: '#FFD700' },
  { name: 'excitation', label: 'Excitation', emoji: '🤩', color: '#FF6B35' },
  { name: 'amusement', label: 'Amusement', emoji: '😄', color: '#FFA500' },
  { name: 'fierté', label: 'Fierté', emoji: '😌', color: '#DAA520' },
  { name: 'admiration', label: 'Admiration', emoji: '🤗', color: '#FFB347' },
  { name: 'détermination', label: 'Détermination', emoji: '💪', color: '#FF8C00' },
  { name: 'enthousiasme', label: 'Enthousiasme', emoji: '🎉', color: '#FF1493' },
  { name: 'extase', label: 'Extase', emoji: '😍', color: '#FF00FF' },
  { name: 'émerveillement', label: 'Émerveillement', emoji: '🤩', color: '#FFB6C1' },
  { name: 'inspiration', label: 'Inspiration', emoji: '✨', color: '#FFA07A' },
  
  // Positives basse énergie
  { name: 'calm', label: 'Calme', emoji: '😌', color: '#87CEEB' },
  { name: 'sérénité', label: 'Sérénité', emoji: '🧘', color: '#B0E0E6' },
  { name: 'satisfaction', label: 'Satisfaction', emoji: '😊', color: '#98D8C8' },
  { name: 'contentement', label: 'Contentement', emoji: '☺️', color: '#90EE90' },
  { name: 'soulagement', label: 'Soulagement', emoji: '😅', color: '#ADD8E6' },
  { name: 'tendresse', label: 'Tendresse', emoji: '🥰', color: '#FFB7D5' },
  { name: 'gratitude', label: 'Gratitude', emoji: '🙏', color: '#98FB98' },
  { name: 'espoir', label: 'Espoir', emoji: '🌟', color: '#87CEFA' },
  
  // Négatives haute énergie
  { name: 'anger', label: 'Colère', emoji: '😠', color: '#FF4500' },
  { name: 'fear', label: 'Peur', emoji: '😨', color: '#8A2BE2' },
  { name: 'anxiété', label: 'Anxiété', emoji: '😰', color: '#9370DB' },
  { name: 'stress', label: 'Stress', emoji: '😣', color: '#DC143C' },
  { name: 'frustration', label: 'Frustration', emoji: '😤', color: '#CD5C5C' },
  { name: 'irritation', label: 'Irritation', emoji: '😒', color: '#FA8072' },
  { name: 'jalousie', label: 'Jalousie', emoji: '😠', color: '#228B22' },
  { name: 'envie', label: 'Envie', emoji: '🤨', color: '#32CD32' },
  { name: 'tourment', label: 'Tourment', emoji: '😖', color: '#B22222' },
  
  // Négatives basse énergie
  { name: 'sadness', label: 'Tristesse', emoji: '😢', color: '#6495ED' },
  { name: 'ennui', label: 'Ennui', emoji: '😑', color: '#778899' },
  { name: 'fatigue', label: 'Fatigue', emoji: '😴', color: '#708090' },
  { name: 'honte', label: 'Honte', emoji: '😳', color: '#BC8F8F' },
  { name: 'mélancolie', label: 'Mélancolie', emoji: '😔', color: '#4682B4' },
  { name: 'inquiétude', label: 'Inquiétude', emoji: '😟', color: '#9370DB' },
  { name: 'culpabilité', label: 'Culpabilité', emoji: '😞', color: '#8B4789' },
  { name: 'embarras', label: 'Embarras', emoji: '😳', color: '#DB7093' },
  { name: 'déception', label: 'Déception', emoji: '😞', color: '#6A5ACD' },
  { name: 'torpeur', label: 'Torpeur', emoji: '😶', color: '#696969' },
  
  // Mixtes/Complexes
  { name: 'surprise', label: 'Surprise', emoji: '😲', color: '#FF69B4' },
  { name: 'disgust', label: 'Dégoût', emoji: '🤢', color: '#32CD32' },
  { name: 'confusion', label: 'Confusion', emoji: '😕', color: '#B8860B' },
  { name: 'concentration', label: 'Concentration', emoji: '🤔', color: '#4682B4' },
  { name: 'nostalgie', label: 'Nostalgie', emoji: '🥲', color: '#6A5ACD' },
  { name: 'mépris', label: 'Mépris', emoji: '😒', color: '#8B8B83' },
  { name: 'désir', label: 'Désir', emoji: '😏', color: '#FF1493' },
  
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
  enthousiasme: '#FF1493',
  extase: '#FF00FF',
  émerveillement: '#FFB6C1',
  inspiration: '#FFA07A',
  
  // Positives basse énergie
  calm: '#87CEEB',
  sérénité: '#B0E0E6',
  satisfaction: '#98D8C8',
  contentement: '#90EE90',
  soulagement: '#ADD8E6',
  tendresse: '#FFB7D5',
  gratitude: '#98FB98',
  hope: '#87CEFA',
  espoir: '#87CEFA',
  
  // Négatives haute énergie
  anger: '#FF4500',
  fear: '#8A2BE2',
  anxiété: '#9370DB',
  anxiety: '#9370DB',
  stress: '#DC143C',
  frustration: '#CD5C5C',
  irritation: '#FA8072',
  jalousie: '#228B22',
  envie: '#32CD32',
  tourment: '#B22222',
  
  // Négatives basse énergie
  sadness: '#6495ED',
  ennui: '#778899',
  fatigue: '#708090',
  exhaustion: '#708090',
  honte: '#BC8F8F',
  mélancolie: '#4682B4',
  inquiétude: '#9370DB',
  culpabilité: '#8B4789',
  embarras: '#DB7093',
  déception: '#6A5ACD',
  torpeur: '#696969',
  
  // Mixtes
  surprise: '#FF69B4',
  disgust: '#32CD32',
  confusion: '#B8860B',
  concentration: '#4682B4',
  nostalgie: '#6A5ACD',
  mépris: '#8B8B83',
  désir: '#FF1493',
  
  // Neutre
  neutral: '#A9A9A9',
  
  // Autres
  motivation: '#FFA500'
};


export const primaryEmotions = [
  { name: 'joy', label: 'Joie', emoji: '😊', color: '#FFD700' },
  { name: 'sadness', label: 'Tristesse', emoji: '😢', color: '#6495ED' },
  { name: 'anger', label: 'Colère', emoji: '😠', color: '#FF4500' },
  { name: 'fear', label: 'Peur', emoji: '😨', color: '#8A2BE2' },
  { name: 'disgust', label: 'Dégoût', emoji: '🤢', color: '#32CD32' },
  { name: 'surprise', label: 'Surprise', emoji: '😲', color: '#FF69B4' },
  { name: 'neutral', label: 'Neutre', emoji: '😐', color: '#A9A9A9' },
  { name: 'calm', label: 'Calme', emoji: '😌', color: '#87CEEB' }
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
  joy: '#FFD700',
  happiness: '#FFD700',
  sadness: '#6495ED',
  anger: '#FF4500',
  fear: '#8A2BE2',
  disgust: '#32CD32',
  surprise: '#FF69B4',
  neutral: '#A9A9A9',
  calm: '#87CEEB',
  anxiety: '#9932CC',
  stress: '#DC143C',
  motivation: '#FFA500',
  exhaustion: '#708090',
  hope: '#00CED1',
  gratitude: '#00FA9A'
};

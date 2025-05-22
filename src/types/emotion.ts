
export type EmotionName =
  | 'happy'
  | 'sad'
  | 'angry'
  | 'fearful'
  | 'disgusted'
  | 'surprised'
  | 'neutral'
  | 'calm'
  | 'excited'
  | 'anxious'
  | 'frustrated'
  | 'content'
  | 'nostalgic'
  | 'proud'
  | 'guilty'
  | 'grateful'
  | 'jealous'
  | 'lonely'
  | 'hopeful'
  | 'overwhelmed';

export type EmotionIntensity = 1 | 2 | 3 | 4 | 5;

export type EmotionSource = 'emoji' | 'text' | 'facial' | 'voice' | 'manual' | 'ai';

export interface EmotionResult {
  primaryEmotion: EmotionName;
  secondaryEmotion?: EmotionName;
  intensity: EmotionIntensity;
  source: EmotionSource;
  timestamp: string;
  userId?: string;
  notes?: string;
  context?: string;
  triggers?: string[];
}

export interface EmotionRecommendation {
  id: string;
  type: 'activity' | 'music' | 'video' | 'breathing' | 'reading' | 'social';
  title: string;
  description: string;
  emotion: EmotionName;
  intensity?: EmotionIntensity;
  url?: string;
  imageUrl?: string;
  duration?: number; // in minutes
}

export interface Emotion {
  name: EmotionName;
  label: string;
  color: string;
  emoji: string;
  intensity?: EmotionIntensity;
}

export const emotions: Emotion[] = [
  { name: 'happy', label: 'Heureux', color: '#FFD700', emoji: '😊' },
  { name: 'sad', label: 'Triste', color: '#6495ED', emoji: '😔' },
  { name: 'angry', label: 'En colère', color: '#FF6347', emoji: '😠' },
  { name: 'fearful', label: 'Effrayé', color: '#9370DB', emoji: '😨' },
  { name: 'disgusted', label: 'Dégoûté', color: '#90EE90', emoji: '🤢' },
  { name: 'surprised', label: 'Surpris', color: '#FF69B4', emoji: '😲' },
  { name: 'neutral', label: 'Neutre', color: '#A9A9A9', emoji: '😐' },
  { name: 'calm', label: 'Calme', color: '#87CEEB', emoji: '😌' },
  { name: 'excited', label: 'Excité', color: '#FFA500', emoji: '🤩' },
  { name: 'anxious', label: 'Anxieux', color: '#8A2BE2', emoji: '😰' },
  { name: 'frustrated', label: 'Frustré', color: '#DC143C', emoji: '😤' },
  { name: 'content', label: 'Content', color: '#ADFF2F', emoji: '☺️' },
  { name: 'nostalgic', label: 'Nostalgique', color: '#DDA0DD', emoji: '🥲' },
  { name: 'proud', label: 'Fier', color: '#DAA520', emoji: '😌' },
  { name: 'guilty', label: 'Coupable', color: '#4682B4', emoji: '😔' },
  { name: 'grateful', label: 'Reconnaissant', color: '#9ACD32', emoji: '🙏' },
  { name: 'jealous', label: 'Jaloux', color: '#228B22', emoji: '😒' },
  { name: 'lonely', label: 'Seul', color: '#708090', emoji: '🥺' },
  { name: 'hopeful', label: 'Plein d\'espoir', color: '#40E0D0', emoji: '🙂' },
  { name: 'overwhelmed', label: 'Dépassé', color: '#CD5C5C', emoji: '😵' }
];

export const getEmotionByName = (name: EmotionName): Emotion => {
  return emotions.find(e => e.name === name) || emotions[6]; // Return neutral as default
};

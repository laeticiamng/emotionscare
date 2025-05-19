
// Types liés à la réalité virtuelle

export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number | string;
  thumbnail?: string;
  category: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  emotion?: string;
  rating?: number;
  scenes?: VRScene[];
}

export interface VRScene {
  id: string;
  title: string;
  description: string;
  duration: number | string;
  environment: string;
  audio?: string;
  narration?: string;
  transitions?: any[];
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration: number | string;
  completed: boolean;
  emotion?: string;
  intensity?: number;
  feedback?: string;
  rating?: number;
}

export interface VRSessionViewProps {
  template: VRSessionTemplate;
  onCompleteSession?: () => void;
}

// Utilitaire pour convertir string/number
export function ensureNumber(value: string | number): number {
  if (typeof value === 'string') {
    return parseFloat(value) || 0;
  }
  return value || 0;
}

// Utilitaire pour formater les durées
export function formatDuration(minutes: string | number): string {
  const mins = ensureNumber(minutes);
  if (mins < 60) {
    return `${mins} min`;
  }
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
}

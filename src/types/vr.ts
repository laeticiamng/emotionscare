
export interface VRSessionTemplate {
  id: string;
  name: string;
  description: string;
  duration: number;
  scene_type: 'nature' | 'abstract' | 'urban' | 'space' | 'underwater';
  intensity: 'low' | 'medium' | 'high';
  goal: 'relaxation' | 'focus' | 'energy' | 'sleep' | 'creativity';
  audio_track?: string;
  guided?: boolean;
  premium?: boolean;
}


export interface VRSessionTemplate {
  id: string;
  name: string;
  description?: string;
  duration: number;
  environment: string;
  intensity: number;
  tags: string[];
  objective: string;
  coverImage?: string;
  audioTrack?: string;
}

export interface VRSession {
  id: string;
  userId: string;
  templateId: string;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  feedback?: string;
  rating?: number;
  metrics?: {
    focusLevel?: number;
    relaxationLevel?: number;
    heartRate?: number[];
    breathingRate?: number[];
  };
}

export interface VRSessionWithMusicProps {
  session: VRSession;
  template: VRSessionTemplate;
  useMusic?: boolean;
  onComplete?: (feedback: string, rating: number) => void;
}

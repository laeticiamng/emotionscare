
export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: string | number;
  environment?: string;
  recommendedMood?: string;
  thumbnailUrl?: string;
}

export interface VRSession {
  id: string;
  templateId: string;
  startTime: string;
  endTime?: string;
  completed: boolean;
  progress?: number;
}

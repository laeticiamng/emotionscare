
export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  tags: string[];
  imageUrl?: string;
  previewUrl?: string;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startedAt: string;
  endedAt?: string;
  duration?: number;
  completed: boolean;
  feedback?: {
    rating: number;
    comments?: string;
  };
  emotionalState?: {
    before: string;
    after: string;
  };
}

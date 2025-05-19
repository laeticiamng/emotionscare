// Creating a placeholder types file for VR related types
// You may need to adjust this based on your actual types

export interface VRSessionTemplate {
  id: string;
  name: string;
  description: string;
  duration: number;
  category: string;
  tags: string[];
  thumbnailUrl?: string;
  // Add other properties as needed
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  metrics?: {
    heartRate?: number[];
    focus?: number[];
    relaxation?: number[];
  };
  // Add other properties as needed
}

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  heartRate?: number;
  onBack?: () => void;
  onStartSession?: () => void; // Added missing property
}

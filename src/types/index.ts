
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  onboarded?: boolean;
  created_at?: string;
  metadata?: any;
}

export interface VRSessionTemplate {
  template_id: string;
  theme: string;
  duration: number;  // in minutes
  preview_url: string;
}

export interface VRSession {
  id: string;
  user_id: string;
  date: string;
  duration_seconds: number;
  location_url: string;
  heart_rate_before: number;
  heart_rate_after: number | null;
}

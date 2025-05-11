
export interface Coach {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  experience: number;
  bio: string;
  rating: number;
  availability: CoachAvailability[];
  certifications?: string[];
  languages?: string[];
}

export interface CoachSession {
  id: string;
  coach_id: string;
  user_id: string;
  date: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  rating?: number;
  feedback?: string;
  focus_areas?: string[];
}

export interface CoachAvailability {
  day: string;
  start_time: string;
  end_time: string;
}

export interface CoachRecommendation {
  coach_id: string;
  confidence: number;
  reason: string;
}

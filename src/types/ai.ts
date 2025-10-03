
export interface AIAssistant {
  id: string;
  name: string;
  avatar: string;
  type: 'coach' | 'therapist' | 'analyst' | 'guide';
  description: string;
  capabilities: string[];
  tone?: string;
  personality?: string[];
}

export interface AIInteraction {
  id: string;
  user_id: string;
  assistant_id: string;
  messages: AIMessage[];
  created_at: string;
  updated_at: string;
  topic?: string;
  emotion_context?: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  feedback?: 'helpful' | 'not_helpful';
  emotions_detected?: string[];
  confidence?: number;
}

export interface AIRecommendation {
  id: string;
  type: 'content' | 'activity' | 'habit' | 'resource';
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  emotion_context?: string;
  resource_url?: string;
}

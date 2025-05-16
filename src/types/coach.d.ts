
export interface CoachMessage {
  id: string;
  content: string;
  timestamp: string;
  type: 'text' | 'question' | 'suggestion' | 'info';
  isBot: boolean;
  emotion?: string;
  sender?: string;
  role?: string;
  conversation_id?: string;
}

export interface CoachEvent {
  id: string;
  type: 'session' | 'emotion' | 'achievement' | 'milestone';
  date: string;
  title: string;
  description: string;
}

export interface CoachAction {
  id: string;
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  completed: boolean;
  due?: string;
}

export interface EmotionalData {
  emotion: string;
  intensity: number;
  date: string;
}

export interface EmotionalTrend {
  trend: 'improving' | 'declining' | 'stable';
  primaryEmotion: string;
  secondaryEmotion?: string;
  startDate: string;
  endDate: string;
  data: EmotionalData[];
}

export interface CoachNotification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'suggestion' | 'achievement';
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

export interface ChatMessage {
  id: string;
  text?: string;
  content?: string;
  sender: string;
  sender_id?: string;
  timestamp?: string;
  conversation_id?: string;
  role?: string;
  is_read?: boolean;
  sender_type?: string;
}

export interface CoachContextType {
  messages: ChatMessage[];
  loading: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
  loadMessages: () => Promise<void>;
  events: CoachEvent[];
  addEvent: (event: CoachEvent) => void;
  clearEvents: () => void;
  status: string;
  userContext: any;
  lastEmotion: any;
  recommendations: any[];
  generateRecommendation: () => void;
  coachService?: any;
}

export interface CoachCharacterProps {
  mood?: string;
  speaking?: boolean;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: React.CSSProperties;
  className?: string;
}

export interface CoachChatProps {
  initialQuestion?: string;
  simpleMode?: boolean;
  className?: string;
  onBackClick?: () => void;
}

export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

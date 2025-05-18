
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: Date | string;
  emotion?: string;
}

export interface ChatResponse {
  content: string;
  emotion?: string;
}

export interface SupportHistory {
  id: string;
  userId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  resolved: boolean;
}


export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: Date | string;
  emotion?: string;
}

export interface ChatResponse {
  id?: string;
  content?: string;
  emotion?: string;
  message?: string;
  sender?: string;
  timestamp?: string;
}

export interface SupportHistory {
  id: string;
  userId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  resolved: boolean;
}

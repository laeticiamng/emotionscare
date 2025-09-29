export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  emotion?: string;
  timestamp: string;
  attachments?: Attachment[];
}

export interface Attachment {
  type: 'image' | 'audio' | 'file';
  url: string;
  name: string;
  size?: number;
}

export interface ChatResponse {
  id: string;
  content: string;
  emotion?: string;
  timestamp: string;
  suggestions?: string[];
  confidence?: number;
}

export interface SupportTicket {
  id: string;
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful: number;
  notHelpful: number;
}
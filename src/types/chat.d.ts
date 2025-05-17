
export interface ChatMessage {
  id: string;
  content: string;
  text?: string;
  sender: string;
  role: string;
  timestamp: string;
  conversation_id?: string;
}

export interface ChatResponse {
  content?: string;
  message?: string;
}

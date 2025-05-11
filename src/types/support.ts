
export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  emotion?: string;
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

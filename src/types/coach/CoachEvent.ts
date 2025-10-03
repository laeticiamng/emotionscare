
export interface CoachEvent {
  id: string;
  type: 'message' | 'suggestion' | 'notification' | 'recommendation';
  content: string;
  timestamp: string;
  userId: string;
  metadata?: Record<string, any>;
  read?: boolean;
}


export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'system' | 'emotion' | 'challenge' | 'achievement' | 'reminder';
  read: boolean;
  timestamp: string;  // For compatibility with existing code
  createdAt: string;  // For compatibility with existing code
  created_at: string; // Standard format
}

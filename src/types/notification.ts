
export type NotificationType = 
  | 'system' 
  | 'achievement' 
  | 'challenge' 
  | 'reminder' 
  | 'message' 
  | 'friend_request' 
  | 'group_invitation' 
  | 'event' 
  | 'milestone' 
  | 'update' 
  | 'promotion'
  | 'invitation';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string | Date;
  read: boolean;
  actionUrl?: string;
  imageUrl?: string;
  priority?: 'low' | 'normal' | 'high';
  category?: string;
  expiry?: string | Date;
  data?: Record<string, any>;
  userId?: string; // ID de l'utilisateur auquel la notification est destinée
}
